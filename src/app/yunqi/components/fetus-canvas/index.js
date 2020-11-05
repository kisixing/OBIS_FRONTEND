import React, { Component } from "react";
import { Button, Modal } from "antd";
import { judgeAreas, setHorRules, setVerRules, printCanvas } from "../common";
import { futureDate, getWeek, countWeek } from '../../../fuzhen/util';
import service from "../../../../service";
import tableRender from "../../../../render/table";
import * as baseData from "./data";
import "./index.less";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      colorList: ['#6BB6FF', '#000', '#238E68', '#DBDB70', '#D9D9F3', '#D9D9F3'],
      fetusList: {},
      isShowTableModal: false,
      allFetusData: [],
      isShowPointModal: false,
      pointData: null,
    };
  }

  componentDidMount() {
    this.drawFetusCanvas();
    this.getFetuData();
  }

  getFetuData = async () => {
    const res = await service.yunqi.getCurve();
    this.setState({
      fetusList: res.object.curveGroup
    }, () => {
      this.drawFetusCanvas()
    })
  }

  //绘制曲线
  drawScaleLine = (canvas, ctx, oringin, steps, data, point, color, shape, lineWidth) => {
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
        const that = this;
        canvas && canvas.addEventListener('click', function(e) {
          const X = oringin[0] + steps[0] * data[i].x;
          const Y = oringin[1] - steps[1] * data[i].y;
          const obj = {x: X, y: Y, r: 5};

          let x = e.pageX - canvas.getBoundingClientRect().left;
          let y = e.pageY - canvas.getBoundingClientRect().top;
          if (x > (obj.x - obj.r) && x < (obj.x + obj.r) && y > (obj.y - obj.r) && y < (obj.y + obj.r)) {
            const obj = {
              "x": data[i].gesweek,
              "y": data[i].y,
              "line": point[2],
              "fetus": data[i].sort,
              "style": {
                "position": "fixed",
                "top": e.pageY,
                "left": e.pageX,
              }
            };
            that.setState({
              pointData: obj,
              isShowPointModal: true
            })
          }
        }, false)
      }
    }
  }

  drawFetusCanvas = () => {
    const { topAcLine, middleAcLine, bottomAcLine, topFlLine, middleFlLine, bottomFlLine, topBpdLine, middleBpdLine, bottomBpdLine, 
            fetusList, acPoints, flPoints, bdpPoints, colorList } = this.state;
    let allList = [], allBpdArr = [], allFlArr = [], allAcArr = [];
    if(fetusList) {
      for(let key in fetusList) {
        const item = fetusList[key];
        let bpdArr = [], flArr= [], acArr = [];
        if (item) {
          for (let i = 0; i < item.length; i++) {
            allList.push(item[i]);
            let bpdObj = {};
            let flObj = {};
            let acObj = {};
            let yunWeek = item[i].gesweek;
            if(yunWeek.indexOf('+') !== -1) {
              const arr = yunWeek.split('+');
              yunWeek = Number(arr[0]) + Number(arr[1]) / 7;
            }

            const setData = (obj, param, arr) => {
              obj.x = yunWeek - 10;
              obj.y = Number(item[i][param]);
              obj.gesweek = item[i].gesweek;
              obj.sort = key;
              if(yunWeek && item[i][param] && yunWeek >= 10 && yunWeek <= 40 && item[i][param] <= 110) {
                arr.push(obj);
              }
            }

            setData(bpdObj, 'bpd', bpdArr);
            setData(flObj, 'fl', flArr);
            setData(acObj, 'ac', acArr);
          }
        }
        allBpdArr.push(bpdArr);
        allFlArr.push(flArr);
        allAcArr.push(acArr);
      }
      this.setState({ allFetusData: allList });
    }
  
    const canvas = document.getElementById('fetusCanvas');
    const context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, 800, 800)

    const baseLeft = 170;
    const baseTop = 140;
    const xStep = 10;
    const yStep = 15;
    const xCount = 56;
    const yCount = 31;

    context.fillStyle = "#000";
    context.font = 'bold 16px KaiTi';
    context.textAlign='center';
    context.fillText('胎儿生长曲线', canvas.width / 2, baseTop - 10);

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
        if (i * 2 % 10 === 0) { 
          context.lineWidth = 1;
          context.strokeStyle = 'gray';
          context.fillText(i * 2, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
        }
        context.stroke();
      }
    }

    //y轴线
    const setHorizontal = () => {
      for (let i = 0; i < yCount; i++) {
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
    }
    setVertical();
    setHorizontal();
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, 'black', 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, 'black', 1, xStep, 5);

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

    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topAcLine, [false], 'gray', [0], 1);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleAcLine, [false], '#787878', [0], 2);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomAcLine, [false], 'gray', [0], 1);

    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topFlLine, [false], 'gray', [0], 1);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleFlLine, [false], '#787878', [0], 2);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomFlLine, [false], 'gray', [0], 1);

    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], topBpdLine, [false], 'gray', [0], 1);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], middleBpdLine, [false], '#787878', [0], 2);
    this.drawScaleLine(null, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bottomBpdLine, [false], 'gray', [0], 1);

    console.log(allBpdArr, allFlArr, allAcArr, '生长曲线')

    allBpdArr.forEach((bpdArr, index) => {
      if (bpdArr.length > 0) {
        let bpdColor = judgeAreas(bpdArr[bpdArr.length - 1], bdpPoints) ? colorList[index] : 'red';
        this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], bpdArr, [true, 'red', 'BPD'], bpdColor, [0], 4);
      }
    })

    allFlArr.forEach((flArr, index) => {
      if (flArr.length > 0) {
        let flColor = judgeAreas(flArr[flArr.length - 1], flPoints) ? colorList[index] : 'red';
        this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], flArr, [true, 'red', 'FL'], flColor, [0], 4);
      }
    })

    allAcArr.forEach((acArr, index) => {
      if (acArr.length > 0) {
        let acColor = judgeAreas(acArr[acArr.length - 1], acPoints) ? colorList[index] : 'red';
        this.drawScaleLine(canvas, context, [baseLeft, baseTop + (xCount - 1) * xStep],  [yStep, xStep / 2], acArr, [true, 'red', 'AC'], acColor, [0], 4);
      } 
    })

  }

  pointModal() {
    const { isShowPointModal, pointData } = this.state;

    const handleCancel = () => {
      this.setState({ isShowPointModal: false })
    }

    return (
      isShowPointModal
      ? <Modal style={pointData.style} className="point-modal" visible={isShowPointModal} footer={null} onCancel={handleCancel}>
          <sapn className="info-item">孕周：{pointData.x}</sapn>
          <sapn className="info-item">{pointData.line}：{pointData.y}</sapn>
          <sapn>胎儿信息：胎儿{pointData.fetus}</sapn>
        </Modal>
      : null
    )
  }

  tableModal() {
    const { isShowTableModal, allFetusData } = this.state;
    const { userDoc } = this.props;

    const handleCancel = () => {
      this.setState({ isShowTableModal: false })
    }

    const handleOk = () => {
      this.setState({ isShowTableModal: false })
    }

    const handleTableChange = async (type, item, row, key) => {
      if (key === "date" && !!item.date && userDoc.gesexpectrv) {
        item.gesweek = getWeek(40, countWeek(userDoc.gesexpectrv, item.date));
      } else if (key === "fetusNo" && item.fetusNo.length > 1) {
        item.fetusNo = item.fetusNo.substr(1);
      }
      await service.yunqi.saveCurve(item);
      this.getFetuData();
    }

    const handleAdd = async () => {
      const data = {	
        "id":"",
        "date": futureDate(0),
        "gesweek":"",
        "bpd":"",
        "fl":"",
        "ac":"",
        "fetusNo":"1",
        "docUniqueid":""
      };
      await service.yunqi.saveCurve(data);
      this.getFetuData();
    }

    const handleDelete = async (select) => {
      await service.yunqi.removeCurve(select);
      this.getFetuData();
    }

    const initTable = (data) =>
      tableRender(baseData.fetusKey(), data, {
        pagination: false,
        buttons: [{ title: "添加", fn: handleAdd }, { title: "删除", fn: handleDelete }],
        editable: true,
        onRowChange: handleTableChange,
      });

    return (
      <Modal title="胎儿生长曲线绘制编辑" footer={null} className="table-modal" visible={isShowTableModal} onCancel={handleCancel} onOk={handleOk}>
        {initTable(allFetusData)}
      </Modal>
    )
  }

  render() {
    return (
      <div className="fetus-wrapper">
        <div className="btn-wrapper">
          <Button icon="print-white" type="ghost" className="print-btn btn-sz" onClick={() => printCanvas('fetusCanvas')}>打印生长曲线</Button>
          <Button icon="edit" type="ghost" className="print-btn btn-bj" onClick={() => this.setState({ isShowTableModal: true })}>编辑</Button>
        </div>
        <canvas id="fetusCanvas" className='fetusCanvas'>
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
        {this.pointModal()}
        {this.tableModal()}
      </div>
    );
  }
}
