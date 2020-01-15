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
    this.drawBmiCanvas();
  }

  //水平坐标轴标尺 
  setVerRules(cxt, origin, Len, color, lineWidth, step, int) {
    // 创建水平坐标轴路径
    cxt.moveTo(origin[0], origin[1]);
    cxt.lineTo(origin[0] + Len, origin[1]);

    // 创建坐标轴的刻度线路径
    for(let i = origin[0] + step; i <= Len + origin[0]; i += step){
      cxt.moveTo(i, origin[1]);
      cxt.lineTo(i, origin[1] + int);
    }
    cxt.strokeStyle = color;
    cxt.lineWidth = lineWidth;
    cxt.stroke();
    cxt.beginPath();
  }

  //垂直坐标轴标尺 
  setHorRules = (cxt, origin, Len, color, lineWidth, step, int) => {
    // 创建水平坐标轴路径
    cxt.moveTo(origin[0], origin[1]);
    cxt.lineTo(origin[0], origin[1] - Len);

    // 创建坐标轴的刻度线路径
    for(let i = origin[1] - step; i >= origin[1] - Len; i -= step){
      cxt.moveTo(origin[0] - int, i);
      cxt.lineTo(origin[0], i);
    }
    cxt.strokeStyle = color;
    cxt.lineWidth = lineWidth;
    cxt.stroke();
    cxt.beginPath();
  }

  drawPregCanvas() {
    const canvas = document.getElementById('pregCanvas');
    const context = canvas.getContext("2d");
    canvas.width = '700';
    canvas.height = '600';
    const baseLeft = 100;
    const baseTop = 70;

    context.font = 'bold 18px sans-serif';
    context.fillText('妊娠图', 350, 20);
    context.font = 'normal 12px sans-serif';

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
    }

    //y轴线
    const setHorizontal = () => {
      for (var i = 0; i < 28; i++) {
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
    }

    setVertical();
    setHorizontal();
    this.setVerRules(context, [baseLeft, baseTop + 450], 540, 'black', 1, 20, 5);
    this.setHorRules(context, [baseLeft, baseTop + 450], 450, 'black', 1, 15, 5);
  }

  drawBmiCanvas() {
    const canvas = document.getElementById('bmiCanvas');
    const context = canvas.getContext("2d");
    canvas.width = '960';
    canvas.height = '450';
    const baseLeft = 80;
    const baseTop = 80;

    context.font = 'bold 16px sans-serif';
    context.textAlign='center';
    context.fillText('BMI孕期体重管理曲线', 450, 20);
    
    context.fillStyle = '#52aaff';
    context.font = 'normal 12px sans-serif';
    context.fillText('孕前BMI:18.5~24.9kgm2', 450, 40);
    context.fillText('体重正常，建议增长体重增长目标11.5~16kg', 450, 55);

    context.fillStyle = '#000';
    //x轴线
    const setVertical = () => {
      context.strokeStyle = 'gray'; // 横轴线
      for (var i = 0; i < 11; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(baseLeft, baseTop + 30 * i);
        context.lineTo(baseLeft + 780, baseTop + 30 * i);
       
        context.textBaseline='middle';
        context.fillText(i * 2, 60, 380 - i * 30);

        context.stroke();
      }
      context.fillText('体重增长(kg)', 80, 55);
    }

    //y轴线
    const setHorizontal = () => {
      let count = 0;
      for (var i = 0; i < 40; i++) {
        count++;
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(20 * i + baseLeft, baseTop);
        context.lineTo(20 * i + baseLeft, baseTop + 300);
        if(count === 1 || count === 4) {
          console.log(count, '333')
          count = count === 4 ? 1 : count;
          context.textAlign='center';
          context.fillText(i + 1, baseLeft + i * 20, 395);
        }
        context.stroke();
      }
      context.fillText('孕周(周)', 890, 380);
    }

    setVertical();
    setHorizontal();
    this.setVerRules(context, [baseLeft, baseTop + 300], 780, 'black', 1, 20, 5);
    this.setHorRules(context, [baseLeft, baseTop + 300], 300, 'black', 1, 30, 5);
  }

  render() {
    return (
      <Page className="yunqi font-16 ant-col">
        <canvas id="canvas" style={{border: "1px solid gray", marginRight: "10px"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
        <canvas id="pregCanvas" style={{border: "1px solid gray"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
        <canvas id="bmiCanvas" style={{border: "1px solid gray"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </Page>
    );
  }
}
