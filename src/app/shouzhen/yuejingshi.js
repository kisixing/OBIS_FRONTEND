import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '月经、婚姻史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: 'yjcuch(岁)[初潮]', type: 'select', span: 4, showSearch: true, options: baseData.ccOptions, valid: 'required'},
            { span: 2 },
            { name: 'yjzhouq(天)[周期]', type: 'input', span: 4, valid: 'number|required' },
            { span: 2 },
            { name: 'yjchix[持续天数]', className: 'width_7', type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'yjtongj[痛经]', type: 'checkinput', span: 6, valid: 'required', radio: true, options: baseData.plOptions },
          ]
        },
        {
          columns: [
            { name: 'maritalHistory[婚姻史]', type: 'select', span: 4, valid: 'required', options: baseData.hysOptions },
            { span: 1 },
            { name: 'userjiehn[本次结婚年龄]', className: 'width_7', type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'userjinqjh[近亲结婚]', className:'col-yjs-sp', type: 'checkinput', span: 5, radio: true, valid: 'required', options: baseData.jinqOptions },
          ]
        },
        {
          columns: [
            { name: 'historyOfInfertility[不孕病史]',className:'col-yjs-sp', type: 'checkinput-1', valid: 'required', unselect: '无', options: baseData.bybsOptions.map(v => ({ ...v, span: 8 })) },
          ]
        }
      ]
    };
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
