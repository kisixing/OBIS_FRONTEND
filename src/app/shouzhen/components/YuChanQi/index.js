import React, { Component } from "react";
import { Modal } from 'antd';
import formRender from '../../../../render/form';
import * as baseData from '../../data';
import store from "../../../store";

export default class extends Component {
  static Title = '现病史';
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState()
    }
    store.subscribe(this.handleStoreChange);
  }
  handleStoreChange = () => {
    this.setState(store.getState());
  };

  config() {
    const { entity } = this.props;
    return {
      rows: [
        {
          columns: [
            { name: "gesmoc[末次月经]", type: "date", icon:'require',
              span: entity.add_FIELD_gesmoc_unknown && entity.add_FIELD_gesmoc_unknown[0] && entity.add_FIELD_gesmoc_unknown[0].label === '不详' ? 2 : 5,
              className: entity.add_FIELD_gesmoc_unknown && entity.add_FIELD_gesmoc_unknown[0] && entity.add_FIELD_gesmoc_unknown[0].label === '不详' ? 'hide-icon hide-date' : 'hide-icon' },
            { name: "add_FIELD_gesmoc_unknown", type: 'checkinput', options: baseData.bxOptions,
              span: entity.add_FIELD_gesmoc_unknown && entity.add_FIELD_gesmoc_unknown[0] && entity.add_FIELD_gesmoc_unknown[0].label === '不详' ? 4 : 1,},
            { name: "gesexpect[预产期-月经]", type: "date", span: 5 },
            { span: 1 },
            { name: "gesexpectrv[预产期-B超]", type: "date", span: 5, valid: "required" }
          ]
        },
        // {
        //   columns: [
        //     { name: "ckzdate[早孕-B超]", type: "date", span: 5 },
        //     { span: 1 },
        //     { name: "ckztingj(周)[停经]", type: "input", span: 5 },
        //     { span: 1 },
        //     { name: "ckzcrl(mm)[CRL]", type: "input", span: 4 },
        //     { name: "ckzbpd(mm)[NT]", className: 'label-right', type: "input", span: 4, valid: 'rang(0,2.499)' },
        //     { name: "ckzweek(周)[如孕]", className: 'label-right', type: "input", span: 4, valid: "symbol(+)" },
        //   ]
        // },

        {
          name: 'ultrasounds', span: 24, groups: index => ({
            rows: [
              {
                columns: [
                  { name: "checkdate[早孕-B超]", type: "date", span: 5, filter: () => index === 0 },
                  { span: index === 0 ? 1 : 11 },
                  { name: "menopause(周)[停经]", type: "input", span: 5, filter: () => index === 0 },
                  { span: 1 },
                  { name: "crl(mm)[CRL]", className: 'crl-item', type: "input", span: 3 },
                  { name: "bpd(mm)[NT]", className: 'label-right', type: "input", span: 3, valid: 'rang(0,2.499)' },
                  { name: "gestationalWeek(周)[如孕]", className: 'label-right', type: "input", span: 3, valid: "symbol(+)" },
                  { span: 1 },
                  {
                    name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                    filter: entity => entity.ultrasounds && entity.ultrasounds.length !== 1,
                    onClick: (e, text, resolve) => {
                      Modal.confirm({
                        title: '您是否确认要删除该记录',
                        width: '300',
                        style: {top:'50%', left: '30%', fontSize: '18px' },
                        onOk: () => this.handleChange(e, resolve, index)
                      });
                    }
                  },
                  { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small',
                    filter: entity => entity.ultrasounds && entity.ultrasounds.length === index + 1,
                    onClick: (e, text, resolve) => this.handleChange(e, resolve)},
                ]
              }
            ]
          })
        },

        // { name: 'ckyibzhzh[一般症状]', type: 'checkinput-4', valid: 'required',options: baseData.ybzzOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        {
          columns: [
            { name: "add_FIELD_shouyun[受孕方式]", className: 'ivf-item', type: "checkinput-8", span: 24, valid: "required", radio: true, options: baseData.syfsOptions }
          ]
        },
        {
          columns: [
            { name: 'add_FIELD_chiefComplaint[主诉]', type: 'input', span: 17 },
          ]
        },
        // {
        //   columns: [
        //     { name: 'ckyibzhzhtd(周)[胎动开始]', type: 'input', span: 5, valid: 'required,number' },
        //   ]
        // },

        // '尿妊娠试验阳性',
        // {
        //   columns: [
        //     { name: 'dopupt[报告时间]', type: 'date', span: 5},
        //     { name: 'pupttm(周)[停经]', type: 'input', span: 5},
        //   ]
        // },
      ]
    };
  }

  handleChange(e, resolve, index) {
    const { entity, onChange } = this.props;
    let ultrasounds = entity.ultrasounds || [{}];
    if (/^\d$/.test(index)) {
      ultrasounds = ultrasounds.filter((v, i) => i !== index);
    } else {
      ultrasounds.push({});
    }
    onChange(e, { name: 'ultrasounds', value: ultrasounds });
    resolve();
  }


  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="ben-yun-qk">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
