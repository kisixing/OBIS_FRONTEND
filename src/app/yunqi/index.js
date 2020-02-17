import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from "../../render/page";
import "./index.less";
import service from "../../service";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bmiDashLine1: [{ 'week': 0, 'tizhong': 0 }, { 'week': 12, 'tizhong': 1.5 }, { 'week': 39, 'tizhong': 11.5 }],
      bmiDashLine2: [{ 'week': 0, 'tizhong': 0 }, { 'week': 12, 'tizhong': 3 }, { 'week': 39, 'tizhong': 16 }],

      pregSolidLine1: [{ 'week': 1, 'gonggao': 0 }, { 'week': 3, 'gonggao': 1 }, { 'week': 5, 'gonggao': 3 }, { 'week': 7, 'gonggao': 4.5 }, { 'week': 9, 'gonggao': 6 },
                      { 'week': 11, 'gonggao': 7 }, { 'week': 13, 'gonggao': 8.5 }, { 'week': 15, 'gonggao': 10.5 }, { 'week': 17, 'gonggao': 12.5 }, { 'week': 19, 'gonggao': 13.5 },
                      { 'week': 21, 'gonggao': 15 }, { 'week': 23, 'gonggao': 16 }, { 'week': 25, 'gonggao': 17.5 }, { 'week': 27, 'gonggao': 17 }],

      pregDashLine1: [{ 'week': 1, 'gonggao': 1.5 }, { 'week': 3, 'gonggao': 2.5 }, { 'week': 5, 'gonggao': 4.5 }, { 'week': 7, 'gonggao': 6 }, { 'week': 9, 'gonggao': 7.5 },
                      { 'week': 11, 'gonggao': 8.5 }, { 'week': 13, 'gonggao': 10 }, { 'week': 15, 'gonggao': 12.5 }, { 'week': 17, 'gonggao': 14.5 }, { 'week': 19, 'gonggao': 14.5 },
                      { 'week': 21, 'gonggao': 16 }, { 'week': 23, 'gonggao': 17.5 }, { 'week': 25, 'gonggao': 18.5 }, { 'week': 26, 'gonggao': 18 }, { 'week': 27, 'gonggao': 17.5 }],

      pregSolidLine2: [{ 'week': 1, 'gonggao': 7 },{ 'week': 2, 'gonggao': 8 }, { 'week': 3, 'gonggao': 8 }, { 'week': 5, 'gonggao': 10 }, { 'week': 7, 'gonggao': 11.5 }, { 'week': 9, 'gonggao': 13.5 },
                      { 'week': 11, 'gonggao': 15 }, { 'week': 13, 'gonggao': 16.5 }, { 'week': 15, 'gonggao': 18 }, { 'week': 17, 'gonggao': 19.5 }, { 'week': 19, 'gonggao': 20.5 },
                      { 'week': 21, 'gonggao': 21.5 }, { 'week': 23, 'gonggao': 22.5 }, { 'week': 25, 'gonggao': 23.5 }, { 'week': 26, 'gonggao': 23 }, { 'week': 27, 'gonggao': 23 }],

      pregDashLine2: [{ 'week': 1, 'gonggao': 5.5 },{ 'week': 2, 'gonggao': 7 }, { 'week': 3, 'gonggao': 7 }, { 'week': 5, 'gonggao': 8.5 }, { 'week': 7, 'gonggao': 10 }, { 'week': 9, 'gonggao': 12 },
                      { 'week': 11, 'gonggao': 13.5 }, { 'week': 13, 'gonggao': 15 }, { 'week': 15, 'gonggao': 16.5 }, { 'week': 17, 'gonggao': 18.5 }, { 'week': 19, 'gonggao': 19 },
                      { 'week': 21, 'gonggao': 20.5 }, { 'week': 23, 'gonggao': 21 }, { 'week': 25, 'gonggao': 22.5 }, { 'week': 26, 'gonggao': 22 }, { 'week': 27, 'gonggao': 22 }],

      bmiNum: '',
      bmiTz: '',
      bmiIntro: '',
      bmiList: [],
      pregList: [],
    };
  }

  componentDidMount() {
    service.yunqi.getPacsGrowth().then(res => {
      demodata = res.object;
      drawgrid('canvas');
      printline();
    });

    // service.yunqi.getPreg().then(res => {
    //   this.setState({pregList: res.object}, () => {
    //     this.drawPregCanvas();
    //   })
    // })

    service.yunqi.getbmi().then(res => {
      if(res.object.bmi < 18.5){
        this.setState({bmiIntro: '体重过轻,建议孕期体重增长目标:12.5~18kg'})
      }else if(res.object.bmi < 25){
        this.setState({bmiIntro: '体重正常，建议增长体重增长目标11.5~16kg'})
      }else if(res.object.bmi < 30){
        this.setState({bmiIntro: '体重超重，建议增长体重增长目标7~11.5kg'})
      }else if(res.object.bmi >= 30){
        this.setState({bmiIntro: '体重肥胖，建议增长体重增长目标5~9kg'})
      }

      this.setState({
        bmiNum: res.object.bmi,
        bmiTz: res.object.cktizh,
        bmiList: res.object.list
      }, () => { this.drawBmiCanvas() })
    })

    // this.drawPregCanvas();
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
  drawScaleLine(ctx, oringin, steps, data, params, color, shape) {
    for (let i = 0; i < data.length; i++) {

      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.arc(oringin[0] + steps[0] * data[i][params[0]], oringin[1] - steps[1] * data[i][params[1]], 1, 0, 2*Math.PI);
      ctx.strokeStyle = 'red';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.setLineDash(shape);
      ctx.lineWidth = 2;
      if(i < data.length - 1) {
        ctx.moveTo(oringin[0] + steps[0] * data[i][params[0]], oringin[1] - steps[1] * data[i][params[1]]);
        ctx.lineTo(oringin[0] + steps[0] * data[i + 1][params[0]], oringin[1] - steps[1] * data[i + 1][params[1]]);

        // ctx.quadraticCurveTo(((oringin[0] + steps[0] * data[i][params[0]]) + (oringin[0] + steps[0] * data[i + 1][params[0]])) / 2, 
        //                     ((oringin[1] - steps[1] * data[i][params[1]]) + (oringin[1] - steps[1] * data[i + 1][params[1]])) / 2, 
        //                     oringin[0] + steps[0] * data[i + 1][params[0]], oringin[1] - steps[1] * data[i + 1][params[1]]);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

  // drawPregCanvas() {
  //   const { pregDashLine1, pregDashLine2, pregSolidLine1, pregSolidLine2, pregList } = this.state;

  //   const resetItem = (item) => {
  //     if(item.week.indexOf('+') !== -1) {
  //       let arr = item.week.split('+');
  //       item.week = parseInt(arr[0]) + parseInt(arr[1]) / 7;
  //     }
  //     item.week = item.week - 15;
  //     item.gonggao = item.gonggao - 12;
  //     return item;
  //   }

  //   let newPregData = pregList.filter(i => i.week >= 15 && i.week <= 42 && i.gonggao >= 12 && i.gonggao <= 41);
  //   newPregData && newPregData.map((item) => {
  //     item = resetItem(item);
  //   })
  
  //   const canvas = document.getElementById('pregCanvas');
  //   const context = canvas.getContext("2d");
  //   canvas.width = '700';
  //   canvas.height = '600';
  //   const baseLeft = 100;
  //   const baseTop = 70;

  //   context.font = 'bold 18px KaiTi';
  //   context.fillText('妊娠图', 350, 20);
  //   context.font = 'normal 12px KaiTi';

  //   //x轴线
  //   const setVertical = () => {
  //     context.strokeStyle = 'gray'; // 横轴线
  //     for (var i = 0; i < 30; i++) {
  //       context.beginPath();
  //       context.lineWidth = 0.5;
  //       context.moveTo(baseLeft, baseTop + 15 * i);
  //       context.lineTo(baseLeft + 540, baseTop + 15 * i);
  //       if(i%2 == 0) {
  //         context.textBaseline='middle';
  //         context.fillText(13 + i, 80, 520 - (i + 1) * 15);
  //       }
  //       context.stroke();
  //     }
  //     context.fillText('宫高(cm)', 80, 55);
  //   }

  //   //y轴线
  //   const setHorizontal = () => {
  //     for (var i = 0; i < 28; i++) {
  //       context.beginPath();
  //       context.lineWidth = 0.5;
  //       context.moveTo(20 * i + baseLeft, baseTop);
  //       context.lineTo(20 * i + baseLeft, baseTop + 450);
  //       if(i%2 == 0) {
  //         context.textAlign='center';
  //         context.fillText(16 + i, baseLeft + (i + 1) * 20, 535);
  //       }
  //       context.stroke();
  //     }
  //     context.fillText('孕周(周)', 670, 520);
  //   }

  //   setVertical();
  //   setHorizontal();
  //   this.setVerRules(context, [baseLeft, baseTop + 450], 540, 'black', 1, 20, 5);
  //   this.setHorRules(context, [baseLeft, baseTop + 450], 450, 'black', 1, 15, 5);

  //   this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregDashLine1, ["week", "gonggao"], '#607b8b', [3]);
  //   this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregDashLine2, ["week", "gonggao"], '#607b8b', [3]);
  //   this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregSolidLine1, ["week", "gonggao"], '#607b8b', []);
  //   this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], pregSolidLine2, ["week", "gonggao"], '#607b8b', []);

  //   this.drawScaleLine(context, [baseLeft, baseTop + 450],  [20, 15], newPregData, ["week", "gonggao"], 'pink', []);
  // }

  drawBmiCanvas() {
    const { bmiDashLine1, bmiDashLine2, bmiNum, bmiTz, bmiList, bmiIntro } = this.state;
    let newBmiList = JSON.parse(JSON.stringify(bmiList));
    newBmiList && newBmiList.map((item, index) => {
      item.tizhong = item.tizhong - bmiTz;
      if(item.week.indexOf('+') !== -1) {
        let arr = item.week.split('+');
        item.week = parseInt(arr[0]) + parseInt(arr[1]) / 7;
      }
      item.week = item.week - 1;
    })
    console.log(newBmiList, '31')
    let bmiColor = 'green';
    let lastBmi = newBmiList[newBmiList.length-1];
    if(lastBmi && (lastBmi.week < 0 || lastBmi.week >39 || lastBmi.tizhong < -6 || lastBmi.tizhong > 20)) {
      bmiColor = 'red';
    }
    newBmiList = newBmiList.filter(i => i.week >= 0 && i.week <= 39 && i.tizhong >= -6 && i.tizhong <= 20);

    const canvas = document.getElementById('bmiCanvas');
    const context = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 520;
    const baseLeft = 60;
    const baseTop = 80;
    const xStep = 30;
    const yStep = 15;
    const xCount = 14;
    const yCount = 40;

    context.font = 'bold 16px KaiTi';
    context.textAlign='center';
    context.fillText('BMI孕期体重管理曲线', canvas.width / 2, 20);
    
    context.fillStyle = '#52aaff';
    context.font = 'normal 12px KaiTi';
    context.fillText(`孕前BMI: ${bmiNum} kg/m2`, canvas.width / 2, 40);
    context.fillText(bmiIntro, canvas.width / 2, 55);

    context.fillStyle = '#000';
    //x轴线
    const setVertical = () => {
      context.strokeStyle = 'gray'; // 横轴线
      for (var i = 0; i < xCount; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(baseLeft, baseTop + xStep * i);
        context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
       
        context.textBaseline='middle';
        context.fillText(i * 2 + (-6), baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);

        context.stroke();
      }
      context.fillText('体重增长(kg)', baseLeft - 20, 55);
    }

    //y轴线
    const setHorizontal = () => {
      let count = 0;
      for (var i = 0; i < yCount; i++) {
        count++;
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(yStep * i + baseLeft, baseTop);
        context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
        if(count === 1 || count === 4) {
          count = count === 4 ? 1 : count;
          context.textAlign='center';
          context.fillText(i + 1, baseLeft + i * yStep, xStep * xCount + baseTop - 15);
        }
        context.stroke();
      }
      context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
    }

    setVertical();
    setHorizontal();
    this.setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, 'black', 1, yStep, 5);
    this.setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, 'black', 1, xStep, 5);

    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine1, ["week", "tizhong"], '#52aaff', [8]);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine2, ["week", "tizhong"], '#52aaff', [8]);
    console.log(newBmiList, '3122')
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], newBmiList, ["week", "tizhong"], bmiColor, [0]);
  }

  render() {
    return (
      <Page className="yunqi font-16 ant-col">
        <canvas id="canvas" className='canvas'>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
        {/* <canvas id="pregCanvas" style={{border: "1px solid gray"}}>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas> */}
        <canvas id="bmiCanvas" className='bmiCanvas'>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </Page>
    );
  }
}
