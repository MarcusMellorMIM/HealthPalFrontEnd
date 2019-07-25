import React, { Component } from "react";

class InputDetail extends Component {

    render() {
    
    const {serving_qty, serving_unit,name, unit_calories, photo_thumb, unit_grams } = this.props.input;
    const arrayIndex = this.props.arrayIndex;

      return (
          <tr>
            <td>
                <img src={photo_thumb} alt={name} name="photo_thumb"/>
            </td>
            <td>
              {name}
          </td>
          <td>
              <input type="number" className="smallNumber" id="serving_qty" name="serving_qty" value={serving_qty} onChange={ event => this.props.changeInputDetail(event, arrayIndex) }/>
          </td>
          <td>
              {serving_unit}
          </td>
          <td>
            {Math.ceil(serving_qty * unit_grams)} grams
          </td>
          <td>
              {Math.ceil(serving_qty * unit_calories)} calories
          </td>
          </tr>
      );
    }
  }
  
  export default InputDetail;
  