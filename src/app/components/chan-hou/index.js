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
      fzFormEntity: {...baseData.fzFormEntity},
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  /**
   * 产后复诊记录表单
   */  
  fzFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'sfri[随访日期]', type: 'date', valid: 'required', span: 4 },
            { name: 'fmri[分娩日期]', type: 'date', valid: 'required', span: 4  },
            { name: 'fmyy[分娩医院]', type: 'input', valid: 'required', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'zs[主@@诉]', type: 'input', span: 8 }
          ]
        },
        {
          columns: [
            { 
              name: 'ckpressure(mmHg)[血@@压]', type: ['input(/)','input'], span: 4, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`number|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            { name: 'tz[体@@重](kg)', type: 'input', span: 4 },
            { name: 'bmi[BMI]', type: 'input', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'jkzk[健康状况]', type: 'select', span: 8, showSearch: true, options: baseData.jkzkOptions },
            { name: 'xlzk[心里状况]((EPDS: <span>12分<span>))', type: 'select', span: 8, valid: 'required', showSearch: true, options: baseData.xlzkOptions },
          ]
        },
        {
          columns:[
            { name: 'xsewy[新生儿喂养]', type: 'checkinput', radio: true, span: 12, options: baseData.xsewyOptions }
          ]
        },
        {
          columns:[
            { name: 'rf[乳@@房]', type: 'select', span: 4, showSearch: true, options: baseData.rfOptions },
            { name: 'el[恶@@露]', type: 'select', span: 4, showSearch: true, options: baseData.elOptions },
            { name: 'hy[会@@阴]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'yd[阴@@道]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
          ]
        },
        {
          columns:[
            { name: 'zg[子@@宫]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'fj[附@@件]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'pdpf[盆地评分]', type: 'input', span: 4 },
            { name: 'pdhf[盆地恢复]', type: 'select', span: 4, showSearch: true, options: baseData.pdhfOptions },
          ]
        },
        {
          columns:[
            { name: 'qt[其@@他]', type: 'input', span: 10 },
          ]
        },
        {
          columns:[
            { name: 'gwzw[高危转归]', type: 'checkinput', radio: true, span: 12, options: baseData.gwzwOptions },
          ]
        },
        {
          columns:[
            { name: 'zd[诊@@断]', type: 'select', span: 10, valid: 'required', showSearch: true, options: baseData.zdOptions }
          ]
        },
        {
          columns:[
            { name: 'zhd[指@@导]', type: 'input', span: 10 }
          ]
        },
        {
          columns:[
            { name: 'cl[处@@理]', type: 'input', span: 10 }
          ]
        },
      ]
    }
  }

  handleFZChange(e, { name, value, valid }) {
    console.log(e, { name, value, valid })
  }

  handleFZSave(form) {
    fireForm(form,'valid').then((valid)=>{
      if(valid){
        console.log(666)
      }else {
        message.error("必填项不能为空！")
      }
    });
  }

  render() {
    const { fzFormEntity } = this.state;
    return (
      <div className="chanhou-form ant-col-24">
        <p className="chanhou-title">产后复诊记录</p>
        {formRender(fzFormEntity, this.fzFormConfig(), this.handleFZChange.bind(this))}
        <Button className="blue-btn chanhou-btn" type="ghost" 
                onClick={() => this.handleFZSave(document.querySelector(".chanhou-form"))}>
          保存
        </Button>
      </div>
    )
  }
}