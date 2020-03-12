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
      bmiDashPoints: [
        { 'x': 0, 'y': 0 }, { 'x': 12, 'y': 1.5 }, { 'x': 39, 'y': 11.5 },
        { 'x': 39, 'y': 16 }, { 'x': 12, 'y': 3 }, { 'x': 0, 'y': 0 }
      ],

      // pregSolidLine1: [{ 'week': 1, 'gonggao': 0 }, { 'week': 3, 'gonggao': 1 }, { 'week': 5, 'gonggao': 3 }, { 'week': 7, 'gonggao': 4.5 }, { 'week': 9, 'gonggao': 6 },
      //                 { 'week': 11, 'gonggao': 7 }, { 'week': 13, 'gonggao': 8.5 }, { 'week': 15, 'gonggao': 10.5 }, { 'week': 17, 'gonggao': 12.5 }, { 'week': 19, 'gonggao': 13.5 },
      //                 { 'week': 21, 'gonggao': 15 }, { 'week': 23, 'gonggao': 16 }, { 'week': 25, 'gonggao': 17.5 }, { 'week': 27, 'gonggao': 17 }],

      // pregDashLine1: [{ 'week': 1, 'gonggao': 1.5 }, { 'week': 3, 'gonggao': 2.5 }, { 'week': 5, 'gonggao': 4.5 }, { 'week': 7, 'gonggao': 6 }, { 'week': 9, 'gonggao': 7.5 },
      //                 { 'week': 11, 'gonggao': 8.5 }, { 'week': 13, 'gonggao': 10 }, { 'week': 15, 'gonggao': 12.5 }, { 'week': 17, 'gonggao': 14.5 }, { 'week': 19, 'gonggao': 14.5 },
      //                 { 'week': 21, 'gonggao': 16 }, { 'week': 23, 'gonggao': 17.5 }, { 'week': 25, 'gonggao': 18.5 }, { 'week': 26, 'gonggao': 18 }, { 'week': 27, 'gonggao': 17.5 }],

      // pregSolidLine2: [{ 'week': 1, 'gonggao': 7 },{ 'week': 2, 'gonggao': 8 }, { 'week': 3, 'gonggao': 8 }, { 'week': 5, 'gonggao': 10 }, { 'week': 7, 'gonggao': 11.5 }, { 'week': 9, 'gonggao': 13.5 },
      //                 { 'week': 11, 'gonggao': 15 }, { 'week': 13, 'gonggao': 16.5 }, { 'week': 15, 'gonggao': 18 }, { 'week': 17, 'gonggao': 19.5 }, { 'week': 19, 'gonggao': 20.5 },
      //                 { 'week': 21, 'gonggao': 21.5 }, { 'week': 23, 'gonggao': 22.5 }, { 'week': 25, 'gonggao': 23.5 }, { 'week': 26, 'gonggao': 23 }, { 'week': 27, 'gonggao': 23 }],

      // pregDashLine2: [{ 'week': 1, 'gonggao': 5.5 },{ 'week': 2, 'gonggao': 7 }, { 'week': 3, 'gonggao': 7 }, { 'week': 5, 'gonggao': 8.5 }, { 'week': 7, 'gonggao': 10 }, { 'week': 9, 'gonggao': 12 },
      //                 { 'week': 11, 'gonggao': 13.5 }, { 'week': 13, 'gonggao': 15 }, { 'week': 15, 'gonggao': 16.5 }, { 'week': 17, 'gonggao': 18.5 }, { 'week': 19, 'gonggao': 19 },
      //                 { 'week': 21, 'gonggao': 20.5 }, { 'week': 23, 'gonggao': 21 }, { 'week': 25, 'gonggao': 22.5 }, { 'week': 26, 'gonggao': 22 }, { 'week': 27, 'gonggao': 22 }],

      topAcLine: [{ 'x': 5.5, 'y': 10.5 }, { 'x': 10, 'y': 15.8 }, { 'x': 15, 'y': 22 },
                  { 'x': 20, 'y': 27.7 }, { 'x': 25, 'y': 32.8 }, { 'x': 30, 'y': 37 }],
      middleAcLine: [{ 'x': 5.5, 'y': 9.3 }, { 'x': 10, 'y': 14.4 }, { 'x': 15, 'y': 20 },
                     { 'x': 20, 'y': 25.2 }, { 'x': 25, 'y': 30 }, { 'x': 30, 'y': 34 }],
      bottomAcLine: [{ 'x': 5.5, 'y': 8 }, { 'x': 10, 'y': 12.8 }, { 'x': 15, 'y': 18 },
                     { 'x': 20, 'y': 22.8 }, { 'x': 25, 'y': 27.2 }, { 'x': 30, 'y': 31}],
      acPoints: [
        { 'x': 5.5, 'y': 10.5 },
        { 'x': 10, 'y': 15.8 },
        { 'x': 15, 'y': 22 },
        { 'x': 20, 'y': 27.7 },
        { 'x': 25, 'y': 32.8 },
        { 'x': 30, 'y': 37 },
        { 'x': 30, 'y': 31 },
        { 'x': 25, 'y': 27.2 },
        { 'x': 20, 'y': 22.8 },
        { 'x': 15, 'y': 18 },
        { 'x': 10, 'y': 12.8 },
        { 'x': 5.5, 'y': 8 },
        { 'x': 5.5, 'y': 10.5 },
      ],

      topFlLine: [{ 'x': 2, 'y': 9 }, { 'x': 5.5, 'y': 20.7 }, { 'x': 10, 'y': 34 },
                  { 'x': 15, 'y': 47.5 }, { 'x': 20, 'y': 58.5 }, { 'x': 25, 'y': 68.8 }, { 'x': 30, 'y': 77 }],
      middleFlLine: [{ 'x': 2, 'y': 6 }, { 'x': 5.5, 'y': 17.4 }, { 'x': 10, 'y': 30.7 },
                     { 'x': 15, 'y': 43 }, { 'x': 20, 'y': 54 }, { 'x': 25, 'y': 63.5 }, { 'x': 30, 'y': 72 }],
      bottomFlLine: [{ 'x': 2, 'y': 2.5 }, { 'x': 5.5, 'y': 13.3 }, { 'x': 10, 'y': 26.4 },
                     { 'x': 15, 'y': 38.6 }, { 'x': 20, 'y': 49.5 }, { 'x': 25, 'y': 59.2 }, { 'x': 30, 'y': 67 }],
      flPoints: [
        { 'x': 2, 'y': 9 },
        { 'x': 5.5, 'y': 20.7 },
        { 'x': 10, 'y': 34 },
        { 'x': 15, 'y': 47.5 },
        { 'x': 20, 'y': 58.5 },
        { 'x': 25, 'y': 68.8 },
        { 'x': 30, 'y': 77 },
        { 'x': 30, 'y': 67 },
        { 'x': 25, 'y': 59.2 },
        { 'x': 20, 'y': 49.5 },
        { 'x': 15, 'y': 38.6 },
        { 'x': 10, 'y': 26.4 },
        { 'x': 5.5, 'y': 13.3 },
        { 'x': 2, 'y': 2.5 },
        { 'x': 2, 'y': 9 },
      ], 

      topBpdLine: [{ 'x': 2, 'y': 25 }, { 'x': 5.5, 'y': 38 }, { 'x': 10, 'y': 53.5 }, { 'x': 15, 'y': 69.2 },
                   { 'x': 20, 'y': 82.5 }, { 'x': 25, 'y': 93.4 }, { 'x': 27.5, 'y': 97.6 }, { 'x': 30, 'y': 100.8 }],
      middleBpdLine: [{ 'x': 2, 'y': 20.5 }, { 'x': 5.5, 'y': 32.7 }, { 'x': 10, 'y': 47.5 }, { 'x': 15, 'y': 63 },
                      { 'x': 20, 'y': 76.7 }, { 'x': 25, 'y': 87.5 }, { 'x': 27.5, 'y': 91.7 }, { 'x': 30, 'y': 94 }],
      bottomBpdLine: [{ 'x': 2, 'y': 14.8 }, { 'x': 5.5, 'y': 26.7 }, { 'x': 10, 'y': 41.5 }, { 'x': 15, 'y': 56.5 },
                      { 'x': 20, 'y': 70 }, { 'x': 25, 'y': 80.8 }, { 'x': 27.5, 'y': 84.7 }, { 'x': 30, 'y': 87 }],
      bdpPoints: [
        { 'x': 2, 'y': 25 },
        { 'x': 5.5, 'y': 38 },
        { 'x': 10, 'y': 53.5 },
        { 'x': 15, 'y': 69.2 },
        { 'x': 20, 'y': 82.5 },
        { 'x': 25, 'y': 93.4 },
        { 'x': 27.5, 'y': 97.6 },
        { 'x': 30, 'y': 100.8 },
        { 'x': 30, 'y': 87 },
        { 'x': 27.5, 'y': 84.7 },
        { 'x': 25, 'y': 80.8 },
        { 'x': 20, 'y': 70 },
        { 'x': 15, 'y': 56.5 },
        { 'x': 10, 'y': 41.5 },
        { 'x': 5.5, 'y': 26.7 },
        { 'x': 2, 'y': 14.8 },
        { 'x': 2, 'y': 25 }
      ],

      bmiNum: '',
      bmiTz: '',
      bmiIntro: '',
      bmiList: [],
      pregList: [],
      fetusList: [],
    };
  }

  componentDidMount() {
    service.yunqi.getPacsGrowth().then(res => {
      // demodata = res.object;
      // drawgrid('canvas');
      // printline();
      this.setState({
        fetusList: res.object
      }, () => {
        this.drawFetusCanvas()
      })
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
      }, () => { 
        this.drawBmiCanvas() 
      })
    })

    // this.drawPregCanvas();
    this.drawBmiCanvas();
    this.drawFetusCanvas();
  }

  // 判断某个点是否在多边形内部
  judgeAreas(dot, coordinates) {
    var x = dot.x,y=dot.y;
    var crossNum = 0;
    for(var i=0;i<coordinates.length-1;i++){
      var start = coordinates[i];
      var end = coordinates[i+1];
      // 起点、终点斜率不存在的情况
      if(start.x===end.x) {
          // 因为射线向右水平，此处说明不相交
          if(x>start.x) continue;
          if((end.y>start.y&&y>=start.y && y<=end.y) || (end.y<start.y&&y>=end.y && y<=start.y)){
            crossNum++;
          }
          continue;
      }
      // 斜率存在的情况，计算斜率
      var k=(end.y-start.y)/(end.x-start.x);
      // 交点的x坐标
      var x0 = (y-start.y)/k+start.x;
      // 因为射线向右水平，此处说明不相交
      if(x>x0) continue;
      if((end.x>start.x&&x0>=start.x && x0<=end.x) || (end.x<start.x&&x0>=end.x && x0<=start.x)){
          crossNum++;
      }
    }
    return crossNum%2===1;
  };

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
  drawScaleLine(ctx, oringin, steps, data, point, color, shape, lineWidth) {
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
    const { bmiDashLine1, bmiDashLine2, bmiDashPoints, bmiNum, bmiTz, bmiList, bmiIntro } = this.state;
    let newBmiList = JSON.parse(JSON.stringify(bmiList));
    newBmiList && newBmiList.map((item, index) => {
      item.tizhong = item.tizhong - bmiTz;
      if(item.week.indexOf('+') !== -1) {
        let arr = item.week.split('+');
        item.week = parseInt(arr[0]) + parseInt(arr[1]) / 7;
      }
      item.week = item.week - 1;
    })
    console.log(newBmiList, 'bmi1')
    newBmiList = newBmiList.filter(i => i.week >= 0 && i.week <= 39 && i.tizhong >= -6 && i.tizhong <= 20);
    // 统一曲线 x,y 表示
    newBmiList.length > 0 && newBmiList.map(item => {
      item.x = item.week;
      item.y = item.tizhong;
    })
    const bmiColor = newBmiList.length > 0 && this.judgeAreas(newBmiList[newBmiList.length-1], bmiDashPoints) ? '#6BB6FF' : 'red';

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
      context.strokeStyle = 'gray'; 
      for (var i = 0; i < xCount; i++) {
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
          context.textAlign = 'center';
          context.fillStyle = '#003366';
          context.font = 'bold 12px consolas';
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

    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine1, [true, '#787878'], 'gray', [8], 2);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], bmiDashLine2, [true, '#787878'], 'gray', [8], 2);
    console.log(newBmiList, 'bmi2')
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 4) * xStep],  [yStep, xStep / 2], newBmiList, [true, 'red'], bmiColor, [0], 2);
  }

  drawFetusCanvas() {
    const { topAcLine, middleAcLine, bottomAcLine, topFlLine, middleFlLine, bottomFlLine, topBpdLine, middleBpdLine, bottomBpdLine, 
            fetusList, acPoints, flPoints, bdpPoints } = this.state;
    let bpdArr = [], flArr = [], acArr = [];
    if(!!fetusList) {
      for (var i = 0; i < fetusList.length; i++) {
        var bpdObj = {};
        var flObj = {};
        var acObj = {};
        bpdObj.x = parseInt(fetusList[i].yunzh) - 10;
        bpdObj.y = parseInt(fetusList[i].bpd);
        bpdArr.push(bpdObj);
    
        flObj.x = parseInt(fetusList[i].yunzh) - 10;
        flObj.y = parseInt(fetusList[i].fl);
        flArr.push(flObj);
    
        acObj.x = parseInt(fetusList[i].yunzh) - 10;
        acObj.y = parseInt(fetusList[i].ac);
        acArr.push(acObj);
      }
    }
  
    const canvas = document.getElementById('fetusCanvas');
    const context = canvas.getContext("2d");
    canvas.width = 550;
    canvas.height = 600;
    const baseLeft = 60;
    const baseTop = 30;
    const xStep = 10;
    const yStep = 15;
    const xCount = 56;
    const yCount = 31;

    context.font = 'bold 16px KaiTi';
    context.textAlign='center';
    context.fillText('胎儿生长曲线', canvas.width / 2, 20);

    context.fillStyle = '#000';

    //x轴线
    const setVertical = () => {
      context.strokeStyle = 'gray';
      for (var i = 0; i < xCount; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(baseLeft, baseTop + xStep * i);
        context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
        
        context.textBaseline='middle';
        context.fillStyle = '#003366';
        context.font = 'bold 12px consolas';
        if (i * 2 % 10 === 0) { 
          context.lineWidth = 1;
          context.strokeStyle = 'gray';
          context.fillText(i * 2, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
        }
        context.stroke();
      }
      // context.fillText('体重增长(kg)', baseLeft - 20, 30);
    }

    //y轴线
    const setHorizontal = () => {
      for (var i = 0; i < yCount; i++) {
        context.beginPath();
        context.lineWidth = 0.5;
        context.moveTo(yStep * i + baseLeft, baseTop);
        context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));

        context.textAlign = 'center';
        context.fillStyle = '#003366';
        context.font = 'bold 12px consolas';
        if(i % 5 === 0) {
          context.lineWidth = 1;
          context.strokeStyle = 'black';
          context.fillText(i + 10, baseLeft + i * yStep, xStep * xCount + baseTop + 5);
        }
        context.stroke();
      }
      // context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
    }
    setVertical();
    setHorizontal();
    this.setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, 'black', 1, yStep, 5);
    this.setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, 'black', 1, xStep, 5);

    //手动绘制标尺最右端点
    //BPD
    context.fillText('+2SD', baseLeft + yCount * yStep, baseTop + 4.2 * xStep);
    context.fillText('Mean', baseLeft + yCount * yStep, baseTop + 8 * xStep);
    context.fillText('-2SD', baseLeft + yCount * yStep, baseTop + 11.5 * xStep);
    //FL
    context.fillText('+2SD', baseLeft + yCount * yStep, baseTop + 16.5 * xStep);
    context.fillText('Mean', baseLeft + yCount * yStep, baseTop + 19 * xStep);
    context.fillText('-2SD', baseLeft + yCount * yStep, baseTop + 21.5 * xStep);
    //AC
    context.fillText(37, baseLeft + yCount * yStep, baseTop + 36.5 * xStep);
    context.fillText(34, baseLeft + yCount * yStep, baseTop + 38 * xStep);
    context.fillText(31, baseLeft + yCount * yStep, baseTop + 39.5 * xStep);

    context.font = 'bold 18px consolas';
    context.textAlign = 'center';
    context.fillText('BPD', baseLeft + (yCount - 6) * yStep, baseTop + 6 * xStep);
    context.fillText('FL', baseLeft + (yCount - 6) * yStep, baseTop + 28 * xStep);
    context.fillText('AC', baseLeft + (yCount - 6) * yStep, baseTop + 44* xStep);

    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topAcLine, [false], 'gray', [0], 1);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleAcLine, [false], '#787878', [0], 2);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomAcLine, [false], 'gray', [0], 1);

    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topFlLine, [false], 'gray', [0], 1);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleFlLine, [false], '#787878', [0], 2);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomFlLine, [false], 'gray', [0], 1);

    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topBpdLine, [false], 'gray', [0], 1);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleBpdLine, [false], '#787878', [0], 2);
    this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomBpdLine, [false], 'gray', [0], 1);

    console.log(bpdArr, flArr, acArr, '生长曲线')
    if (bpdArr.length > 0) {
      let bpdColor = this.judgeAreas(bpdArr[bpdArr.length - 1], bdpPoints) ? '#6BB6FF' : 'red';
      this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bpdArr, [true, 'red'], bpdColor, [0], 4);
    }

    if (flArr.length > 0) {
      let flColor = this.judgeAreas(flArr[flArr.length - 1], flPoints) ? '#6BB6FF' : 'red';
      this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], flArr, [true, 'red'], flColor, [0], 4);
    }

    if (acArr.length > 0) {
      let acColor = this.judgeAreas(acArr[acArr.length - 1], acPoints) ? '#6BB6FF' : 'red';
      this.drawScaleLine(context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], acArr, [true, 'red'], acColor, [0], 4);
    }
  }

  render() {
    return (
      <Page className="yunqi font-16 ant-col">
        {/* <canvas id="canvas" className='canvas'>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas> */}
        <canvas id="fetusCanvas" className='fetusCanvas'>
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
