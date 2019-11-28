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

export function checkinput(props){
  const { name, options = [], onChange, onBlur, value = [], ...rest } = props;
  const span = Math.max(6, 24 / (options.length || 1));
  
  const handleCheck = (e,index) => {
    value[index][0] = e.target.checked;
    onChange(e,value).then(()=>onBlur());
  }

  const handleInput = (e,index) => {
    value[index][1] = e.target.value;
    onChange(e,value);
  }

  options.forEach((v,i)=>value[i]=value[i]||[]);

  return (
    <Row>
      {options.map((op,index)=>{
        var data = value[index] || [];
        return (
          <Col span={op.span||span} key={`checkinput-${name}-${index}`}>
            <Checkbox value={op.value||op} checked={!!data[0]} onChange={e=>handleCheck(e,index)}>{op.label||op}</Checkbox>
            {data[0]?<Input {...rest} style={{width:60}} value={data[1]} onChange={e=>handleInput(e,index)} onBlur={onBlur}/>:null}
          </Col>
        )
      })}
    </Row>
  )
}
