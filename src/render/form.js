import React, { Component } from "react";
import { Row, Col, Button, message, Table, Modal, Spin, Tree } from 'antd';

import {events, editors, valid as validFn} from './common';
import table from './table';

import './form.less';

function render(type, props){
  const editor = editors[type] || editors[type.replace(/-.*$/,'$x')] || type;
  if(typeof editor === 'function' ){
    return editor(props, /-(.*)$/.test(type)&&/-(.*)$/.exec(type)[1]);
  }
  if(editor === 'table'){
    const {options, value=[{}], ...rest} = props;
    return table(options, value, rest);
  }
  if(editor){
    if(/^:/.test(editor)){
      return editor.replace(/^:/,'');
    }
    console.log('没有找到可用的编辑组件：' + editor);
  }
  return null;
}

const AddResize = (function(fn){
  var fnList = [];
  window.onresize = function() {
    fnList.forEach(fn=>fn());
  };
  return function(fn){
    fn();
    fnList.push(fn);
    return function(){
      fnList = fnList.filter(f=>f!==fn);
    };
  };
})();



class FormItem extends Component{
  constructor(props){
    super(props);
    const { entity, type, name = '' } = props;
    const field = name.replace(/\(.*\)/,'').replace(/\[.*\]/,'');
    
    this.state = {
      name: field,
      width: 0,
      label: /\[.*\]/.test(name) && /\[(.*)\]/.exec(name)[1],
      unit: /\(.*\)/.test(name) && /\((.*)\)/.exec(name)[1],
      value: entity[field],
      dirty: false,
      error: ''
    }
  }

  resize(){
    const { width } = this.props;
    const { formItem, formItemlabel = {}, formItemEditor, formItemUnit = {}} = this.refs;
    
    if(formItemEditor){
      setTimeout(()=>{
        const panelWidth = Math.min(formItem.offsetWidth, width || formItem.offsetWidth);
        const editorWidth = panelWidth - (formItemlabel.offsetWidth||0) - (formItemUnit.offsetWidth||0) - 4;
        formItemEditor.style.width = editorWidth +'px';
        this.setState({
          width: editorWidth
        });
      }, 0);
    }
  }

  componentDidMount(){
    this.componentWillUnmount = AddResize(()=>this.resize())
  }

  componentWillReceiveProps(newProps){
    const { name } = this.state;
    if(this.props.entity[name] !== newProps.entity[name]){
      this.state.value = newProps.entity[name];
      this.state.error = validFn(newProps.valid, newProps.entity[name]);
    }
  }

  onChange = (e, value) => {
    return new Promise(resolve=>{
      this.setState({
        value: value
      },resolve);
    });
  }

  onBlur = (e) => {
    const { entity, valid, onChange } = this.props;
    const { name, value } = this.state;
    const error = validFn(valid, value);
    this.setState({
      error: error
    });
    if(JSON.stringify(entity[name]) !== JSON.stringify(value)){
      onChange(e, {name, value, error})
    }
  }

  renderEditor(){
    const { type, valid, onChange, ...props} = this.props;
    const {  name, value, width } = this.state;
    this.editor = editors[type] || type;
    if(type instanceof Array){
      const span = Math.floor(24/type.length);
      const data = value || [];
      const handleChange = i => (e, v) => {data[i] = v; return this.onChange(e, data);};
      return (
        <Row type="flex">
          {type.map((t,index)=>{
            const tType = (t.type||t).replace(/\(.*\)/,'');
            const tUnit = /\(.*\)/.test(t.type||t) && /\((.*)\)/.exec(t.type||t)[1];
            const tWidth = width*(t.span || span)/24 - ((index+1<type.length||tUnit)?8:0);
            return (
              <Col span={t.span || span} key={`col-${name}${index}`}>
                {render(tType, {...props, ...t, name: `${name}${index}`, value:data[index],style:{width:tWidth}, onChange: handleChange(index), onBlur: this.onBlur.bind(this)})}
                {tUnit?tUnit:null}
              </Col>
          )})}
        </Row>
      )
    }
    return render(type, {...props, name, value, width, onChange: this.onChange.bind(this), onBlur: this.onBlur.bind(this)});
  }

  render(){
    const { valid } = this.props;
    const { name, label, unit, value, error } = this.state;
    
      return (
        <div ref="formItem" className={`form-item ${name} ${error&&/\*/.test(error)?'form-error':`${error&&'form-warn'||''} ${value&&'is-not-empty' ||''}`}`}>
          {label?<div ref="formItemlabel" className="form-label">
            {/required/.test(valid)?<span className="colorRed">*</span>:null}
            <span>{label}:&nbsp;</span>
          </div>:null}
          <div className="form-content">
            <div ref="formItemEditor">{this.renderEditor()}</div>
            {unit?<div ref="formItemUnit" className="form-unit">{unit}</div>:null}
            {error?<div className="form-message">{error}</div>:null}
          </div>
        </div>
      );
    
  }
}

/**
 * 由配置构建表单内容
 * entity 数据
 * config 的结构 
 * {
 *    children:[ //是行
 *        {className:作用于行上, (其他属性）作用于当前编辑组件},
 *        {
 *          children: [ //是列
 *              {className: 作用于列, span: 作用于列, (其他属性)作用于当前编辑组件}
 *          ]
 *        }
 *    ]             
 * }
 * 这里所有的其他属性会传递到 FormItem 里面
 * onChange 数据修改的处理
 * 第四个参数是附加到form表单的属性
 */
export default function(entity, config, onChange, {children, ...props}={}){
  return (
    <form {...events(props)}>
        {render(config)}
        {children}
    </form>
  );
  
  function foreach(list, type, path){
    return list.map((rc, index) => {
      if(!rc ||(rc.filter&&!rc.filter(entity))){return null;}
      const { span, label, className, ...rest } = (typeof rc === 'object' ? rc : {});
      const key = `${path}-${type[0]}${index}`;
      const props = {
        key: key,
        className: `form-${type} ${className} ${key}`
      }
      let Wapper = null;
      if(type === 'row'){
        props.type = type || 'flex';
        Wapper = Row;
      }else{
        props.span = span || 24;
        Wapper = Col;
      }
      if(typeof rc !== 'object'){
        return (
          <Wapper {...props}>
            <strong>{rc}</strong>
            <div style={{clear:'both'}}></div>
          </Wapper>
        );
      }
      return (
        <Wapper {...props}>
          {!rest.type&&label?<label className={`${type}-label`}>{label||''}</label>:null}
          {!rest.type&&rest.text?<div className={`${type}-text`}>{rest.text||''}</div>:null}
          {render(rest, key)}
          <div style={{clear:'both'}}></div>
        </Wapper>
      );
    });
  }

  function render(option, path = 'entity') {
    if(option.rows){
      return foreach(option.rows, 'row', path)
    }
    if(option.columns){
      return foreach(option.columns, 'column', path)
    }
    if(option.type){
      return <FormItem entity={entity} onChange={onChange} {...option}/>
    }
    return null;
  }
}
