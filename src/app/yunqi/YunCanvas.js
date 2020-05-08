import React, { Component } from "react";

class YunCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { id } = this.props;
    console.log(id, 123)
    return (
      <canvas id={id}>
        您的浏览器不支持canvas，请更换浏览器。
      </canvas>
    )
  }
}

export default function({id}) {
  return (
    <YunCanvas 
    id={id}
    />
  )
}