import React, { Component } from "react";
import { getConfigObj} from "./api";
import { dateString, timeString } from "./helpers";
import InputShowDetail from "./InputShowDetail";
import InputShowGraph from "./InputShowGraph";

const EMPTYINPUT = {
  detail: "",
  calories: 0,
  input_date_d: "",
  input_date: "",
  input_date_t: "",
  input_type_id: "",
  input_details: []
};

class Input extends Component {
  
  constructor(props) {
    super(props) 
    this.state = {
      input: EMPTYINPUT
    }
  }

  changeInput = event => {
    // The handler that changes the main input state, for either new or updates of a food entry
    let input = {};
    Object.assign(input, this.state.input);
    input[event.target.name] = event.target.value;
    this.setState({ input: input });
  };

  changeInputDetail = (event, index) => {
    // Change an individual input detail line item
    let input = {};
    Object.assign(input, this.state.input);
    input.input_details[index][event.target.name] = event.target.value;
    input.calories = this.inputTotalCalories(input.input_details);
    this.setState({ input: input });
  };

  inputTotalCalories = data => {
    return data.length > 0
      ? data
          .map(fd => Math.ceil(fd.serving_qty * fd.unit_calories))
          .reduce((total, element) => {
            return total + element;
          })
      : 0;
  };

  submitInput = event => {
    // Used to call the API and get the main input detail records, that will then be
    // saved with submitInputDetail
    event.preventDefault();

    fetch(this.props.apiInputsUrl, getConfigObj("POST", this.state.input.detail) )
      .then(data => data.json())
      .then( data => this.setState( { input: {input:data}} ))
  
  };

  submitInputDetail = event => {
    event.preventDefault();
// If the id is set, this is an update else it is an insert
    if (!this.state.input.id) {
      this.createInputDetail();
    } else {
      this.updateInputDetail();
    }
  };

  updateInputDetail = () => {
    // Updating the input and input details
    // Remove this input item from the array, so we can add the fully changed object in the fetch
    let inputs = this.props.inputs.filter(f => f.id !== this.state.input.id);

    fetch(`${this.props.inputsUrl}/${this.state.input.id}`, getConfigObj("PATCH", this.state.input))
      .then(data => data.json())
      .then(data => {
        inputs.push(data);
      })
      .then(() => this.props.setAppState({ inputs: inputs }))
      .then(() => this.resetInput());
  };

  createInputDetail = () => {
    // Creates new input and input detail records
    let input = {};
    let inputs = [...this.props.inputs];

    Object.assign(inputs, this.state.input );

    fetch(this.props.inputsUrl, getConfigObj("POST", input))
      .then(data => data.json())
      .then(data => {
        inputs.push(data);
      })
      .then(() => this.props.setAppState({ inputs: inputs }))
      .then(() => this.resetInput());
  };

  resetInput = () => {
    // Resets the input entry form
    this.setState({ input: EMPTYINPUT });
  };

  deleteInput = () => {
    // delete the selected input element, remove from app inputs state and remove from local input state
    fetch(`${this.props.inputsUrl}/${this.state.input.id}`, getConfigObj( "DELETE"))
    .then(
      () => {
        let inputs = this.props.inputs.filter(f => f.id !== this.state.input.id);
        this.setAppState({ inputs: inputs });
        this.setState({ input: EMPTYINPUT });
      }
    );
  };

  selectInput = (datapoint, event) => {
    // Called when a point on the graph is called - it will show the details
    let input = {};
    Object.assign(input, this.props.inputs.find(f => f.id === datapoint.id));
    // Add the split date items to allow the date and time input fields in input state to work
    Object.assign(
      input,
      { input_date_d: dateString(input.input_date) },
      { input_date_t: timeString(input.input_date) }
    );
    this.setState({ input: input });
  };


  render() {
    return (
      <div>
        <div>
          <h2>Record your food, drinks and snacks here</h2>
          <form onSubmit={this.submitInput}>
            <label htmlFor="inputDetail">Natural language search here </label>
            <input
              type="text"
              className="largetext"
              id="inputDetail"
              name="detail"
              value={this.state.input.detail}
              onChange={this.changeInput}
            />
            <button
              type="submit"
              className="submitBtn"
              id="inputsubmitBtn"
              name="inputsubmitBtn"
            >
              Submit
            </button>
            <hr />
          </form>
        </div>

        {this.state.input.input_details.length > 0 ? (

            <InputShowDetail
              input={this.state.input}
              changeInputDetail={this.changeInputDetail}
              changeInput={this.changeInput}
              onSubmit={this.submitInputDetail}
              onChange={this.changeInput}
              submitInputDetail={this.submitInputDetail}
              deleteInput={this.deleteInput}
              resetInput={this.resetInput}  
            />
        )
        : 
        <InputShowGraph
          inputs={this.props.inputs}
          selectInput={this.selectInput}
        />
      }
      </div>
    );
  }
}

export default Input;