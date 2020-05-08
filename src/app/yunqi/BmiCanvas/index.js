import React, { Component } from "react";

import yunCanvas from '../YunCanvas';

export default class BmiCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        {yunCanvas({
          id: "bmiCanvas"
        })}
      </div>
    )
  }
}
