import React, { Component } from "react";
import { Row, Col, Checkbox, Input, Table, Select, DatePicker } from 'antd';

export function mix({value, options, width, ...props}){
  return (
    <Row>
        <Select {...props} />
        <Input/>
    </Row>
  )
}

/**
 * 
 * options里面的每一项可以有type,unit
 * 或者在label里面label(input)[unit]
 */
export function checkinput(props, count, FormItemComponent){
  const { name, options = [], onChange, onBlur, value = [], unselect, radio, ...rest } = props;
  const span = Math.max(6, 24 / ((options.length + !!unselect) || 1));
  
  const handleCheck = (e,index) => {
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

  const renderEditor = (data, op, change) => {
    const props = {type:'input',...rest,...op,name:op.unit?`value(${op.unit})`:'value'};

    return <FormItemComponent {...props} entity={data} onChange={change} />;
  }

  options.forEach((v,i)=>value[i]=value[i]||{});

  return (
    <Row>
      {unselect?(
      <Col span={span} key={`checkinput-${name}-unselect`}>
        <Checkbox checked={value.unselect} onChange={e=>handleUnselect(e)}>{unselect}</Checkbox>
      </Col>
      ):null}
      {options.map((op,index)=>{
        const data = value[index] || {};
        const label = (op.label||op).replace(/\((.*)\)/,'').replace(/\[.*\]/,'');
        const type = op.type || (/\((.*)\)/.test(op.label||op) && /\((.*)\)/.exec(op.label||op)[1]);
        const unit = op.unit || (/\[(.*)\]/.test(op.label||op) && /\[(.*)\]/.exec(op.label||op)[1]);
        return (
          <Col span={op.span||span} key={`checkinput-${name}-${index}`}>
            <Checkbox value={op.value||op} checked={data.checked} onChange={e=>handleCheck(e,index)}>{label}</Checkbox>
            {data.checked && type ? renderEditor(data, {...op,type, unit} , handleInput(index)):null}
          </Col>
        )
      })}
    </Row>
  )
}


