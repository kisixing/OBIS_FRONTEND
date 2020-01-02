
var maxindex = 750;
var context = null;
var lastx = 0;
var lasty = 0;
var baseleft = 50;
var basetop = 5;
var max = 210;
var start = '2019-09-01 05:30';
var demodata = [];
var acscale = [[{ 'x': 105, 'y': 800 }, { 'x': 600, 'y': 590 }], [{ 'x': 105, 'y': 788 }, { 'x': 600, 'y': 575 }], [{ 'x': 105, 'y': 780 }, { 'x': 600, 'y': 560 }]];
var flscale = [[{ 'x': 40, 'y': 809 }, { 'x': 600, 'y': 322 }], [{ 'x': 40, 'y': 780 }, { 'x': 600, 'y': 285 }], [{ 'x': 40, 'y': 755 }, { 'x': 600, 'y': 250 }]];
var bpdscale = [[{ 'x': 40, 'y': 711 }, { 'x': 600, 'y': 172 }], [{ 'x': 40, 'y': 675 }, { 'x': 600, 'y': 120 }], [{ 'x': 40, 'y': 635 }, { 'x': 600, 'y': 70 }]];
var lastcurrx = 0;
var currentx = 10;
var textposition = 550;
function formatDate(date, format) {
  if (!date) return;
  if (!format) format = "yyyy-MM-dd";
  switch (typeof date) {
    case "string":
      date = new Date(date.replace(/-/, "/"));
      break;
    case "number":
      date = new Date(date);
      break;
  }
  if (!date instanceof Date) return;
  var dict = {
    "yyyy": date.getFullYear(),
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "H": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "MM": ("" + (date.getMonth() + 101)).substr(1),
    "dd": ("" + (date.getDate() + 100)).substr(1),
    "HH": ("" + (date.getHours() + 100)).substr(1),
    "mm": ("" + (date.getMinutes() + 100)).substr(1),
    "ss": ("" + (date.getSeconds() + 100)).substr(1)
  };
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]];
  });
}


var starttime = formatDate(new Date(), "HH:mm");
function getEventPosition(ev) {
  var x, y;
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }
  //return {x: x, y: y};
  return x + '-' + y;
}

// canvas = document.getElementById('canvas');
// canvas.addEventListener('click', function (e) {
//     p = getEventPosition(e);
//     alert(p);
// }, false);

function showcur(x, fhr, toco) {
  context.font = 'bold 10px consolas';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.font = 'bold 16px arial';
  context.fillStyle = 'blue';
  var title = document.getElementById('curtitle');
  title.innerHTML = 'FHR1:' + fhr + "  " + 'TOCO:' + toco;
}

function showbase() {

}

function selectfrom(lowValue, highValue) {
  var choice = highValue - lowValue + 1;
  return Math.floor(Math.random() * choice + lowValue);
}

function drawarc(x, y) {
  context.beginPath();
  context.arc(x, y, 8, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.strokeStyle = "red";
  context.fill();
  context.stroke();
}

function drawcross(x, y) {
  context.beginPath();
  context.fillStyle = "#394a6d";
  context.strokeStyle = "#394a6d";
  context.lineWidth = 0;
  context.moveTo(x, y);
  context.lineTo(x + 5, y);
  context.lineTo(x + 20, y + 15);
  context.lineTo(x + 15, y + 15);
  context.lineTo(x, y);
  context.moveTo(x + 15, y);
  context.lineTo(x + 20, y);
  context.lineTo(x + 5, y + 15);
  context.lineTo(x, y + 15);
  context.lineTo(x + 15, y);
  context.fill();
}

//缩放
function scaleContext(context) {
  // context.scale(0.6, 0.25);
  if (context != undefined) {
    context.scale(0.7, 0.7);
  }
}

//绘制网格
function drawgrid(id) {
  var canvas = document.getElementById(id);
  if (canvas == null)
    return false;
  scaleContext(canvas.getContext("2d"));
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
  context = canvas.getContext("2d");
  context.font = 'bold 15px consolas';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = 'rgba(0,51,102,1)'; // 轴数
  for (var i = 0; i < 31; i++) {
    if (i % 5 == 0)
      context.fillText(i + 10, baseleft + i * 20, basetop + 825 + 10);
  }
  //手动绘制X坐标
  // context.fillText(10, baseleft+(10-10)*20, basetop+825+10);
  // context.fillText(12, baseleft+(12-10)*20, basetop+825+10);//90
  // // context.fillText(15, baseleft+5*20, basetop+825+10);
  // context.fillText(15.5, baseleft+(15.5-10)*20, basetop+825+10);//160
  // context.fillText(20, baseleft+(20-10)*20, basetop+825+10);//250
  // context.fillText(25, baseleft+(25-10)*20, basetop+825+10);//350
  // context.fillText(30, baseleft+(30-10)*20, basetop+825+10);//450
  // context.fillText(35, baseleft+(35-10)*20, basetop+825+10);//550
  // context.fillText(37.5, baseleft+(37.5-10)*20, basetop+825+10);//600
  // context.fillText(40, baseleft+(40-10)*20, basetop+825+10);//650

  context.stroke();
}
//x轴线
function setvertical(maxline) {
  var canvas = document.getElementById('canvas');
  if (canvas == null)
    return false;
  context = canvas.getContext("2d");
  context.strokeStyle = "rgb(150,150,150)"; // 横轴线
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
  context = canvas.getContext("2d");
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
  context = canvas.getContext("2d");
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
  context = canvas.getContext("2d");
  context.font = 'bold 15px consolas';
  context.textAlign = align;
  context.textBaseline = 'top';
  context.fillStyle = 'rgba(0,51,102,1)'; // 轴数
  // for (var i = 10; i < 21; i++) {
  //     if(i%5==0)
  //         context.fillText(i*2, x, (55-i) * 15);
  // }
  // context.fillText('+2SD', x, 65);
  // context.fillText('Mean', x, 120);
  // context.fillText('-2SD', x, 170);
  // context.fillText('+2SD', x, 250);
  // context.fillText('Mean', x, 280);
  // context.fillText('-2SD', x, 310);

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
  // drawscale(acscale,'AC',650);

  var topscale = [
    { 'x': calculateX(15.5), 'y': calculateY(10.5) },
    { 'x': calculateX(20), 'y': calculateY(15.8) },
    { 'x': calculateX(25), 'y': calculateY(22) },
    { 'x': calculateX(30), 'y': calculateY(27.7) },
    { 'x': calculateX(35), 'y': calculateY(32.8) },
    { 'x': calculateX(40), 'y': calculateY(37) }
  ];
  drawscaleLine(topscale, 'AC', 650, '1');

  var midscale = [
    { 'x': calculateX(15.5), 'y': calculateY(9.3) },
    { 'x': calculateX(20), 'y': calculateY(14.4) },
    { 'x': calculateX(25), 'y': calculateY(20) },
    { 'x': calculateX(30), 'y': calculateY(25.2) },
    { 'x': calculateX(35), 'y': calculateY(30) },
    { 'x': calculateX(40), 'y': calculateY(34) }
  ];
  drawscaleLine(midscale, 'AC', 650, '2');

  var bottomscale = [
    { 'x': calculateX(15.5), 'y': calculateY(8) },
    { 'x': calculateX(20), 'y': calculateY(12.8) },
    { 'x': calculateX(25), 'y': calculateY(18) },
    { 'x': calculateX(30), 'y': calculateY(22.8) },
    { 'x': calculateX(35), 'y': calculateY(27.2) },
    { 'x': calculateX(40), 'y': calculateY(31) }
  ];
  drawscaleLine(bottomscale, 'AC', 650, '1');
}

function fl() {
  // drawscale(flscale,'FL',420);

  var topscale = [
    { 'x': calculateX(12), 'y': calculateY(9) },
    { 'x': calculateX(15.5), 'y': calculateY(20.7) },
    { 'x': calculateX(20), 'y': calculateY(34) },
    { 'x': calculateX(25), 'y': calculateY(47.5) },
    { 'x': calculateX(30), 'y': calculateY(58.5) },
    { 'x': calculateX(35), 'y': calculateY(68.8) },
    { 'x': calculateX(40), 'y': calculateY(77) }
  ];
  drawscaleLine(topscale, 'FL', 420, '1');

  var midscale = [
    { 'x': calculateX(12), 'y': calculateY(6) },
    { 'x': calculateX(15.5), 'y': calculateY(17.4) },
    { 'x': calculateX(20), 'y': calculateY(30.7) },
    { 'x': calculateX(25), 'y': calculateY(43) },
    { 'x': calculateX(30), 'y': calculateY(54) },
    { 'x': calculateX(35), 'y': calculateY(63.5) },
    { 'x': calculateX(40), 'y': calculateY(72) }
  ];
  drawscaleLine(midscale, 'FL', 420, '2');

  var bottomscale = [
    { 'x': calculateX(12), 'y': calculateY(2.5) },
    { 'x': calculateX(15.5), 'y': calculateY(13.3) },
    { 'x': calculateX(20), 'y': calculateY(26.4) },
    { 'x': calculateX(25), 'y': calculateY(38.6) },
    { 'x': calculateX(30), 'y': calculateY(49.5) },
    { 'x': calculateX(35), 'y': calculateY(59.2) },
    { 'x': calculateX(40), 'y': calculateY(67) }
  ];
  drawscaleLine(bottomscale, 'FL', 420, '1');
}

function bpd() {
  // drawscale(bpdscale,'BPD', 90);

  var topscale = [
    { 'x': calculateX(12), 'y': calculateY(25) },
    { 'x': calculateX(15.5), 'y': calculateY(38) },
    { 'x': calculateX(20), 'y': calculateY(53.5) },
    { 'x': calculateX(25), 'y': calculateY(69.2) },
    { 'x': calculateX(30), 'y': calculateY(82.5) },
    { 'x': calculateX(35), 'y': calculateY(93.4) },
    { 'x': calculateX(37.5), 'y': calculateY(97.6) },
    { 'x': calculateX(40), 'y': calculateY(100.8) }
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
    { 'x': calculateX(40), 'y': calculateY(94) }
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
    { 'x': calculateX(40), 'y': calculateY(87) }
  ];
  drawscaleLine(bottomscale, 'BPD', 90, '1');
}

function drawscale(scale, name, namey) {
  for (var k = 0; k < scale.length; k++) {
    for (var i = 0; i < scale[k].length - 1; i++) {
      // 起点
      var x0 = scale[k][i].x;
      var y0 = scale[k][i].y;
      // 终点
      var x2 = scale[k][i + 1].x;
      var y2 = scale[k][i + 1].y;
      var curveness = -0.4;
      context.lineWidth = 1.5;
      context.strokeStyle = "black";
      // 贝塞尔曲线中间点 curveness曲率
      var x1 = (x0 + x2) / 2 - (y0 - y2) * curveness;
      var y1 = (y0 + y2) / 2 - (y2 - y0) * curveness;
      context.beginPath();
      context.moveTo(baseleft + x0, y0);
      context.bezierCurveTo(baseleft + x0, y0, baseleft + x1, y1, baseleft + x2, y2);
      context.stroke();
    }
  }
  context.font = 'bold 25px consolas';
  context.textAlign = 'center';
  context.fillText(name, textposition, namey);
}

function printline() {
  var canvas = document.getElementById('canvas2');
  if (canvas == null)
    return false;
  context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  var lastx, lasty1, lasty2, lasty3 = 0;
  for (var i = 0; i < demodata.length; i++) {
    var curx = i * 40 + 200;//baseleft+converttime(start,demodata[i].checktime)*35;
    var cury1 = 825 - Number(demodata[i].ac);
    var cury2 = 825 - demodata[i].fl;
    var cury3 = 825 - demodata[i].bpd;
    if (lastx != 0) {
      var canvas = document.getElementById('canvas');
      if (canvas == null)
        return false;
      context.beginPath();
      context.lineWidth = 2.5;
      context.strokeStyle = "green";
      context.moveTo(lastx, lasty1);
      context.lineTo(curx, cury1);
      context.stroke();
      context.beginPath();
      context.lineWidth = 2.5;
      context.strokeStyle = "green";
      context.moveTo(lastx, lasty2);
      context.lineTo(curx, cury2);
      context.stroke();
      context.beginPath();
      context.lineWidth = 2.5;
      context.strokeStyle = "green";
      context.moveTo(lastx, lasty3);
      context.lineTo(curx, cury3);
      context.stroke();
    }
    lastx = curx;
    lasty1 = cury1;
    lasty2 = cury2;
    lasty3 = cury3;
  }
}

//获取生长曲线数据
// function getPacsGrowth(userid) {
//   $.ajax({
//     type: 'POST',
//     dataType: "json",
//     async: false,
//     data: { userid: userid },
//     //url: 'http://120.77.46.176:8080/Obcloud/api/pacs/getPacsGrowth',
//     url: "http://120.77.46.176:8080/Obcloud/outpatientRestful/getPacsGrowth",
//     success: function (data) {
//       if (data.code == '1') {
//         // parent.BJUI.alertmsg('info', '获取');
//         demodata = data;

//         drawgrid('canvas');
//         printline();
//       } else {
//         parent.BJUI.alertmsg('error', data.message);
//       }
//     }
//   });
// }

function drawscaleLine(scale, name, namey, style) {
  console.log('drawscaleAC');

  var x0 = scale[0].x;
  var y0 = scale[0].y;
  context.beginPath();
  context.moveTo(x0, y0);
  for (var i = 1; i < scale.length; i++) {
    var x = scale[i].x;
    var y = scale[i].y;

    if (style == '2') {
      context.lineWidth = 3;
      context.strokeStyle = "black";
    } else {
      context.lineWidth = 1.2;
      context.strokeStyle = "gray";
    }
    context.lineTo(x, y);
  }
  context.stroke();

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
