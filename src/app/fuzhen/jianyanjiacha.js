import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from '../shouzhen/data';

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
            {name:'ckxuex[女方血型]', icon:'female-Gender', type: 'select',span:4, options: baseData.xuexingOptions},
            {name:'ckrh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span:2},
            {name:'thalassemia[女方地贫]', icon:'female-Gender', type:'checkinput-5',radio:true, valid: 'required', options: baseData.dpOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'hbsAg[乙肝两对半]', className:' col-tg-sp', type:'checkinput-5',valid: 'required', options: baseData.ygOptions,radio:true,span:18}
          ]
        },
        {
          columns:[
            {name:'hbsAgDNA(IU/ml)[乙肝DNA]', type:'input', span:5},
            {span:1},
            {name:'hbsAgALT(U/L)[ALT]', type:'input', span:5},
            {span:1},
            {name:'hbsAgAST(U/L)[AST]',type:'input', span:5}
          ]
        },
        {
          columns:[
            {name:'hcvAb[丙肝抗体]', type:'checkinput-5',valid: 'required', options: baseData.yywOptions,radio:true,span:12},
            {name:'hcvAbRNA[丙肝RNA]', type:'checkinput-5', valid: 'required', options: baseData.yywOptions,radio:true,span:12}
          ]
        },
        {
          columns:[
            {name:'rpr[梅毒]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.mdOptions,span: 15}
          ]
        },
        {
          columns:[
            {name:'aids[HIV]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'tsh[TSH](uIU/ml)', type:'input', span:5},
            {span:1},
            {name:'freeT3[游离T3](pmol/L)', type:'input', span:5},
            {span:1},
            {name:'freeT4[游离T4](pmol/L)',type:'input', span:5}
          ]
        },
        {
          columns:[
            {name:'proteinuria[尿蛋白]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.dbnOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'hb(g/L)[Hb]', type:'input', span:5},
            {span:1},
            {name:'mcv(fL)[MCV]',type:'input', span:5},
            {span:1},
            {name:'plt(x10^9/L)[PLT]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'ogtt[OGTT]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.ogttOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'gbs[GBS]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'husbandCkxuex[男方血型]', icon:'male-Gender', type: 'select',span:4, options: baseData.xuexingOptions},
            {name:'husbandRh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span: 2},
            {name:'husbandThalassemia[男方地贫]', icon:'male-Gender', type:'checkinput-5',radio:true, valid: 'required', options: baseData.dpOptions,span:15}
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
