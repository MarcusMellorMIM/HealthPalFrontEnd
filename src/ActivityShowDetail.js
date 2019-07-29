import React, { Component } from "react";
import ActivityDetail from "./ActivityDetail";

// Renders the exercise items from the api, plus additional form buttons to 
// allow the user to save the meal
class ActivityShowDetail extends Component {
  render() {
    return (
      <div>
        <div>
{/* Display the API rendered food details */}
          <tbody>
            {this.props.activity.activity_details.map((ed, index) => (
              <ActivityDetail
                key={index}
                activity={ed}
                arrayIndex={index}
                changeActivityDetail={this.props.changeActivityDetail}
              />
            ))}
          </tbody>
        </div>

{/* Now display the rest of the form items to allow a user to 
save the exercise into the database */}
        <div>
          <h2>Totalling {this.props.activity.calories} calories</h2>
          <form onSubmit={this.props.submitActivityDetail}>
            <label htmlFor="activityDate">
              Enter date/time or leave blank for now{" "}
            </label>
            <input
              type="date"
              id="activityDate"
              name="activity_date_d"
              value={this.props.activity.activity_date_d}
              onChange={this.props.changeActivity}
            />
            <input
              type="time"
              id="activityTime"
              name="activity_date_t"
              value={this.props.activity.activity_date_t}
              onChange={this.props.changeActivity}
            />
            <label htmlFor="activity_type_id">How would you describe this ? </label>
            <select
              defaultValue="1"
              name="activity_type_id"
              value={this.props.activity.activity_type_id}
              onChange={this.props.changeActivity}
            >
              <option value="1">Light</option>
              <option value="2">Moderate</option>
              <option value="3">Intense</option>
            </select>
            <button
              type="submit"
              className="submitBtn"
              id="activityDetailSubmitBtn"
              name="activityDetailSubmitBtn"
              onChange={this.props.submitActivityDetail}
            >
              Submit
            </button>
          </form>

            {!!this.props.activity.id ?
            <div>
            <label htmlFor="deleteBtn">Hit delete, to remove this entry, or undo</label>
            <button id="deleteBtn" name="deleteBtn" onClick={this.props.deleteActivity}>
              Delete
            </button>
            <button id="resetBtn" name="resetBtn" onClick={this.props.resetActivity}>
              Undo
            </button>
            </div>
            : null }

        </div>
      </div>
    );
  }
}

export default ActivityShowDetail;
