import React, { Component } from "react";
import BmiCanvas from "./components/bmi-canvas";
import FetusCanvas from "./components/fetus-canvas";
import Page from "../../render/page";
import "./index.less";

export default class Index extends Component {

  render() {
    return (
      <Page className="yunqi">
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>  
        <FetusCanvas />
        <BmiCanvas />
      </Page>
    )
  }
}
