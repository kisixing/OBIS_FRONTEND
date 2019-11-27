import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '丈夫信息';
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
            { name: 'zfxm[丈夫姓名]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zfnl[年龄]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zfgj[国籍]', type: 'input', span: 6 },
          ]
        },
        {
          columns: [
            { name: 'zfjg[籍贯]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zfmz[民族]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zfzy[职业]', type: 'input', span: 6 },
          ]
        },
        {
          columns: [
            { name: 'zhsj[手机]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zhzhlx[证件类型]', type: 'select', span: 5, options: baseData.zjlxOptions },
            { span: 1 },
            { name: 'zfzjh[证件号]', type: 'input', span: 6 },
          ]
        },
        {
          columns: [
            { name: 'zhhkdz[户口地址]', type: 'input', span: 18 }
          ]
        },
        {
          columns: [
            { name: 'zfcy(只/天)[抽烟]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'zfhj(ml/天)[喝酒]', type: [{ type: 'select', options: baseData.jiuOptions }, 'input'], span: 6 }
          ]
        },
        {
          columns: [
            { name: 'zfxyhb[现有何病]', type: 'input', span: 18 }
          ]
        },
      ]
    }
  }

  handleChange(e, { name, value, valid }) {
    this.setState({
      [name]: value
    });
  }

  render() {
    const { entity } = this.state;
    return (
      <div>
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
