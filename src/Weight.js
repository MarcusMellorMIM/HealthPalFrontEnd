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

    fetch(`${this.props.weightsUrl}/${this.state.weight.id}`, getConfigObj("DELETE"))
    .then(() => {
      // Pass the weight into the callback to remove from app.state.weights
      let weights = this.props.weights.filter(w => w.id !== this.state.weight.id);
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
      <div>
        <div>
          {!id ? (
            <h2>Record your weight here</h2>
          ) : (
            <h2>Update the selected weight here</h2>
          )}

          <form onSubmit={this.submitWeight}>
            <input type="hidden" id="weight_id" name="weight_id" value={id} />
            <label htmlFor="weight_kg">Please enter your latest weight </label>
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              value={weight_kg}
              onChange={this.changeWeight}
            />
            <label name="weight_kg"> in kilograms.</label>
            <br />
            <label htmlFor="weight_date_d">Enter the date </label>
            <input
              type="date"
              id="weight_date_d"
              name="weight_date_d"
              value={weight_date_d}
              onChange={this.changeWeight}
            />
            <label name="weight_date"> or leave blank if recorded today.</label>
            <br />
            <label htmlFor="weight_t">Enter the time </label>
            <input
              type="time"
              id="weight_date_t"
              name="weight_date_t"
              value={weight_date_t}
              onChange={this.changeWeight}
            />
            <label name="weight_date"> or leave blank if taken now.</label>
            <br />
            <label htmlFor="submitBtn">Hit submit, to save this entry</label>
            <button type="submit" id="submitBtn" name="submitBtn">
              Submit
            </button>
          </form>

          {!!id ? (
            <div>
              <label htmlFor="deleteBtn">
                Hit delete, to remove this entry, or undo
              </label>
              <button
                type="submit"
                id="deleteBtn"
                name="deleteBtn"
                onClick={this.deleteWeight}
              >
                Delete
              </button>
              <button
                type="submit"
                id="resetBtn"
                name="resetBtn"
                onClick={this.resetWeight}
              >
                Undo
              </button>
            </div>
          ) : null}

          <hr />
        </div>

        <div>
          <div>
            <h2>Click on the graph, to select a weight to update or delete</h2>
            <XYPlot
              xType="time"
              height={500}
              width={500}
              margin={{ left: 120, right: 20, top: 20, bottom: 120 }}
            >
              {/* <ChartLabel
          text="Date"
          className="alt-x-label"
          includeMargin={true}
          xPercent={0.9}
          yPercent={1.01}
          />
          <ChartLabel
          text="Weight (kgs)"
          className="alt-y-label"
          includeMargin={false}
          xPercent={-0.07}
          yPercent={0.06}
          /> */}
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Time" />
              <YAxis title="Weight (kg)" width={100} />
              <MarkSeries
                color="red"
                data={this.genGraphData()}
                onValueClick={(datapoint, event) =>
                  this.selectWeight(datapoint, event)
                }
              />
            </XYPlot>
          </div>
        </div>
      </div>
    );
  }
}