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
            { name: 'cc(岁)[初潮]', type: 'select', span: 5, showSearch: true, options: baseData.ccOptions },
            { span: 1 },
            { name: 'zq(天)[周期]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'cxts[持续天数]', type: 'input', span: 5, valid: 'number' },
          ]
        },
        {
          columns: [
            { name: 'jl[经量]', type: 'checkinput', span: 5, valid: 'required', options: baseData.slOptions },
            { span: 1 },
            { name: 'tj[痛经]', type: 'checkinput', span: 5, valid: 'required', options: baseData.plOptions },
          ]
        },
        {
          columns: [
            { name: 'hys[婚姻史]', type: 'select', span: 5, showSearch: false, options: baseData.hysOptions },
            { span: 1 },
            { name: 'jhnl[结婚年龄]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'jqjh[近亲结婚]', type: 'checkinput', span: 5, valid: 'required', options: baseData.yesOptions },
          ]
        },
        { name: 'bybs[不孕病史]', type: 'checkinput', options: baseData.bybsOptions },
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
