import React, { Component } from "react";
import {valid} from '../../../../render/common';
import formRender from '../../../../render/form';
import * as baseData from '../../data';

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
            { 
              name: 'ckpressure(mmHg)[血压]', className: 'short-ckpressure', type: ['input(/)','input'], span: 5, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`pureNumber|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            {name:'add_FIELD_pulse(次/分)[脉搏]', className: 'short-pluse', type:'input', span:3, valid: 'required|pureNumber|rang(0,100)'},
            {name:'cksheng(cm)[身高]', type:'input', className: 'short-cksheng', span:4, valid: 'required|number|rang(150,250)'},
            {name:'cktizh(kg)[孕前体重]', className: 'short-cktizh', type:'input', span:4, valid: 'required|number|rang(10,100)'},
            {name:'ckcurtizh(kg)[现体重]', type:'input', span:3, valid: 'required|number|rang(0,500)'},
            {span: 1},
            {name:'ckbmi(kg/㎡)[孕前BMI]',className:'col-97-sp', type:'input', span:4, valid: 'required|number|rang(18.5,24.9)'},
          ]
        },
        // {
        //   columns:[
        //     {name:'cktizh(kg)[孕前体重]', type:'input', span:3, valid: 'required|number|rang(10,100)'},
        //     {span:5},
        //     {name:'ckcurtizh(kg)[现体重]', type:'input', span:3, valid: 'required|number|rang(0,500)'},
        //     {span:5},
        //     {name:'ckbmi(kg/㎡)[孕前BMI]',className:'col-97-sp', type:'input', span:4, valid: 'required|number|rang(18.5,24.9)'},
        //   ]
        // },
        {
          columns:[
            { 
              name: 'secondCkpressure(mmHg)[血压二测]', className: 'short-ckpressure', type: ['input(/)','input'], span: 5, valid: (value)=>{
                let message = '';
                if(value){
                  message = [0,1].map(i=>valid(`pureNumber|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
                }
                return message;
              }, 
              filter: entity => entity.secondBpSystolic && entity.secondBpDiastolic
            },
            { 
              name: 'threeCkpressure(mmHg)[血压三测]', className: 'short-ckpressure', type: ['input(/)','input'], span: 5, valid: (value)=>{
                let message = '';
                if(value){
                  message = [0,1].map(i=>valid(`pureNumber|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
                }
                return message;
              }, 
              filter: entity => entity.threeBpSystolic && entity.threeBpDiastolic
            },
          ]
        },
        {
          columns:[
            {name:'add_FIELD_headFeatures[头颅五官]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'ckpifu[皮肤黏膜]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'ckjiazhx[甲状腺]', className: 'long-ipt', type:'checkinput-4', valid: 'required', options: baseData.noOptions,radio:true,span:8},
            // {name:'vascularMurmur[血管杂音]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.nhOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckrut[乳房乳腺]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'breathSounds[呼吸音]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.coOptions,radio:true,span:8},
            {name:'breathSoundsOther[啰音]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.nhOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'cardiac(次/分)[心率]', type:'input',valid: 'required|pureNumber', span:4},
            {span:4},
            {name:'heart[心律]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.xinlvOptions,radio:true,span:8},
            {name:'murmurs[杂音]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.nhOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckganz[肝脏]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.cjOptions,radio:true,span:8},
            {name:'ckpiz[脾脏]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.cjOptions,radio:true,span:8},
            {name:'ckshenz[肾区叩痛]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.nhOptions,radio:true,span:8},
          ]
        },
        {
          columns:[
            {name:'ckjizh[脊柱]', className: 'long-ipt', type:'checkinput-4',valid: 'required', options: baseData.noOptions,radio:true,span:8},
            {name:'nervousReflex[生理反射]', className: 'long-ipt', type:'checkinput-4', valid: 'required', options: baseData.slfsOptions,radio:true,span:8},
            {name:'vascularMurmurOther[病理反射]', className: 'long-ipt', type:'checkinput-4', valid: 'required', options: baseData.nhOptions,radio:true,span:8},
            // {name:'nervousReflex[双膝反射]', type:'checkinput', className:'col-97-sp', valid: 'required', options: baseData.sxfOptions,radio:true,span:9},
          ]
        },
        {
          columns:[
            {name:'ckfuzh[下肢水肿]', type:'checkinput', className:'col-xz-sp', valid: 'required', options: baseData.xzfOptions, radio:true, span:12},
          ]
        },
        {
          columns:[
            {name:'add_FIELD_checkup_other[其他]', type:'input', span: 21},
          ]
        }
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="label-4 ti-ge-jc">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
