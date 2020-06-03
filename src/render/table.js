import React, { Component } from "react";
import { Button, Table, message } from 'antd';
import service from '../service';
import {events, types, editors, valid as validFn} from './common';
import store from '../app/store';
import { openYCQAction, getYCQAction } from '../app/store/actionCreators.js';

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
    const { iseditable = () => true, entity, row, name, value, onEdit, hasRecord, isTwins } = this.props;
    if(this.props.value !== newProps.value){
      this.state.value = newProps.value;
      this.state.error = validFn(newProps.valid, newProps.value);
    }
    if (iseditable({entity, row, name, value}) && onEdit && !hasRecord) {
      if(isTwins && (name === "allTaix" || name === "allXianl")) {
        this.setState({force:false});
      }
    }
  }

  componentDidMount(){
    const { iseditable = () => true, entity, row, name, value, onEdit, hasRecord, style, isTwins } = this.props;
    const arr = ["ckzijzhz", "allTaix", "allXianl", "ckgongg", "ckfuzh"];
    if (iseditable({entity, row, name, value}) && onEdit) {
      if (arr.includes(name)) {
        this.setState({force:true});
      }
      if(isTwins && (name === "allTaix" || name === "allXianl")) {
        this.setState({force:false});
      }
    }
    this.refs.tableItem.parentNode.ondbclick = ()=>this.setState({force:true});
    if(style) {
      this.refs.tableItem.parentNode.style.display = 'none';
    }
  }

  componentDidUpdate() {
    const { style, isPreghiss } = this.props;
    if (isPreghiss) {
      if(style) {
        this.refs.tableItem.parentNode.style.display = 'none';
      }else {
        this.refs.tableItem.parentNode.style.display = 'table-cell';
      }
    }
  }

  onDbClick = () => {
    const { iseditable = ()=> true, type, entity, row, name, value, onEdit, isTwins, onDBClick, isPreghiss } = this.props;
    if(onDBClick) {
      return onDBClick(entity);
    }
    if(iseditable({entity, row, name, value})){
      if(isTwins && (name === "allTaix" || name === "allXianl")) {
        this.setState({force:false});
        return;
      }
      this.setState({force:true}, ()=>{
        if (type !== 'editableSelect') {
          const input = this.refs.tableItem.querySelector(types.join());
          if(input) input.focus();
        } else {
          this.refs.tableItem.querySelector('input').focus();
        }
      });
      if(onEdit && name==="ckweek") {
        service.fuzhen.getGesweekForm().then(res => {
          service.fuzhen.autoGesweekForm(res.object).then(res => {
            const getAction = getYCQAction(res.object);
            store.dispatch(getAction);
            const openAction = openYCQAction(true);
            store.dispatch(openAction);
          })
        })
      }
      if (isPreghiss && name === "births") {
        message.info('胎数自动生成不可修改，请选择某行点击删除按钮，或添加同年月的记录来增加胎数。', 5);
      }
    }
  }

  onChange = (e, value) => {
    const { entity, name, isPreghiss } = this.props;
    if (typeof value === 'object') value = value.label;
    // let bool = false;
    // if(isPreghiss) {
    //   let threeCount = 0;
    //   let fourCount = 0;
    //   if (!!entity.zir) threeCount++;
    //   if (!!entity.reng) threeCount++;
    //   if (!!entity.yinch) threeCount++;

    //   if (!!entity.zaoch) fourCount++;
    //   if (entity.zuych === 'true') fourCount++;
    //   if (entity.shunch === 'true') fourCount++;
    //   if (!!entity.shouShuChanType) fourCount++;

    //   if( (name === 'zir' && value && fourCount > 0) || 
    //       (name === 'reng' && value && fourCount > 0) ||
    //       (name === 'yinch' && value && fourCount > 0) ) {
    //       message.error('早产、足月产、顺产、手术产式中已有数据！', 4);
    //       bool = true;
    //   }

    //   if( (name === 'zaoch' && value  && threeCount > 0) || 
    //       (name === 'zuych' && value === 'true' && threeCount > 0) ||
    //       (name === 'shunch' && value === 'true' && threeCount > 0) ||
    //       (name === 'shouShuChanType' && value && threeCount > 0) ) {
    //       message.error('自然流产、人工流产、引产中已有数据！', 4);
    //       bool = true;
    //   }

    //   if (name === 'zir' && value && (entity.reng || entity.yinch)) {
    //     message.error('人工流产、引产中已有数据！', 4);
    //     bool = true;
    //   } 
    //   if (name === 'reng' && value && (entity.zir || entity.yinch)) {
    //     message.error('自然流产、引产中已有数据！', 4);
    //     bool = true;
    //   }
    //   if (name === 'yinch' && value && (entity.zir || entity.reng)) {
    //     message.error('自然流产、人工流产中已有数据！', 4);
    //     bool = true;
    //   }

    //   if (name === 'zaoch' && value && entity.zuych === 'true') {
    //     message.error('足月产已有数据！', 4);
    //     bool = true;
    //   }
    //   if (name === 'zuych' && value === 'true' && entity.zaoch)  {
    //     message.error('早产已有数据！', 4);
    //     bool = true;
    //   }

    //   if (name === 'shunch' && value === 'true' && entity.shouShuChanType) {
    //     message.error('手术产式已有数据！', 4);
    //     bool = true;
    //   }
    //   if (name === 'shouShuChanType' && value && entity.shunch === 'true') {
    //     message.error('顺产已有数据！', 4);
    //     bool = true;
    //   }
    // }
    // if (bool) return new Promise(resolve => resolve);

    return new Promise(resolve => {
      this.setState({
        value: value
      }, resolve);
    });
  }

  onBlur = (e) => {
    const { valid, onChange, name, entity, isPreghiss, onEdit } = this.props;
    const { value } = this.state;
    const arr = ["ckzijzhz", "allTaix", "allXianl", "ckgongg", "ckfuzh"];
    const error = validFn(valid, value);

    if(isPreghiss) {
      let threeCount = 0;
      let fourCount = 0;
      if (entity.zir === 'true') threeCount++;
      if (entity.reng === 'true') threeCount++;
      if (entity.yinch === 'true') threeCount++;

      if (entity.zaoch === 'true') fourCount++;
      if (entity.zuych === 'true') fourCount++;
      if (entity.shunch === 'true') fourCount++;
      if (!!entity.shouShuChanType) fourCount++;

      if( (name === 'zir' && value === 'true' && fourCount > 0) || 
          (name === 'reng' && value === 'true' && fourCount > 0) ||
          (name === 'yinch' && value === 'true' && fourCount > 0) ) {
          message.error('早产、足月产、顺产、手术产式中已有数据！', 4);
      }

      if( (name === 'zaoch' && value === 'true'  && threeCount > 0) || 
          (name === 'zuych' && value === 'true' && threeCount > 0) ||
          (name === 'shunch' && value === 'true' && threeCount > 0) ||
          (name === 'shouShuChanType' && value && threeCount > 0) ) {
          message.error('自然流产、人工流产、引产中已有数据！', 4);
      }

      if (name === 'zir' && value === 'true' && (entity.reng === 'true' || entity.yinch === 'true')) {
        message.error('人工流产、引产中已有数据！', 4);
      } 
      if (name === 'reng' && value === 'true' && (entity.zir === 'true' || entity.yinch === 'true')) {
        message.error('自然流产、引产中已有数据！', 4);
      }
      if (name === 'yinch' && value === 'true' && (entity.zir === 'true' || entity.reng === 'true')) {
        message.error('自然流产、人工流产中已有数据！', 4);
      }

      if (name === 'zaoch' && value === 'true' && entity.zuych === 'true') {
        message.error('足月产已有数据！', 4);
      }
      if (name === 'zuych' && value === 'true' && entity.zaoch === 'true')  {
        message.error('早产已有数据！', 4);
      }

      if (name === 'shunch' && value === 'true' && entity.shouShuChanType) {
        message.error('手术产式已有数据！', 4);
      }
      if (name === 'shouShuChanType' && value && entity.shunch === 'true') {
        message.error('顺产已有数据！', 4);
      }
    }

    if(!value && arr.includes(name) && onEdit) {
      this.setState({force: true})
    } else if (value==="脐下指" && name==="ckgongg") {
      // 宫高光标定位
      const ipt = this.refs.tableItem.querySelector('input');
      ipt.setSelectionRange(2, 2);
      this.setState({force: true});
    }else {
      this.setState({
        force: !!error,
        error: error
      });
    }
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
        title={value}
        onClick={this.onDbClick.bind(this)}
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
      selected: null,
      rowIndex: null
    }
  }

  onRowClick(record, index) {
    const { onRowSave, onRowClick } = this.props;
    const {selected} = this.state;
    if(selected && record !== selected) {
      onRowSave(selected);
    }
    this.setState({selected: record, rowIndex: index});
    if(onRowClick) return onRowClick(record, index);
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
    const { selected, rowIndex } = this.state;
    const { buttons, buttonSize = "default", ...props } = this.props;
    return (
      <div>
        {buttons ? (
          <div className="table-btns">
            {buttons.map((btn, i) => (
              <Button
                key={`btn-${i}`}
                icon={btn.title === '添加' ? 'plus-circle-o' : 'delete'}
                size={buttonSize}
                onClick={() => btn.fn(selected, rowIndex)}
                className={btn.title === '添加' ? 'btn-add' : 'btn-delete'}
              >
                {btn.title}
              </Button>
            ))}
          </div>
        ) : null}
        <Table
          {...props}
          onRowClick={(row, index) => this.onRowClick(row, index)}
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
    onRowChange = () => {},
    className,
    editable,
    isPreghiss,
    ...props
  }) {
  const dataSource = data ? data.filter(i => i && typeof i === 'object') : [];
  const rows = getheades(keys);
  const columns = rows[rows.length-1].map(({key, title, width, className, holdeditor, ...rest}, column)=>{
    return {
      key: key,
      dataIndex: key,
      title: title,
      width: width || 80,
      className: className,
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
              onRowChange('modify', item, row-rows.length, key);
            }
          }
        }
        if(isPreghiss && dataSource.length >  1 && row > 1 && row <= dataSource.length && item.pregnum) {
          const numArr = [14, 15, 16, 17, 18, 19];
          if ((row === 2 && item.pregnum === dataSource[row - 1].pregnum && !numArr.includes(column)) ||
          (row > 2 && item.pregnum === dataSource[row - 1].pregnum && item.pregnum !== dataSource[row - 3].pregnum && !numArr.includes(column))) {
            let countNum = 0;
            dataSource.map(subItem => (
              subItem.pregnum == item.pregnum ? countNum++ : null
            ))
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
                isPreghiss={isPreghiss}
              />,
              props:{
                rowSpan: countNum
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
                isPreghiss={isPreghiss}
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
            isPreghiss={isPreghiss}
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
