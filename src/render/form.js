import React, { Component } from "react";
import { Row, Col, Button, message, Table, Modal, Spin, Tree } from 'antd';

import { events, editors, valid as validFn } from './common';
import table from './table';

import './form.less';

function render(type, props) {
  const editor = editors[type] || editors[type.replace(/(-.*)?$/, '$x')] || type;
  if (typeof editor === 'function') {
    return editor(props, /-(.*)$/.test(type) && /-(.*)$/.exec(type)[1], FormItem, AddResize);
  }
  if (editor === 'table') {
    const { options, value = [{}], onChange, onBlur, ...rest } = props;
    const onRowChange = (type, item, row) => {
      let list = value || [];
      switch (type) {
        case 'create':
          list.push(item);
          break;
        case 'modify':
          list[row] = item;
          break;
        case 'delete':
          list = list.filter(i => i !== item);
          break;
      }
      onChange({}, list).then(() => onBlur({}));
    }
    const headleChange = (e, { item, row }) => onRowChange('modify', item, row);
    return table(options, value, { ...rest, onChange: headleChange, onRowChange });
  }
  if (editor) {
    if (/^:/.test(editor)) {
      return editor.replace(/^:/, '');
    }
    if (!/^\**$/.test(editor)) {
      console.log('没有找到可用的编辑组件：' + editor);
    }
  }
  return null;
}

const AddResize = (function (fn) {
  var fnList = [];
  window.onresize = function () {
    fnList.forEach(fn => fn());
  };
  return function (fn) {
    fn();
    fnList.push(fn);
    return function () {
      fnList = fnList.filter(f => f !== fn);
    };
  };
})();



class FormItem extends Component {
  constructor(props) {
    super(props);
    const { entity = {}, name = '', label, unit } = props;
    const field = name.replace(/\(.*\)/, '').replace(/\[.*\]/, '');

    this.state = {
      name: field,
      width: 0,
      label: /\[.*\]/.test(name.replace(/\(.*\)/, '')) && /\[(.*)\]/.exec(name.replace(/\(.*\)/, ''))[1],
      unit: /\(.*\)/.test(name.replace(/\[.*\]/, '')) && /\((.*)\)/.exec(name.replace(/\[.*\]/, ''))[1],
      value: entity[field],
      dirty: false,
      error: ''
    }
  }

  resize() {
    const { width } = this.props;
    const { formItem, formItemlabel = {}, formItemEditor, formItemUnit = {} } = this.refs;

    if (formItemEditor) {
      setTimeout(() => {
        const panelWidth = Math.min(formItem.offsetWidth, width || formItem.offsetWidth);
        const editorWidth = panelWidth - (formItemlabel.offsetWidth || 0) - (formItemUnit.offsetWidth || 0) - 4;

        formItemEditor.style.width = editorWidth + 'px';
        this.setState({
          width: editorWidth
        });
      }, 0);
    }
  }

  componentDidMount() {
    this.componentWillUnmount = AddResize(() => this.resize())
    this.refs.formItem.fireReact = (type, ...args) => {
      return new Promise(resolve => {
        switch (type) {
          case 'valid':
            this.onBlur(...args).then(resolve)
            break;
          case 'reset':
            this.setState({
              dirty: false,
              error: ''
            }, resolve);
            break;
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    const { name } = this.state;
    const { entity, width } = this.props;

    if (!entity || (entity[name] !== newProps.entity[name])) {
      this.state.value = newProps.entity[name];
      this.state.error = validFn(newProps.valid, newProps.entity[name]);
    }
    if (width !== newProps.width) {
      this.resize();
    }
  }

  onChange = (e, value) => {
    return new Promise(resolve => {
      this.setState({
        value: value
      }, resolve);
    });
  }

  onBlur = (e) => {
    return new Promise(resolve => {
      const { entity, valid, onChange } = this.props;
      const { name, value } = this.state;
      const error = validFn(valid, value);
      this.setState({
        error: error
      }, () => resolve());
      if (onChange && JSON.stringify(entity && entity[name]) !== JSON.stringify(value)) {
        onChange(e, { name, value, error, entity })
      }
    });
  }

  renderEditor() {
    const { type, valid, onChange, ...props } = this.props;
    const { name, value, width } = this.state;
    this.editor = editors[type] || type;
    if (type instanceof Array) {
      const span = Math.floor(24 / type.length);
      const data = value || [];
      const handleChange = i => (e, v) => { data[i] = v; return this.onChange(e, data); };
      const types = type.map(t => ({
        ...t,
        type: (t.type || t).replace(/\(.*\)/, ''),
        unit: /\(.*\)/.test(t.type || t) && /\((.*)\)/.exec(t.type || t)[1] || t.unit
      }));
      const enitorWidth = width - types.filter(i => i.unit).length * 16;
      return (
        <Row type="flex">
          {types.map((t, index) => {
            const zoom = (t.span && t.span < 1) ? t.span : (t.span || span) / 24
            const tWidth = enitorWidth * zoom;
            return (
              <Col span={t.span || span} key={`col-${name}${index}`}>
                {render(t.type, { ...props, ...t, name: `${name}${index}`, value: data[index], style: { width: tWidth }, onChange: handleChange(index), onBlur: this.onBlur.bind(this) })}
                {t.unit ? t.unit : null}
              </Col>
            )
          })}
        </Row>
      )
    }
    return render(type, { ...props, name, value, width, onChange: this.onChange.bind(this), onBlur: this.onBlur.bind(this) });
  }

  render() {
    const { valid, icon } = this.props;
    const { name, label, unit, value, error } = this.state;

    return (
      <div ref="formItem" className={`form-item ${name} ${error && /\*/.test(error) ? 'form-error' : `${error && 'form-warn' || ''} ${!validFn('required', value) && 'is-not-empty' || ''}`}`}>
        {label ? <div ref="formItemlabel" className="form-label">
          {icon ? <i className={`anticon anticon-${icon}`}>&nbsp;</i> : null}
          {/required/.test(valid) ? <span className="colorRed">*</span> : null}
          <span>{label}:&nbsp;</span>
        </div> : null}
        <div className="form-content">
          <div ref="formItemEditor">{this.renderEditor()}</div>
          {unit ? <div ref="formItemUnit" className="form-unit">{unit}</div> : null}
          {error ? <div className="form-message">{error}</div> : null}
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
 * 每一项的数据 {
 *        name: name(unit)[label],
 *        icon: 显示在label前面的图表，以样式的方式呈现
 *        type：***为没有编辑器，其他为具体编辑器名称，可以是数组，方法或者字符串
 * }
 */
export default function (entity, config, onChange, { children, ...props } = {}) {
  if (!entity) {
    console.warn('entity最好不为空,否则可能导致保存不上');
  }
  return (
    <form {...events(props)}>
      {render(entity, onChange, config)}
      {children}
    </form>
  );

  function foreach(data, change, list, type, path) {
    return list.map((rc, index) => {
      if (!rc || (rc.filter && !rc.filter(entity))) { return null; }
      const { span, label, className, ...rest } = (typeof rc === 'object' ? rc : {});
      const key = `${path}-${type[0]}${index}`;
      const props = {
        key: key,
        className: `form-${type} ${className} ${key}`
      }
      let Wapper = null;
      if (type === 'row') {
        props.type = type || 'flex';
        Wapper = Row;
      } else {
        if (span && span < 1) {
          props.width = (span * 100).t + '%';
        }
        props.span = span || 24;
        Wapper = Col;
      }
      if (typeof rc !== 'object') {
        return (
          <Wapper {...props}>
            <strong>{rc}</strong>
            <div style={{ clear: 'both' }}></div>
          </Wapper>
        );
      }
      return (
        <Wapper {...props}>
          {!rest.type && label ? <label className={`${type}-label`}>{label || ''}</label> : null}
          {!rest.type && rest.text ? <div className={`${type}-text`}>{rest.text || ''}</div> : null}
          {render(data, change, rest, key)}
          <div style={{ clear: 'both' }}></div>
        </Wapper>
      );
    });
  }

  function render(data, change, option, path = 'entity') {
    if (option.rows) {
      return foreach(data, change, option.rows, 'row', path)
    }
    if (option.columns) {
      return foreach(data, change, option.columns, 'column', path)
    }
    if (option.groups) {
      const field = option.name.replace(/\(.*\)/, '').replace(/\[.*\]/, '');
      const list = data[field] || [{}];
      return list.map((group, index) => {
        const handleChange = (e, { name, value, ...rest }) => {
          list[index][name] = value;
          return change(e, { name: field, value: list, ...rest })
        }
        return render(group, handleChange, option.groups(index), `${path}-group${index}`)
      });
    }
    if (option.type) {
      const hanldChange = (...args) => Promise.resolve(change(...args)).then(()=>{
        console.log('************************');
        return option.onChange && option.onChange(...args);
      });
      return <FormItem {...option} entity={data} onChange={hanldChange} />
    }
    return null;
  }
}

/**
 * 触发当前dom下的所有验证/重置等操作
 */
export function fireForm(parentNode, type) {
  return new Promise(resolve => {
    Promise.all(Array.prototype.map.call(parentNode.querySelectorAll('.form-item'), el => el.fireReact(type))).then(function () {
      resolve(!parentNode.querySelector('.form-error'));
    })
  });
}

/**
 * 添加当前模块的编辑器,返回卸载器
 */
export function manageEditor(type, editor) {
  editors[type] = editor;
  return () => editors[type] = null;
}
