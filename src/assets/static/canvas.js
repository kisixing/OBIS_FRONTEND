/* eslint-disable linebreak-style */
var context = null;
var lastx = 0;
var lasty = 0;
var baseleft = 50;
var basetop = 5;
var demodata = [];
var textposition = 550;

//缩放
function scaleContext(context) {
  if (context != undefined) {
    context.scale(0.7, 0.7);
  }
}

//绘制网格
function drawgrid(id) {
  var canvas = document.getElementById(id);
  if (canvas == null)
    return false;
  canvas.width = 550;
  canvas.height = 600;
  scaleContext(canvas.getContext('2d'));
  sethorizontal(900);
  setvertical(900);
  setrules(30, 'right');
  setrrules(660, 'left');
  sethrules();
}
// 绘制坐标
function sethrules() {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext('2d');
  context.font = 'bold 15px consolas';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = 'rgba(0,51,102,1)'; // 轴数
  for (var i = 0; i < 31; i++) {
    if (i % 5 == 0)
      context.fillText(i + 10, baseleft + i * 20, basetop + 825 + 10);
  }
  context.stroke();
}
//x轴线
function setvertical(maxline) {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext('2d');
  context.strokeStyle = 'rgb(150,150,150)'; // 横轴线
  for (var i = 0; i < 56; i++) {
    context.beginPath();
    context.lineWidth = 0.8;
    if (i % 5 == 0) {
      context.lineWidth = 2;
    }
    context.moveTo(baseleft, basetop + 15 * i);
    context.lineTo(baseleft + 600, basetop + 15 * i);
    context.stroke();
  }
  context.stroke();
}
//y轴线
function sethorizontal(length) {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext('2d');
  for (var i = 0; i < 31; i++) {
    context.beginPath();
    context.lineWidth = 0.8;
    if (i % 5 == 0) {
      context.lineWidth = 2;
    }
    context.moveTo(20 * i + baseleft, basetop);
    context.lineTo(20 * i + baseleft, basetop + 825);
    context.stroke();
  }
}
//绘制左侧标尺 0-110
function setrules(x, align) {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext('2d');
  context.font = 'bold 15px consolas';
  context.textAlign = align;
  context.textBaseline = 'top';
  context.fillStyle = 'rgba(0,51,102,1)'; // 轴数
  for (var i = 0; i < 110; i++) {
    if (i % 5 == 0)
      context.fillText((110 - i * 2), x, i * 15);
  }
  context.stroke();
}
//绘制右侧标尺
//注意右侧标尺的位置可能修改
function setrrules(x, align) {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext('2d');
  context.font = 'bold 15px consolas';
  context.textAlign = align;
  context.textBaseline = 'top';
  context.fillStyle = 'rgba(0,51,102,1)'; // 轴数

  //手动绘制标尺最右端点
  //BPD
  context.fillText('+2SD', x, (55 - (100.8 / 2)) * 15);
  context.fillText('Mean', x, (55 - (94 / 2)) * 15);
  context.fillText('-2SD', x, (55 - (87 / 2)) * 15);
  //FL
  context.fillText('+2SD', x, (55 - (77 / 2)) * 15);
  context.fillText('Mean', x, (55 - (72 / 2)) * 15);
  context.fillText('-2SD', x, (55 - (67 / 2)) * 15);
  //AC
  context.fillText((31 / 2) * 2, x, (55 - (31 / 2)) * 15);
  context.fillText((34 / 2) * 2, x, (55 - (34 / 2)) * 15);
  context.fillText((37 / 2) * 2, x, (55 - (37 / 2)) * 15);

  context.stroke();
  ac();
  bpd();
  fl();
}

function ac() {

  var topscale = [
    { 'x': calculateX(15.5), 'y': calculateY(10.5) },
    { 'x': calculateX(20), 'y': calculateY(15.8) },
    { 'x': calculateX(25), 'y': calculateY(22) },
    { 'x': calculateX(30), 'y': calculateY(27.7) },
    { 'x': calculateX(35), 'y': calculateY(32.8) },
    { 'x': calculateX(40), 'y': calculateY(37) },
  ];
  drawscaleLine(topscale, 'AC', 650, '1');

  var midscale = [
    { 'x': calculateX(15.5), 'y': calculateY(9.3) },
    { 'x': calculateX(20), 'y': calculateY(14.4) },
    { 'x': calculateX(25), 'y': calculateY(20) },
    { 'x': calculateX(30), 'y': calculateY(25.2) },
    { 'x': calculateX(35), 'y': calculateY(30) },
    { 'x': calculateX(40), 'y': calculateY(34) },
  ];
  drawscaleLine(midscale, 'AC', 650, '2');

  var bottomscale = [
    { 'x': calculateX(15.5), 'y': calculateY(8) },
    { 'x': calculateX(20), 'y': calculateY(12.8) },
    { 'x': calculateX(25), 'y': calculateY(18) },
    { 'x': calculateX(30), 'y': calculateY(22.8) },
    { 'x': calculateX(35), 'y': calculateY(27.2) },
    { 'x': calculateX(40), 'y': calculateY(31) },
  ];
  drawscaleLine(bottomscale, 'AC', 650, '1');
}

function fl() {
  var topscale = [
    { 'x': calculateX(12), 'y': calculateY(9) },
    { 'x': calculateX(15.5), 'y': calculateY(20.7) },
    { 'x': calculateX(20), 'y': calculateY(34) },
    { 'x': calculateX(25), 'y': calculateY(47.5) },
    { 'x': calculateX(30), 'y': calculateY(58.5) },
    { 'x': calculateX(35), 'y': calculateY(68.8) },
    { 'x': calculateX(40), 'y': calculateY(77) },
  ];
  drawscaleLine(topscale, 'FL', 420, '1');

  var midscale = [
    { 'x': calculateX(12), 'y': calculateY(6) },
    { 'x': calculateX(15.5), 'y': calculateY(17.4) },
    { 'x': calculateX(20), 'y': calculateY(30.7) },
    { 'x': calculateX(25), 'y': calculateY(43) },
    { 'x': calculateX(30), 'y': calculateY(54) },
    { 'x': calculateX(35), 'y': calculateY(63.5) },
    { 'x': calculateX(40), 'y': calculateY(72) },
  ];
  drawscaleLine(midscale, 'FL', 420, '2');

  var bottomscale = [
    { 'x': calculateX(12), 'y': calculateY(2.5) },
    { 'x': calculateX(15.5), 'y': calculateY(13.3) },
    { 'x': calculateX(20), 'y': calculateY(26.4) },
    { 'x': calculateX(25), 'y': calculateY(38.6) },
    { 'x': calculateX(30), 'y': calculateY(49.5) },
    { 'x': calculateX(35), 'y': calculateY(59.2) },
    { 'x': calculateX(40), 'y': calculateY(67) },
  ];
  drawscaleLine(bottomscale, 'FL', 420, '1');
}

function bpd() {

  var topscale = [
    { 'x': calculateX(12), 'y': calculateY(25) },
    { 'x': calculateX(15.5), 'y': calculateY(38) },
    { 'x': calculateX(20), 'y': calculateY(53.5) },
    { 'x': calculateX(25), 'y': calculateY(69.2) },
    { 'x': calculateX(30), 'y': calculateY(82.5) },
    { 'x': calculateX(35), 'y': calculateY(93.4) },
    { 'x': calculateX(37.5), 'y': calculateY(97.6) },
    { 'x': calculateX(40), 'y': calculateY(100.8) },
  ];
  drawscaleLine(topscale, 'BPD', 90, '1');

  var midscale = [
    { 'x': calculateX(12), 'y': calculateY(20.5) },
    { 'x': calculateX(15.5), 'y': calculateY(32.7) },
    { 'x': calculateX(20), 'y': calculateY(47.5) },
    { 'x': calculateX(25), 'y': calculateY(63) },
    { 'x': calculateX(30), 'y': calculateY(76.7) },
    { 'x': calculateX(35), 'y': calculateY(87.5) },
    { 'x': calculateX(37.5), 'y': calculateY(91.7) },
    { 'x': calculateX(40), 'y': calculateY(94) },
  ];
  drawscaleLine(midscale, 'BPD', 90, '2');

  var bottomscale = [
    { 'x': calculateX(12), 'y': calculateY(14.8) },
    { 'x': calculateX(15.5), 'y': calculateY(26.7) },
    { 'x': calculateX(20), 'y': calculateY(41.5) },
    { 'x': calculateX(25), 'y': calculateY(56.5) },
    { 'x': calculateX(30), 'y': calculateY(70) },
    { 'x': calculateX(35), 'y': calculateY(80.8) },
    { 'x': calculateX(37.5), 'y': calculateY(84.7) },
    { 'x': calculateX(40), 'y': calculateY(87) },
  ];
  drawscaleLine(bottomscale, 'BPD', 90, '1');
}

function printline() {
  var bpdArr = [];
  var flArr = [];
  var acArr = [];
  var bdpPoints = [
    { 'x': calculateX(12), 'y': calculateY(25) },
    { 'x': calculateX(15.5), 'y': calculateY(38) },
    { 'x': calculateX(20), 'y': calculateY(53.5) },
    { 'x': calculateX(25), 'y': calculateY(69.2) },
    { 'x': calculateX(30), 'y': calculateY(82.5) },
    { 'x': calculateX(35), 'y': calculateY(93.4) },
    { 'x': calculateX(37.5), 'y': calculateY(97.6) },
    { 'x': calculateX(40), 'y': calculateY(100.8) },
    { 'x': calculateX(40), 'y': calculateY(87) },
    { 'x': calculateX(37.5), 'y': calculateY(84.7) },
    { 'x': calculateX(35), 'y': calculateY(80.8) },
    { 'x': calculateX(30), 'y': calculateY(70) },
    { 'x': calculateX(25), 'y': calculateY(56.5) },
    { 'x': calculateX(20), 'y': calculateY(41.5) },
    { 'x': calculateX(15.5), 'y': calculateY(26.7) },
    { 'x': calculateX(12), 'y': calculateY(14.8) },
    { 'x': calculateX(12), 'y': calculateY(25) }
  ];
  var flPoints = [
    { 'x': calculateX(12), 'y': calculateY(9) },
    { 'x': calculateX(15.5), 'y': calculateY(20.7) },
    { 'x': calculateX(20), 'y': calculateY(34) },
    { 'x': calculateX(25), 'y': calculateY(47.5) },
    { 'x': calculateX(30), 'y': calculateY(58.5) },
    { 'x': calculateX(35), 'y': calculateY(68.8) },
    { 'x': calculateX(40), 'y': calculateY(77) },
    { 'x': calculateX(40), 'y': calculateY(67) },
    { 'x': calculateX(35), 'y': calculateY(59.2) },
    { 'x': calculateX(30), 'y': calculateY(49.5) },
    { 'x': calculateX(25), 'y': calculateY(38.6) },
    { 'x': calculateX(20), 'y': calculateY(26.4) },
    { 'x': calculateX(15.5), 'y': calculateY(13.3) },
    { 'x': calculateX(12), 'y': calculateY(2.5) },
    { 'x': calculateX(12), 'y': calculateY(9) },
  ];
  var acPoints = [
    { 'x': calculateX(15.5), 'y': calculateY(10.5) },
    { 'x': calculateX(20), 'y': calculateY(15.8) },
    { 'x': calculateX(25), 'y': calculateY(22) },
    { 'x': calculateX(30), 'y': calculateY(27.7) },
    { 'x': calculateX(35), 'y': calculateY(32.8) },
    { 'x': calculateX(40), 'y': calculateY(37) },
    { 'x': calculateX(40), 'y': calculateY(31) },
    { 'x': calculateX(35), 'y': calculateY(27.2) },
    { 'x': calculateX(30), 'y': calculateY(22.8) },
    { 'x': calculateX(25), 'y': calculateY(18) },
    { 'x': calculateX(20), 'y': calculateY(12.8) },
    { 'x': calculateX(15.5), 'y': calculateY(8) },
    { 'x': calculateX(15.5), 'y': calculateY(10.5) },
  ];

  for (var i = 0; i < demodata.length; i++) {
    var bpdObj = {};
    var flObj = {};
    var acObj = {};
    bpdObj.x = calculateX(parseInt(demodata[i].yunzh));
    bpdObj.y = calculateY(parseInt(demodata[i].bpd));
    bpdArr.push(bpdObj);

    flObj.x = calculateX(parseInt(demodata[i].yunzh));
    flObj.y = calculateY(parseInt(demodata[i].fl));
    flArr.push(flObj);

    acObj.x = calculateX(parseInt(demodata[i].yunzh));
    acObj.y = calculateY(parseInt(demodata[i].ac));
    acArr.push(acObj);
  }

  if (bpdArr.length > 0) {
    var bpdColor = judge(bpdArr[bpdArr.length - 1], bdpPoints) ? '#6BB6FF' : 'red';
    drawscaleLine(bpdArr, 'BPD', 90, '3', bpdColor);
  }

  if (flArr.length > 0) {
    var flColor = judge(flArr[flArr.length - 1], flPoints) ? '#6BB6FF' : 'red';
    drawscaleLine(flArr, 'FL', 420, '3', flColor);
  }

  if (acArr.length > 0) {
    var acColor = judge(acArr[acArr.length - 1], acPoints) ? '#6BB6FF' : 'red';
    drawscaleLine(acArr, 'AC', 650, '3', acColor);
  }
}

function drawscaleLine(scale, name, namey, style, color) {
  for (var i = 0; i < scale.length; i++) {
     context.beginPath();
    if (style === '3') {
      context.lineWidth = 6;
      context.strokeStyle = color;
    } else if (style == '2') {
      context.lineWidth = 3;
      context.strokeStyle = '#787878';
    } else {
      context.lineWidth = 1.2;
      context.strokeStyle = 'gray';
    }
    if (i < scale.length - 1) {
      context.moveTo(scale[i].x, scale[i].y);
      context.lineTo(scale[i + 1].x, scale[i + 1].y);
    }
    context.stroke();
    //绘制红点
    if (style === '3') {
      context.beginPath();
      context.arc(scale[i].x, scale[i].y, 6, 0, 2*Math.PI);
      context.fillStyle = 'red';
      context.fill();
      context.closePath();
    }
  }

  context.fillStyle = 'rgba(0,51,102,1)';
  context.font = 'bold 25px consolas';
  context.textAlign = 'center';
  context.fillText(name, textposition, namey);
}

function calculateX(x) {
  return baseleft + (x - 10) * 20;
}

function calculateY(y) {
  return (55 - (y / 2.0625)) * 15;
}


// 判断某个点是否在多边形内部
function judge(dot,coordinates) {
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