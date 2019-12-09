
export function countWeek(date){
  if (!date) {
    return '';
  }
  var days = Math.floor(((new Date() - new Date(date)) / (1000 * 3600) + 8) / 24);
  return `${Math.floor(days / 7)}+${days % 7}`;
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
