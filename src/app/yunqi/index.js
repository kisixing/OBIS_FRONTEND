import React, { Component } from "react";
import BmiCanvas from "./components/bmi-canvas";
import FetusCanvas from "./components/fetus-canvas";
import Page from "../../render/page";
import store from "../store";
import "./index.less";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  render() {
    const { userDoc } = this.state;
    return (
      <Page className="yunqi">
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>  
        <FetusCanvas userDoc={userDoc} />
        <BmiCanvas />
      </Page>
    )
  }
}
