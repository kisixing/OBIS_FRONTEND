
import React, { Component } from "react";
import { Row, Col, Button, Input, Table, Select, DatePicker } from 'antd';

class MButton extends Component {
  constructor(props){
    super(props);
  }
  handleClick = (e) => {
    const { onClick } = this.props;
    new Promise(resolve=>onClick(e, ()=>resolve())).then(()=>{
      this.refs.panel.querySelector('button').focus();
    });
  };
  render(){
    return (
      <span ref="panel">
        <Button {...this.props} onClick={this.handleClick}/>
      </span>
    )
  }
}

class MButtons extends Component {
  constructor(props){
    super(props);
  }
  handleClick = (e, index, text) => {
    const { onClick } = this.props;
    new Promise(resolve=>onClick(e, {index, text}, ()=>resolve())).then(()=>{
      this.refs.panel.querySelectorAll('button')[index].focus();
    });
  };
  render(){
    const { buttons, style, ...props } = this.props;
    return (
      <span ref="panel">
        <Button.Group style={style}>
        {buttons.map(({text,name,color},i)=>(
          <Button key={name} name={name} style={{color:color,borderColor:color}} {...props} onClick={e=>this.handleClick(e,i,text)}>{text}</Button>
        ))}
        </Button.Group>
      </span>
    )
  }
}

export function button({onClick, name, text, color, ...props}){
  const handleClick = (e,resolve) => onClick(e, text, resolve);
  return (
    <MButton {...props} style={{color:color,borderColor:color}} onClick={handleClick}>{text}</MButton>
  )
}


/**
 * text以,分组，数据结构是name(color)[text]
 */
export function buttons({onClick, name, text, color, ...props}){
  const handleClick = onClick;
  const texts = text.split(',').map((t,i)=>({
    name: t.replace(/\(.*\)/,'').replace(/\[.*\]/,'') || (name + i),
    text: /\[.*\]/.test(text) && /\[(.*)\]/.exec(t)[1],
    color: /\(.*\)/.test(t) && /\((.*)\)/.exec(t)[1]
  }))
  return (
    <MButtons {...props} style={{color:color,borderColor:color}} buttons={texts} onClick={handleClick}/>
  )
}
