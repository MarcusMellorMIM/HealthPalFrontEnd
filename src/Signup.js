import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { dateString } from "./helpers";

class Signup extends Component {
  render() {
    return (
      <div className="signup">

          <h1 className="main_title1">{this.props.isLoggedIn ? "Amend" : "Create" }</h1>
          <h1 className="main_title2">your</h1>
          <h1 className="main_title3">Account</h1>
          <div className="signup_instruction1">
                <p>{this.props.isLoggedIn ? "Amend" : "Create" } your account here</p>
                <p>Even though your data is protected with JWT authentication, we cannot guarantee its security until a production service is released. Please do not enter any data that you deem personal, and that you are unwilling to share.</p>
          </div> 

          <div className="signup_instruction2">
                <p>Feedback is always welcome, from irritating bug to incredible functional ask.</p>
                <p>Please send your amazing idea, via email to </p>
                <a className="email" href="mailto:EvaHealthyPal@gmail.com?subject=Feedback&body=Hi Eva, I have a great suggestion for your amazing app">Eva your Health Pal</a>
          </div> 

          <div className="signup_instruction3">
                <p>You cannot change your password just yet.</p>
                <p>We will be working on this, as well as allowing you to link and unlink to yours or other Alexa accounts</p>
          </div> 

          {this.props.isLoggedIn ? 
            <div className="signup_logged_in">
              <h3> {`Hi ${this.props.user.name}, you are now logged in. If you are on a shared computer, please make sure you logout when you are done.`}</h3>
              <button className="login_buttons" onClick={this.props.handleLogOut}>Log Out</button>
              <br/>
              <br/>
            </div> : null }

        <form className="signup_entry" onSubmit={this.props.submitUser}>

          <label htmlFor="user_name">
            <b>Username: </b>
          </label>
          <input
            className="signup_input"
            type="text"
            placeholder="Enter Username"
            name="user_name"
            value={this.props.user.user_name}
            onChange={this.props.changeUser}
          />

          <br />

          <label htmlFor="email">
            <b>Email Address: </b>
          </label>
          <input
            className="signup_input"
            type="email"
            placeholder="Enter Email"
            name="email"
            value={this.props.user.email}
            onChange={this.props.changeUser}
          />

          <br />

        { this.props.isLoggedIn ? null : <label htmlFor="password"> <b>Password: </b> </label> }
        { this.props.isLoggedIn ? null : <input className="signup_input" type="password" placeholder="Enter Password" name="password" onChange={this.props.changeUser}/> }

          <label htmlFor="name">
            <b>Name: </b>
          </label>
          <input
            className="signup_input"
            type="text"
            placeholder="Enter Name"
            name="name"
            value={this.props.user.name}
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="dob">
            <b>Date of Birth: </b>
          </label>
          <input
            className="signup_input"
            type="date"
            placeholder="DD/MM/YYYY"
            name="dob"
            value={dateString(this.props.user.dob)}
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="height_cm">
            <b>Height: </b>
          </label>
          <input
            className="signup_input"
            type="number"
            placeholder="Enter your height in cm"
            name="height_cm"
            value={this.props.user.height_cm}
            onChange={this.props.changeUser}
          />
          <br />
          <label htmlFor="gender">
            <b>Gender: </b>
          </label>
          <select className="signup_input" name="gender" value={this.props.user.gender} onChange={this.props.changeUser} >
            <option value="none">Choose Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <br />
          <button className="signup_buttons" type="submit" value="Submit">Submit</button>
        </form>


          {this.props.isLoggedIn ? 
          <div className="signup_logged_in">
            <h3> {this.props.user.screentext}</h3>

            {this.props.user.navlink.length>0 ?
                <button className="signup_buttons" >
                      {this.props.user.navlink==='Weight' ? <NavLink to="/Weight">Smart navigation</NavLink> :
                      this.props.user.navlink==='Input'  ? <NavLink to="/Input">Smart navigation</NavLink> :
                      this.props.user.navlink==='Activity' ? <NavLink to="/Activity">Smart navigation</NavLink> :
                      this.props.user.navlink==='Account' ? <NavLink to="/Account">Smart navigation</NavLink> : null}
                </button>
            : null }
              </div>
            : null }

      </div> /* End of full page div */

      
    );
  }
}

export default Signup;
