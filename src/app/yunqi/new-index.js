import React, { Component } from "react";
import BmiCanvas from "./components/bmi-canvas";
import FetusCanvas from "./components/fetus-canvas";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <BmiCanvas />
        <FetusCanvas />
      </div>
    )
  }
}
