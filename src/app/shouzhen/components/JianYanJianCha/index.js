import React, { Component } from "react";
import { get } from 'lodash';
import formRender from '../../../../render/form';
import * as baseData from '../../data';

export default class extends Component{
  static Title = '检验检查';
  constructor(props) {
    super(props);
  }

  config(){
    const { entity } = this.props;
    const unusualArr = ["↑", "↓", "异常"];
    return {
      step: 1,
      rows: [
        {
          columns:[
            {name:'husbandCkxuex[男方血型]', className: 'hide-icon', icon:'male-Gender', type: 'select',span:3, options: baseData.xuexingOptions},
            {name:'husbandRh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span: 1},
            {name:'husbandThalassemia[男方地贫]', className: 'short-dipin', icon:'male-Gender', type:'checkinput-5', unselect: '正常', valid: 'required', options: baseData.dpOptions, span: 18}
          ]
        },
        {
          columns:[
            {name:'ckxuex[女方血型]', className: 'hide-icon', icon:'female-Gender', type: 'select',span:3, options: baseData.xuexingOptions},
            {name:'ckrh[]', type: 'select',span:2, options: baseData.xuexing2Options},
            {span:1},
            {name:'thalassemia[女方地贫]', className: 'short-dipin', icon:'female-Gender', type:'checkinput-5', unselect: '正常', valid: 'required', options: baseData.dpOptions, span: 18}
          ]
        },
        {
          columns:[
            {name:'all_add_FIELD_TSH[TSH](uIU/ml)', className: unusualArr.includes(entity.add_FIELD_TSH_unusual) ? 'isRed' : '', type:'input', span: 5},
            {span:1},
            {name:'all_add_FIELD_free_t3[游离T3](pmol/L)', className: unusualArr.includes(entity.add_FIELD_free_t3_unusual) ? 'isRed' : '', type:'input', span: 5},
            {span:1},
            {name:'all_add_FIELD_free_t4[游离T4](pmol/L)',  className: unusualArr.includes(entity.add_FIELD_free_t4_unusual) ? 'isRed' : '', type:'input', span: 5}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_lis_hb(g/L)[HB]', className: unusualArr.includes(entity.add_FIELD_lis_hb_unusual) ? 'isRed' : '', type:'input', span: 5},
            {span:1},
            {name:'add_FIELD_lis_mcv(fL)[MCV]', className: unusualArr.includes(entity.add_FIELD_lis_mcv_unusual) ? 'isRed' : '', type:'input', span: 5},
            {span:1},
            {name:'add_FIELD_lis_plt(x10^9/L)[PLT]', className: unusualArr.includes(entity.add_FIELD_lis_plt_unusual) ? 'isRed' : '', type:'input', span: 5},
          ]
        },
        {
          columns:[
            {name:'add_FIELD_ndb[尿蛋白]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.dbnOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'hbsAg[乙肝两对半]', className:'add-ipt', type:'checkinput-5',valid: 'required', options: baseData.ygOptions,radio:true,span:12},
            {name:'add_FIELD_hbsAg_DNA(IU/ml)[HBV DNA]', className: unusualArr.includes(entity.add_FIELD_hbsAg_DNA_unusual) ? 'isRed' : '', type:'input', span:4, filter:entity => get(entity, 'hbsAg.0.label') === '异常'},
            {name:'add_FIELD_hbsAg_ALT(U/L)[ALT]', className: unusualArr.includes(entity.add_FIELD_hbsAg_ALT_unusual) ? 'isRed label-right' : 'label-right', type:'input', span:4, filter:entity => get(entity, 'hbsAg.0.label') === '异常'},
            {name:'add_FIELD_hbsAg_AST(U/L)[AST]', className: unusualArr.includes(entity.add_FIELD_hbsAg_AST_unusual) ? 'isRed label-right' : 'label-right', type:'input', span:4, filter:entity => get(entity, 'hbsAg.0.label') === '异常'},
          ]
        },
        {
          columns:[
            {name:'hcvAb[丙肝抗体]', className:'add-ipt', type:'checkinput-5',valid: 'required', options: baseData.yywOptions, radio:true, span:12},
            {name:'add_FIELD_hcvAb_RNA[丙肝RNA]', type:'checkinput-5', options: baseData.yywOptions, radio:true, span:12, filter: entity => get(entity, 'hcvAb.0.label') === '阳性'}
          ]
        },
        {
          columns:[
            {name:'rpr[梅毒]', className: 'short-item rpr', type:'checkinput-5',radio:true, valid: 'required', options: baseData.mdOptions,span:24}
          ]
        },
        {
          columns:[
            {name:'aids[HIV]', className:'add-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_GBS[GBS]', className:'add-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.yywOptions,span:12}
          ]
        },
        {
          columns:[
            {name:'ogtt[OGTT]', className: 'short-item', type:'checkinput-5',radio:true, valid: 'required', options: baseData.ogttOptions,span:24}
          ]
        },
        {
          columns:[
            {name:'add_FIELD_early_downs_syndrome[早唐]', className: 'short-syndrome', type:'checkinput-2', radio:true, options: baseData.fxOptions, span: 6},
            {name:'add_FIELD_mk_downs_syndrome[中唐]', type:'checkinput-2', radio:true, options: baseData.fxOptions, span: 6},
            {name:'add_FIELD_nipt[NIPT]', className: 'short-syndrome', type:'checkinput-2', radio:true, options: baseData.fxOptions, span: 6},
          ]
        },
        {
          columns:[
            {name:'add_FIELD_outpatient[产前诊断]', type:'checkinput-5', radio:true, options: baseData.cqzdOptions, span: 12},
          ]
        },
        {
          columns:[
            {name:'ckfzother[其他]', type:'input', span: 17},
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="jian-yan-jc">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
