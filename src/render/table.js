import React, { Component } from "react";
import { Button, Table } from 'antd';

import {events, types, editors, valid as validFn} from './common';
import store from '../app/store';
import { openYCQAction } from '../app/store/actionCreators.js';

import './table.less';

const dateType = { CREATE:'CREATE', MODIFY:'MODIFY' };

class TableItem extends Component {
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
    const { iseditable = () => true, entity, row, name, value, onEdit, hasRecord, style } = this.props;
    const arr = ["cktizh", "ckzijzhz", "cktaix", "ckxianl", "ckgongg", "ckfuzh"];
    if (iseditable({entity, row, name, value}) && onEdit && !hasRecord) {
      if (arr.includes(name)) {
        this.setState({force:true});
      }
    }
    this.refs.tableItem.parentNode.ondbclick = ()=>this.setState({force:true});
    if(style) {
      this.refs.tableItem.parentNode.style.display = 'none';
    }
  }

  componentDidUpdate() {
    const { style } = this.props;
    if(style) {
      this.refs.tableItem.parentNode.style.display = 'none';
    }
  }

  onDbClick = () => {
    const { iseditable = ()=> true, entity, row, name, value, onEdit } = this.props;
    if(iseditable({entity, row, name, value})){
      this.setState({force:true}, ()=>{
        const input = this.refs.tableItem.querySelector(types.join());
        if(input)input.focus();
      });
      if(onEdit && name==="ckweek") {
        const action = openYCQAction(true);
        store.dispatch(action);
      }
    }
  }

  onChange = (e, value) => {
    if (typeof value === 'object') value = value.label;
    return new Promise(resolve => {
      this.setState({
        value: value
      }, resolve);
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
    if (!error) {
      onChange(e, value)
    }
  }

  format() {
    const { format = i => i, entity, name, row, options } = this.props;
    const { value } = this.state;
    const getLabel = (ls, v)=>{
      let result = '';
      if(ls instanceof Array){
        const option = ls.filter(op => (op.value || op) == v).pop();
        result = option ? (option.describe || option.label || option) : '';
      }
      return result;
    }

    return format(getLabel(options, value) || value, {row, entity, name, lookup: getLabel, format: v => getLabel(options, v)});
  }

  render(){
    const { type, format = i=>i, isEditor, editable, ...props } = this.props;
    const { value, error, force } = this.state;
    const editor = editors[type] || type;
    return (
      <span
        ref="tableItem"
        title={error}
        onDoubleClick={this.onDbClick.bind(this)}
        className={`table-item table-item-${type} ${(force && "table-force") ||
          (error && "table-error") ||
          ""}`}
      >
        {editable && typeof editor === "function" && (force || isEditor)
          ? editor({
              ...props,
              value,
              onChange: this.onChange.bind(this),
              onBlur: this.onBlur.bind(this)
            })
          : this.format()}
      </span>
    );
  }
}


class MTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  onRowClick(record) {
    const { onRowSave } = this.props;
    const {selected} = this.state;
    if(selected && record !== selected) {
      onRowSave(selected);
    }
    this.setState({selected: record});
  }

  rowClassName(record) {
    const {selected} = this.state;
    if(!record.$head) {
      return `table-content ${selected === record ? 'row-selected' : ''}`
    }else{
      return 'table-head';
    }
  }

  render() {
    const {selected} = this.state;
    const { buttons, buttonSize = "default", ...props } = this.props;
    return (
      <div>
        {buttons ? (
          <Button.Group style={{ marginBottom: "5px" }}>
            {buttons.map((btn, i) => (
              <Button
                key={`btn-${i}`}
                size={buttonSize}
                onClick={() => btn.fn(selected)}
                style={{
                  height: buttonSize === "default" ? "30px" : "initial",
                  fontSize: '14px'
                }}
              >
                {btn.title}
              </Button>
            ))}
          </Button.Group>
        ) : null}
        <Table
          {...props}
          onRowClick={row => this.onRowClick(row)}
          rowClassName={row => this.rowClassName(row)}
        />
      </div>
    );
  }
}

function getheades(columns, level = 0) {
  const nextColumns = Array.prototype.concat.apply([], columns.map(k => k.children || [k]));
  const childrenCount = column => {
    if(column.children){
      return column.children.map(cl => childrenCount(cl)).reduce((p,c) => p + c);
    }
    return 1;
  }
  columns.forEach(column => {
    column.level = column.level !== undefined ? column.level : level;
    column.span = childrenCount(column);
  });
  if (columns.filter(i => i.children && i.children.length).length) {
    return [columns, ...getheades(nextColumns, level + 1)]
  }
  return [columns];
}

export default function(
  keys,
  data,
  {
    onChange = () => {},
    onRowChange,
    className,
    editable,
    ...props
  }) {
  const dataSource = data ? data.filter(i => i && typeof i === 'object') : [];
  const rows = getheades(keys);
  const columns = rows[rows.length-1].map(({key, title, width, holdeditor, ...rest}, column)=>{
    return {
      key: key,
      dataIndex: key,
      title: title,
      width: width || 80,
      render(value, item, row) {
        if (row < rows.length) {
          const { title, span,level,children} = rows[row][column] || {};
          return {
            children:<span dangerouslySetInnerHTML={{__html: title}}></span>,
            props:{
              colSpan: title?span:0,
              rowSpan: level !== row?0:(children?1:rows.length-row)
            }
          }
        }
        const handleChange = (e, value) => {
          if(item[key] !== value){
            item[key] = value;
            item.$type = item.$type || dateType.MODIFY;
            onChange(e,{item,value,key,row:row-rows.length,column});
            if(item.$type === dateType.MODIFY){
              item.$type = '';
              onRowChange('modify', item, row-rows.length);
            }
          }
        }
        if(dataSource.length >  1 && row > 1 && item.pregnum && row <= dataSource.length) {
          const numArr = [15, 16, 17, 18, 19, 20];
          if ((row === 2 && item.pregnum === dataSource[row - 1].pregnum && !numArr.includes(column)) ||
          (row > 2 && item.pregnum === dataSource[row - 1].pregnum && item.pregnum !== dataSource[row - 3].pregnum && !numArr.includes(column))) {
            return {
              children: <TableItem
                {...props}
                {...rest}
                row={row-rows.length}
                entity={item}
                name={key}
                editable={editable}
                value={value}
                isEditor={holdeditor || item.$type===dateType.CREATE}
                onChange={handleChange}
              />,
              props:{
                rowSpan: item.births
              }
            }
          } else if ((row !== 2 && item.pregnum === dataSource[row - 3].pregnum && !numArr.includes(column)) || 
                    (row !== 2 && item.pregnum === dataSource[row - 3].pregnum && item.pregnum === dataSource[row - 1].pregnum && !numArr.includes(column))) {
            return {
              children: <TableItem
                {...props}
                {...rest}
                row={row-rows.length}
                entity={item}
                name={key}
                editable={editable}
                value={value}
                isEditor={holdeditor || item.$type===dateType.CREATE}
                onChange={handleChange}
                style={{display: 'none'}}
              />,
              props:{
                rowSpan: 1
              }
            }
          }
        }
        return (
          <TableItem
            {...props}
            {...rest}
            row={row-rows.length}
            entity={item}
            name={key}
            editable={editable}
            value={value}
            isEditor={holdeditor || item.$type===dateType.CREATE}
            onChange={handleChange}
          />
        );
      }
    }
  });
  const extendProps = {
    onRowSave: item =>
      item.$type && onRowChange("modify", item, dataSource.indexOf(item)),
    buttons: [
      {
        title: "添加",
        fn: () => onRowChange("create", { $type: dateType.CREATE })
      },
      { title: "删除", fn: item => onRowChange("delete", item) }
    ]
  };
  return (
    <MTable
      {...extendProps}
      {...events(props)}
      loading={!data}
      className={`table-render ${className}`}
      size="small"
      bordered={true}
      dataSource={Array(rows.length)
        .fill({ $head: true })
        .concat(dataSource)}
      showHeader={false}
      columns={columns}
      head={rows}
    />
  );
}
