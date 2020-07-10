import React, { Component } from "react";
import { Button, message, Icon } from 'antd';
import * as baseData from '../../data';
import * as common from '../../../../utils/common';
import formRender, {fireForm} from '../../../../render/form';
import {valid} from '../../../../render/common';
import service from '../../../../service';
import store from '../../../store';

export default class RegForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fzFormEntity: {...baseData.fzFormEntity},
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  async componentDidMount() {
    const res = await service.chanhou.getPartumRvisit();
    const resData = res.object;
    if (!resData.deliveryHostital) resData.deliveryHostital = '本院';
    if (!resData.followDate) resData.followDate = new Date();
    if (!resData.followDoctor) resData.followDoctor = common.getCookie('docName');
    this.setState({ fzFormEntity: service.praseJSON(resData) });
  }

  /**
   * 产后复诊记录表单
   */  
  fzFormConfig() {
    const { fzFormEntity } = this.state;
    return {
      rows: [
        {
          columns: [
            { name: 'systolicPressure(/)[血压]', type: 'input', span: 4, valid: 'pureNumber|rang(90,140)' },
            { name: 'diastolicPressure(mmHg)[]', type: 'input', span: 2, valid: 'pureNumber|rang(60,90)' },
            // { 
            //   name: 'bp(mmHg)[血压]', type: ['input(/)','input'], span: 5, valid: (value)=>{
            //   let message = '';
            //   if(value){
            //     message = [0,1].map(i=>valid(`pureNumber|required|rang(${[90,60][i]},${[140,90][i]})`,value[i])).filter(i=>i).join();
            //   }else{
            //     message = valid('required',value)
            //   }
            //   return message;
            // }},
            { name: 'weight[体重](kg)', type: 'input', span: 5 },
            { span: 1 },
            { name: 'bmi[BMI]', type: 'input', span: 5  },
          ]
        },
        {
          columns: [
            { name: 'chiefComplaint[主诉]', type: 'input', span: 11 },
            { span: 1 },
            { name: 'deliveryDate[分娩日期]', type: 'date', valid: 'required', span: 5  },
            { span: 1 },
            { name: 'deliveryHostital[分娩医院]', type: 'input', span: 5  },
          ]
        },
        {
          columns:[
            { name: 'healthCondition[健康状况]', type: 'editableSelect', span: 11, showSearch: true, options: baseData.jkzkOptions },
            { span: 1 },
            { name: 'psychologicalCondition[心里状况]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.xlzkOptions },
            { span: 1 },
            { name: 'epds[心理评分]', className: fzFormEntity.epds >= 13 ? 'isRed' : '', type: 'input', span: 5 },
          ]
        },
        {
          columns:[
            { name: 'breast[乳房]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.rfOptions },
            { span: 1 },
            { name: 'lochia[恶露]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.elOptions },
            { span: 1 },
            { name: 'perineum[会阴]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.sfycOptions },
            { span: 1 },
            { name: 'cervix[宫颈]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.sfycOptions },
          ]
        },
        {
          columns:[
            { name: 'frontWall[前壁膨出]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'backWall[后壁膨出]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'uterus[子宫]', type: 'select', span: 5, showSearch: true, options: baseData.sfycOptions },
            { span: 1 },
            { name: 'uterineAppendages[附件]', type: 'select', span: 5, showSearch: true, options: baseData.sfycOptions },
          ]
        },
        {
          columns:[
            { name: 'pelvicMuscleSec2nd[盆地Ⅱ肌]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.pdjOptions },
            { span: 1 },
            { name: 'pelvicMuscleSec1st[盆地Ⅰ肌]', type: 'editableSelect', span: 5, showSearch: true, options: baseData.pdjOptions },
            { span: 1 },
            { name: 'pelvicPressure[盆地压力]', type: 'input', span: 5 },
          ]
        },
        {
          columns:[
            { name: 'stressIncontinence[压力性尿失禁]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'abnormalUrination[排尿异常]', type: 'input', span: 5 },
          ]
        },
        {
          columns:[
            { name: 'other[其他]', type: 'input', span: 17 },
          ]
        },
        {
          columns:[
            { name: 'highRiskTurnover[高危转归]', type: 'checkinput', radio: true, span: 12, options: baseData.gwzwOptions },
          ]
        },
        {
          columns:[
            { name: 'diagnosis[诊断]', type: 'editableSelect', span: 17, valid: 'required', showSearch: true, options: baseData.zdOptions }
          ]
        },
        {
          columns:[
            { name: 'treatment[处理指导]', type: 'input', valid: 'required', span: 17 }
          ]
        },
        {
          columns:[
            { name: 'followDate[随访日期]', type: 'date', span: 5 },
            { span: 1 },
            { name: 'followDoctor[随诊医生]', type: 'input', span: 5 },
          ]
        },
      ]
    }
  }

  handleFZChange(e, { name, value }) {
    const { fzFormEntity } = this.state;
    let data = {[name]: value};
    this.setState({
      fzFormEntity: {...fzFormEntity, ...data}
    })
  }

  handleFZSave(form) {
    const { fzFormEntity } = this.state;
    fireForm(form,'valid').then((valid)=>{
      if(valid){
        service.chanhou.postPartumRvisit(fzFormEntity)
      }else {
        message.error("必填项不能为空！")
      }
    });
  }

  render() {
    const { fzFormEntity } = this.state;
    return (
      <div>
        {formRender(fzFormEntity, this.fzFormConfig(), this.handleFZChange.bind(this))}
        <div className="btn-wrapper">
          <Button className="chanhou-btn" onClick={() => setTimeout(() => { this.handleFZSave(document.querySelector(".chanhou-form"))}, 100) }>
            保存
            <Icon type="save" />
          </Button>
        </div>
      </div>
    )
  }
}