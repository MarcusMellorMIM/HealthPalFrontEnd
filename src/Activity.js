import React, { Component } from "react";
import { getConfigObj} from "./api";
import { dateString, timeString } from "./helpers";
import ActivityShowDetail from "./ActivityShowDetail";
import ActivityShowGraph from "./ActivityShowGraph";

const EMPTYACTIVITY = {
  detail: "",
  calories: 0,
  activity_date: "",
  activity_date_t: "",
  activity_date_d: "",
  activity_type_id: "",
  activity_details: []
};


class Activity extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activity:EMPTYACTIVITY
    }
  }

 changeActivity = event => {
   // Changes the activity state, when a user changes the data on the html rendered page
    let activity = {};
    Object.assign(activity, this.state.activity);
    activity[event.target.name] = event.target.value;
    this.setState({ activity: activity });
  };

  changeActivityDetail = (event, index) => {
    // Change an individual activity line item
    let activity = {};
    Object.assign(activity, this.state.activity);
    activity.activity_details[index][event.target.name] = event.target.value;
    activity.calories = this.activityTotalCalories(activity.activity_details);
    this.setState({ activity: activity });
  };

  activityTotalCalories = data => {
    return data.length > 0
      ? data
          .map(ed => Math.ceil(ed.duration_min * ed.unit_calories))
          .reduce((total, element) => {
            return total + element;
          })
      : 0;
  };

  submitActivity = event => {
    // Calls the API and get the natural language list for the entered exercise
    // Does not create any records in the database
    event.preventDefault();
    let activity = {...this.state.activity}

  fetch(this.props.apiActivitiesUrl, getConfigObj("POST", this.state.activity.detail))
      .then(data => data.json())
      .then(data => {
        activity.calories=this.activityTotalCalories(data)
        Object.assign(activity,{activity_details:data})
        return activity
      })
      .then(data => this.setState({activity:data}))
  
    };

  submitActivityDetail = event => {
    // Store the food and food details records into the database
  // If the id is set, this is an update else it is an insert
    event.preventDefault();
      if (!this.state.activity.id) {
        this.createActivityDetail();
      } else {
        this.updateActivityDetail();
      }
  };

  updateActivityDetail = () => {
// Send the updated activity to the database
    let activities = this.props.activities.filter(f => f.id !== this.state.activity.id);
    fetch(`${this.props.activitiesUrl}/${this.state.activity.id}`, getConfigObj("PATCH", this.state.activity))
      .then(data => data.json())
      .then(data => {
        activities.push(data);
      })
      .then(() => this.props.setAppState({ activities: activities }))
      .then(() => this.resetActivity());
  };

  createActivityDetail = () => {
    // Creates new activity and activity detail records
    let activities = [...this.props.activities];
    fetch(this.props.activitiesUrl, getConfigObj("POST", this.state.activity))
      .then(data => data.json())
      .then(data => {
        activities.push(data);
      })
      .then(() => this.props.setAppState({ activities: activities }))
      .then(() => this.resetActivity());
  };

  resetActivity = () => {
    // Resets the exercise entry form
    console.log("RESET ACTIVITY")
    this.setState({ activity: EMPTYACTIVITY });
  };

  deleteActivity = () => {
    // delete the selected activity element, remove from app state and remove from local state
    fetch(`${this.props.activitiesUrl}/${this.state.activity.id}`, getConfigObj( "DELETE"))
    .then(
      () => {
        let activities = this.props.activities.filter(f => f.id !== this.state.activity.id);
        this.props.setAppState({ activities: activities });
        this.setState({ activity: EMPTYACTIVITY });
      }
    );
  };

  selectActivity = (datapoint, event) => {
    // Called when an item on the graph is clicked
    console.log("SELECTACTIVITY")
    console.log(`the datapoint ${datapoint}`)
    let activity = {};
    Object.assign(activity,this.props.activities.find(e => e.id === datapoint.id));
    // Add the split date items to allow the date and time input fields to work
    Object.assign(
      activity,
      { activity_date_d: dateString(activity.activity_date) },
      { activity_date_t: timeString(activity.activity_date) }
    );
    this.setState({ activity: activity });
  };

  render() {
    // Now render the activity view
    return (
      <div className="activity_main">
      <h1 className="main_title1">Activities</h1>
      <h1 className="main_title2">and</h1>
      <h1 className="main_title3">Exercise</h1>

        <div className="main_entry">
          <h2>Record your activity here</h2>
          <form onSubmit={this.submitActivity}>
            <label htmlFor="activityDetail">Natural language search here </label>
            <input
              className="main_entry_input"
              type="text"
              id="activityDetail"
              name="detail"
              value={this.state.activity.detail}
              onChange={this.changeActivity}
            />
            <button
              className="main_entry_button"
              type="submit"
              id="activitysubmitBtn"
              name="activitysubmitBtn"
            >
              Submit
            </button>
            <hr />
          </form>
        </div>

        {this.state.activity.activity_details.length > 0 ? (
          <div className="main_graph">
            <ActivityShowDetail
              activity={this.state.activity}
              changeActivityDetail={this.changeActivityDetail}
              changeActivity={this.changeActivity}
              onSubmit={this.submitActivityDetail}
              onChange={this.changeActivity}
              submitActivityDetail={this.submitActivityDetail}
              deleteActivity={this.deleteActivity}
              resetActivity={this.resetActivity}
            />
            </div>
        )
        : 
        <ActivityShowGraph
          activities={this.props.activities}
          selectActivity={this.selectActivity}
        />
      }
      </div>
    );
  }
}

export default Activity;
