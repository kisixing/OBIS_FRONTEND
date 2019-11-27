import React, { Component } from "react";
import { Row, Col, Button, message, Table, Modal, Spin, Tree } from 'antd';

import {events, types, editors, valid as validFn} from './common';

import './table.less';


class TableItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      force: false,
      error: ''
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props.value !== newProps.value){
      this.state.value = newProps.value;
      this.state.error = validFn(newProps.valid, newProps.value);
    }
  }

  componentDidMount(){
    this.refs.tableItem.parentNode.ondbclick = ()=>this.setState({force:true});
  }

  onDbClick = () => {
    this.setState({force:true}, ()=>{
      const input = this.refs.tableItem.querySelector(types.join());
      if(input)input.focus();
    });
  }

  onChange = (e, value) => {
    return new Promise(resolve=>{
      this.setState({
        value: value
      },resolve);
    });
  }

  onBlur = (e) => {
    const { valid, onChange } = this.props;
    const { value } = this.state;
    const error = validFn(valid, value);
    this.setState({
      force: !!error,
      error: error
    });
    if(!error){
      onChange(e, value)
    }
  }

  format(){
    const { format = i=>i, options } = this.props;
    const { value } = this.state;
    let result = '';
    if(options instanceof Array){
      const option = options.filter(op=>(op.value||op)==value).pop();
      result = option ? (option.label || option) : '';
    }

    return format(result || value);
  }

  render(){
    const { type, format = i=>i, editable, ...props } = this.props;
    const { value, error, force } = this.state;
    const editor = editors[type] || type;
    return (
      <span ref="tableItem" title={error} onDoubleClick={this.onDbClick.bind(this)} className={`table-item ${(force&&'table-force') || (error&&'table-error') || ''}`}>
        {
          editable && (typeof editor === 'function') && force?editor({...props, value, onChange: this.onChange.bind(this), onBlur: this.onBlur.bind(this)}):this.format()
        }
      </span>
    );
  }
}


function getheades(columns, level = 0){
  const nextColumns = Array.prototype.concat.apply([], columns.map(k=>k.children||[k]));
  const childrenCount = column =>{
    if(column.children){
      return column.children.map(cl=>childrenCount(cl)).reduce((p,c)=>p+c);
    }
    return 1;
  }
  columns.forEach(column=>{
    column.level = column.level !== undefined ? column.level : level;
    column.span = childrenCount(column);
  });
  if(nextColumns.length !== columns.length){
    return [columns, ...getheades(nextColumns, level+1)]
  }
  return [columns]
}

export default function(keys, data, {onChange, className, editable, ...props}){
  const dataSource = data ? data : [];
  const rows = getheades(keys);
  const columns = rows[rows.length-1].map(({key, title, width, ...rest}, column)=>{
    return {
      key: key,
      dataIndex: key,
      title: title,
      width: width || 80,
      render(value, item, row) {
        if (row < rows.length) {
          const { title, span,level,children} = item[column] || {};
          return {
            children: title,
            props:{
              colSpan: title?span:0,
              rowSpan: level !== row?0:(children?1:rows.length-row)
            }
          }
        }
        const handleChange = (e, value) =>{
          item[key] = value;
          onChange(e,{item,value,key,row,column});
        }
        return <TableItem {...rest} editable={editable} value={value} onChange={handleChange}/>
      }
    }
  });
  return (
    <Table {...events(props)} className={`table-render ${className}`} size="small" bordered={true} dataSource={rows.concat(dataSource)} showHeader={false} columns={columns} />
  );
}


