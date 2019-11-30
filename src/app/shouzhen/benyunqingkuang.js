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
            { name: 'mcyj[末次月经]', type: 'date', span: 5, valid: 'required' },
            { name: 'ycq[预产期]', type: 'date', span: 5, valid: 'required' },
            { span: 1 },
            { name: 'xdycq[修订预产期]', type: 'date', span: 5, valid: 'required' },
          ]
        },
        { name: 'ybzz[一般症状]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.ybzzOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        {
          columns: [
            { name: 'tdks(周)[胎动开始]', type: 'input', span: 5, valid: 'required,number' },
          ]
        },
        
        '尿妊娠试验阳性',
        {
          columns: [
            { name: 'rcbgsj[报告时间]', type: 'date', span: 5 },
            { name: 'rctj(周)[停经]', type: 'input', span: 5 },
          ]
        },
        '早孕B超',
        {
          columns: [
            { name: 'zybgsj[报告时间]', type: 'date', span: 5 },
            { name: 'zytj(周)[停经]', type: 'input', span: 5 },
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_160">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
