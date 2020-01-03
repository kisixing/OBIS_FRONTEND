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
            {name:'cktizh(kg)[现 体 重 ]', type:'input', span:3, valid: 'required|number|rang(0,500)'},
            {span:5},
            { 
              name: 'ckpressure(mmHg)[血@@@压 ]', type: ['input(/)','input'], span: 5, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`number|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            {span:3},
            {name:'add_FIELD_pulse(次/分)[脉@@@搏 ]', type:'input', span:4, valid: 'required|number|rang(0,100)'},
          ]
        },
        {
          columns:[
            {name:'ckcurtizh(kg)[孕前体重]', type:'input', span:3, valid: 'required|number|rang(10,100)'},
            {span:5},
            {name:'cksheng(cm)[身@@@高 ]', type:'input', span:4, valid: 'required|number|rang(150,250)'},
            {span:4},
            {name:'ckbmi(kg/㎡)[孕前BMI ]',className:'col-97-sp', type:'input', span:4, valid: 'required|number|rang(18.5,24.9)'},
          ]
        },
        {
          columns:[
            {name:'ckpifu[皮肤黏膜]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,span:8},
            {name:'ckjiazhx[甲 状 腺 ]', type:'checkinput-3', valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'vascularMurmur[血管杂音]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckrut[乳@@@房 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'breathSounds[呼 吸 音 ]', type:'checkinput-3',valid: 'required', options: baseData.coOptions,radio:true,span:8},
            {name:'breathSoundsOther[啰@@@音 ]', type:'checkinput-3',valid: 'required', options: baseData.neOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'cardiac(次/分)[心@@@率 ]', type:'input',valid: 'required|number', span:4},
            {span:4},
            {name:'heart[心@@@律 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'murmurs[杂@@@音 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckganz[肝@@@脏 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'ckpiz[脾@@@脏 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'ckshenz[肾区叩痛]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckjizh[脊@@@柱 ]', type:'checkinput-3',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'ckfuzh[下肢水肿]', type:'checkinput', className:'col-xz-sp', valid: 'required', options: baseData.xzfOptions,radio:true,span:14},
            // {name:'nervousReflex[双膝反射]', type:'checkinput', className:'col-97-sp', valid: 'required', options: baseData.sxfOptions,radio:true,span:9},
          ]
        },
        {
          columns:[
            {name:'nervousReflex[生理反射]', type:'checkinput-3', valid: 'required', options: baseData.slfsOptions,radio:true,span:8},
            {name:'nervousReflex[病理反射]', type:'checkinput-3', valid: 'required', options: baseData.blfsOptions,radio:true,span:8},
          ]
        }
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
