import React, { Component } from "react";
import { Row, Col, Button, Input, Table, Select, DatePicker } from 'antd';

class MSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      search: ''
    }
  }
  handleClick = (e) => {
    const { onClick } = this.props;
    new Promise(resolve=>onClick(e, ()=>resolve())).then(()=>{
      this.refs.panel.querySelector('button').focus();
    });
  };
  renderSearch(){
    const { options } = this.props;
    const { search } = this.state;
    if(options.filter(op=>op.label===search).length){
      return null;
    }
    return (
      <Select.Option key={`search-${search}`} value={search}>{search}</Select.Option>
    );
  }
  render(){
    const { children, ...props } = this.props;
    return (
      <Select {...props} onSearch={search=>this.setState({search})}>
        {this.renderSearch()}
        {children}
      </Select>
    )
  }
}

export function select({ name, options, width, onChange, ...props }){
  return (
    <MSelect {...props} options={options} onChange={e => onChange(e, e)}>
      {options.map(o => <Select.Option key={`${name}-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
    </MSelect>
  )
}