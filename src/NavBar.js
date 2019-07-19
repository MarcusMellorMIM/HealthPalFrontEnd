import React, { Component } from "react";

import { NavLink } from "react-router-dom";

class NavBar extends Component {
  render() {

    return this.props.isLoggedIn ? (
      <div className="usernav">
        <NavLink to="/Weight">Weight</NavLink>
        {/* <NavLink to="/Food"> Food</NavLink>
        <NavLink to="/Exercise">Exercise</NavLink>
        <NavLink to="/Dashboard"> Dashboard</NavLink> */}
        <NavLink to="/Account"> Account</NavLink>
        <NavLink to="/Login" onClick={this.props.handleLogOut}>
          Logout
        </NavLink>
      </div>
    ) : (
      <div className="usernav">
        <NavLink to="/Login">Login</NavLink>
        <NavLink to="/Signup"> Signup</NavLink>
      </div>
    );
  }
}

export default NavBar;
