export const editTypes = 'input,select,.ant-select-selection'.split(',');

 

export function eventFns({onKeyUp, ...props}) {
  const noAutoClick = el => {
    return [
      'checkbox,radio,button'.toLocaleLowerCase().split(',').indexOf(el.type) !== -1
    ].filter(i=>i).length;
  };
  const findNext = (root, item, next) => {
    let inedx = 0;
    const types = 'input,select,textarea,button,[tabindex]';
    const active = item.querySelector(types) || item;
    const elements = root.querySelectorAll(types);
    Array.prototype.forEach.call(elements,(el,i)=>{
      if(el === active){
        inedx = i;
      }
    });
    return elements[inedx + next];
  };
  return {
    ...props,
    onKeyUp: e=>{
      // 添加扩展逻辑
      if(([37,39].indexOf(e.keyCode) !== -1)) {
        const nextEl = findNext(e.currentTarget,e.target,e.keyCode-38)
        nextEl&&setTimeout(()=>{
          nextEl.focus();
          if(!noAutoClick(nextEl)){
            nextEl.click();
          }
        });
        e.preventDefault();
      }
      if(onKeyUp){
        return onKeyUp(e);
      }
    }
  }
};
