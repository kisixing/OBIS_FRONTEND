import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '检验检查';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            {name:'vfxx[女方血型]', icon:'female-Gender', type: 'select',span:4, valid: 'required', options: baseData.xuexingOptions},
            {name:'vfxx2[]', type: 'select',span:2, valid: 'required', options: baseData.xuexing2Options},
            {span:2},
            {name:'nfxx[男方血型]', icon:'male-Gender', type: 'select',span:4, valid: 'required', options: baseData.xuexingOptions},
            {name:'nfxx2[]', type: 'select',span:2, valid: 'required', options: baseData.xuexing2Options},
          ]
        },
        {
          columns:[
            {name:'ygldb[乙肝两对半]', type:'checkinput-5', options: baseData.ygOptions,unselect:'正常', span:15}
          ]
        },
        {
          columns:[
            {name:'ygdna[乙肝DNA]', className:'col-8-sp', type:'checkinput-3', options: baseData.yywOptions,radio:true,span:9},
            {name:'alt(U/L)[ALT]', type:'input', span:4},
            {span:1},
            {name:'ast(UL)[AST]',type:'input', span:4}
          ]
        },
        {
          columns:[
            {name:'bggt[丙肝抗体]', type:'checkinput-5', options: baseData.yywOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            {name:'bgrna[丙肝RNA]', type:'checkinput-5', options: baseData.yywOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            {name:'md[梅毒]', type:'checkinput-5',radio:true, options: baseData.mdOptions,span: 24}
          ]
        },
        {
          columns:[
            {name:'hiv[HIV]', type:'checkinput-5',radio:true, options: baseData.yywOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'ogtt[OGTT]', type:'checkinput-5',radio:true, options: baseData.ogttOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'vfdp[女方地贫]', icon:'environment-o', type:'checkinput-5',radio:true, options: baseData.dpOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'nfdp[男方地贫]', icon:'environment', type:'checkinput-5',radio:true, options: baseData.dpOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'ndb[尿蛋白]', type:'checkinput-5',radio:true, options: baseData.dbnOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'gbs[GBS]', type:'checkinput-5',radio:true, options: baseData.yywOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'hb(g/L)[Hb]', type:'input', span:5},
            {span:1},
            {name:'mcv(fL)[MCV]',type:'input', span:5},
            {span:1},
            {name:'plt(x10^9L)[PLT]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'other[其他]', type:'input', span:11},
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_7">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
