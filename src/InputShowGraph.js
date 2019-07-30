import React, { Component } from "react";
import { hourString } from "./helpers";

import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    MarkSeries
  } from "react-vis";
  
class InputShowGraph extends Component {

    returnColor =(id) => {
        // Display the colour of the meal, depending on type
        return id===3 ? "red" : 
            id===2 ? "yellow" : "green"
    }

    // timeString = (date) => {
    //     // Used by the time part of a date item .. will return the HH:MI bit of a date
    //       return !!date ? date.toString().slice(11,13) : 12 
    //     }
    
    categoriseCalories = (calories) => {
        return calories<250 ? 5 : 
            calories<1000 ? 10 : 15
    }
 
    genGraphData = () => {
        // Render the weight object into a form the graph object understands
        let data = this.props.inputs.map(input => {
          return { x: Date.parse(input.input_date), 
                    y: hourString(input.input_date), 
                    label:input.detail,
                    size: this.categoriseCalories(input.calories),
                    color:this.returnColor(input.input_type_id),
                    id:input.id };
        });    
        return data;
      };
    
  render() {

    let graphData = this.genGraphData();

    return ( 
        <div className="main_graph">
        
        <h2>Click on the graph, to select a meal to update or delete</h2>
        <XYPlot
        xType="time"
        height={500}
        width={500}
        color="red"
        margin={{ left: 120, right: 20, top: 20, bottom: 120 }}
        >
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Date"/>
        <YAxis title="Time" width={100} />
        <MarkSeries
            sizeRange={[5,15]}
            data={graphData.filter(gd => gd.color==="red")  }
            color="red"
            onValueClick= {(datapoint,event) => this.props.selectInput(datapoint,event)}
        />
        <MarkSeries
            sizeRange={[5,15]}
            data={graphData.filter(gd => gd.color==="yellow")  }
            color="yellow"
            onValueClick= {(datapoint,event) => this.props.selectInput(datapoint,event)}
        />
       <MarkSeries
            sizeRange={[5,15]}
            data={graphData.filter(gd => gd.color==="green")  }
            color="green"
            onValueClick= {(datapoint,event) => this.props.selectInput(datapoint,event)}
        />


      </XYPlot>
      </div>
    );

}
}

export default InputShowGraph;