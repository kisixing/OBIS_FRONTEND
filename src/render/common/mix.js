import React, { Component } from "react";
import { Row, Col, Checkbox, Input, Table, Select, DatePicker } from 'antd';

const getrealy = str => str.replace(/\((.*)\)/,'').replace(/\[.*\]/,'').replace(/\<(.*)\>/,'').replace(/\{(.*)\}/,'');

class MMix extends Component{
  constructor(props){
    super(props);
    const {option,baseColor} = props;
    const $label = option.label||option;
    const label = getrealy($label);
    const type = option.type || (/\((.*)\)/.test($label) && /\((.*)\)/.exec($label)[1]);
    const unit = option.unit || (/\[(.*)\]/.test($label) && /\[(.*)\]/.exec($label)[1]);
    const color = option.color || (/\{(.*)\}/.test($label) && /\{(.*)\}/.exec($label)[1]);
    const field = getrealy(option.value || option);
    this.state = {
      label,type,unit,field,width:0,color:color || baseColor
    };
  }

  componentDidMount(){
    const { field } = this.state;
    const {args:[,AddResize], option, data} = this.props;
    if(!option.wrap && !this.componentWillUnmount && data.hasOwnProperty(field)){
      setTimeout(()=>{
        this.componentWillUnmount = AddResize(()=>this.resize())
      })
    }
  }

  componentWillReceiveProps(newProps){
    const { field } = this.state;
    const {args:[,AddResize], option, data} = this.props;
    if(!option.wrap && !data.hasOwnProperty(field) && newProps.data.hasOwnProperty(field)){
      if(!this.componentWillUnmount){
        this.componentWillUnmount = AddResize(()=>this.resize())
      } else {
        this.resize();
      }
    }
  }

  resize(){
    const {checkboxInput} = this.refs;
    setTimeout(() => {
      if(checkboxInput && checkboxInput.parentNode){
        const width = checkboxInput.parentNode.offsetWidth - Array.prototype.map.call(checkboxInput.parentNode.children, el=>{
          return checkboxInput===el?0:el.offsetWidth;
        }).reduce((a,b)=>a+b) - 6;
        if(width>0){
          checkboxInput.style.width = width + 'px';
          this.setState({width});
        }
      }
    });
  }

  handleCheck(e){
    const {option, onCheck} = this.props;
    const {field} = this.state; 
    const {checkboxInput} = this.refs;
    onCheck(e,{checked:e.target.checked,name:field,option}).then(()=>{
      if(checkboxInput){
        var editor = checkboxInput.querySelector('input,select');
        if(editor){
          editor.focus();
        }
      }
    })
  }

  renderEditor([FormItemComponent, ]) {
    const { data, option, onChange } = this.props;
    const {field,type,unit,width} = this.state; 
    const props = {type:type||'input',...option,name:unit?`${field}(${unit})`:field};

    return <FormItemComponent {...props} width={width} entity={data} onChange={onChange} />;
  }

  render(){
    const {args, data, option, onCheck, onChange, span, baseColor, ...rest} = this.props;
    const {label,type,field,color} = this.state; 
    const showEditor = type && data.hasOwnProperty(field);
    const fontColor = data.hasOwnProperty(field) && (color || baseColor) || '';

    return (
      <Col {...rest} span={span * (1 + (showEditor?(/^\d+$/.test(option.addspan) ? option.addspan : 1):0))}>
        <Checkbox style={{color: fontColor}} value={field} checked={data.hasOwnProperty(field)} onChange={e=>this.handleCheck(e)}>{label}</Checkbox>
        <div ref="checkboxInput" style={{display:showEditor?'inline-block':'none'}}>
          {showEditor ? this.renderEditor(args):null}
        </div>
      </Col>
    )
  }
}

/**
 * count表示每一行最多可以排几个
 * options里面的每一项可以有type,unit
 * 或者在label里面label(input)[unit]<flag>{color}
 * wrap这个属性告诉编辑器是否编辑器不受限在一行
 * addspan 表示当前选项，当编辑框出来后增加的占位
 * flag 1.所有的!为互斥，2.!x与x为互斥，3.flag可以为多个以逗号分隔
 */
export function checkinput$x({ name, options = [], onChange, onBlur, value:data1 = [], unselect, radio, baseColor = '#333333', ...rest }, count, ...args){
  // const optionList = (unselect?[{label:unselect,value:'unselect',unselect:true}]:[]).concat(options);
  const optionList = (unselect?options.concat([{label:unselect,value:'unselect',unselect:true}]):options);
  const span = Math.floor(count ? (24/count) : Math.max(6, 24 / (optionList.length || 1)));
  
  const data = data1 ? (typeof data1.$data === 'object' ? data1.$data : {}) : {};
  const toData = () => {
    var result = Object.keys(data).filter(i => !/^\$/.test(i)).map(i => ({label:i, value: data[i], $value: data[`$${i}`]}));
    result.$data = data;
    return result;
  };
  if(data1 instanceof Array){
    data1.forEach(i => {
      data[i.label] = i.value;
      data[`$${i.label}`] = data[`$${i.label}`] || i.$value;
    });
  }else if(typeof data1 === 'object'){
    Object.keys(data1||{}).forEach(k=>data[k] = data1[k]);
    onChange({}, toData()).then(()=>onBlur());
  }
  
  const findWC = (op, fn) => {
    const getflag = o => (o.flag || (/\((.*)\)/.test(o.label||o) && /\((.*)\)/.exec(o.label||o)[1]) || '').split(',');
    const bijiao = (aList, bList) => {
      return aList.filter(a => bList.filter(b => a === `!${b}` || a === `!${b}`.replace(/^!!/,'')).length).length;
    }
    const flag = getflag(op);

    // 为了兼容唯一反选 unselect
    if (unselect){
      if(op.unselect){
        optionList.filter(o=>o!==op).forEach(o => fn(getrealy(o.value || o)));
      }else{
        fn(optionList[0].value);
      }
    } else {
      optionList.filter(o=>o!==op).forEach(o=>{
        if((flag.indexOf('!') !== -1 && getflag(onBlur).indexOf('!') !== -1) || radio){
          fn(getrealy(o.value || o));
        } else if(bijiao(getflag(o), flag)){
          fn(getrealy(o.value || o));
        }
      });
    }
  }

  const handleCheck = (e, {name, checked, option}) => {
    if(checked){
      data[name] = data[`$${name}`] || '';
      findWC(option, n => delete data[n]);
    }else{
      delete data[name];
    }
    return onChange(e, toData()).then(()=>onBlur({checkedChange:true}, `${name}-checkbox`));
  }

  const handleInput = (e,{value, name, target}) => {
    data[`$${name}`] = value;
    data[name] = value;
    onChange(e, toData()).then(()=>onBlur({}, `${name}-${target || 'input'}`));
  }

  
  return (
    <Row className="checkinput">
    {optionList.map((op,index)=>(
        <MMix {...rest} args={args} key={`checkinput-${name}-${index}`} baseColor={baseColor}
          span={op.span||span} data={{...data}} option={op} 
          onCheck={handleCheck} onChange={handleInput}/>
    ))}
    </Row>
  )
}


