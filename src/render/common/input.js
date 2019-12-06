import React, { Component } from "react";
import { Row, Col, Button, Input, Table, Select, DatePicker } from 'antd';

export function input({onChange, value, ...props}){
  const handleChange = (e) => {
    if (value !== e.target.value) {
        if (onChange) {
            onChange(e, e.target.value)
        } else {
            console.log('miss onChange: ' + props.name);
        }
    }
  }
  return (
    <Input {...props} title={value} value={value} onChange={handleChange}/>
  )
}

export function textarea(prop){
  return input({...prop,type:'textarea',rows:3})
}

export function input$x({name, onChange, value, width, ...props}, count){
  const data = value || [];
  const childWidth = (width-4)/(+count) -5;
  const handleChange = (e, index) => {
    data[index] = e.target.value;
    onChange(e, data);
  }
  return (
    <div className="inputxxx">
      {Array(+count).fill(null).map((v,index)=>(
        <Input {...props} key={`inputxxx-${name}-${index}`} style={{width:childWidth}} value={data[index]} value={data[index]} onChange={e=>handleChange(e,index)}/>
      ))}
    </div>
  )
}
