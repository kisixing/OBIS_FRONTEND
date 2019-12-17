import React, { Component } from "react";

import {valid} from '../../render/common';
import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '体格检查';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            {name:'ckcurtizh(kg)[现体重]', type:'input', span:6, valid: 'required|number|rang(0,500)'},
            {span:1},
            { 
              name: 'ckshrinkpressure(mmHg)[血压]', type: ['input(/)','input'], span: 6, valid: (value)=>{
              let message = '';
              if(value){
                if(value[0] && valid('number|required|rang(0,139)',value[0])){
                  message += '第1个值' + valid('number|required|rang(0,139)',value[0])
                }else if(value[0] && valid('number|rang(0,109)',value[1])){
                  message += '第2个值' + valid('number|required|rang(0,109)',value[1])
                }
              }
              
              return message;
            }},
            {span:2},
            {name:'mb(次/分)[脉搏]', type:'input', span:6, valid: 'required|number|rang(0,100)'},
          ]
        },
        {
          columns:[
            {name:'yqtz(kg)[孕前体重]', type:'input', span:6, valid: 'required|number|rang(10,100)'},
            {span:1},
            {name:'cksheng(cm)[身高]', type:'input', span:6, valid: 'required|number|rang(150,250)'},
            {span:2},
            {name:'ckbmi(kg/㎡)[孕前BMI]', type:'input', span:6, valid: 'required|number|rang(18.5,24.9)'},
          ]
        },
        {
          columns:[
            {name:'pflm[皮肤黏膜]', className:'col-94-sp', type:'checkinput-6',valid: 'required', options: baseData.pfOptions,span:13}
          ]
        },
        {
          columns:[
            {name:'jzx[甲状腺]', type:'checkinput-3',valid: 'required', options: baseData.neOptions,radio:true,span:7},
            {name:'xgzy[血管杂音]', type:'checkinput-3',valid: 'required', options: baseData.hnOptions,radio:true,span:7},
            {span:1},
            {name:'id3[其他]', type:'input', span:6},
          ]
        },
        {
          columns:[
            {name:'rt[乳头]', type:'checkinput-3',valid: 'required', options: baseData.rtOptions,radio:true,span:7}
          ]
        },
        {
          columns:[
            {name:'hxy[呼吸音]', type:'checkinput-3',valid: 'required', options: baseData.neOptions,radio:true,span:7},
            {name:'ly[啰音]', type:'input', span:6,valid: 'required'},
          ]
        },
        {
          columns:[
            {name:'xl(次/分)[心率]', type:'input',valid: 'required', span:6},
            {span:1},
            {name:'xl2[心率]', type:'checkinput-3',valid: 'required', options: baseData.xlOptions,radio:true,span:7},
            {span:1},
            {name:'xlzy[杂音]', type:'checkinput-3',valid: 'required', options: baseData.hnOptions,radio:true,span:9},
          ]
        },
        {
          columns:[
            {name:'gan[肝]', type:'checkinput-3',valid: 'required', options: baseData.cjOptions,radio:true,span:7},
            {name:'pi[脾]', type:'checkinput-3',valid: 'required', options: baseData.cjOptions,radio:true,span:7},
            {span:1},
            {name:'sqt[肾区叩痛]', type:'checkinput-3',valid: 'required', options: baseData.sktOptions,span:9},
          ]
        },
        {
          columns:[
            {name:'jz[脊柱]', type:'checkinput-3',valid: 'required', options: baseData.jxOptions,radio:true,span:7},
            {name:'xzfz[下肢浮肿]', type:'checkinput', className:'col-97-sp', valid: 'required', options: baseData.xzfOptions,radio:true,span:9},
            {span:4},
            {name:'sqfs[双膝反射]', type:'checkinput', className:'col-97-sp', valid: 'required', options: baseData.sxfOptions,radio:true,span:9},
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
