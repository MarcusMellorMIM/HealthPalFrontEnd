import React, { Component } from "react";
import { dateString, timeString } from "./helpers";
import { getConfigObj} from "./api";

import {
  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  VerticalGridLines,
  MarkSeries
} from "react-vis";
import { _adjustCategoricalScale } from "react-vis/dist/utils/scales-utils";

const EMPTYWEIGHT = {
  id: "",
  weight_kg: "",
  weight_date: "",
  weight_date_d: "",
  weight_date_t: ""
};

export default class Weight extends Component {
  constructor() {
    super();
    this.state = {
      weight: EMPTYWEIGHT
    };
  }

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
    let weight_id = this.state.weight.id;
    fetch(`${this.props.weightsUrl}/${weight_id}`, getConfigObj("DELETE"))
    .then(() => {
      // Pass the weight into the callback to remove from app.state.weights
      let weights = this.props.weights.filter(w => w.id !== weight_id);
      this.props.setAppState({ weights: weights });
      this.setState({ weight: EMPTYWEIGHT });
    });
  };

  insertWeight = () => {
    // Creates a new weight, and maniplates weights state using callback
    let weights = [...this.props.weights];
    
    fetch(this.props.weightsUrl, getConfigObj("POST", this.state.weight))
      .then(data => data.json())
      .then(data => {
        weights.push(data);
        return weights;
      })
      .then(weights => {
        this.props.setAppState({ weights: weights }); // Set App.state.weights
        //            this.setState({ weights: weights });
      });
  };

  updateWeight = () => {
    //Updating a weight in the database TO BE TESTED
    let weights = [...this.props.weights];

    fetch(`${this.props.weightsUrl}/${this.state.weight.id}`, getConfigObj("PATCH", this.state.weight))
      .then(data => data.json())
      .then(weight => {
        let weightIndex = weights.findIndex(w => w.id === weight.id);
        Object.assign(weights[weightIndex], weight);
        this.props.setAppState({ weights: weights }); // Set App.state.weights
      });
  };

  submitWeight = event => {
    // Used to create a new weight, or update an existing one
    event.preventDefault();
    if (this.state.weight.id === "") {
      this.insertWeight();
    } else {
      this.updateWeight();
    }
    // Whether inserting or updating, we need to reset the weight state to
    // get the weight entry/udpate/delete form into initial state
    this.setState({ weight: EMPTYWEIGHT });
  };

  selectWeight = (datapoint, event) => {

    console.log(datapoint.id)    
    let weight = this.props.weights.find(w => w.id === datapoint.id);
    // Add the split date items to allow the date and time input fields to work
    Object.assign(
      weight,
      { weight_date_d: dateString(weight.weight_date) },
      { weight_date_t: timeString(weight.weight_date) }
    );
    this.setState({ weight: weight });
  };

  genGraphData = () => {
    // Render the weight object into a form the graph object understands
    let data = this.props.weights.map(weight => {
      return {
        x: Date.parse(weight.weight_date),
        y: weight.weight_kg,
        id: weight.id
      };
    });

    return data;
  };

  render() {

    const { id, weight_kg, weight_date_d, weight_date_t } = this.state.weight;

    return (
        <div className="weight_main">
              <h1 className="main_title1">Record</h1>
              <h1 className="main_title2">your</h1>
              <h1 className="main_title3">Weight</h1>

      
          <div className="main_entry">
          <form>
            {!id ? (<h2>Record your weight here</h2>) : (<h2>Update the selected weight here</h2>)}
            <label htmlFor="weight_kg">Please enter your latest weight </label>
            <input
              className="main_entry_input"
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={weight_kg}
              onChange={this.changeWeight}
            />
            <label name="weight_kg"> in kilograms.</label>
            <hr />
            </form>
          </div>
        

          {weight_kg!=="" ? (
            <div className="main_show_details">

              {!!id ? (
              <div>
              <label htmlFor="deleteBtn">
                Hit delete, to remove this entry
              </label>
              <br />
              <button
                className="submit_button"
                id="deleteBtn"
                name="deleteBtn"
              onClick={this.deleteWeight}>Delete</button>  
              </div> )
              : (null) }


            <form onSubmit={this.submitWeight}>
            <input type="hidden" id="weight_id" name="weight_id" value={id} />

              {!!id ? (
              <div>
              <br />
              <br />
              <label htmlFor="weight_kg">Amend you weight, in kilograms, here </label>
              <br />
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={weight_kg}
              onChange={this.changeWeight}
            />

              </div>
              ) : (null) }


            <br />
            <label htmlFor="weight_date_d">Enter the date/time or leave blank for now </label>
            <br />

            <input
              type="date"
              id="weight_date_d"
              name="weight_date_d"
              value={weight_date_d}
              onChange={this.changeWeight}
            />

            <input
              type="time"
              id="weight_date_t"
              name="weight_date_t"
              value={weight_date_t}
              onChange={this.changeWeight}
            />

            <br />
            <br />
            <label htmlFor="submitBtn">Press Confirm, to save this entry</label>
            <br />
            <button className="submit_button" type="submit" id="submitBtn" name="submitBtn">
              Confirm
            </button>
            <br />
          </form>

            <div>
              <br />
              <button
                className="undo_button"
                type="submit"
                id="resetBtn"
                name="resetBtn"
                onClick={this.resetWeight}>Back</button>
                </div>
          </div>

          ) : (

          <div className="main_graph">
            <h2>Click on the graph, to select a weight to update or delete</h2>
            <XYPlot
              xType="time"
              height={500}
              width={500}
              margin={{ left: 120, right: 20, top: 20, bottom: 120 }}
            >
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Time" />
              <YAxis title="Weight (kg)" width={100} />
              <MarkSeries
                color="red"
                data={this.genGraphData()}
                onValueClick={(datapoint, event) => this.selectWeight(datapoint, event)}
              />
            </XYPlot>
          </div>
            )};
      </div>
      ) 
    }

  }