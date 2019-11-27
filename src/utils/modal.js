import React from "react";
import {render} from "react-dom";
import { Modal } from 'antd';

let modal = null;
export default function({content, onCancel, onOk, ...props}){
  if(!modal){
    modal = document.createElement('div');
    document.body.appendChild(modal);
  }

  const handelClick = (fn) => (...args) => {
    try{fn(...args);}catch(e){}
    render(<i/>, modal);
  };
  
  render((
    <Modal {...props} visible={true} onCancel={handelClick(onCancel)} onOk={handelClick(onOk)}>
      {content}
    </Modal>
  ), modal);
}