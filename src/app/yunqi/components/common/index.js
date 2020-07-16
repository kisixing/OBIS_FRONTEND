/**
* @param  pt {{x,y}} 需要判断的点
* @param  poly {{x,y}[]} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
*/

export function judgeAreas(pt, poly) { 
  for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) 
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) 
      && (c = !c); 
  return c; 
}

/*
*绘制水平坐标轴标尺 
*/
export function setVerRules(ctx, origin, Len, color, lineWidth, step, int) {
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

/*
*绘制垂直坐标轴标尺 
*/
export function setHorRules(ctx, origin, Len, color, lineWidth, step, int) {
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

/*
*打印canvas图片
*/
export function printCanvas(id) {
  const canvas = document.getElementById(id);
  const image = new Image();
  image.src = canvas.toDataURL('image/png');
  $(image).jqprint();
}