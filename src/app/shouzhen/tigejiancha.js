import React, { Component } from "react";

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
            {name:'xtz(kg)[现体重]', type:'input', span:6, valid: 'required|number|rang(10,100)'},
            {span:1},
            { 
              name: 'ckpressure(mmHg)[血压]', type: ['input(/)','input'], span: 6, valid: (value)=>{
              let message = '';
              if(value){
                if(value[0] && valid('number|rang(0,140)',value[0])){
                  message += '第1个值' + valid('number|rang(0,140)',value[0])
                }else if(value[0] && valid('number|rang(0,110)',value[1])){
                  message += '第2个值' + valid('number|rang(0,140)',value[1])
                }
              }
              
              return message;
            }},
            {span:2},
            {name:'mb(次/分)[脉搏]', type:'input', span:6, valid: 'required|number'},
          ]
        },
        {
          columns:[
            {name:'yqtz(kg)[孕前体重]', type:'input', span:6, valid: 'required|number|rang(10,100)'},
            {span:1},
            {name:'sg(cm)[身高]', type:'input', span:6, valid: 'required|number'},
            {span:2},
            {name:'bmi(kg/㎡)[孕前BMI]', type:'input', span:6, valid: 'required|number'},
          ]
        },
        {
          columns:[
            {name:'pflm[皮肤黏膜]', type:'checkinput', options: baseData.pfOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'jzx[甲状腺]', type:'checkinput', options: baseData.neOptions,radio:true,span:7},
            {name:'xgzy[血管杂音]', type:'checkinput', options: baseData.hnOptions,radio:true,span:7},
            {span:1},
            {name:'id3[其他]', type:'input', span:6},
          ]
        },
        {
          columns:[
            {name:'rt[乳头]', type:'checkinput', options: baseData.rtOptions,radio:true,span:7}
          ]
        },
        {
          columns:[
            {name:'hxy[呼吸音]', type:'checkinput', options: baseData.neOptions,radio:true,span:7},
            {name:'ly[啰音]', type:'input', span:6},
          ]
        },
        {
          columns:[
            {name:'xl(次/分)[心率]', type:'input', span:6},
            {span:1},
            {name:'xl2[心率]', type:'checkinput', options: baseData.xlOptions,radio:true,span:7},
            {span:1},
            {name:'xlzy[杂音]', type:'checkinput', options: baseData.hnOptions,radio:true,span:7},
          ]
        },
        {
          columns:[
            {name:'gan[肝]', type:'checkinput', options: baseData.cjOptions,radio:true,span:7},
            {name:'pi[脾]', type:'checkinput', options: baseData.cjOptions,radio:true,span:7},
            {span:1},
            {name:'sqt[肾区叩痛]', type:'checkinput', options: baseData.sktOptions,span:7},
          ]
        },
        {
          columns:[
            {name:'jz[脊柱]', type:'checkinput', options: baseData.jxOptions,radio:true,span:7},
            {name:'xzfz[下肢浮肿]', type:'checkinput', options: baseData.xzfOptions,radio:true,span:11},
            {name:'sqfs[双膝反射]', type:'checkinput', options: baseData.sxfOptions,radio:true,span:12},
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
