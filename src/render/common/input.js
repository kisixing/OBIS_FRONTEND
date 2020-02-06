import React, { Component } from "react";
import { Row, Col, Button, Input, Checkbox, Select, DatePicker, message } from 'antd';

export function input({onChange, onBlur, value, filterDate, ...props}){
  const handleChange = (e) => {
    if (value !== e.target.value) {
        if (onChange) {
            onChange(e, e.target.value)
        } else {
            console.log('miss onChange: ' + props.name);
        }
    }
  }
  const handleBlur = e => {
    if (filterDate) {
      const nowYear = new Date().getFullYear();
      const num1 = nowYear.toString().substring(0, 2);
      const num2 = nowYear.toString().substring(2);
      const iptValue = e.target.value.replace(/[^0-9]+/g, '');

      const getCentury = (v) => {
        const century = v > num2 ? num1 - 1 : num1;
        return century;
      }

      let finalDate = '', str1 = '', str2 = '';

      if(iptValue.length === 2) {
        finalDate = getCentury(iptValue) + iptValue;
      } else if (iptValue.length === 3) {
        str1 = iptValue.substring(0, 2);
        str2 = iptValue.substring(2);

        str1 = getCentury(str1) + str1;
        str2 = str2 > 10 ? str2 : '0' + str2;
        finalDate = str1 + '-' + str2;
      } else if (iptValue.length === 4) {
        str1 = iptValue.substring(0, 2);
        str2 = iptValue.substring(2);

        str1 = getCentury(str1) + str1;
        finalDate = str1 + '-' + str2;
      } else if (iptValue.length === 5) {
        str1 = iptValue.substring(0, 4);
        str2 = iptValue.substring(4);

        str1 = str1;
        str2 = str2 > 10 ? str2 : '0' + str2;
        finalDate = str1 + '-' + str2;
      } else if (iptValue.length === 6) {
        str1 = iptValue.substring(0, 4);
        str2 = iptValue.substring(4);

        finalDate = str1 + '-' + str2;
      } else {
        message.error('输入格式错误！');
        return;
      }

      onChange(e, finalDate)
      onBlur(e)
    } else {
      onBlur(e)
    }
  }
  return (
    <Input {...props} title={value} value={value} onChange={handleChange} onBlur={handleBlur}/>
  )
}

export function textarea(prop){
  return input({...prop,type:'textarea',rows:3})
}

export function checkbox({onChange, onBlur, value, ...props}){
  const handleChange = (e, value) => {
    onChange(e, `${value}`).then(()=>onBlur());
  };
  return (
    <Checkbox
      {...props}
      value={value}
      checked={value == "true" || value === true}
      onChange={e => handleChange(e, e.target.checked)}
    ></Checkbox>
  );
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
