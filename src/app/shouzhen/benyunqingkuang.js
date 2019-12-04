import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '本孕情况';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      rows: [
        {
          columns: [
            { name: 'gesmoc[末次月经]', type: 'date', span: 5, valid: 'required' },
            { name: 'gesexpect[预产期]', type: 'date', span: 5, valid: 'required' },
            { span: 1 },
            { name: 'gesexpectrv[修订预产期]', type: 'date', span: 5, valid: 'required' },
          ]
        },
        { name: 'ckyibzhzh[一般症状]', type: 'checkinput-4', valid: 'required', unselect:'无', options: baseData.ybzzOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        {
          columns: [
            { name: 'ckyibzhzhtd(周)[胎动开始]', type: 'input', span: 5, valid: 'required,number' },
          ]
        },
        
        '尿妊娠试验阳性',
        {
          columns: [
            { name: 'dopupt[报告时间]', type: 'date', span: 5 },
            { name: 'pupttm(周)[停经]', type: 'input', span: 5 },
          ]
        },
        '早孕B超',
        {
          columns: [
            { name: 'ckzdate[报告时间]', type: 'date', span: 5 },
            { name: 'ckztingj(周)[停经]', type: 'input', span: 5 },
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_6">
        {formRender(entity.pregnantInfo, this.config(), onChange)}
      </div>
    )
  }
}
