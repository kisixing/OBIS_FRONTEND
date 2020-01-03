import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '过去史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        // {
        //   columns:[
        //     { name: 'bsjibing[疾病史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.jibOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        //   ]
        // },
        {
          label: '疾病史:', span: 12, className:'labelclass2'
        },
        {
          columns:[
            {span:2},
        { name: 'bsshoushu[高血压]', type: 'checkinput', valid: 'required', unselect: '无', radio: true, options: baseData.wssOptions,span:15 },
          ]
        },
        {
          columns:[
            {span:2},
        { name: 'bsshoushu[糖尿病]', type: 'checkinput', valid: 'required', unselect: '无', radio: true, options: baseData.wssOptions,span:15 },
      ]
    },
    {
      columns:[
        {span:2},
        { name: 'bsshoushu[心脏病]', type: 'checkinput', valid: 'required', unselect: '无', radio: true, options: baseData.wssOptions,span:15 },
      ]
    },
    {
      columns:[
        {span:2},
        { name: 'bsshoushu[其他病史]', type: 'checkinput', valid: 'required', unselect: '无', radio: true, options: baseData.wssOptions,span:15 },
      ]
    },
    {
      columns:[
        { name: 'operationHistory[手术史]', type: 'table', valid: 'required', pagination: false, editable: true, options: baseData.shoushushiColumns },
      ]
    },
    {
      columns:[
        { name: 'bsguomin[过敏史]', type: 'checkinput', valid: 'required', options: baseData.ywgmOptions, unselect: '无' },
      ]
    },
    {
      columns:[
        { name: 'hobtabp[输血史]', type: 'checkinput', valid: 'required', unselect: '无', options: baseData.sxsOptions },
      ]
    }
      ]
    };
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="guoqushi">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
