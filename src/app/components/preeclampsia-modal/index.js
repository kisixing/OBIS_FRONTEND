import React, { Component } from "react";
import { Modal, Icon } from 'antd';
import store from '../../store';
import { showPreeclampsiaAction } from '../../store/actionCreators.js';

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...store.getState(),
    };
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  renderModal() {
    const { isShowPreeclampsia } = this.state;
    const { closeModal } = this.props;
    
    const handleCancel = (e) => {
      const preeAction = showPreeclampsiaAction(false);
      store.dispatch(preeAction);
    }

    const handleOk = (e) => {
      const preeAction = showPreeclampsiaAction(false);
      store.dispatch(preeAction);
      closeModal(e);
    }

    return (
      <Modal 
        visible={isShowPreeclampsia}
        onCancel={handleCancel}
        onOk={handleOk}
        title={<span><Icon type="exclamation-circle" style={{color: "#FB9824"}} /> 请注意！</span>}
      >
        <p>是否使用“阿司匹林”预防子痫前期</p>
      </Modal>
    )
  }

  render(){
    return (
      <div>
        {this.renderModal()}
      </div>
    )
  }
}
