import React, { Component } from "react";
import formRender from '../../render/form';
import * as baseData from './data';
import service from '../../service';
import store from "../store";

export default class extends Component {
  static Title = '预产期';
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
    const { onChange, entity } = this.props;
    return {
      rows: [
        {
          columns: [
            // { name: "gesmoc[末次月经]", type: "date", span: 6, valid: "required" },
            { name: "all_gesmoc[末次月经]", className: entity.all_gesmoc && entity.all_gesmoc[1] && entity.all_gesmoc[1][0] && entity.all_gesmoc[1][0].label === '不详' ? 'hide-date' : '', span: 7, valid: "required", 
              type: [
                { type: 'date'},
                { type: 'checkinput', options: baseData.bxOptions }
              ] 
            },
            { name: "gesexpect[预产期-日期]", type: "date", span: 6 },
            { name: "gesexpectrv[预产期-B超]", type: "date", span: 6, valid: "required" }
          ]
        },
        {
          columns: [
            { name: "ckzdate[早孕-B超]", type: "date", span: 6 },
            { span: 1 },
            { name: "ckztingj(周)[停经]", className: 'ting-j', type: "input", span: 5 },
            { name: "ckzcrl(mm)[CRL]", type: "input", span: 4 },
            { name: "ckzbpd(mm)[NT]", type: "input", span: 4 },
            { name: "ckzweek(周)[如@@孕]", type: "input", span: 4, valid: "symbol(+)" },
          ]
        },
        // {
        //   columns: [
        //     { name: 'ckyi[主诉]', type: 'input', span: 18, valid: 'required' },
        //   ]
        // },
        // { name: 'ckyibzhzh[一般症状]', type: 'checkinput-4', valid: 'required',options: baseData.ybzzOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        {
          columns: [
            { name: "add_FIELD_shouyun[受孕方式]",  type: "checkinput-4", span: 14, valid: "required", radio: true, options: baseData.syfsOptions }
          ]
        }
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

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_7 ben-yun-qk">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
