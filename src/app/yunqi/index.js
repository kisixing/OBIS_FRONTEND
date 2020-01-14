import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from "../../render/page";
import "./index.less";
import service from "../../service";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    service.yunqi.getPacsGrowth().then(res => {
      demodata = res.object;
      drawgrid('canvas');
    });

    this.drawPregCanvas();
  }

  drawPregCanvas() {
    const canvas = document.getElementById('pregCanvas');
    const context = canvas.getContext("2d");
    canvas.width = '700';
    canvas.height = '600';
    const baseLeft = 100;
    const baseTop = 70;

    // context.font = 'bold 20px sans-serif';
    // context.fillText('妊娠图', 300, 20);

    //x轴线
    const setVertical = () => {
      context.strokeStyle = 'gray'; // 横轴线
      for (var i = 0; i < 30; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(baseLeft, baseTop + 15 * i);
        context.lineTo(baseLeft + 540, baseTop + 15 * i);
        if(i%2 == 0) {
          context.textBaseline='middle';
          context.fillText(13 + i, 80, 520 - (i + 1) * 15);
        }
        context.stroke();
      }
      context.fillText('宫高(cm)', 80, 55);
      context.stroke();
    }

    //y轴线
    const setHorizontal = () => {
      for (var i = 0; i <= 27; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(20 * i + baseLeft, baseTop);
        context.lineTo(20 * i + baseLeft, baseTop + 450);
        if(i%2 == 0) {
          context.textAlign='center';
          context.fillText(16 + i, baseLeft + (i + 1) * 20, 535);
        }
        context.stroke();
      }
      context.fillText('孕周(周)', 670, 520);
      context.stroke();
    }

    //水平坐标轴标尺 
    const setVerRules = (origin, Len, color, lineWidth) => {
      // 创建水平坐标轴路径
      context.moveTo(origin[0], origin[1]);
      context.lineTo(origin[0] + Len, origin[1]);

      // 创建坐标轴的刻度线路径
      for(let i = origin[0] + 20; i <= Len + baseLeft; i += 20){
        context.moveTo(i, origin[1]);
        context.lineTo(i, origin[1] + 5);
      }
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.stroke();
      context.beginPath();
    }

      //垂直坐标轴标尺 
      const setHorRules = (origin, Len, color, lineWidth) => {
        // 创建水平坐标轴路径
        context.moveTo(origin[0], origin[1]);
        context.lineTo(origin[0], origin[1] - Len);
  
        // 创建坐标轴的刻度线路径
        for(let i = origin[1] - 15; i >= origin[1] - Len; i -= 15){
          context.moveTo(origin[0] - 5, i);
          context.lineTo(origin[0], i);
        }
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();
        context.beginPath();
      }

    setVertical();
    setHorizontal();
    setVerRules([baseLeft, baseTop + 450], 540, 'black', 1);
    setHorRules([baseLeft, baseTop + 450], 450, 'black', 1);
  }


  render() {
    return (
      <Page className="yunqi font-16 ant-col">
        <canvas id="canvas" style={{border: "1px solid gray", marginRight: "10px"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
        <canvas id="pregCanvas" width="700" height="600" style={{border: "1px solid gray"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </Page>
    );
  }
}
