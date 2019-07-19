import React from "react";
import NavBar from "./NavBar";
import Signup from "./Signup";
import Login from "./Login";
import Weights from "./Weights";
import Food from "./Food";
import Account from "./Account";
import Exercise from "./Exercise";
import Dashboard from "./Dashboard";
import { login, getCurrentUser } from "./api";
import { Redirect } from 'react-router-dom'

import { BrowserRouter as Router, Route } from "react-router-dom";

//const WEIGHTS_URL = `${ENV['FITBOOK_ROUTE']}/weights`;
const WEIGHTS_URL = "http://localhost:3000/weights";
const USERS_URL = "http://localhost:3000/users";
const MEALS_URL = "http://localhost:3000/meals";
const EXERCISES_URL = "http://localhost:3000/exercises";
const APIFOOD_URL = "http://localhost:3000/api/food";
const APIEXERCISE_URL = "http://localhost:3000/api/exercise";

const HEADERS = { headers: { "Content-Type": "application/json",
                            Accept: "application/json" } }

const EMPTYWEIGHT = {
  id: "",
  weight_kg: "",
  weight_date: "",
  weight_date_d: "",
  weight_date_t: ""
};

const EMPTYFOOD = {
  detail: "",
  totalCalories: 0,
  meal_date: "",
  meal_date_d: "",
  meal_date_t: "",
  meal_type_id: "",
  meal_details: []
};

const EMPTYEXERCISE = {
  detail: "",
  totalCalories: 0,
  exercise_date: "",
  exercise_date_d: "",
  exercise_date_t: "",
  exercise_type_id: "",
  exercise_details: []
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      food: EMPTYFOOD,
      foods: [],
      weight: EMPTYWEIGHT,
      weights: [],
      exercise: EMPTYEXERCISE,
      exercises: [],
      isLoggedIn: false
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then(user => {
          this.setState({ isLoggedIn: true, user: user });
        })
        .then(() => {
          this.getUserData();
        });
    }
  }

  getUserData() {

    // let headers = {...HEADERS, headers : {Authorization:token } }
    let headers=this.getJWTHeaders();
    console.log(headers)

    fetch(`${WEIGHTS_URL}/user/${this.state.user.user_name}`, headers)
      .then(response => response.json())
      .then(data => {
        this.setState({ weights: data });
      });

    // GET THE FOOD RECORDED AFTER A PERSON HAS BEEN SELECTED
    fetch(`${MEALS_URL}/user/${this.state.user.user_name}`, headers)
      .then(response => response.json())
      .then(data => {
        return data.map(food => {
          return Object.assign(food, {
            totalCalories: this.foodTotalCalories(food.meal_details)
          });
        });
      })
      .then(data => {
        this.setState({ foods: data });
      });

    // GET THE EXERCISE RECORDED AFTER A PERSON HAS BEEN SELECTED
    fetch(`${EXERCISES_URL}/user/${this.state.user.user_name}`, headers)
      .then(response => response.json())
      .then(data => {
        return data.map(exercise => {
          return Object.assign(exercise, {
            totalCalories: this.exerciseTotalCalories(exercise.exercise_details)
          });
        });
      })
      .then(data => {
        this.setState({ exercises: data });
      });
  }

  getJWTHeaders = () => {
    const token = localStorage.getItem("token");
    let headers={}
    Object.assign(headers,HEADERS )
    Object.assign(headers.headers, {Authorization:token })
    return headers
  }

  getConfigObj = ( method, body_detail=null ) => {

    let headers = this.getJWTHeaders();
    Object.assign(headers,  {method:method})
    let configObj={}
    if (body_detail) {
      Object.assign (configObj, headers, {body:JSON.stringify({ detail: body_detail })})
    } else {
      Object.assign (configObj, headers)
    }
    console.log(configObj)
    return configObj

  }


  ///////////////////////////////////////////////////////////////////////////////////
  // EXERCISE HANDLERS START
  changeExercise = event => {
    let exercise = {};
    Object.assign(exercise, this.state.exercise);
    exercise[event.target.name] = event.target.value;
    this.setState({ exercise: exercise });
  };

  changeExerciseDetail = (event, index) => {
    // Change an individual exercise line item
    let exercise = {};
    Object.assign(exercise, this.state.exercise);
    exercise.exercise_details[index][event.target.name] = event.target.value;
    exercise.totalCalories = this.exerciseTotalCalories(
      exercise.exercise_details
    );
    this.setState({ exercise: exercise });
  };

  getExerciseUnitCalories = (calories, duration_min) => {
    // Returns the base unit, which is calories per minute, allowing for user adjustments.
    return parseFloat(calories) / parseFloat(duration_min);
  };

  exerciseTotalCalories = data => {
    return data.length > 0
      ? data
          .map(ed => Math.ceil(ed.duration_min * ed.unit_calories))
          .reduce((total, element) => {
            return total + element;
          })
      : 0;
  };

  submitExercise = event => {
    // Used to call the API and get the natural language list for the entered exercise
    event.preventDefault();

    // Should save the Object, and then assign details from the array rather than this clumsy manner
    let detail = this.state.exercise.detail;
    let exercise_date = this.state.exercise.exercise_date;
    let exercise_date_d = this.state.exercise.exercise_date_d;
    let exercise_date_t = this.state.exercise.exercise_date_t;
    let exercise_type_id = this.exercise_type_id;
    
    let configObj = this.getConfigObj("POST", detail)
 
    fetch(APIEXERCISE_URL, configObj)
      .then(data => data.json())
      .then(data =>
        data.map(ed => {
          return Object.assign(
            ed,
            { photo_thumb: ed.photo.thumb },
            {
              unit_calories: this.getExerciseUnitCalories(
                ed.nf_calories,
                ed.duration_min
              )
            }
          );
        })
      )
      .then(data => {
        this.setState({
          exercise: {
            exercise_details: data,
            detail: detail,
            totalCalories: this.exerciseTotalCalories(data),
            exercise_date: exercise_date,
            exercise_date_d: exercise_date_d,
            exercise_date_t: exercise_date_t,
            exercise_type_id: exercise_type_id
          }
        });
      });
  };

  submitExerciseDetail = event => {
    // Store the food and food details records into the database
    event.preventDefault();
    let exercise = {};
    let exercises = [...this.state.exercises];
    exercises.push(exercise);

    Object.assign(exercise, this.state.exercise, {
      user_id: this.state.user.id
    });

    // let configObj = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json"
    //   },
    //   body: JSON.stringify({
    //     user_id: this.state.user_id, // NEED TO CHANGE WITH AUTH
    //     exercise: exercise
    //   })
    // };

    let configObj = this.getConfigObj("POST", exercise)

    fetch(EXERCISES_URL, configObj)
      .then(data => data.json())
      .then(() => this.setState({ exercises: exercises }))
      .then(() => this.resetExercise());
  };

  resetExercise = () => {
    // Resets the exercise entry form
    this.setState({ exercise: EMPTYEXERCISE });
  };

  selectExercise = (datapoint, event) => {
    let exercise = {};

    Object.assign(
      exercise,
      this.state.exercises.find(e => e.id === datapoint.id)
    );

    // Add the split date items to allow the date and time input fields to work
    Object.assign(
      exercise,
      { exercise_date_d: this.dateString(exercise.exercise_date) },
      { exercise_date_t: this.timeString(exercise.exercise_date) }
    );
    this.setState({ exercise: exercise });
  };

  // END OF EXERCISE HANDLERS
  //////////////////////////////////////////////////////////////
  // FOOD HANDLERS START
  changeFood = event => {
    // The handler that changes the food state, for either new or updates of a food entry
    // As this works off a single detail .... we can reset the entire state if this changes
    // no need to keep the details in the hash
    let food = {};
    Object.assign(food, this.state.food);
    food[event.target.name] = event.target.value;
    this.setState({ food: food });
  };

  changeFoodDetail = (event, index) => {
    // Change an individual food line item
    let food = {};
    Object.assign(food, this.state.food);
    food.meal_details[index][event.target.name] = event.target.value;
    food.totalCalories = this.foodTotalCalories(food.meal_details);
    this.setState({ food: food });
  };

  foodTotalCalories = data => {
    return data.length > 0
      ? data
          .map(fd => Math.ceil(fd.serving_qty * fd.unit_calories))
          .reduce((total, element) => {
            return total + element;
          })
      : 0;
  };

  getFoodUnitCalories = (calories, serving_qty) => {
    // Returns the base unit, which is calories per serving unit, allowing for user adjustments.
    return parseFloat(calories) / parseFloat(serving_qty);
  };

  getFoodUnitGrams = (serving_weight_grams, serving_qty) => {
    // Returns the base unit, which is grams per serving unit, allowing for user adjustments.
    return parseFloat(serving_weight_grams) / parseFloat(serving_qty);
  };

  submitFood = event => {
    // Used to get the main food records, that will then be
    // saved with submitFoodDetail
    //
    event.preventDefault();
    // Should save the Object, and then assign details from the array rather than this clumsy manner
    let detail = this.state.food.detail;
    let meal_date = this.state.meal_date;
    let meal_date_d = this.state.meal_date_d;
    let meal_date_t = this.meal_date_t;

    // let headers = this.getJWTHeaders();
    // Object.assign(headers,  {method:"POST"})
    // let configObj={}
    // Object.assign(configObj, headers, {body:JSON.stringify({ detail: detail })})

    let configObj = this.getConfigObj("POST", detail)

    fetch(APIFOOD_URL, configObj)
      .then(data => data.json())
      .then(data =>
        data.map(fd => {
          return Object.assign(
            fd,
            { photo_thumb: fd.photo.thumb },
            {
              unit_calories: this.getFoodUnitCalories(
                fd.nf_calories,
                fd.serving_qty
              )
            },
            {
              unit_grams: this.getFoodUnitGrams(
                fd.serving_weight_grams,
                fd.serving_qty
              )
            }
          );
        })
      )
      .then(data => {
        this.setState({
          food: {
            meal_details: data,
            detail: detail,
            totalCalories: this.foodTotalCalories(data),
            meal_date: meal_date,
            meal_date_d: meal_date_d,
            meal_date_t: meal_date_t
          }
        });
      });
  };

  submitFoodDetail = event => {
    event.preventDefault();

    if (!this.state.food.id) {
      console.log("INSERT");
      this.createFoodDetail();
    } else {
      console.log("UPDATE");
      this.updateFoodDetail();
    }
  };

  updateFoodDetail = () => {
    console.log(`Updating food record ${this.state.food.id}`);
    // Store the food and food details records into the database
    let food = {};
    // Remove this food from the array, so we can add the fully changed object
    // in the fetch
    let foods = this.state.foods.filter(f => f.id !== this.state.food.id);

    Object.assign(food, this.state.food, { user_id: this.state.user.id });

    // let configObj = {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json"
    //   },
    //   body: JSON.stringify({
    //     user_id: this.state.user_id, // NEED TO CHANGE WITH AUTH
    //     food: food
    //   })
    // };

    let configObj = this.getConfigObj("PATCH", food)

    fetch(`${MEALS_URL}/${food.id}`, configObj)
      .then(data => data.json())
      .then(data => {
        foods.push(data);
      })
      .then(() => this.setState({ foods: foods }))
      .then(() => this.resetFood());
  };

  createFoodDetail = () => {
    // Store the food and food details records into the database
    let food = {};
    let foods = [...this.state.foods];
    //    foods.push(food);

    Object.assign(food, this.state.food, { user_id: this.state.user.id });

    // let configObj = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json"
    //   },
    //   body: JSON.stringify({
    //     user_id: this.state.user_id, // NEED TO CHANGE WITH AUTH
    //     food: food
    //   })
    // };

    let configObj = this.getConfigObj("POST", food)

    fetch(MEALS_URL, configObj)
      .then(data => data.json())
      .then(data => {
        foods.push(data);
      })
      .then(() => this.setState({ foods: foods }))
      .then(() => this.resetFood());
  };

  resetFood = () => {
    // Resets the food entry form
    console.log("RESET FOOD");
    this.setState({ food: EMPTYFOOD });
  };

  deleteFood = () => {
    // delete the selected food element
    console.log("Deleting food");
    let configObj = this.getConfigObj( "DELETE")
    let foods = [];
    // fetch(`${MEALS_URL}/${this.state.food.id}`, { method: "DELETE" }).then(
    fetch(`${MEALS_URL}/${this.state.food.id}`, configObj).then(
      () => {
        console.log(`delete ${this.state.food.id}`);
        foods = this.state.foods.filter(f => f.id !== this.state.food.id);
        this.setState({ foods: foods });
        this.setState({ food: EMPTYFOOD });
      }
    );
  };

  selectFood = (datapoint, event) => {
    console.log("Select a graph point");
    let food = {};
    Object.assign(food, this.state.foods.find(f => f.id === datapoint.id));
    // Add the split date items to allow the date and time input fields to work
    Object.assign(
      food,
      { meal_date_d: this.dateString(food.meal_date) },
      { meal_date_t: this.timeString(food.meal_date) }
    );
    console.log(food);
    this.setState({ food: food });
  };

  // END OF FOOD HANDLERS
  //////////////////////////////////////////////////////////////////////////////
  // WEIGHT HANDLERS START

  // All of the weight handlers ... should these be in a seperate file etc ?? whats best practice ?
  changeWeight = event => {
    // The handler that changes the weight state, for either new or updates of a weight
    let weight = {};
    Object.assign(weight, this.state.weight);
    weight[event.target.name] = event.target.value;
    this.setState({ weight: weight });
  };

  resetWeight = () => {
    // Resets the weight entry form
    this.setState({ weight: EMPTYWEIGHT });
  };

  deleteWeight = () => {
    // The handler that changes the weight state, for either new or updates of a weight
    console.log("Deleting weight");
    let weights = [];

    let configObj = this.getConfigObj( "DELETE")
    // fetch(`${WEIGHTS_URL}/${this.state.weight.id}`, { method: "DELETE" }).then(
    fetch(`${WEIGHTS_URL}/${this.state.weight.id}`, configObj).then(
      () => {
        console.log(`delete ${this.state.weight.id}`);
        weights = this.state.weights.filter(w => w.id !== this.state.weight.id);
        this.setState({ weights: weights });
        this.setState({ weight: EMPTYWEIGHT });
      }
    );
  };

  submitWeight = event => {
    // Used to create a new weight, or update an existing one
    event.preventDefault();
    let weights = [...this.state.weights];

    // The date handling is now done on the backend
    let weight = {};
    Object.assign(weight, this.state.weight, { user_id: this.state.user.id });

    if (this.state.weight.id === "") {
      // Inserting a weight
      
      // let configObj = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json"
      //   },
      //   body: JSON.stringify(weight)
      // };
      let configObj = this.getConfigObj( "POST", weight);

      fetch(WEIGHTS_URL, configObj)
        .then(data => data.json())
        .then(data => {
          weights.push(data);
          console.log(weights);
          return weights;
        })
        .then(weights => {
          this.setState({ weights: weights });
        });
    } else {
      //Updating a weight in the database TO BE TESTED
      // let configObj = {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json"
      //   },
      //   body: JSON.stringify(weight)
      // };

      let configObj = this.getConfigObj( "PATCH", weight);

      fetch(`${WEIGHTS_URL}/${weight.id}`, configObj)
        .then(data => data.json())
        .then(weight => {
          let weightIndex = weights.findIndex(w => w.id === weight.id);
          Object.assign(weights[weightIndex], weight);
          this.setState({ weights: weights });
        });
    }
    // Whether inserting or updating, we need to reset the weight state to
    // get the weight entry/udpate/delete form into initial state
    this.setState({ weight: EMPTYWEIGHT });
  };

  selectWeight = (datapoint, event) => {
    let weight = this.state.weights.find(w => w.id === datapoint.id);
    // Add the split date items to allow the date and time input fields to work
    Object.assign(
      weight,
      { weight_date_d: this.dateString(weight.weight_date) },
      { weight_date_t: this.timeString(weight.weight_date) }
    );
    this.setState({ weight: weight });
  };

  dateString = date => {
    // Used by the date part of a date item ... will return the YYYY-MM-YY bit of a date
    return !!date ? date.toString().slice(0, 10) : null;
  };

  timeString = date => {
    // Used by the time part of a date item .. will return the HH:MI bit of a date
    return !!date ? date.toString().slice(11, 16) : null;
  };
  // END OF WEIGHT STATE HANDLERS ETC
  //////////////////////////////////////////////////////////////////////////////
  // START OF USER STATE HANDLERS
  changeUser = event => {
    // The handler that changes the user state, for either new or updates of a user
    let user = {};
    Object.assign(user, this.state.user);
    user[event.target.name] = event.target.value;
    this.setState({ user: user });
  };

  createUser = event => {
    event.preventDefault();
    if (this.state.user.name && this.state.user.gender && this.state.user.dob && this.state.user.height_cm ) {

      // let configObj = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json"
      //   },
      //   body: JSON.stringify({ user: this.state.user })
      // };

      let configObj = this.getConfigObj( "POST", this.state.user);
      fetch(USERS_URL, configObj)
      .then(data => data.json())
      .then( () => login(this.state.user.user_name, this.state.user.password) )
      .then( data => {
        localStorage.setItem("token", data.jwt);
        this.setState({ isLoggedIn: true, user: data.user });
        this.getUserData();
      });
//
//      .then(() => <Redirect to='/Account' />)
// WORK TO DO --- NEED TO FIGURE OUT HOW TO REDIRECT
// POSSIBLY SETSTATE REDIRECT TRUE, THEN IN NAVBAR ..... DO THE REDIRECT
//
    } else {
      alert("Please enter your name, gender, height and date of birth. Required to calculate your BMR");
    }
  };

  handleLoginChange = event => {
    let user = {};
    Object.assign(user, this.state.user);
    user[event.target.name] = event.target.value;
    this.setState({ user: user });
  };

  handleLogin = event => {
    event.preventDefault();
    console.log("Hello Programmer");
    login(this.state.user.user_name, this.state.user.password).then(data => {
      if (data.error) {
        alert("something is wrong with your credentials");
        this.setState({ user_name: "", password: "" });
      } else {
        localStorage.setItem("token", data.jwt);
        this.setState({ isLoggedIn: true, user: data.user });
        this.getUserData();
      }
    });
  };

  handleLogOut = () => {
    // WORKTODO --- PUT IN A CONST AS THIS IS USED TWICE, HERE AND IN CONSTRUCTOR
    localStorage.clear("token");
    this.setState({
      user: null,
      weight: EMPTYWEIGHT,
      food: EMPTYFOOD,
      foods: [],
      weights: [],
      exercises: [],
      isLoggedIn: false
    });
  };
/////////////////////////////////////////////////////////////
  // END OF USER STATE HANDLERS
////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
// START RENDERING PAGES
/////////////////////////////////////////////////////////////

  // Render the pages, with routes called from the selection from Navbar
  render() {
    return (
      <Router>
        <NavBar
          isLoggedIn={this.state.isLoggedIn}
          handleLogOut={this.handleLogOut}
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
              createUser={this.createUser}
              changeUser={this.changeUser}
            />
          )}
        />
        <Route
          path="/Weight"
          render={() => (
            <Weights
              user={this.state.user}
              weights={this.state.weights}
              weight={this.state.weight}
              submitWeight={this.submitWeight}
              changeWeight={this.changeWeight}
              deleteWeight={this.deleteWeight}
              selectWeight={this.selectWeight}
              resetWeight={this.resetWeight}
            />
          )}
        />
        <Route
          path="/Food"
          render={() => (
            <Food
              component={Food}
              user={this.state.user}
              foods={this.state.foods}
              food={this.state.food}
              submitFood={this.submitFood}
              submitFoodDetail={this.submitFoodDetail}
              changeFood={this.changeFood}
              changeFoodDetail={this.changeFoodDetail}
              selectFood={this.selectFood}
              deleteFood={this.deleteFood}
              resetFood={this.resetFood}
            />
          )}
        />
        <Route
          path="/Exercise"
          render={() => (
            <Exercise
              component={Exercise}
              user={this.state.user}
              exercises={this.state.exercises}
              exercise={this.state.exercise}
              submitExercise={this.submitExercise}
              submitExerciseDetail={this.submitExerciseDetail}
              changeExercise={this.changeExercise}
              changeExerciseDetail={this.changeExerciseDetail}
              selectExercise={this.selectExercise}
            />
          )}
        />

        <Route path="/Dashboard" render={() => <Dashboard />} />
        <Route
          path="/Account"
          render={() => <Account user={this.state.user} />}
        />
      </Router>
    );
  }
}

export default App;
