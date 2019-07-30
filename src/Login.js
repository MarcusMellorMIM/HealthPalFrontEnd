import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div className="login">
        <h1 className="login_title_health">Health</h1>
        <h1 className="login_title_pal">Pal</h1>
        <div className="login_instructions1" >
          <p>Use Health Pal to track your food and drink intake, activities and weight.</p>
          <p>We will calculate your daily calory burn, BMR, and calculate your daily calory deficit.</p>       
          <p>“What's measured improves” ― Peter Drucker.</p>       
        </div>

        <div className="login_instructions2" >
          <p>Coming soon ..... goals, better daily views, more coaching from Eva your Alexa skill, multiple health pal accounts against one alexa device ... and so much more.</p>
          <p>Even though your data is protected with JWT authentication, we cannot guarantee its security until a production service is released. Please do not enter any data that you deem personal, and that you are unwilling to share.</p>       
          <p>Feedback is always welcome, from irritating bug to incredible functional ask. Please send your amazing idea, via email to </p>
          <a className="email" href="mailto:EvaHealthyPal@gmail.com?subject=Feedback&body=Hi Eva, I have a great suggestion for your amazing app">Eva your Health Pal</a>

        </div>


        <div className="login_instructions3" >
          <p>If you are concerned about developing type 2 diabetes, have high blood pressure or a family history of heart disease or strokes.</p>
          <p>Take back control of your health and wellbeing now.</p>       
          <p>Let Eva, your health pal, help you live the life you deserve.</p>       
        </div>

        <div className="login_instructions4" >
          <p>Add the Alexa skill, "Eva, my health pal" to your Alexa echo today. </p>
          <p>She be with you every step of the way, helping your to achieve your goal.</p>
          <p>To invoke, say "Alexa, please open Eva my Health Pal"</p>       
        </div>

        {this.props.isLoggedIn ? (
          <div className="login_logged_in">
            <h3> {`Hi ${this.props.user.name}, you are now logged in.`}</h3>
            <button className="login_buttons" onClick={this.props.handleLogOut}>Log Out</button>
            <h3> {this.props.user.screentext}</h3>

            {this.props.user.navlink.length>0 ?
                <button className="login_buttons" >
                      { this.props.user.navlink==='Weight' ? <NavLink to="/Weight">Smart navigation</NavLink> :
                      this.props.user.navlink==='Input'  ? <NavLink to="/Input">Smart navigation</NavLink> :
                      this.props.user.navlink==='Activity' ? <NavLink to="/Weight">Smart navigation</NavLink> :
                      this.props.user.navlink==='Account' ? <NavLink to="/Account">Smart navigation</NavLink> : null}
                </button>
            : null }

          </div>
        ) : (
          <form className="login_entry">
            <label htmlFor="user_name">
              <b>Username: </b>
            </label>
            <input
              className="login_input"
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
              className="login_input"
              type="password"
              onChange={this.props.handleLoginChange}
              placeholder="Enter Password"
              name="password"
            />
            <br />
            <button className="login_buttons" onClick={this.props.handleLogin} type="submit">
              {" "}
              Login{" "}
            </button>
            <br/>
            <br/>
            <button className="register_button" >
                <NavLink to="/Signup"> Register</NavLink>
            </button>

          </form>
        )}
      </div>
    );
  }
}

export default Login;
