import React, { Component } from "react";
import { Button, message, Modal } from 'antd';
import * as baseData from './data';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import service from '../../service';
import './index.less';
import store from '../store';
import { showSypAction } from "../store/actionCreators.js";

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

  componentDidMount() {
    service.chanhou.getPartumRvisit().then(res => {
      this.setState({ fzFormEntity: res.object });
    })
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
            { name: 'followDate[随访日期]', type: 'date', valid: 'required', span: 4 },
            { name: 'deliveryDate[分娩日期]', type: 'date', valid: 'required', span: 4  },
            { name: 'deliveryHostital[分娩医院]', type: 'input', valid: 'required', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'chiefComplaint[主@@诉]', type: 'input', span: 8 }
          ]
        },
        {
          columns: [
            { 
              name: 'bp(mmHg)[血@@压]', type: ['input(/)','input'], span: 4, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`number|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            { name: 'weight[体@@重](kg)', type: 'input', span: 4 },
            { name: 'bmi[BMI]', type: 'input', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'healthCondition[健康状况]', type: 'select', span: 8, showSearch: true, options: baseData.jkzkOptions },
            { name: `${fzFormEntity.epds}`>=13 ? `psychologicalCondition[心里状况]((epds: <span style="color: red">${fzFormEntity.epds}</span>分))`
                    : `psychologicalCondition[心里状况]((epds: <span>${fzFormEntity.epds}</span>分))`, 
              type: 'select', span: 8, valid: 'required', showSearch: true, options: baseData.xlzkOptions },
          ]
        },
        {
          columns:[
            { name: 'neonatalFeeding[新生儿喂养]', type: 'checkinput', radio: true, span: 12, options: baseData.xsewyOptions }
          ]
        },
        {
          columns:[
            { name: 'breast[乳@@房]', type: 'select', span: 4, showSearch: true, options: baseData.rfOptions },
            { name: 'lochia[恶@@露]', type: 'select', span: 4, showSearch: true, options: baseData.elOptions },
            { name: 'perineum[会@@阴]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'vagina[阴@@道]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
          ]
        },
        {
          columns:[
            { name: 'uterus[子@@宫]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'uterineAppendages[附@@件]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'pelvicScore[盆地评分]', type: 'input', span: 4 },
            { name: 'pelvicRecover[盆地恢复]', type: 'select', span: 4, showSearch: true, options: baseData.pdhfOptions },
          ]
        },
        {
          columns:[
            { name: 'other[其@@他]', type: 'input', span: 10 },
          ]
        },
        {
          columns:[
            { name: 'highRiskTurnover[高危转归]', type: 'checkinput', radio: true, span: 12, options: baseData.gwzwOptions },
          ]
        },
        {
          columns:[
            { name: 'diagnosis[诊@@断]', type: 'select', span: 10, valid: 'required', showSearch: true, options: baseData.zdOptions }
          ]
        },
        {
          columns:[
            { name: 'guide[指@@导]', type: 'input', span: 10 }
          ]
        },
        {
          columns:[
            { name: 'treatment[处@@理]', type: 'input', span: 10 }
          ]
        },
      ]
    }
  }

  handleFZChange(e, { name, value, valid }) {
    const { fzFormEntity } = this.state;
    let data = {[name]: value};
    console.log(data, value, '123');
    this.setState({
      fzFormEntity: {...fzFormEntity, ...data}
    })
  }

  handleFZSave(form) {
    const { fzFormEntity } = this.state;
    fireForm(form,'valid').then((valid)=>{
      if(valid){
        console.log(valid, 666)
        service.chanhou.postPartumRvisit(fzFormEntity).then(res => {
          console.log(res, '4343')
        })
      }else {
        message.error("必填项不能为空！")
      }
    });
  }

  render() {
    const { fzFormEntity } = this.state;
    return (
      <div className="chanhou-form ant-col-24">
        {formRender(fzFormEntity, this.fzFormConfig(), this.handleFZChange.bind(this))}
        <Button className="blue-btn chanhou-btn" type="ghost" onClick={() => setTimeout(() => { this.handleFZSave(document.querySelector(".chanhou-form"))}, 100) }>保存</Button>
      </div>
    )
  }
}