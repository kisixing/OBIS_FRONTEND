import React, { Component } from "react";
import { Button, message, Modal } from 'antd';
import * as baseData from './data';
import formRender, {fireForm} from '../../../render/form';
import service from '../../../service';
import './index.less';
import store from '../../store';
import { showSypAction } from "../../store/actionCreators.js";

export default class RegForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sypFormEntity: {...baseData.sypFormEntity},
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  // 梅毒表单
  sypFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'name[转诊]', type: 'checkinput', span: 6, radio: true, options: baseData.sfOptions },
            { name: 'sex[同意治疗]', type: 'checkinput', span: 6, radio: true, options: baseData.sfOptions  },
          ]
        },
        {
          columns:[
            { name: 'notionality[梅毒结果：TPPA滴度]', className: 'long-label', type: 'input', span: 10 },
            { name: 'root[TRUST滴度]', type: 'input', span: 8 },
          ]
        },
        {
          label: '第一疗程', span: 12, className: 'labelclass'
        },
        {
          columns:[
            { name: 'notionality[第一针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第二针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第三针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          label: '第二疗程', span: 12, className: 'labelclass'
        },
        {
          columns:[
            { name: 'notionality[第一针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第二针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第三针]((孕周))', type: 'date', span: 6 },
            { name: 'root[执行情况]', type: 'input', span: 6 },
          ]
        },
        {
          label: 'TRUST随访结果', span: 12, className: 'labelclass'
        },
        {
          columns:[
            { name: 'notionality[第一次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
            { name: 'notionality[第四次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第二次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
            { name: 'notionality[第五次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'notionality[第三次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
            { name: 'notionality[第六次]', type: 'date', span: 6 },
            { name: 'root[TRUST滴度]', type: 'input', span: 6 },
          ]
        },
      ]
    }
  }

 /**
   * 梅毒管理页面
   */
  renderSypModal() {
    const { isShowSypModal, sypFormEntity } = this.state;

    const closeModal = (bool) => {
      const action = showSypAction(false);
      store.dispatch(action);
    }

    const handleSypChange = (e, { name, value, valid }) => {true
      console.log(e, { name, value, valid });
    }

    return (
      <Modal title="梅毒管理" visible={isShowSypModal} width="60%" className="syp-modal"
            onCancel={() => closeModal()} onOk={() => closeModal(true)}>
        {formRender(sypFormEntity, this.sypFormConfig(), handleSypChange)}
      </Modal>
    )

  }

  render() {
    return (
      <div className="syp-form">
        {this.renderSypModal()}
      </div>
    )
  }
}