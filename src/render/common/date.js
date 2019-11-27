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
    return (
      <span ref="panel">
        <DatePicker {...this.props} onChange={this.handleChange}/>
      </span>
    )
  }
}

export function date({onChange, onBlur, ...props}){
  const handleChange = (e,value) => {
    onChange(e,value).then(()=>onBlur())
  };
  return (
    <MDatePicker {...props} onChange={handleChange}/>
  )
}