import React, { Component } from "react";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <canvas>
        您的浏览器不支持canvas，请更换浏览器。
      </canvas>
    )
  }
}
