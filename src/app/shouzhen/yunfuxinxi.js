import React, { Component } from "react";

import * as baseData from './data';
import formRender from '../../render/form';

export default class extends Component {
  static Title = '孕妇信息';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: 'jdrq[建档日期]', type: 'date', span: 5 },
            { span: 1 },        
            { name: 'cjbh[产检编号]', type: 'input', span: 5, valid: 'number' },
          ]
        },
        {
          columns: [
            { name: 'csrq[出生日期]', type: 'date', span: 5 },
            { span: 1 },
            { name: 'nl[年龄]', type: 'input', span: 5, valid: 'number' },
          ]
        },
        {
          columns: [
            { name: 'gj[国籍]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'jg[籍贯]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'mz[民族]', type: 'input', span: 4 },
            { span: 1 },
            { name: 'zy[职业]', type: 'input', span: 6 },
          ]
        }, {
          columns: [
            { name: 'sj[手机]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'gh[固话]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'zjlx[证件类型]', type: 'select', span: 4, showSearch: false, options: baseData.sfzOptions },
            { span: 1 },
            { name: 'zfzh[身份证号]', type: 'input', span: 6 }
          ]
        }
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="guoqishi">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
