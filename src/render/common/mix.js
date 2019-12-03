import React, { Component } from "react";
import { Row, Col, Checkbox, Input, Table, Select, DatePicker } from 'antd';

const getrealy = str => str.replace(/\((.*)\)/,'').replace(/\[.*\]/,'').replace(/\((.*)\)/,'');

class MMix extends Component{
  constructor(props){
    super(props);
    const {option} = props;
    const $label = option.label||option;
    const label = getrealy($label);
    const type = option.type || (/\((.*)\)/.test($label) && /\((.*)\)/.exec($label)[1]);
    const unit = option.unit || (/\[(.*)\]/.test($label) && /\[(.*)\]/.exec($label)[1]);
    const field = getrealy(option.value || option);
    this.state = {
      label,type,unit,field,width:0
    };
  }

  componentWillReceiveProps(newProps){
    const { field } = this.state;
    const {args:[,AddResize], option, data} = this.props;
    if(!option.wrap && !this.componentWillUnmount && !data.hasOwnProperty(field) && newProps.data.hasOwnProperty(field)){
      this.componentWillUnmount = AddResize(()=>this.resize())
    }
  }

  resize(){
    const {checkboxInput} = this.refs;
    setTimeout(() => {
      if(checkboxInput && checkboxInput.parentNode){
        const width = checkboxInput.parentNode.offsetWidth - Array.prototype.map.call(checkboxInput.parentNode.children, el=>{
          return checkboxInput===el?0:el.offsetWidth;
        }).reduce((a,b)=>a+b) - 6;
        checkboxInput.style.width = width + 'px';
        this.setState({width});
      }
    });
  }

  renderEditor([FormItemComponent, ]) {
    const { data, option, onChange } = this.props;
    const {field,type,unit,width} = this.state; 
    const props = {type:type||'input',...option,name:unit?`${field}(${unit})`:field};

    return <FormItemComponent {...props} width={width} entity={data} onChange={onChange} />;
  }

  render(){
    const {args, data, option, onCheck, onChange, span, addspan, ...rest} = this.props;
    const {label,type,field} = this.state; 
    const showEditor = type && data.hasOwnProperty(field);
        
    return (
      <Col {...rest} span={span * (1 + (/^\d+$/.test(addspan) ? addspan : !!showEditor))}>
        <Checkbox value={field} checked={data.hasOwnProperty(field)} onChange={e=>onCheck(e,{checked:e.target.checked,name:field,option})}>{label}</Checkbox>
        <div ref="checkboxInput" style={{display:showEditor?'inline-block':'none'}}>
          {showEditor ? this.renderEditor(args):null}
        </div>
      </Col>
    )
  }
}

/**
 * count表示每一行最多可以排几个
 * options里面的每一项可以有type,unit
 * 或者在label里面label(input)[unit]
 * wrap这个属性告诉编辑器是否编辑器不受限在一行
 * addspan 表示当前选项，当编辑框出来后增加的占位
 */
export function checkinput$x({ name, options = [], onChange, onBlur, value:data = {}, unselect, radio, ...rest }, count, ...args){
  const optionList = (unselect?[{label:unselect,value:'unselect',unselect:true}]:[]).concat(options);
  const span = Math.floor(count ? (24/count) : Math.max(6, 24 / (optionList.length || 1)));
  
  const findWC = (op, fn) => {
    const getflag = o => o.flag || (/\((.*)\)/.test(o.label||o) && /\((.*)\)/.exec(o.label||o)[1]) || '';
    const flag = getflag(op);

    // 为了兼容唯一反选 unselect
    if (unselect){
      if(op.unselect){
        optionList.filter(o=>o!==op).forEach(o => fn(getrealy(o.value || o)));
      }else{
        fn(unselect);
      }
    } else {
      optionList.filter(o=>o!==op).forEach(o=>{
        if((flag === '!' && getflag(onBlur) === '!') || radio){
          fn(getrealy(o.value || o));
        } else if(getflag(o) === `!${flag}` || getflag(o) === `!${flag}`.replace(/^!!/,'')){
          fn(getrealy(o.value || o));
        }
      });
    }
  }

  const handleCheck = (e, {name, checked, option}) => {
    if(checked){
      data[name] = data[`$${name}`] || '';
      findWC(option, n => delete data[n]);
    }else{
      delete data[name];
    }
    onChange(e,data).then(()=>onBlur());
  }

  const handleInput = (e,{value, name}) => {
    data[`$${name}`] = value;
    data[name] = value;
    onChange(e,value).then(()=>onBlur());
  }

  return (
    <Row className="checkinput">
    {optionList.map((op,index)=>(
        <MMix {...rest} args={args} key={`checkinput-${name}-${index}`} 
          span={op.span||span} data={{...data}} option={op} 
          onCheck={handleCheck} onChange={handleInput}/>
    ))}
    </Row>
  )
}


