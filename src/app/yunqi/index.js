import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from "../../render/page";
import "./index.less";
import service from "../../service";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bmiDashLine1: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 11.5 }],
      bmiDashLine2: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 3 }, { 'x': 39, 'y': 16 }],

      pregSolidLine1: [{ 'x': 1, 'y': 0 }, { 'x': 3, 'y': 1 }, { 'x': 5, 'y': 3 }, { 'x': 7, 'y': 4.5 }, { 'x': 9, 'y': 6 },
                      { 'x': 11, 'y': 7 }, { 'x': 13, 'y': 8.5 }, { 'x': 15, 'y': 10.5 }, { 'x': 17, 'y': 12.5 }, { 'x': 19, 'y': 13.5 },
                      { 'x': 21, 'y': 15 }, { 'x': 23, 'y': 16 }, { 'x': 25, 'y': 17.5 }, { 'x': 27, 'y': 17 }],

      pregDashLine1: [{ 'x': 1, 'y': 1.5 }, { 'x': 3, 'y': 2.5 }, { 'x': 5, 'y': 4.5 }, { 'x': 7, 'y': 6 }, { 'x': 9, 'y': 7.5 },
                      { 'x': 11, 'y': 8.5 }, { 'x': 13, 'y': 10 }, { 'x': 15, 'y': 12.5 }, { 'x': 17, 'y': 14.5 }, { 'x': 19, 'y': 14.5 },
                      { 'x': 21, 'y': 16 }, { 'x': 23, 'y': 17.5 }, { 'x': 25, 'y': 18.5 }, { 'x': 26, 'y': 18 }, { 'x': 27, 'y': 17.5 }],

      pregSolidLine2: [{ 'x': 1, 'y': 7 },{ 'x': 2, 'y': 8 }, { 'x': 3, 'y': 8 }, { 'x': 5, 'y': 10 }, { 'x': 7, 'y': 11.5 }, { 'x': 9, 'y': 13.5 },
                      { 'x': 11, 'y': 15 }, { 'x': 13, 'y': 16.5 }, { 'x': 15, 'y': 18 }, { 'x': 17, 'y': 19.5 }, { 'x': 19, 'y': 20.5 },
                      { 'x': 21, 'y': 21.5 }, { 'x': 23, 'y': 22.5 }, { 'x': 25, 'y': 23.5 }, { 'x': 26, 'y': 23 }, { 'x': 27, 'y': 23 }],

      pregDashLine2: [{ 'x': 1, 'y': 5.5 },{ 'x': 2, 'y': 7 }, { 'x': 3, 'y': 7 }, { 'x': 5, 'y': 8.5 }, { 'x': 7, 'y': 10 }, { 'x': 9, 'y': 12 },
                      { 'x': 11, 'y': 13.5 }, { 'x': 13, 'y': 15 }, { 'x': 15, 'y': 16.5 }, { 'x': 17, 'y': 18.5 }, { 'x': 19, 'y': 19 },
                      { 'x': 21, 'y': 20.5 }, { 'x': 23, 'y': 21 }, { 'x': 25, 'y': 22.5 }, { 'x': 26, 'y': 22 }, { 'x': 27, 'y': 22 }],
    };
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
  setVerRules(ctx, origin, Len, color, lineWidth, step, int) {
    // 创建水平坐标轴路径
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(origin[0] + Len, origin[1]);

    // 创建坐标轴的刻度线路径
    for(let i = origin[0] + step; i <= Len + origin[0]; i += step){
      ctx.moveTo(i, origin[1]);
      ctx.lineTo(i, origin[1] + int);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.beginPath();
  }

  //垂直坐标轴标尺 
  setHorRules = (ctx, origin, Len, color, lineWidth, step, int) => {
    // 创建水平坐标轴路径
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(origin[0], origin[1] - Len);

    // 创建坐标轴的刻度线路径
    for(let i = origin[1] - step; i >= origin[1] - Len; i -= step){
      ctx.moveTo(origin[0] - int, i);
      ctx.lineTo(origin[0], i);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.beginPath();
  }

  //绘制曲线
  drawScaleLine(ctx, oringin, steps, data, color, shape) {
    for (let i = 0; i < data.length; i++) {

      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.arc(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y, 1, 0, 2*Math.PI);
      ctx.strokeStyle = 'red';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.setLineDash(shape);
      if(i < data.length - 1) {
        ctx.moveTo(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y);
        ctx.lineTo(oringin[0] + steps[0] * data[i + 1].x, oringin[1] - steps[1] * data[i + 1].y);

        // ctx.quadraticCurveTo(((oringin[0] + steps[0] * data[i].x) + (oringin[0] + steps[0] * data[i + 1].x)) / 2, 
        //                     ((oringin[1] - steps[1] * data[i].y) + (oringin[1] - steps[1] * data[i + 1].y)) / 2, 
        //                     oringin[0] + steps[0] * data[i + 1].x, oringin[1] - steps[1] * data[i + 1].y);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

  drawPregCanvas() {
    const { pregDashLine1, pregDashLine2, pregSolidLine1, pregSolidLine2 } = this.state;

    
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

    this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregDashLine1, '#607b8b', [3]);
    this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregDashLine2, '#607b8b', [3]);
    this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregSolidLine1, '#607b8b', []);
    this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregSolidLine2, '#607b8b', []);
  }

  drawBmiCanvas() {
    const { bmiDashLine1, bmiDashLine2 } = this.state;

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

    this.drawScaleLine(context, [baseLeft, baseTop + 300],  [20, 15], bmiDashLine1, '#52aaff', [8]);
    this.drawScaleLine(context, [baseLeft, baseTop + 300],  [20, 15], bmiDashLine2, '#52aaff', [8]);
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
