import React, { Component } from "react";
import { login, getCurrentUser } from "./auth";
import { getConfigObj, getJWTHeaders } from "./api";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import NavBar from "./NavBar";
import Weight from "./Weight";
import Input from "./Input";
import Activity from "./Activity";
import './css/Input.css'
import './css/Login.css'
import './css/Signup.css'
import './css/Weight.css'
import './css/Activity.css'
import './css/Navbar.css'

//const BASE_URL = `http://localhost:3000`
const BASE_URL = `https://healthpal-api.herokuapp.com`;
const USERS_URL = `${BASE_URL}/users`;
const WEIGHTS_URL = `${BASE_URL}/weights`;
const INPUTS_URL = `${BASE_URL}/inputs`;
const ACTIVITIES_URL = `${BASE_URL}/activities`;
const APIINPUTS_URL = `${BASE_URL}/api/input`;
const APIACTIVITIES_URL = `${BASE_URL}/api/activity`;

const EMPTYUSER = {
  user_name: "",
  name: "",
  dob: "",
  gender: "",
  height_cm:""  
};

export default class App extends Component {
  // Use the contructor to set the initial state
  constructor() {
    super();
    this.state = { isLoggedIn: false, 
                user: EMPTYUSER,
                weights: [],
                inputs: [],
                activities: []
             };
  }

  componentDidMount() {
    // Deal with auth tokens as the page mounts.
    // If a valid token, login else go to sign up page
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(BASE_URL, token)
        .then(user => {
          this.setState({ isLoggedIn: true, user: user });
        })
        .then(() => {
          this.getUserData();
        });
    }
  }

  getUserData = () => {
    // Is used to get the initial set of data for the user
    let headers=getJWTHeaders();
    fetch(WEIGHTS_URL, headers )
      .then(response => response.json())
      .then(data => {
        this.setState({ weights: data });
      });

    fetch(INPUTS_URL, headers)
    .then(response => response.json())
    .then(data => {
      this.setState({ inputs: data });
    });

    fetch(ACTIVITIES_URL, headers)
    .then(response => response.json())
    .then(data => {
      this.setState({ activities: data });
    });

  };

  changeUser = event => {
    // The handler that changes the user state, for either new or updates of a user
    let user = {};
    Object.assign(user, this.state.user);
    user[event.target.name] = event.target.value;
    this.setState({ user: user });
  };

  submitUser = event => {

    event.preventDefault();

    if (this.state.user.id) {
      console.log('Update user')
      this.updateUser()
    } else {
      this.createUser()
    }

  }

  createUser = () => {
  // Create a new user, setting JWT tokens etc
    
    if ( this.state.user.user_name && this.state.user.name && this.state.user.password  ) {
      
      let configObj = getConfigObj( "POST", this.state.user );

      fetch(USERS_URL, configObj)
      .then(data => data.json())
      .then( () => login(BASE_URL, this.state.user.user_name, this.state.user.password) )
      .then( data => {
        localStorage.setItem("token", data.jwt);
        this.setState({ isLoggedIn: true, user: data.user });
        this.getUserData();
      })
      .catch(err => { console.log(err) })
    } else {
      alert(`Please enter your user name, name and password`);
    }  
  }

  updateUser = () => {
    // Update the user, 
    // Possibly dont need to set JWT tokens and relogin etc ....       
      if ( this.state.user.user_name && this.state.user.name  ) {
        
        let configObj = getConfigObj( "PATCH", this.state.user );  
  
        // For security reasons, only use the token to get the user to be updated
        fetch(`${USERS_URL}/update`, configObj)
          .then(data => data.json())
          .then( data => {
            this.setState({ isLoggedIn: true, user: data });
        })
        .catch(err => { console.log(err) })
      } else {
        alert(`Please enter your user name and name`);
      }  
    }
  

  handleLoginChange = event => {
// Simply sets the user state when an item is modified in the Signup container
    let user = {};
    Object.assign(user, this.state.user);
    user[event.target.name] = event.target.value;
    this.setState({ user: user });
  };

  handleLogin = event => {
// Is called when a user logins in, in the Login container
    event.preventDefault();
    login(BASE_URL, this.state.user.user_name, this.state.user.password)
    .then(data => {
      if (data.error) {
        alert("something is wrong with your credentials" + data.error);
        this.setState({ user_name: "", password: "" });
      } else {
        localStorage.setItem("token", data.jwt);
        this.setState({ isLoggedIn: true, user: data.user });
        this.getUserData();
      }
    });
  };

  handleLogOut = () => {
  // Will reset user state, putting the system into a position to allow
  // another user to log in.
    localStorage.clear("token");
    this.setState({
      user: EMPTYUSER,
      isLoggedIn: false
    });
  };

  setAppState = ( stateObj ) => {
    // Callback to allow child components to manipulate App state
    this.setState( stateObj )
  }

  render() {
// Now render the page ... here is where the fun starts
    return (
      <Router>
 
       <NavBar
          isLoggedIn={this.state.isLoggedIn}
          handleLogOut={this.handleLogOut}
        />

        <Route
          exact path="/"
          render={() => (
            <Login
              handleLoginChange={this.handleLoginChange}
              user={this.state.user}
              isLoggedIn={this.state.isLoggedIn}
              handleLogin={this.handleLogin}
              handleLogOut={this.handleLogOut}
            />
          )}
        />

        <Route
          path="/Login"
          render={() => (
            <Login
              handleLoginChange={this.handleLoginChange}
              user={this.state.user}
              isLoggedIn={this.state.isLoggedIn}
              handleLogin={this.handleLogin}
              handleLogOut={this.handleLogOut}
            />
          )}
        />

        <Route
          path="/Signup"
          render={() => (
            <Signup
              user={this.state.user}
              isLoggedIn={this.state.isLoggedIn}
              submitUser={this.submitUser}
              changeUser={this.changeUser}
              handleLogOut={this.handleLogOut}
            />
          )}
        />

        <Route
          path="/Account"
          render={() => (
            <Signup
              user={this.state.user}
              isLoggedIn={this.state.isLoggedIn}
              submitUser={this.submitUser}
              changeUser={this.changeUser}
              handleLogOut={this.handleLogOut}
            />
          )}
        />

        <Route
          path="/Weight"
          render={() => (
            <Weight
              weights={this.state.weights}
              setAppState={this.setAppState}
              weightsUrl={WEIGHTS_URL}
            />
          )}
        />

        <Route
          path="/Input"
          render={() => (
            <Input
              inputs={this.state.inputs}
              setAppState={this.setAppState}
              inputsUrl={INPUTS_URL}
              apiInputsUrl={APIINPUTS_URL}
            />
          )}
        />

        <Route
          path="/Activity"
          render={() => (
            <Activity
              activities={this.state.activities}
              setAppState={this.setAppState}
              activitiesUrl={ACTIVITIES_URL}
              apiActivitiesUrl={APIACTIVITIES_URL}
            />
          )}
        />

      </Router>
    );
  } // End of render function

}
