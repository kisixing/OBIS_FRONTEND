
import React from 'react';
import { Select, Input } from 'antd';

export function editableSelect({
  name,
  options,
  value,
  onChange,
  onBlur,
  ...props,
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
    onChange(e, options.filter(o=>o.value==e).pop()).then(()=>onBlur({checkedChange:true}));
  };
  const handleSearch = e => {
    let data = {"label": e.target.value, "value": e.target.value};
    onChange(e, data).then(() =>  {})  
  };
  const handleBlur = e => {
    onBlur({ checkedChange: true })
  };
  return (
    <div className="editable-wrapper" >
      <Select 
        className="editable-select" 
        value="" 
        {...props} 
        options={options} 
        onChange={handleChange} 
        onBlur={handleBlur}>
          {options.map(o => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
      </Select>
      <Input 
        className="editable-input" 
        value={getValue()} 
        onChange={handleSearch} 
        onBlur={handleBlur} />
    </div>
  )
}