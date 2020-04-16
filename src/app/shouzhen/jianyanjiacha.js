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
            {name:'husbandCkxuex[男方血型]', icon:'male-Gender', type: 'select',span:4, options: baseData.xuexingOptions},
            {name:'husbandRh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span: 2},
            {name:'husbandThalassemia[男方地贫]', className: 'short-dipin', icon:'male-Gender', type:'checkinput-5', unselect: '正常', valid: 'required', options: baseData.dpOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'ckxuex[女方血型]', icon:'female-Gender', type: 'select',span:4, options: baseData.xuexingOptions},
            {name:'ckrh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span:2},
            {name:'thalassemia[女方地贫]', className: 'short-dipin', icon:'female-Gender', type:'checkinput-5', unselect: '正常', valid: 'required', options: baseData.dpOptions,span:15}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_TSH[TSH](uIU/ml)', type:'input', span:5},
            {span:1},
            {name:'add_FIELD_free_t3[游离T3](pmol/L)', type:'input', span:5},
            {span:1},
            {name:'add_FIELD_free_t4[游离T4](pmol/L)',type:'input', span:5}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_lis_hb(g/L)[HB]', type:'input', span:5},
            {span:1},
            {name:'add_FIELD_lis_mcv(fL)[MCV]',type:'input', span:5},
            {span:1},
            {name:'add_FIELD_lis_plt(x10^9/L)[PLT]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'add_FIELD_ndb[尿蛋白]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.dbnOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'hbsAg[乙肝两对半]', className:'yi-gan', type:'checkinput-5',valid: 'required', options: baseData.ygOptions,radio:true,span:12},
            {name:'add_FIELD_hbsAg_DNA(IU/ml)[HBV DNA]', type:'input', span:4, filter:entity => entity.hbsAg && entity.hbsAg[0] && entity.hbsAg[0].label === '异常'},
            {name:'add_FIELD_hbsAg_ALT(U/L)[ALT]', type:'input', span:4, filter:entity => entity.hbsAg && entity.hbsAg[0] && entity.hbsAg[0].label === '异常'},
            {name:'add_FIELD_hbsAg_AST(U/L)[AST]', type:'input', span:4, filter:entity => entity.hbsAg && entity.hbsAg[0] && entity.hbsAg[0].label === '异常'},
          ]
        },
        {
          columns:[
            {name:'hcvAb[丙肝抗体]', type:'checkinput-5',valid: 'required', options: baseData.yywOptions,radio:true,span:12},
            {name:'add_FIELD_hcvAb_RNA[丙肝RNA]', type:'checkinput-5', valid: 'required', options: baseData.yywOptions,radio:true,span:12}
          ]
        },
        {
          columns:[
            {name:'rpr[梅毒]', className: 'short-item', type:'checkinput-5',radio:true, valid: 'required', options: baseData.mdOptions,span:24}
          ]
        },
        {
          columns:[
            {name:'aids[HIV]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_GBS[GBS]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'ogtt[OGTT]', className: 'short-item', type:'checkinput-5',radio:true, valid: 'required', options: baseData.ogttOptions,span:24}
          ]
        },
        {
          columns:[
            {name:'ckfzother[其他]', type:'input', span:11},
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_7 jian-yan-jc">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
