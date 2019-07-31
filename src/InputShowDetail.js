import React, { Component } from "react";
import InputDetail from "./InputDetail";

// Renders the meal items from the api, plus additional form buttons to 
// allow the user to save the meal
class InputShowDetail extends Component {
  render() {
    return (
      <div className="main_show_details">

            <h3>{this.props.input.detail}, totalling {this.props.input.calories} calories</h3>  
            {!!this.props.input.id ?
            <div>
            <label htmlFor="deleteBtn">Hit the delete button, to remove this entry</label>
            <br/>
            <button className="submit_button" id="deleteBtn" name="deleteBtn" onClick={this.props.deleteInput}>Delete</button>
            </div>
            : null }
    
        <div>

        <br/>
{/* Display the API rendered food details */}
          <tbody>
            {this.props.input.input_details.map((fd, index) => (
              <InputDetail
                key={index}
                input={fd}
                arrayIndex={index}
                changeInputDetail={this.props.changeInputDetail}
              />
            ))}
          </tbody>
          <br/>
        </div>

{/* Now display the rest of the form items to allow a user to 
save the meal into the database */}
        <div>
          <form onSubmit={this.props.submitInputDetail}>
            <label htmlFor="inputDate">
              Enter date/time or leave blank for now{" "}
            </label>
            <br/>
            <input
              type="date"
              id="inputDate"
              name="input_date_d"
              value={this.props.input.input_date_d}
              onChange={this.props.changeInput}
            />
            <input
              type="time"
              id="inputTime"
              name="input_date_t"
              value={this.props.input.input_date_t}
              onChange={this.props.changeInput}
            />
            <br/>
            <label htmlFor="input_type_id">How does this make you feel ? </label>
            <select
              defaultValue="1"
              name="input_type_id"
              id="input_type_id"
              value={this.props.input.input_type_id}
              onChange={this.props.changeInput}
            >
              <option value="1">Angelic</option>
              <option value="2">Meh</option>
              <option value="3">Guilty</option>
            </select>

            <br/>
            <label htmlFor="inputDetailSubmitBtn">Press Confirm to save your entry</label>
            <br/>
            <button
              type="submit"
              className="submit_button"
              id="inputDetailSubmitBtn"
              name="inputDetailSubmitBtn"
              onChange={this.props.submitInputDetail}
            >
              Confirm
            </button>
          </form>

          <br/>

          <button className="undo_button" id="resetBtn" name="resetBtn" onClick={this.props.resetInput}>Back</button>

        </div>
      </div>
    );
  }
}

export default InputShowDetail;
