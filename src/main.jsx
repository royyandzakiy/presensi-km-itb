import React, { Component } from 'react';
import $ from 'jquery';
import './css/main.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nama:'',
            nim:'',
            data:[],
            rekap:[]
        };

        this.onChangeNama = this.onChangeNama.bind(this);
        this.onChangeNim = this.onChangeNim.bind(this);
        this.checkin = this.checkin.bind(this);
        this.checkout = this.checkout.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.refresh = this.refresh.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        this.refreshData();
    }

    getTime() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
    }

    refreshData() {
        var temp = [{
            nama: 'Rio Dwi Putra',
            nim: '13215001',
            jurusan: 'Teknik Elektro',
            himpunan: 'HME',
            waktu_datang: '11.00',
            waktu_pulang: '17.04'
        }];

        var rekap = [];

        $.get("https://presensi-km-itb-api.herokuapp.com/presensi-forum-bidikmisi/total",
            {},
            function (_data, status) {
                temp = _data.data;
                rekap = _data.rekap;

                this.setState({
                    "data": temp,
                    "rekap": rekap
                }, () => {
                    this.refresh();
                });
            }.bind(this));
    }

    refresh() {
        var tableRef = '';

        if(this.state.data.length > 0) {
            $("#hal1 tbody tr").remove();
            $("#hal2 tbody tr").remove();
            $("#hal3 tbody tr").remove();
            $("#hal4 tbody tr").remove();
            // generate rows
            for (var i = 0; i < this.state.data.length; i++) {
                $("#hal1 tbody").append(
                    "<tr>" +
                    "<td>" + this.state.data[i].nama + "</td>" +
                    "<td>" + this.state.data[i].nim + "</td>" +
                    "<td>" + this.state.data[i].jurusan + "</td>" +
                    // "<td>" + this.state.data[i].himpunan + "</td>" +
                    "<td>" + this.state.data[i].waktu_datang + "</td>" +
                    "<td>" + this.state.data[i].waktu_pulang + "</td>" +
                    '</tr>');

                if(this.state.data[i].waktu_pulang == '-') {
                    $("#hal2 tbody").append(
                        "<tr>" +
                        "<td>" + this.state.data[i].nama + "</td>" +
                        "<td>" + this.state.data[i].nim + "</td>" +
                        "<td>" + this.state.data[i].jurusan + "</td>" +
                        // "<td>" + this.state.data[i].himpunan + "</td>" +
                        "<td>" + this.state.data[i].waktu_datang + "</td>" +
                        "<td>" + "-" + "</td>" +
                        '</tr>');
                } else {
                    $("#hal3 tbody").append(
                        "<tr>" +
                        "<td>" + this.state.data[i].nama + "</td>" +
                        "<td>" + this.state.data[i].nim + "</td>" +
                        "<td>" + this.state.data[i].jurusan + "</td>" +
                        // "<td>" + this.state.data[i].himpunan + "</td>" +
                        "<td>" + this.state.data[i].waktu_datang + "</td>" +
                        "<td>" + this.state.data[i].waktu_pulang + "</td>" +
                        '</tr>');
                }
            }

            console.log(this.state.rekap.length);
                
            for(var i=0; i<this.state.rekap.length; i++)
                $("#hal4 tbody").append(
                    "<tr>" +
                    "<td>" + this.state.rekap[i].kode + "</td>" +
                    "<td>" + this.state.rekap[i].jurusan + "</td>" +
                    // "<td>" + this.state.rekap[i].himpunan + "</td>" +
                    "<td>" + this.state.rekap[i].checkin + "</td>" +
                    "<td>" + this.state.rekap[i].checkout + "</td>" +
                    "<td>" + this.state.rekap[i].total + "</td>" +
                    '</tr>');
            
        } else {

        }
    }

    deleteAll() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://presensi-km-itb-api.herokuapp.com/presensi-forum-bidikmisi/all",
            "method": "DELETE",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {
            alert("ALL DATA SUCCESSFULLY DELETED!");
            console.log(response);
            this.setState({
                data:[],
                rekap:[]
            });            
        }.bind(this));
    }

    checkin() {
        if (this.state.nim.length < 8) {
            alert("NIM tidak valid!");
        } else if (this.state.nama.length == 0) {
            alert("Nama tidak boleh kosong!");
        } else {
            $.get("https://presensi-km-itb-api.herokuapp.com/is-checked-in/" + this.state.nim,
                {},
                function (_data, status) {
                    // console.log(JSON.stringify(_data)); // DEBUG

                    if (!_data.found) {
                        // BELUM CHECKIN
                        var time = this.getTime();
                        var waktu_pulang = time;

                        var temp = {
                            nama: this.state.nama,
                            nim: this.state.nim,
                            waktu_datang: time,
                            waktu_pulang: '-'
                        }

                        // post to endpoint
                        $.post("https://presensi-km-itb-api.herokuapp.com/presensi-forum-bidikmisi",
                            temp,
                            function (_data, status) {
                                console.log(_data); // debug
                                // alert("Selamat " + temp.nama + ", NIM " + temp.nim + " telah berhasil Check-in");
                            });

                        this.refreshData();
                    } else {
                        console.log("FOUND");
                        alert("NIM " + this.state.nim + " sudah checkin sebelumnya, silakan NIM lain");
                    }

                }.bind(this));
        }
        $('#nim').val("");
        $('#nama').val("");
    }

    checkout() {
        if (this.state.nim.length < 8) {
            alert("NIM tidak valid!");
        // } else if (this.state.nama.length == 0) {
        //     alert("Nama tidak boleh kosong!");
        } else {
            $.get("https://presensi-km-itb-api.herokuapp.com/is-checked-in/" + this.state.nim,
                {},
                function (_data, status) {
                    // console.log(JSON.stringify(_data)); // DEBUG

                    if (_data.found) {
                        // SUDAH CHECKIN
                        var time = this.getTime();
                        _data.data.waktu_pulang = time;

                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": "https://presensi-km-itb-api.herokuapp.com/presensi-forum-bidikmisi/" + _data.data._id,
                            "method": "PUT",
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded",
                                "cache-control": "no-cache"
                            },
                            "data": {
                                "nama": _data.data.nama,
                                "nim": _data.data.nim,
                                "waktu_datang": _data.data.waktu_datang,
                                "waktu_pulang": _data.data.waktu_pulang
                            }
                        }

                        $.ajax(settings).done(function (response) {
                            console.log(response);
                        });

                        // alert("Selamat " + _data.data.nama + ", NIM " + _data.data.nim + " telah berhasil Check-out");
                        this.refreshData();
                    } else {
                        console.log("FOUND");
                        alert("NIM " + this.state.nim + " belum pernah checkin sebelumnya, silakan coba NIM lain");
                    }

                }.bind(this));
        }
        $('#nim').val("");
        $('#nama').val("");
    }

    onChangeNama(e) {
        this.setState({
            nama: e.target.value
        });
    }
    
    onChangeNim(e) {
        this.setState({
            nim: e.target.value
        });
    }

    render() {
        return (
            <div class="container" id="container">

                <div id="header">
                    <img src={require('./pics/replika-logo-km-itb.png')} width="100px" /> PRESENSI <span id="kmitb">KM ITB</span>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <input id="nama" class="input-lg" type="text" onChange={this.onChangeNama.bind(this)} placeholder="Nama" />
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-lg-12">
                        <input id="nim" class="input-lg" type="text" onChange={this.onChangeNim.bind(this)} placeholder="NIM" maxlength="8" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="row">
                            <br />
                            <div class="btn-group">
                                <input type="button" class="btn btn-success btn-lg" value="check in" onClick={this.checkin} />
                                <input type="button" class="btn btn-warning btn-lg" value="check out" onClick={this.checkout} />
                            </div>
                        </div>
                        <div class="row">
                            <br />
                            <button class="btn btn-default btn-sm form-data" data-toggle='modal' data-target='#form' onClick={this.refreshData}>View Log</button>
                        </div>
                    </div>
                </div>

                <div id="form" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">

                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Daftar Presensi</h4>
                            </div>

                            <div class="modal-body">

                                <ul class="nav nav-tabs">
                                    <li class="active">
                                        <a data-toggle="tab" href="#hal1">Semua</a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#hal2">Hadir</a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#hal3">Pulang</a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#hal4">Rekap</a>
                                    </li>
                                </ul>

                                <div class="tab-content">

                                    <div id="hal1" class="tab-pane fade in active">
                                        <table class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nama</th>
                                                    <th>NIM</th>
                                                    <th>Jurusan</th>
                                                    {/* <th>Himpunan</th> */}
                                                    <th>Waktu Datang</th>
                                                    <th>Waktu Pulang</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Royyan Abdullah Dzakiy</td>
                                                    <td>13515123</td>
                                                    <td>Teknik Informatika</td>
                                                    {/* <td>HMIF</td> */}
                                                    <td>13:00</td>
                                                    <td>15:04</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div id="hal2" class="tab-pane fade">

                                        <table class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nama</th>
                                                    <th>NIM</th>
                                                    <th>Jurusan</th>
                                                    {/* <th>Himpunan</th> */}
                                                    <th>Waktu Datang</th>
                                                    <th>Waktu Pulang</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Royyan Abdullah Dzakiy</td>
                                                    <td>13515123</td>
                                                    <td>Teknik Informatika</td>
                                                    {/* <td>HMIF</td> */}
                                                    <td>13:00</td>
                                                    <td>15:04</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div id="hal3" class="tab-pane fade">

                                        <table class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nama</th>
                                                    <th>NIM</th>
                                                    <th>Jurusan</th>
                                                    {/* <th>Himpunan</th> */}
                                                    <th>Waktu Datang</th>
                                                    <th>Waktu Pulang</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Royyan Abdullah Dzakiy</td>
                                                    <td>13515123</td>
                                                    <td>Teknik Informatika</td>
                                                    {/* <td>HMIF</td> */}
                                                    <td>13:00</td>
                                                    <td>15:04</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div id="hal4" class="tab-pane fade">

                                        <table class="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Kode</th>
                                                    <th>Jurusan</th>
                                                    {/* <th>Himpunan</th> */}
                                                    <th>Check in</th>
                                                    <th>Check out</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>135</td>
                                                    <td>Teknik Informatika</td>
                                                    {/* <td>HMIF</td> */}
                                                    <td>3</td>
                                                    <td>7</td>
                                                    <td>10</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={this.deleteAll}>Delete All</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal" onClick={this.refreshData}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
