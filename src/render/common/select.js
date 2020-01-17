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
  ...props
}) {
  const getValue = () => {
    if (value && typeof value === "object") {
      return value.value;
    }
    return value;
  };
  const handleChange = e => {
    onChange(e, options.filter(o => o.value == e).pop()).then(() =>
      onBlur({ checkedChange: true })
    );
  };
  console.log('444444444444', style)
  return (
    <Select
      {...props}
      value={getValue()}
      options={options}
      onChange={handleChange}
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

