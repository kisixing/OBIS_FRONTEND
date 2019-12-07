import React, { Component } from "react";
import { Row, Col, Button, Input, Checkbox, Select, DatePicker } from 'antd';

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

export function checkbox({onChange, onBlur, value, ...props}){
  const handleChange = (e,value) => {
    onChange(e,value).then(()=>onBlur())
  };
  return (
    <Checkbox {...props} value={value} checked={!!value} onChange={e=>handleChange(e, e.target.checked)}></Checkbox>
  )
}

/**
 * input-5 这个表示有5个输入框
 * input-number 表示有一个number的输入框
 */
export function input$x({name, onChange, value, width, ...props}, count){
  if(!/^\d+$/.test(count)){
    return input({name, onChange, value, width, ...props, type: count});
  }
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
