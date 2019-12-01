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
            {name:'vfxx2[]', type: 'select',span:3, valid: 'required', options: baseData.xuexingOptions},
          ]
        },      
        {
          columns:[
            {name:'nfxx[男方血型]', icon:'male-Gender', type: 'select',span:4, valid: 'required', options: baseData.xuexingOptions},
            {name:'nfxx2[]', type: 'select',span:3, valid: 'required', options: baseData.xuexingOptions},
          ]
        },
        {
          columns:[
            {name:'ygldb[乙肝两对半]', type:'checkinput-4', options: baseData.ygOptions,unselect:'正常', span:16}
          ]
        },
        {
          columns:[
            {name:'ygdna[乙肝DNA]', type:'checkinput-4', options: baseData.yywOptions,radio:true,span:16}
          ]
        },
        {
          columns:[
            {name:'bggt[丙肝抗体]', type:'checkinput-4', options: baseData.yywOptions,radio:true,span:16}
          ]
        },
        {
          columns:[
            {name:'bgrna[丙肝RNA]', type:'checkinput-4', options: baseData.yywOptions,radio:true,span:16}
          ]
        },
        {
          columns:[
            {name:'md[梅毒]', type:'checkinput-4',radio:true, options: baseData.mdOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'ogtt[OGTT]', type:'checkinput-4',radio:true, options: baseData.ogttOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'vfdp[女方地贫]', icon:'environment-o', type:'checkinput-4',radio:true, options: baseData.dpOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'nfdp[男方地贫]', icon:'environment', type:'checkinput-4',radio:true, options: baseData.dpOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'ndb[尿蛋白]', type:'checkinput-4',radio:true, options: baseData.dbnOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'hiv[HIV]', type:'checkinput-4',radio:true, options: baseData.yywOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'gbs[GBS]', type:'checkinput-4',radio:true, options: baseData.yywOptions,span:16}
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
