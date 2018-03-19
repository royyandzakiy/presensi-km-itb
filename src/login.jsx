import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedin: props.loggedin
        };

        this.login = this.login.bind(this);
    }

    login() {
        // if(username & password sesuai)
        this.setState({
            loggedin : true
        });        
    }

    render() {
        return (
            <div>
                <input id="username" type="text" />
                <input id="password" type="password" />
                <input type="button" value="Login" onClick={this.login} />
                <a href="#">Don't have an account? Register here!</a>
            </div>
        );
    }
}

export default Login;
