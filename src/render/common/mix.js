import React, { Component } from "react";
import { Row, Col, Checkbox, Input, Table, Select, DatePicker } from 'antd';

class MMix extends Component{
  constructor(props){
    super(props);
    const {option} = props;
    const $label = option.label||option;
    const label = $label.replace(/\((.*)\)/,'').replace(/\[.*\]/,'');
    const type = option.type || (/\((.*)\)/.test($label) && /\((.*)\)/.exec($label)[1]);
    const unit = option.unit || (/\[(.*)\]/.test($label) && /\[(.*)\]/.exec($label)[1]);
    this.state = {
      label,type,unit
    };
  }

  componentDidMount(){
    const {args:[,AddResize], option} = this.props;
    if(!option.wrap){
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
        checkboxInput.getElementsByClassName.width = width + 'px';
      }
    });
  }

  renderEditor([FormItemComponent, ], data, op, change) {
    const props = {type:'input',...op,name:op.unit?`value(${op.unit})`:'value'};

    return <FormItemComponent {...props} entity={data} onChange={change} />;
  }

  render(){
    const {args, data, option, onCheck, onChange, ...rest} = this.props;
    const {label,type,unit} = this.state; 
        
    return (
      <Col {...rest}>
        <Checkbox value={option.value||option} checked={data.checked} onChange={onCheck}>{label}</Checkbox>
        <div ref="checkboxInput" style={{display:'inline-block'}}>
          {data.checked && type ? this.renderEditor(args, data, {...option,type, unit} , onChange):null}
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
 */
export function checkinput$x(props, count, ...args){
  const { name, options = [], onChange, onBlur, value = [], unselect, radio, ...rest } = props;
  const span = Math.floor(count ? (24/count) : Math.max(6, 24 / ((options.length + !!unselect) || 1)));
  
  const handleCheck = index => e => {
    if(radio){
      value.forEach(i=>i.checked=false)
    }
    value.unselect = false;
    value[index].checked = e.target.checked;
    onChange(e,value).then(()=>onBlur());
  }

  const handleInput = index => (e,{value:v}) => {
    value[index].value = v;
    onChange(e,value).then(()=>onBlur());
  }

  const handleUnselect = (e) => {
    value.unselect = e.target.checked;
    value.forEach(i=>i.checked=false)
    onChange(e,value);
  }

  options.forEach((v,i)=>value[i]=value[i]||{});

  return (
    <Row className="checkinput">
      {unselect?(
      <Col span={span} key={`checkinput-${name}-unselect`}>
        <Checkbox checked={value.unselect} onChange={e=>handleUnselect(e)}>{unselect}</Checkbox>
      </Col>
      ):null}
      {options.map((op,index)=>(
        <MMix {...rest} args={args} key={`checkinput-${name}-${index}`} span={op.span||span} data={value[index]} option={op} onCheck={handleCheck(index)} onChange={handleInput(index)}/>
      ))}
    </Row>
  )
}


