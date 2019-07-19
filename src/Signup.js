import React, { Component } from "react";

class Signup extends Component {
  render() {
    return (
      <div>
        <h2>Create your account here</h2>
        <h3>Please be aware that this solution is not complete, and has basic authentication security</h3>
        <h3>For this reason, please do not enter any data that you deem personal and that you are unwilling to share</h3>
        <hr />
        <form onSubmit={this.props.createUser}>
          <label htmlFor="user_name">
            <b>Username: </b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="user_name"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="email">
            <b>Email Address: </b>
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="password">
            <b>Password: </b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="name">
            <b>Name: </b>
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="dob">
            <b>Date of Birth: </b>
          </label>
          <input
            type="date"
            placeholder="DD/MM/YYYY"
            name="dob"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="height_cm">
            <b>Height: </b>
          </label>
          <input
            type="number"
            placeholder="Enter your height in cm"
            name="height_cm"
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="gender">
            <b>Gender: </b>
          </label>
          <select name="gender" onChange={this.props.changeUser}>
            <option value="none">Choose Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Signup;
