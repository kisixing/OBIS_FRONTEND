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
      regFormEntity: {...baseData.regFormEntity},
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  // 梅毒表单
  regFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'name[患者姓名]', type: 'input', span: 6, disabled: true },
            { name: 'sex[性别]', type: 'input', span: 6, disabled: true  },
            { name: 'birthday[出生日期]', type: 'input', span: 6, disabled: true  },
            { name: 'telephone[联系电话]', type: 'input', span: 6, disabled: true  }
          ]
        },
        {
          columns: [
            { name: 'dept[住院科室]', type: 'select', valid: 'required', span: 6, options: baseData.zyksOptions },
            { span: 1 },
            { name: `dateHos[入院日期](${yunz})`, className: 'reg-date', type: 'date', valid: 'required', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'note[特殊备注]', type: 'textarea', span: 12, placeholder: "请输入备注" }
          ]
        },
        {
          columns:[
            { name: 'hospitalized[是否曾在我院住院]', className: 'long-label', type: 'checkinput-4', radio: true, span: 16, options: baseData.sfzyOptions }
          ]
        },
        {
          columns:[
            { name: 'notionality[国籍]', type: 'input', span: 6 },
            { name: 'root[籍贯]', type: 'input', span: 6 },
            { name: 'ethnicity[民族]', type: 'input', span: 6 }
          ]
        },
        {
          columns:[
            { name: 'birthAddrProvince[出生地]', span: 12, type: [{type: "cascader", options: addrOptions}] },
            // { name: 'birthAddrProvince[出生地]', type: 'select', span: 4, options: baseData.csd1Options },
            // { name: 'birthAddrCity[]', type: 'select', span: 4, options: baseData.csd2Options },
            { name: 'marriage[婚姻]', type: 'checkinput', radio: true, span: 12, options: baseData.hyOptions }
          ]
        },
        {
          columns:[
            { name: 'address[现住址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'postno[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'idcardAddr[身份证地址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'idcardPostno[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'idcardNo[身份证号码(ID)]', type: 'input', span: 12 },
            { name: 'idcardSource[来源]', className: "reg-source", type: 'checkinput', radio: true, span: 12, options: baseData.lyOptions }
          ]
        },
        {
          columns:[
            { name: 'occupation[职业]', type: 'checkinput', radio: true, span: 24, options: baseData.zyOptions }
          ]
        },
        {
          columns:[
            { name: 'corAddr[工作单位及地址]', className: 'long-label', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'corPostno[单位邮编]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'corTele[单位联系电话]', className: 'long-label', type: 'input', span: 11, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'ecName[联系人姓名]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'ecTele[联系人电话]', type: 'input', span: 11, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'ecAddr[联系人地址]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'ecRelative[联系人与患者关系]', className: 'long-label', type: 'checkinput', radio: true, span: 24, options: baseData.gxOptions }
          ]
        }
      ]
    }
  }

 /**
   * 梅毒管理页面
   */
  renderSypModal() {
    const { isShowSypModal } = this.state;

    const closeModal = (bool) => {
      const action = showSypAction(false);
      store.dispatch(action);
    }

    return (
      <Modal title="梅毒管理页面" visible={isShowSypModal} width={900} className="syp-modal"
            onCancel={() => closeModal()} onOk={() => closeModal(true)}>
  fsssssssss
      </Modal>
    )

  }

  render() {
    return (
      <div className="reg-form">
        {this.renderSypModal()}
      </div>
    )
  }
}