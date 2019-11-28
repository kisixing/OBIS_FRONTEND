import React, { Component } from "react";

import * as baseData from './data';
import formRender from '../../render/form';

export default class extends Component {
  static Title = '孕妇信息';
  constructor(props) {
    super(props);
    this.state = {
      entity: {}
    };
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: 'cjbh[产检编号]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'jdrq[建档日期]', type: 'date', span: 5 },
          ]
        },
        {
          columns: [
            { name: 'csrq[出生日期]', type: 'date', span: 5 },
            { span: 1 },
            { name: 'nl[年龄]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'gj[国籍]', type: 'input', span: 5 },
          ]
        },
        {
          columns: [
            { name: 'jg[籍贯]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'mz[民族]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zy[职业]', type: 'input', span: 5 },
          ]
        }, {
          columns: [
            { name: 'sj[手机]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'gh[固话]', type: 'input', span: 5, valid: 'number' }
          ]
        }, {
          columns: [
            { name: 'zjlx[证件类型]', type: 'select', span: 5, showSearch: false, options: baseData.sfzOptions },
            { span: 1 },
            { name: 'zfzh[身份证号]', type: 'input', span: 11 }
          ]
        }
      ]
    };
  }

  render() {
    const { entity, onChaneg } = this.props;
    return (
      <div>
        {formRender(entity, this.config(), onChaneg)}
      </div>
    )
  }
}
