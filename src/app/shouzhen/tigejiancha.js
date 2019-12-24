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
            {name:'cktizh(kg)[现体重]', type:'input', span:6, valid: 'required|number|rang(0,500)'},
            {span:1},
            { 
              name: 'ckpressure(mmHg)[血压]', type: ['input(/)','input'], span: 6, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`number|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            {span:2},
            {name:'add_FIELD_pulse(次/分)[脉搏]', type:'input', span:6, valid: 'required|number|rang(0,100)'},
          ]
        },
        {
          columns:[
            {name:'ckcurtizh(kg)[孕前体重]', type:'input', span:6, valid: 'required|number|rang(10,100)'},
            {span:1},
            {name:'cksheng(cm)[身高]', type:'input', span:6, valid: 'required|number|rang(150,250)'},
            {span:2},
            {name:'ckbmi(kg/㎡)[孕前BMI]', type:'input', span:6, valid: 'required|number|rang(18.5,24.9)'},
          ]
        },
        {
          columns:[
            {name:'ckpifu[皮肤黏膜]', className:'col-94-sp', type:'checkinput-6',valid: 'required', options: baseData.pfOptions,span:13}
          ]
        },
        {
          columns:[
            {name:'ckjiazhx[甲状腺]', type:'checkinput-3', valid: 'required', options: baseData.neOptions,radio:true,span:7},
            {name:'vascularMurmur[血管杂音]', type:'checkinput-3',valid: 'required', options: baseData.hnOptions,radio:true,span:7},
            {span:1},
            {name:'vascularMurmurOther[其他]', type:'input', span:6},
          ]
        },
        {
          columns:[
            {name:'ckrut[乳头]', type:'checkinput-3',valid: 'required', options: baseData.rtOptions,radio:true,span:7}
          ]
        },
        {
          columns:[
            {name:'breathSounds[呼吸音]', type:'checkinput-3',valid: 'required', options: baseData.neOptions,radio:true,span:7},
            {name:'breathSoundsOther[啰音]', type:'input', span:6,valid: 'required'},
          ]
        },
        {
          columns:[
            {name:'cardiac(次/分)[心率]', type:'input',valid: 'required|number', span:6},
            {span:1},
            {name:'heart[心律]', type:'checkinput-3',valid: 'required', options: baseData.xlOptions,radio:true,span:7},
            {span:1},
            {name:'murmurs[杂音]', type:'checkinput-3',valid: 'required', options: baseData.hnOptions,radio:true,span:9},
          ]
        },
        {
          columns:[
            {name:'ckganz[肝]', type:'checkinput-3',valid: 'required', options: baseData.cjOptions,radio:true,span:7},
            {name:'ckpiz[脾]', type:'checkinput-3',valid: 'required', options: baseData.cjOptions,radio:true,span:7},
            {span:1},
            {name:'ckshenz[肾区叩痛]', type:'checkinput-3',valid: 'required', options: baseData.sktOptions,radio:true,span:9},
          ]
        },
        {
          columns:[
            {name:'ckjizh[脊柱]', type:'checkinput-3',valid: 'required', options: baseData.jxOptions,radio:true,span:7},
            {name:'ckfuzh[下肢浮肿]', type:'checkinput', className:'col-xz-sp', valid: 'required', options: baseData.xzfOptions,radio:true,span:14},
            {span:1},
            {name:'nervousReflex[双膝反射]', type:'checkinput', className:'col-97-sp', valid: 'required', options: baseData.sxfOptions,radio:true,span:9},
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
