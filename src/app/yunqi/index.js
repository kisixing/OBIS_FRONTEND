import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from "../../render/page";
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    drawgrid('canvas');

    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");
  }

  render() {
    return (
      <Page className="yunqi font-16 ant-col">
        <Row>
          <Col span={8}>
          <canvas id="canvas" width="700" height="600" style={{border: "1px solid gray"}}>
              您的浏览器不支持canvas，请更换浏览器.
            </canvas>
            <canvas ref="canvas" width="700" height="600" style={{border: "1px solid gray"}}>
              您的浏览器不支持canvas，请更换浏览器.
            </canvas>
          </Col>
        </Row>
      </Page>
    );
  }
}
