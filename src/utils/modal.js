import React from "react";
import {render} from "react-dom";
import { Modal } from 'antd';

let modal = null;
export default function(props){
  if(!modal){
    modal = document.createElement('div');
    document.body.appendChild(modal);
  }

  

  const handelClick = (fn = ()=>{}) => (...args) => {
    try{fn(...args);}catch(e){}
    render(<i/>, modal);
  };
  
  if(typeof props === 'object'){
    const {content, onCancel, onOk, ...rest} = props;
    render((
      <Modal {...rest} visible={true} onCancel={handelClick(onCancel)} onOk={handelClick(onOk)}>
        {content}
      </Modal>
    ), modal);
  } else {
    render((
      <Modal visible={true} onCancel={handelClick()} onOk={handelClick()}>
        <div dangerouslySetInnerHTML={{__html: props}}></div>
      </Modal>
    ), modal);
  }
}