import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '本孕情况';
  constructor(props) {
    super(props);
    this.state = {
      entity: {}
    };
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
        { name: 'ybzz[一般症状]', type: 'checkinput', valid: 'required', options: baseData.ybzzOptions },
        {
          columns: [
            { name: 'tdks(周)[胎动开始]', type: 'input', span: 5, valid: 'required,number' },
          ]
        },
        
        '尿妊娠试验阳性',
        {
          columns: [
            { name: 'rcbgsj[报告时间]', type: 'date', span: 5 },
            { name: 'rctj[停经]', type: 'input', span: 5 },
          ]
        },
        '早孕B超',
        {
          columns: [
            { name: 'zybgsj[报告时间]', type: 'date', span: 5 },
            { name: 'zytj[停经]', type: 'input', span: 5 },
          ]
        },
      ]
    };
  }

  handleChange(e, { name, value, valid }) {
    this.setState({
      [name]: value
    });
  }

  render() {
    const { entity } = this.state;
    return (
      <div className="bingyunqingkuang">
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
