
export function countWeek(date1, date2){
  var newDate = date2 ? new Date(date2) : new Date();
  var days = Math.ceil(((new Date(date1) - newDate) / (1000 * 3600)) / 24);
  if (days < 0) {
    return `${Math.ceil(days / 7)}+${days % 7}`;
  }
  return `${Math.floor(days / 7)}+${days % 7}`;
}

export function futureDate(param) {
  let date = new Date();
  date.setDate(date.getDate() + Number(param));
  let getMonth = (date.getMonth()+1 >= 10) ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let getDate = (date.getDate()+1 >= 10) ? date.getDate() : "0" + date.getDate();
  return date.getFullYear() +"-"+ getMonth +"-"+ getDate;
}

export function getWeek(param1, param2) {
  const day1 = getDays(param1);
  const day2 = getDays(param2);
  const days = day1 - day2;

  if (days % 7 === 0) return Math.floor(days / 7);
  if (days < 0) return `${Math.ceil(days / 7)}+${days % 7}`;
  return `${Math.floor(days / 7)}+${days % 7}`;
}

export function getDays(param) {
  let days;
  if (typeof param === 'string' && param.indexOf('+') !== -1) {
    days = param.split('+');
    days = Number(days[0]) * 7 + Number(days[1]);
  } else {
    days = Number(param) * 7;
  }
  return Math.abs(days);
}

// 获取本周五、下周五、下下周五时间
export function getOrderTime(orderDate) {
  let time;
  let day = new Date().getDay();
  let countDay = 5 - day;
  let thisWeek = new Date();
  if (orderDate === "本周五") {
    thisWeek.setDate(thisWeek.getDate() + countDay);
  } else if (orderDate === "下周五") {
    thisWeek.setDate(thisWeek.getDate() + countDay + 7);
  } else if (orderDate === "下下周五") {
    thisWeek.setDate(thisWeek.getDate() + countDay + 14);
  }
  let year = thisWeek.getFullYear();
  let month = thisWeek.getMonth() + 1 <= 9 ? '0' + (thisWeek.getMonth() + 1) : thisWeek.getMonth() + 1;
  let strDate = thisWeek.getDate() <= 9 ? '0' + thisWeek.getDate() : thisWeek.getDate();
  time = year + '-' + month + '-' + strDate;
  return time;
}