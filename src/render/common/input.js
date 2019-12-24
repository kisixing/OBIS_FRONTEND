import React, { Component } from "react";
import { Row, Col, Button, Input, Checkbox, Select, DatePicker } from 'antd';

export function input({onChange, onBlur, value, ...props}){
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
    <Input {...props} title={value} value={value} onChange={handleChange} onBlur={e=>onBlur(e)}/>
  )
}

export function textarea(prop){
  return input({...prop,type:'textarea',rows:3})
}

export function checkbox({onChange, onBlur, value, ...props}){
  const handleChange = (e,value) => {
    onChange(e, `${value}`).then(()=>onBlur())
  };
  return (
    <Checkbox {...props} value={value} checked={value=='true'||value===true} onChange={e=>handleChange(e, e.target.checked)}></Checkbox>
  )
}

/**
 * input-5 这个表示有5个输入框
 * input-number 表示有一个number的输入框
 * input-s1&s2&s3 表示有3个输入框，placeholder分别为s1,s2,s3
 */
export function input$x({name, onChange, onBlur, value, width, ...props}, count = ''){
  if(/^[a-zA-z]+$/.test(count)){
    return input({name, onChange, value, width, ...props, type: count});
  }
  const data = value || [];
  const childWidth = (width-4)/(+count) -5;
  const handleChange = (e, index) => {
    data[index] = e.target.value;
    onChange(e, data);
  }

  const handleBlur = index => e => {
    return onBlur(e, `${index}`)
  }

  let placeholders = [];
  if(/^\d+$/.test(count)){
    placeholders = Array(+count).fill('');
  } else {
    placeholders = count.split('&');
  }

  if (typeof data !== 'object') {
    return <strong>{name} 的数据应该为数组或类数组，而当前是 {data}</strong>;
  }

  return (
    <div className="inputxxx">
      {placeholders.map((v,index)=>(
        <Input {...props} key={`inputxxx-${name}-${index}`} style={{width:childWidth}} placeholder={v} value={data[index]} onChange={e=>handleChange(e,index)} onBlur={handleBlur(index)} />
      ))}
    </div>
  )
}
