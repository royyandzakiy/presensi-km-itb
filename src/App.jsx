import React, { Component } from 'react';
import $ from 'jquery';
import './css/App.css';
import Login from './login';
import Main from './main';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedin:true
    };
  }

  render() {
    return (
      <div className="App">
        {this.state.loggedin ? <Main loggedin={this.state.loggedin} /> : <Login loggedin={this.state.loggedin} />}
      </div>
    );
  }
}

export default App;
