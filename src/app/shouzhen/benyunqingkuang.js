import React, { Component } from "react";

import * as common from '../../utils/common';
import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '预产期';
  constructor(props) {
    super(props);
  }

  config() {
    const { onChange } = this.props;
    return {
      rows: [
        {
          columns: [
            { name: 'gesmoc[末次月经]', type: 'date', span: 5, valid: 'required'},
            { name: 'gesexpect[预产期-日期]', type: 'date', span: 5, valid: 'required'},
            { name: 'gesexpectrv[预产期-B超]', type: 'date', span: 6, valid: 'required' },
          ]
        },
        {
          columns: [
            { name: 'ckzdate[早孕B超]', type: 'date', span: 5, onChange: (e, {value})=>onChange(e, {name:'ckztingj', value:common.countWeek(value)}) },
            { name: 'ckztingj(周)[停 经]', type: 'input', span: 4 },
          ]
        },
        // {
        //   columns: [
        //     { name: 'ckyi[主诉]', type: 'input', span: 18, valid: 'required' },
        //   ]
        // },
        // { name: 'ckyibzhzh[一般症状]', type: 'checkinput-4', valid: 'required',options: baseData.ybzzOptions.map(v=>({...v, label:`${v.label}(input)`})) },  
        {
          columns: [
            { name: 'add_FIELD_shouyun[受孕方式]', type: 'checkinput-4',span: 14, valid: 'required',radio:true,unselect:'自然',options: baseData.syfsOptions.map(v=>({...v, label:`${v.label}(input)`})) },  
          ]
        },
        // {
        //   columns: [
        //     { name: 'ckyibzhzhtd(周)[胎动开始]', type: 'input', span: 5, valid: 'required,number' },
        //   ]
        // },
        
        // '尿妊娠试验阳性',
        // {
        //   columns: [
        //     { name: 'dopupt[报告时间]', type: 'date', span: 5},
        //     { name: 'pupttm(周)[停经]', type: 'input', span: 5},
        //   ]
        // },
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
