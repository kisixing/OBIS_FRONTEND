import React from "react";
import {render} from "react-dom";
import { Modal, Icon } from 'antd';
import './modal.less';

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
  
  return new Promise(resolve => {
    if(typeof props === 'object'){
      const {content, onCancel, onOk, visible, ...rest} = props;
      render((
        <Modal 
          className="common-modal"
          visible={visible} 
          onCancel={handelClick(onCancel)} 
          onOk={handelClick(onOk)}
          title={<span><Icon type="exclamation-circle" style={{color: "#FB9824"}} /> 请注意！</span>}
          {...rest}>
            {content()}
        </Modal>
      ), modal, resolve);
    } else {
      render((
        <Modal visible={visible} onCancel={handelClick()} onOk={handelClick()}>
          <div dangerouslySetInnerHTML={{__html: props}}></div>
        </Modal>
      ), modal, resolve);
    }
  });
}