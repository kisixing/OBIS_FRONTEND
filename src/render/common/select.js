import React, { Component } from "react";
import { Select } from 'antd';

export function select({
  name,
  options,
  width,
  value = "",
  onChange,
  onBlur = () => {},
  style,
  autoInsert,
  dropdownMatchSelectWidth = false,
  ...props
}) {
  const getValue = () => {
    if(value && Object.prototype.toString.call(value) === '[object Object]'){
      return value.value;
    }
    if(value && Object.prototype.toString.call(value) === '[object Array]'){
      return value.map(v => v.value);
    }
    return value;
  };
  const handleChange = e => {
    // 新增支持多选
    if(Object.prototype.toString.call(e) === '[object Array]'){
      let r = e.map(v => options.filter(o=>o.value==v).pop());
      onChange(e, r).then(()=>onBlur({checkedChange:true}));
    }else{
      // 一般对象
      onChange(e, options.filter(o=>o.value==e).pop()).then(()=>onBlur({checkedChange:true}));
    }
  };
  const handleSearch = e => {
    if(e) {
      autoInsert ? onChange(e, e).then(() =>  {}) : null;  
    }
  };
  const handleBlur = e => {
    onBlur({ checkedChange: true })
  };
  return (
    <Select
      {...props}
      value={getValue()}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      onBlur={handleBlur}
      style={style}
    >
      {options.map(o => (
        <Select.Option key={o.value} value={o.value}>
          {o.label}
        </Select.Option>
      ))}
    </Select>
  );
}

export function combobox(props){
  return select({...props, showSearch: true, combobox: true, showArrow: false})
}

