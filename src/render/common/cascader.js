import React from 'react';
import { Cascader } from 'antd';
const val = ["北京市", "市辖区", "东城区"];

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
     const getValue = e => {
       if (e && typeof e === "object") {
         // 数组
         return e;
       }
       if (e && typeof e === "string") {
         // 字符串，空格符隔开
         const v = e.split(' ');
         return v;
       }
       return null;
     };

     const handleChange = e => {
       onChange('', e, onBlur({ checkedChange: true }))
     };

     return (
       <Cascader
         {...props}
         options={options}
         value={getValue(value)}
         expandTrigger="hover"
         onChange={handleChange}
         placeholder={placeholder}
         style={{ fontSize: "16px" }}
       />
     );
   }
