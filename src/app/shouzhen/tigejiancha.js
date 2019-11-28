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
            {name:'tz(kg)[现体重]', type:'input', span:5, valid: 'required|number|rang(10,100)'},
            {span:1},
            { 
              name: 'ckpressure(mmHg)[血压]', type: ['input(/)','input'], span: 5, valid: (value)=>{
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
            {span:1},
            {name:'id3(次/分)[脉搏]', type:'input', span:5, valid: 'required|number'},
          ]
        },
        {
          columns:[
            {name:'tz(kg)[孕前体重]', type:'input', span:5, valid: 'required|number|rang(10,100)'},
            {span:1},
            {name:'id3(cm)[身高]', type:'input', span:5, valid: 'required|number'},
            {span:1},
            {name:'id3(kg/㎡)[孕前BMI]', type:'input', span:5, valid: 'required|number'},
          ]
        },
        {
          columns:[
            {name:'id8[皮肤黏膜]', type:'checkinput', options: baseData.pfOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'id8[甲状腺]', type:'checkinput', options: baseData.neOptions,span:7},
            {name:'id8[血管杂音]', type:'checkinput', options: baseData.hnOptions,span:8},
            {name:'id3[其他]', type:'input', span:6},
          ]
        },
        {
          columns:[
            {name:'id8[乳头]', type:'checkinput', options: baseData.rtOptions,span:7}
          ]
        },
        {
          columns:[
            {name:'id8[呼吸音]', type:'checkinput', options: baseData.neOptions,span:7},
            {name:'id3[啰音]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'id3(次/分)[心率]', type:'input', span:6},
            {span:1},
            {name:'id8[心率]', type:'checkinput', options: baseData.xlOptions,span:8},
            {name:'id8[杂音]', type:'checkinput', options: baseData.hnOptions,span:9},
          ]
        },
        {
          columns:[
            {name:'id8[肝]', type:'checkinput', options: baseData.cjOptions,span:7},
            {name:'id8[脾]', type:'checkinput', options: baseData.cjOptions,span:8},
            {name:'id3[肾区叩痛]', type:'checkinput', options: baseData.sktOptions,span:9},
          ]
        },
        {
          columns:[
            {name:'id8[脊柱]', type:'checkinput', options: baseData.jxOptions,span:7},
            {name:'id8[下肢浮肿]', type:'checkinput', options: baseData.xzfOptions,span:8},
            {name:'id3[双膝反射]', type:'checkinput', options: baseData.sxfOptions,span:9},
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
