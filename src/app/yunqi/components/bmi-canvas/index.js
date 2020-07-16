import React, { Component } from "react";
import { Button } from "antd";
import { judgeAreas, setHorRules, setVerRules, printCanvas } from "../common";
import service from "../../../../service";
import "./index.less";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bmiDashLine1: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 11.5 }],
      bmiDashLine2: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 3 }, { 'x': 39, 'y': 16 }],
      bmiDashPoints: [
        { 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 11.5 },
        { 'x': 39, 'y': 16 }, { 'x': 12, 'y': 3 }, { 'x': 0, 'y': 0 }
      ],

      bmiNum: '',
      bmiTz: '',
      bmiIntro: '',
      bmiList: [],
    };
  }

  async componentDidMount() {
    this.drawBmiCanvas();
    const res = await service.yunqi.getbmi();
    if (res.object.bmi < 18.5) {
      this.setState({
        bmiIntro: '体重过轻,建议孕期体重增长目标:12.5-18kg',
        bmiDashLine1: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 12.5 }],
        bmiDashLine2: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 3 }, { 'x': 39, 'y': 18 }],
        bmiDashPoints: [
          { 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 12.5 },
          { 'x': 39, 'y': 18 }, { 'x': 12, 'y': 3 }, { 'x': 0, 'y': 0 }
        ],
      })
    } else if (res.object.bmi < 25) {
      this.setState({
        bmiIntro: '体重正常，建议增长体重增长目标11.5-16kg'
      })
    } else if (res.object.bmi < 30) {
      this.setState({
        bmiIntro: '体重超重，建议增长体重增长目标7-11.5kg',
        bmiDashLine1: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 7 }],
        bmiDashLine2: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 3 }, { 'x': 39, 'y': 11.5 }],
        bmiDashPoints: [
          { 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 7 },
          { 'x': 39, 'y': 11.5 }, { 'x': 12, 'y': 3 }, { 'x': 0, 'y': 0 }
        ],
      })
    } else if (res.object.bmi >= 30) {
      this.setState({
        bmiIntro: '体重肥胖，建议增长体重增长目标5-9kg',
        bmiDashLine1: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 5 }],
        bmiDashLine2: [{ 'x': 0, 'y': 0 }, { 'x': 12, 'y': 3 }, { 'x': 39, 'y': 9 }],
        bmiDashPoints: [
          { 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 5 },
          { 'x': 39, 'y': 9 }, { 'x': 12, 'y': 3 }, { 'x': 0, 'y': 0 }
        ],
      })
    }

    this.setState({
      bmiNum: res.object.bmi,
      bmiTz: res.object.cktizh,
      bmiList: res.object.list
    }, () => { 
      this.drawBmiCanvas() 
    })
  }

  //绘制曲线
  drawScaleLine(canvas, ctx, oringin, steps, data, point, color, shape, lineWidth) {
    for (let i = 0; i < data.length; i++) {
      //绘制曲线
      ctx.beginPath();
      ctx.setLineDash(shape);
      ctx.lineWidth = lineWidth;
      if(i < data.length - 1) {
        ctx.moveTo(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y);
        ctx.lineTo(oringin[0] + steps[0] * data[i + 1].x, oringin[1] - steps[1] * data[i + 1].y);
      }
      ctx.strokeStyle = color;
      ctx.stroke();
      //绘制红点
      if(point[0]) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y, 3, 0, 2*Math.PI);
        ctx.fillStyle = point[1];
        ctx.fill();
      }
    }
  }

  drawBmiCanvas() {
    const { bmiDashLine1, bmiDashLine2, bmiDashPoints, bmiNum, bmiTz, bmiList, bmiIntro } = this.state;
    let newBmiList = JSON.parse(JSON.stringify(bmiList));
    newBmiList && newBmiList.map((item, index) => {
      item.tizhong = item.tizhong - bmiTz;
      if(item.week.indexOf('+') !== -1) {
        const arr = item.week.split('+');
        item.week = Number(arr[0]) + Number(arr[1]) / 7;
      }
      item.week = item.week - 1;
    })
    // console.log(newBmiList, 'bmi1')
    newBmiList = newBmiList.filter(i => i.week >= 0 && i.week <= 39 && i.tizhong >= -6 && i.tizhong <= 20);
    // 统一曲线 x,y 表示
    newBmiList.length > 0 && newBmiList.map(item => {
      item.x = item.week;
      item.y = item.tizhong;
    })
    const bmiColor = newBmiList.length > 0 && judgeAreas(newBmiList[newBmiList.length-1], bmiDashPoints) ? '#6BB6FF' : 'red';

    const canvas = document.getElementById('bmiCanvas');
    const context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;
    context.fillStyle = "#EAEAFD";
    context.fillRect(0, 0, 800, 800)

    const baseLeft = 130;
    const baseTop = 230;
    const xStep = 30;
    const yStep = 15;
    const xCount = 14;
    const yCount = 40;

    context.fillStyle = "#000";
    context.font = 'bold 16px KaiTi';
    context.textAlign='center';
    context.fillText('BMI孕期体重管理曲线', canvas.width / 2, baseTop - 60);
    
    context.fillStyle = '#52aaff';
    context.font = 'normal 12px KaiTi';
    context.fillText(`孕前BMI: ${bmiNum} kg/m2`, canvas.width / 2, baseTop - 40);
    context.fillText(bmiIntro, canvas.width / 2, baseTop - 20);

    context.fillStyle = '#000';
    //x轴线
    const setVertical = () => {
      context.strokeStyle = 'gray'; 
      for (let i = 0; i < xCount; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(baseLeft, baseTop + xStep * i);
        context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
       
        context.textBaseline='middle';
        context.fillStyle = '#003366';
        context.font = 'bold 12px consolas';
        context.fillText(i * 2 + (-6), baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
        context.stroke();
      }
      context.font = 'bold 12px KaiTi';
      context.fillText('体重增长(kg)', baseLeft - 20, baseTop - 20);
    }

    //y轴线
    const setHorizontal = () => {
      let count = 0;
      for (let i = 0; i < yCount; i++) {
        count++;
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(yStep * i + baseLeft, baseTop);
        context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
        if(count === 1 || count === 4) {
          count = count === 4 ? 1 : count;
          context.textAlign = 'center';
          context.fillStyle = '#003366';
          context.font = 'bold 12px consolas';
          context.fillText(i + 1, baseLeft + i * yStep, xStep * xCount + baseTop - 15);
        }
        context.stroke();
      }
      context.font = 'bold 12px KaiTi';
      context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
    }

    setVertical();
    setHorizontal();
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, 'black', 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, 'black', 1, xStep, 5);

    this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine1, [true, '#787878'], 'gray', [8], 2);
    this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine2, [true, '#787878'], 'gray', [8], 2);
    // console.log(newBmiList, 'bmi2')
    this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], newBmiList, [true, 'red'], bmiColor, [0], 2);
  }

  render() {
    return (
      <div className="bmi-wrapper">
        <Button icon="print-white" type="ghost" className="btn-tz" onClick={() => printCanvas('bmiCanvas')}>打印体重曲线</Button>
        <canvas id="bmiCanvas" className='bmiCanvas'>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div>
    )
  }
}
