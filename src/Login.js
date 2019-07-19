import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <div>
        <h2>Log in here, or signup to create an account</h2>
        <h3>Please be aware that this solution is not complete, and has basic authentication security</h3>
        <h3>For this reason, please do not enter any data that you deem personal and that you are unwilling to share</h3>
        {this.props.isLoggedIn ? (
          <div>
            <p> {`Hi ${this.props.user.name}, you're now logged in`}</p>
            <button onClick={this.props.handleLogOut}>Log Out</button>
          </div>
        ) : (
          <form>
            <label htmlFor="user_name">
              <b>Username: </b>
            </label>
            <input
              type="text"
              onChange={this.props.handleLoginChange}
              placeholder="Enter Username"
              name="user_name"
            />
            <br />
            <label htmlFor="password">
              <b>Password: </b>
            </label>
            <input
              type="password"
              onChange={this.props.handleLoginChange}
              placeholder="Enter Password"
              name="password"
            />
            <br />
            <button onClick={this.props.handleLogin} type="submit">
              {" "}
              Login{" "}
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default Login;
