import React, { Component } from "react";
import { Row, Col, Input, Icon, Select, Button, message, Table, Modal, Spin, Tree, DatePicker } from 'antd';
import addrOptions from '../../../utils/cascader-address-options';
import * as baseData from './data';
import formRender, {fireForm} from '../../../render/form';
import {valid} from '../../../render/common';
import service from '../../../service';
import './index.less';


export default class RegForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regFormEntity: {...baseData.regFormEntity},
      yunz: '孕20+6周',
      allFormData: {},
    }
    
  }

  componentDidMount() {
    service.shouzhen.getAllForm().then(res => {
      this.setState({allFormData: res.object}, () => {
        this.getRegform();
      })
    });
  }

  getRegform() {
    const { allFormData } = this.state;

    console.log(allFormData, '3u683');
    service.fuzhen.getRecordList().then(res => {
      let data = res.object;
      Object.keys(data).forEach(key => {
        if(typeof data[key] ==="string" && data[key].indexOf('{') !== -1) {
          data[key] = JSON.parse(data[key])
        }
      })
      this.setState({regFormEntity: data})
    })
  }

  // 入院登记表单
  regFormConfig() {
    const { yunz } = this.state;
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
            { name: `dateHos[入院日期]((${yunz}))`, type: 'date', valid: 'required', span: 7 },
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
            { name: 'idcardNo[身份证号码(ID)]', type: 'input', span: 10 },
            { name: 'idcardSource[来源]', className: "reg-source", type: 'checkinput', radio: true, span: 14, options: baseData.lyOptions }
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
            { name: 'corTele[单位联系电话]', className: 'long-label', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'ecName[联系人姓名]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'ecTele[联系人电话]', type: 'input', span: 12, placeholder: "请输入" }
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

  // 入院登记表
  showRegForm() {
    const { regFormEntity } = this.state;
    const { entity, isShowRegForm } = this.props;
    const handleClick = () => { this.props.closeRegForm() };
    const handleRegChange = (e, { name, value, valid }) => {
      let data = {[name]: value};
      this.setState({
        regFormEntity: {...regFormEntity, ...data}
      })
      if(name === "dateHos") {
        let newEntity = entity;
        newEntity.ckappointment = value;
        this.props.resetEntity(newEntity);
      }
    }
    const handleRegSave = (form) => {
      let newRegFormEntity = regFormEntity;
      Object.keys(newRegFormEntity).forEach(key => {
        newRegFormEntity[key] = typeof newRegFormEntity[key] === "string" ? newRegFormEntity[key] : JSON.stringify(newRegFormEntity[key]);
      })
      const hospitalized = newRegFormEntity.hospitalized;
      if(hospitalized && JSON.parse(hospitalized)[0].label === "是" && JSON.parse(hospitalized)[0].value !== "") {
        newRegFormEntity.inpatientNo = JSON.parse(newRegFormEntity.hospitalized)[0].value.input0;
      }
      fireForm(form, 'valid').then((valid) => {
        if(valid) {
          service.fuzhen.postRecordList(newRegFormEntity).then(() => {
            this.setState({regFormEntity: {...baseData.regFormEntity}})
            this.props.closeRegForm();
            this.getRegform()
          })
        }else {
          message.error('必填项不能为空!');
        }
      })
    }
    const printForm = () => {
      window.print();
    }

    const title = [
      <div className="reg-title">
        <span>入院登记表</span>
        <div className="reg-btns">
          <Button className="pull-right blue-btn margin-R-2" type="ghost" onClick={() => printForm()}>打印入院登记表</Button>
            <Button className="pull-right blue-btn margin-R-1" type="ghost" onClick={() => handleRegSave(document.querySelector('.reg-form'))}>保存</Button>
        </div>
      </div>
    ]

    return (
      <Modal width="80%" title={title} footer={null} className="reg-form"
        visible={isShowRegForm} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
        {formRender(regFormEntity, this.regFormConfig(), handleRegChange)}
      </Modal>
    )
  }

  render() {
    return (
      <div className="reg-form">
        {this.showRegForm()}
      </div>
    )
  }
}