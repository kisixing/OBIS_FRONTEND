import React, { Component } from "react";
import { Row, Col, Button, Input, Table, Select, DatePicker } from 'antd';

class MDatePicker extends Component {
  constructor(props){
    super(props);
  }
  handleChange = (e,value) => {
    const { onChange } = this.props;
    onChange(e,value);
    this.refs.panel.querySelector('input').focus();
  };
  render(){
    const {mode, ...props} = this.props;
    let Wapper = DatePicker;
    if(mode === 'ym'){
      Wapper = DatePicker.MonthPicker;
    } else if(mode === 'range'){
      Wapper = DatePicker.RangePicker;
    }
    return (
      <span ref="panel">
        <Wapper {...props} onChange={this.handleChange}/>
      </span>
    )
  }
}

/**
 * mode 可选值 为ym月份选择器，range范围选择器
 */
export function date({onChange, onBlur, ...props}){
  const handleChange = (e,value) => {
    onChange(e,value).then(()=>onBlur())
  };
  return (
    <MDatePicker {...props} onChange={handleChange}/>
  )
}