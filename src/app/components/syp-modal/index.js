import React, { Component } from "react";
import { Button, message, Modal } from 'antd';
import * as baseData from './data';
import * as util from '../../fuzhen/util';
import formRender, {fireForm} from '../../../render/form';
import service from '../../../service';
import './index.less';
import store from '../../store';
import { showSypAction } from "../../store/actionCreators.js";

export default class SYPmodal extends Component {
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

  componentDidMount() {
    service.shouzhen.searchSyp().then(res => {
      this.setYunz(res.object, res.object.treatment1_time1, 'treatment1_yunz1');
      this.setYunz(res.object, res.object.treatment1_time2, 'treatment1_yunz2');
      this.setYunz(res.object, res.object.treatment1_time3, 'treatment1_yunz3');
      this.setYunz(res.object, res.object.treatment2_time1, 'treatment2_yunz1');
      this.setYunz(res.object, res.object.treatment2_time2, 'treatment2_yunz2');
      this.setYunz(res.object, res.object.treatment2_time3, 'treatment2_yunz3');
      this.setState({ sypFormEntity: service.praseJSON(res.object) });
    });
  }

  setYunz(all, param, value) {
    const { allFormData } = this.state;
    if (!!param) {
      all[value] = util.getWeek(40, util.countWeek(allFormData.pregnantInfo.gesexpectrv, param));
    } else {
      all[value] = '';
    }
  }

  // 梅毒表单
  sypFormConfig() {
    const { sypFormEntity } = this.state;
    return {
      rows: [
        {
          columns: [
            { name: 'transfer[转诊]', type: 'checkinput', span: 6, radio: true, options: baseData.sfOptions },
            { name: 'agree[同意治疗]', type: 'checkinput', span: 6, radio: true, options: baseData.sfOptions  },
          ]
        },
        {
          columns:[
            { name: 'tppa[梅毒结果：TPPA滴度]', className: 'long-label', type: 'input', span: 10 },
            { name: 'trust[TRUST滴度]', type: 'input', span: 8 },
          ]
        },
        {
          className: 'section-title', columns: [
            { name: '[第一疗程]', type: '**', span: 8 },
          ]
        },
        {
          columns:[
            { name: `treatment1_time1[第一针]((${sypFormEntity.treatment1_yunz1}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment1_transfer1[执行情况]', className: `${sypFormEntity.treatment1_transfer1 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: `treatment1_time2[第二针]((${sypFormEntity.treatment1_yunz2}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment1_transfer2[执行情况]', className: `${sypFormEntity.treatment1_transfer2 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: `treatment1_time3[第三针]((${sypFormEntity.treatment1_yunz3}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment1_transfer3[执行情况]', className: `${sypFormEntity.treatment1_transfer3 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          className: 'section-title', columns: [
            { name: '[第二疗程]', type: '**', span: 8 },
          ]
        },
        {
          columns:[
            { name: `treatment2_time1[第一针]((${sypFormEntity.treatment2_yunz1}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment2_transfer1[执行情况]', className: `${sypFormEntity.treatment2_transfer1 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: `treatment2_time2[第二针]((${sypFormEntity.treatment2_yunz2}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment2_transfer2[执行情况]', className: `${sypFormEntity.treatment2_transfer2 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: `treatment2_time3[第三针]((${sypFormEntity.treatment2_yunz3}孕周))`, className: 'no-wrap', type: 'date', span: 8 },
            { name: 'treatment2_transfer3[执行情况]', className: `${sypFormEntity.treatment2_transfer3 === '未执行' ? 'isRed' : ''}`, type: 'input', span: 6 },
          ]
        },
        {
          className: 'section-title', columns: [
            { name: '[TRUST随访结果]', className: 'long-label', type: '**', span: 8 },
          ]
        },
        {
          columns:[
            { name: 'follow_time1[第一次]', type: 'date', span: 6 },
            { name: 'follow_trust1[TRUST滴度]', type: 'input', span: 6 },
            { name: 'follow_time4[第四次]', type: 'date', span: 6 },
            { name: 'follow_trust4[TRUST滴度]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'follow_time2[第二次]', type: 'date', span: 6 },
            { name: 'follow_trust2[TRUST滴度]', type: 'input', span: 6 },
            { name: 'follow_time5[第五次]', type: 'date', span: 6 },
            { name: 'follow_trust5[TRUST滴度]', type: 'input', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'follow_time3[第三次]', type: 'date', span: 6 },
            { name: 'follow_trust3[TRUST滴度]', type: 'input', span: 6 },
            { name: 'follow_time6[第六次]', type: 'date', span: 6 },
            { name: 'follow_trust6[TRUST滴度]', type: 'input', span: 6 },
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
      if (bool) {
        if (!sypFormEntity.syphilisTreatmentId) {
          sypFormEntity.syphilisTreatmentId = '';
        }
        service.shouzhen.editSyp(sypFormEntity).then(res => {
          console.log(res, '66')
        })
      }
    }

    const handleSypChange = (e, { name, value, valid }) => {
      let data = {[name]: value};
      let yunz = '';
      switch(name) {
        case 'treatment1_time1':
          this.setYunz(sypFormEntity, value, 'treatment1_yunz1');
          break;
        case 'treatment1_time2':
          this.setYunz(sypFormEntity, value, 'treatment1_yunz2');
          break;
        case 'treatment1_time3':
          this.setYunz(sypFormEntity, value, 'treatment1_yunz3');
          break;
        case 'treatment2_time1':
          this.setYunz(sypFormEntity, value, 'treatment2_yunz1');
          break;
        case 'treatment2_time2':
          this.setYunz(sypFormEntity, value, 'treatment2_yunz2');
          break;
        case 'treatment2_time3':
          this.setYunz(sypFormEntity, value, 'treatment2_yunz3');
          break;
        default:
          break;
      }
      this.setState({
        sypFormEntity: {...sypFormEntity, ...data}
      })
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