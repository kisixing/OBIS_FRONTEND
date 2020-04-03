import service from '../service';

export function GetExpected(gesmoc) {
  var tmpdate = new Date(gesmoc).getTime();
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

export function getBMI(weight, height) {
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

export function ResetData(entity, name){
  const arr1 = ['add_FIELD_gaoxueya', 'add_FIELD_tangniaobing', 'add_FIELD_xinzangbing', 'add_FIELD_qitabingshi'];
  const arr2 = ['add_FIELD_grxiyan', 'add_FIELD_gryinjiu', 'add_FIELD_gryouhai', 'add_FIELD_grfangshe', 'add_FIELD_grqita'];
  const arr3 = ['add_FIELD_jzgaoxueya', 'add_FIELD_jztangniaobing', 'add_FIELD_jzjixing', 'add_FIELD_jzyichuanbing', 'add_FIELD_jzqita'];
  switch(name) {
    case 'noneChecked1':
      arr1.map(item => { entity[item] = [{"label": "无", "value": ""}] })
    break;
    case 'noneChecked2':
      arr2.map(item => { entity[item] = [{"label": "无", "value": ""}] })
    break;
    case 'noneChecked3':
      arr3.map(item => { entity[item] = [{"label": "无", "value": ""}] })
    break;
  }
  return entity;
}

export function setCookie(c_name, value, expiredays) {                   
  var exdate = new Date();                   
  exdate.setDate(exdate.getDate() + expiredays);                   
  document.cookie = c_name + "=" + escape(value) + "; expires=" + exdate.toGMTString() + "; path=/";         
}

export function getCookie(name){
  var strcookie = document.cookie;
  var arrcookie = strcookie.split("; ");
  for ( var i = 0; i < arrcookie.length; i++) {
      var arr = arrcookie[i].split("=");
      if (arr[0] == name){
        return arr[1];
      }
  }
  return "";
}

export function printPdf(url){
  var iframe = this._printIframe;
  if (!this._printIframe) {
      iframe = this._printIframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      iframe.style.display = 'none';
      iframe.onload = function() {
      setTimeout(function() {
          iframe.focus();
          iframe.contentWindow.print();
      }, 1);
    };
  }
  iframe.src = service.getUrl(url);
}

export function closeWindow() {
  if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
      window.opener = null;
      window.close();
    } else {
      window.open('', '_top');
      window.top.close();
    }
  } else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
    window.location.href = 'about:blank ';
  } else {//close chrome;It is effective when it is only one.
    const len = window.history.length - 1;
    window.history.go(-len);

    window.open(location, '_self').close();

    // window.opener = null;
    // window.open(' ', '_self');
    // window.close();

    // window.location.href = 'about:blank';
    // window.close();
  }
}

