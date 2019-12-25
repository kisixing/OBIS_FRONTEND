import React, { Component } from "react";
import { Row, Col, Button, Input, Table, Select, DatePicker } from 'antd';

export function select({ name, options, width, value='', onChange, onBlur=()=>{}, ...props }){
  const getValue = () => {
    if(value && typeof value === 'object'){
      return value.value;
    }
    return value;
  }
  const handleChange = e => {
    onChange(e, options.filter(o=>o.value==e).pop()).then(()=>onBlur({checkedChange:true}));
  }

  return (
    <Select {...props} value={getValue()} options={options} onChange={handleChange}>
      {options.map(o => <Select.Option key={`${name}-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
    </Select>
  )
}

export function combobox(props){
  return select({...props, showSearch:true, combobox:true, showArrow:false})
}

