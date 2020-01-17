import React from 'react';
import { Cascader } from 'antd';

export function cascader({
  name,
  options = [],
  width,
  value = "",
  onChange,
  placeholder = "请选择...",
  onBlur = () => {},
  ...props
}) {
     const getValue = () => {
       if (value && typeof value === "object") {
         return value.value;
       }
       return value;
     };

     return (
       <Cascader
         options={options}
         expandTrigger="hover"
         onChange={onChange}
         placeholder={placeholder}
         style={{ fontSize: "16px" }}
       />
     );
   }
