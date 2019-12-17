export function GetExpected(gesmoc) {
  var tmpdate = new Date(gesmoc).getTime();
  console.log(tmpdate);
  tmpdate = tmpdate + 280 * 24 * 60 * 60 * 1000;
  tmpdate = new Date(tmpdate);
  var new_y = tmpdate.getFullYear();
  var new_m = tmpdate.getMonth() + 1;
  if (new_m < 10) {
      new_m = "0" + "" + new_m
  }
  var new_d = tmpdate.getDate();
  if (new_d < 10) {
      new_d = "0" + "" + new_d
  }
  var newdate = new_y + "-" + new_m + "-" + new_d;
  return newdate
};

export function GetWeek(expected, today) {
  var date3 = new Date(expected).getTime() - new Date(today).getTime();
  var yunzh = "";
  var week = "";
  var day = "";
  if (date3 > 0) {
      var days = 280 - Math.floor(date3 / (24 * 3600 * 1000));
      console.log(days);
      if (days > 0) {
          week = Math.floor((days / 7));
          day = Math.floor((days % 7));
          if (day == 0) {
              day = ""
          } else {
              day = "+" + day
          }
          yunzh = week + day
      }
  } else {
      var days = Math.floor(Math.abs(date3 / (24 * 3600 * 1000)));
      week = Math.floor((days / 7));
      if (week >= 2) {
          yunzh = "42"
      } else {
          day = Math.floor((days % 7));
          if (day == 0) {
              day = ""
          }else{
            day = "+" + day
          }
          yunzh = week + 40 + day
      }
  }
  return yunzh
};

export function getBMI(weight,height){
  if(!weight || !height){
    return '';
  }
  if(weight==''||height==''){
    return '';
  }
  return (weight/(height*height)*10000).toFixed(1)
}

export const loadWidget = (function (){
  const modules = {
    echarts: [
      'assets/static/echarts-3.8.5-2/echarts3-2.min.js'
    ]
  };

  return function(module){
    if(modules[module]){
      if(!modules[module].then){
        modules[module] = Promise.all(modules[module].map(src=>new Promise(resolve=>{
          if(/\.css/.test(src)){
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = src;
            document.body.appendChild(css);
            resolve()
          }else{
            let timeID;
            const js = document.createElement('script');
            const supportLoad = 'onload' in js;
            const onEvent = supportLoad ? 'onload' : 'onreadystatechange';
            const doOnLoad = () => {
              if (!supportLoad && !timeID && /complete|loaded/.test(js.readyState)) {
                  timeID = setTimeout(doOnLoad);
                  return;
              }
              if (supportLoad || timeID) {
                clearTimeout(timeID);
                resolve();
              }
            };
            js.type = 'text/javascript';
            js.src = src;
            js[onEvent] = doOnLoad;
            document.body.appendChild(js);
          }
        })));
      }
      return modules[module];
    }
    return  Promise.reject('请添加相关配置');
  }
})();
