import React, { Component } from "react";
import ActivityDetail from "./ActivityDetail";

// Renders the exercise items from the api, plus additional form buttons to 
// allow the user to save the meal
class ActivityShowDetail extends Component {
  render() {
    return (
      <div className="main_show_details">

          <h3>{this.props.activity.detail},totalling {this.props.activity.calories} calories</h3>
          {!!this.props.activity.id ?
            <div>
            <label htmlFor="deleteBtn">Hit delete, to remove this entry</label>
            <br/>
            <button className="submit_button" id="deleteBtn" name="deleteBtn" onClick={this.props.deleteActivity}>Delete</button>
            </div>
            : null }

        <div>

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
          <form onSubmit={this.props.submitActivityDetail}>
            <label htmlFor="activityDate">
              Enter date/time or leave blank for now{" "}
            </label>
            <br/>
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

            <br/>
            <br/>

            <label htmlFor="activity_type_id">How would you describe this activity ? </label>
            <br/>
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

            <br/>
            <br/>

            <label htmlFor="activityDetailSubmitBtn">Press Confirm to save your entry</label>
            <br/>
            <button
              type="submit"
              className="submit_button"
              id="activityDetailSubmitBtn"
              name="activityDetailSubmitBtn"
              onChange={this.props.submitActivityDetail}
            >
              Confirm
            </button>
          </form>

            <br/>

            <button className="undo_button" id="resetBtn" name="resetBtn" onClick={this.props.resetActivity}>Back</button>

        </div>
      </div>
    );
  }
}

export default ActivityShowDetail;
