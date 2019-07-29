import React, { Component } from "react";
import InputDetail from "./InputDetail";

// Renders the meal items from the api, plus additional form buttons to 
// allow the user to save the meal
class InputShowDetail extends Component {
  render() {
    return (
      <div>
        <div>
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
        </div>

{/* Now display the rest of the form items to allow a user to 
save the meal into the database */}
        <div>
          <h2>Totalling {this.props.input.calories} calories</h2>
          <form onSubmit={this.props.submitInputDetail}>
            <label htmlFor="inputDate">
              Enter date/time or leave blank for now{" "}
            </label>
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
            <label htmlFor="input_type_id">How would you describe this ? </label>
            <select
              defaultValue="1"
              name="input_type_id"
              value={this.props.input.input_type_id}
              onChange={this.props.changeInput}
            >
              <option value="1">Angelic</option>
              <option value="2">Meh</option>
              <option value="3">Guilty</option>
            </select>
            <button
              type="submit"
              className="submitBtn"
              id="inputDetailSubmitBtn"
              name="inputDetailSubmitBtn"
              onChange={this.props.submitInputDetail}
            >
              Submit
            </button>
          </form>

            {!!this.props.input.id ?
            <div>
            <label htmlFor="deleteBtn">Hit delete, to remove this entry, or undo</label>
            <button id="deleteBtn" name="deleteBtn" onClick={this.props.deleteInput}>
              Delete
            </button>
            <button id="resetBtn" name="resetBtn" onClick={this.props.resetInput}>
              Undo
            </button>
            </div>
            : null }

        </div>
      </div>
    );
  }
}

export default InputShowDetail;
