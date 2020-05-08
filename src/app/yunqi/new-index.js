import React, { Component } from "react";
import BmiCanvas from "./BmiCanvas";
import FetusCanvas from "./FetusCanvas";

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
