/**
* @param  dot {{x,y}} 需要判断的点
* @param  coordinates {{x,y}[]} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
*                      比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
* @param noneZeroMode 对不规则图形进行判断
*/
export function judgeAreas(dot, coordinates, noneZeroMode) {
  // 默认启动none zero mode
  noneZeroMode = noneZeroMode || 1;
  let x = dot.x, y = dot.y;
  let crossNum = 0;
  // 点在线段的左侧数目
  let leftCount = 0;
  // 点在线段的右侧数目
  let rightCount = 0;
  for(let i = 0; i < coordinates.length - 1; i++){
    let start = coordinates[i];
    let end = coordinates[i + 1];
    // 起点、终点斜率不存在的情况
    if(start.x === end.x) {
      // 因为射线向右水平，此处说明不相交
      if(x > start.x) continue;
      // 从左侧贯穿
      if((end.y > start.y && y >= start.y && y <= end.y)){
        leftCount++;
        crossNum++;
      }
      // 从右侧贯穿
      if((end.y < start.y && y >= end.y && y <= start.y)) {
        rightCount++;
        crossNum++;
      }
      continue;
    }
    // 斜率存在的情况，计算斜率
    let k = (end.y - start.y) / (end.x - start.x);
    // 交点的x坐标
    let x0 = (y - start.y) / k + start.x;
    // 因为射线向右水平，此处说明不相交
    if(x > x0) continue;
    if((end.x > start.x && x0 >= start.x && x0 <= end.x)){
      crossNum++;
      if(k >= 0) leftCount++;
      else rightCount++;
    }
    if((end.x < start.x && x0 >= end.x && x0 <= start.x)) {
      crossNum++;
      if(k >= 0) rightCount++;
      else leftCount++;
    }
  }      
  return noneZeroMode === 1 ? leftCount - rightCount !== 0 : crossNum % 2 === 1;
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