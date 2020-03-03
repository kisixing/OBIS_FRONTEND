import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '一般病史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        { label: "疾病史", span: 12, className: "labelclass" },
        {
          columns: [
            { span: 1 },
            {
              name: "add_FIELD_gaoxueya[高血压]",
              type: "checkinput",
              valid: "required",
              className: 'long-ipt',
              radio: true,
              options: baseData.wssOptions,
              span: 8
            },
            {
              name: "add_FIELD_tangniaobing[糖尿病]",
              type: "checkinput",
              valid: "required",
              className: 'long-ipt',
              radio: true,
              options: baseData.wssOptions,
              span: 8
            },
            {
              name: "add_FIELD_xinzangbing[心脏病]",
              type: "checkinput",
              valid: "required",
              className: 'long-ipt',
              radio: true,
              options: baseData.wssOptions,
              span: 7
            }
          ]
        },
        {
          columns: [
            { span: 1 },
            {
              name: "add_FIELD_qitabingshi[其@他]",
              type: "checkinput",
              className: 'long-ipt-2',
              radio: true,
              options: baseData.wssOptions,
              span: 15
            }
          ]
        },
        {
          columns: [
            { span: 1 },
            {
              name: "noneChecked1[ ]",
              type: "checkinput",
              className: "none_check",
              radio: true,
              options: baseData.noneOptions,
              span: 15
            }
          ]
        },
        // {
        //   columns: [
        //     { span: 1 },
        //     {
        //       name: "bsshoushuother[外伤史]",
        //       type: "checkinput",
        //       valid: "required",
        //       className: 'long-ipt-2',
        //       radio: true,
        //       options: baseData.wssOptions,
        //       span: 15
        //     }
        //   ]
        // },
        {
          columns: [
            { span: 1 },
            {
              name: "operationHistory[手术史]",
              type: "table",
              // valid: "required",
              buttonSize: "default",
              pagination: false,
              editable: true,
              options: baseData.shoushushiColumns,
              className: "table-wrapper",
              span: 23
            }
          ]
        },
        {
          columns: [
            { span: 1 },
            {
              name: "bsguomin[过敏史]",
              type: "checkinput",
              valid: "required",
              options: baseData.ywgmOptions,
              unselect: "无",
              span: 23
            }
          ]
        },
        {
          columns: [
            { span: 1 },
            {
              name: "hobtabp[输血史]",
              type: "checkinput-4",
              valid: "required",
              radio: true,
              options: baseData.sxsOptions,
              span: 23
            }
          ]
        },
        {
          columns: [
            { span: 1 },
            {
              name: "add_FIELD_symptom[其@他]",
              type: "select",
              options: baseData.zsOptions,
              autoInsert: true,
              showSearch: true,
              span: 15
            }
          ]
        },
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
