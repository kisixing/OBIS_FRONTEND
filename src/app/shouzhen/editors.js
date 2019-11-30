import React, { Component } from "react";
import { Row, Col, Button, message, Table, Modal, Spin, Tree } from 'antd';
import {manageEditor} from '../../render/form';

export default function(){

  const editors = [manageEditor('shouzhenyy$x', shouzhenyy)]

  return () => editors.forEach(fn=>fn());
}

function shouzhenyy({value, onChange, onBlur}, count, FormItemComponent){
  const data = value || {};
  const options = count.split(',').map(i=>i.split('&'));
  const handleChange = (e, {name, value}) => {
    data[name] = value;
    onChange(e, data).then(()=>onBlur())
  }
  return (
    <Row>
      {options.map(([label,type='input'],index)=>{
        return (
          <Col span={Math.floor(24/options.length)}>
            <FormItemComponent type={type} entity={data} name={`${type}${index}${index===options.length-1?'())':''}[${index?'':'('}${label}]'`} onChange={handleChange}/>
          </Col>
        )
      })}
      <div style={{clear:'both'}}></div>
    </Row>
  )
}
