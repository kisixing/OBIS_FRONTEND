
export function countWeek(date1, date2){
  var newDate = date2 ? new Date(date2) : new Date();
  var days = Math.ceil(((new Date(date1) - newDate) / (1000 * 3600)) / 24);
  if (days < 0) {
    return `${Math.ceil(days / 7)}+${days % 7}`;
  }
  return `${Math.floor(days / 7)}+${days % 7}`;
}

export function formateDate() {
  let date = new Date();
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export function futureDate(param) {
  let date = new Date();
  date.setDate(date.getDate() + parseInt(param));
  let getMonth = (date.getMonth()+1 > 10) ? date.getMonth()+1 : "0" + (date.getMonth()+1);
  let getDate = (date.getDate()+1 > 10) ? date.getDate() : "0" + date.getDate();
  return date.getFullYear() +"-"+ getMonth +"-"+ getDate;
}

export function getWeek(param1, param2) {
  let day1;
  let day2;
  let days;
  if (typeof param1 === 'string' && param1.indexOf('+') !== -1) {
    day1 = param1.split('+');
    day1 = parseInt(day1[0] * 7) + parseInt(day1[1]);
  } else {
    day1 = parseInt(param1) * 7;
  }

  if (typeof param2 === 'string' && param2.indexOf('+') !== -1) {
    day2 = param2.split('+');
    day2 = parseInt(day2[0] * 7) + parseInt(day2[1]);
  } else {
    day2 = parseInt(param2) * 7;
  }
  days = day1 - day2;
  if (days % 7 === 0) return Math.floor(days / 7);
  if (days < 0) {
    return `${Math.ceil(days / 7)}+${days % 7}`;
  }
  return `${Math.floor(days / 7)}+${days % 7}`;
}

// 获取本周五、下周五、下下周五时间
export function getOrderTime(key) {
  console.log(key)
  let time;
  if (key === "本周五") {
    let day = new Date().getDay();
    let minus = 5 - day;
    let thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() + minus);
    let year = thisWeek.getFullYear();
    let month = thisWeek.getMonth() + 1 <= 9 ? '0' + (thisWeek.getMonth() + 1) : thisWeek.getMonth() + 1;
    let strDate = thisWeek.getDate() <= 9 ? '0' + thisWeek.getDate() : thisWeek.getDate();
    time = year + '-' + month + '-' + strDate;
  } else if (key === "下周五") {
    let day = new Date().getDay();
    let minus = 5 - day;
    let nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + minus + 7);
    let year = nextWeek.getFullYear();
    let month = nextWeek.getMonth() + 1 <= 9 ? '0' + (nextWeek.getMonth() + 1) : nextWeek.getMonth() + 1;
    let strDate = nextWeek.getDate() <= 9 ? '0' + nextWeek.getDate() : nextWeek.getDate();
    time = year + '-' + month + '-' + strDate;
  } else if (key === "下下周五") {
    let day = new Date().getDay();
    let minus = 5 - day;
    let nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + minus + 14);
    let year = nextWeek.getFullYear();
    let month = nextWeek.getMonth() + 1 <= 9 ? '0' + (nextWeek.getMonth() + 1) : nextWeek.getMonth() + 1;
    let strDate = nextWeek.getDate() <= 9 ? '0' + nextWeek.getDate() : nextWeek.getDate();
    time = year + '-' + month + '-' + strDate;
  }
  return time;
}