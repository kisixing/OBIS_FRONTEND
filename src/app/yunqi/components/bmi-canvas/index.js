import React, { Component } from "react";

import basicCanvas from '../basic-canvas';

export default class BmiCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        {basicCanvas({
          id: "bmiCanvas"
        })}
      </div>
    )
  }
}
