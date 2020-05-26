import React, { Component } from "react";

import formRender from '../../../../render/form';
import * as baseData from '../../../shouzhen/data';
import { date } from "../../../../render/common/date";

export default class extends Component {
  static Title = '丈夫信息';
  constructor(props) {
    super(props);
  }

  config() {
    const isMY = data => data && data!=='无' && data.value!=='无';
    return {
      rows: [
        {
          columns: [
            { name: "userhname[丈夫姓名]", type: "input", span: 5 },
            { name: "userhage[年龄]", type: "input", span: 4, valid: "pureNumber" },
            { span: 2 },
            { name: "userhmcno[门诊号]", type: "input", span: 6, valid: "pureNumber" }
          ]
        },
        {
          columns: [
            { name: "userhnation[国籍]", type: "input", span: 5 },
            { name: "userhroots[籍贯]", type: "select", span: 4, options: baseData.jgOptions },
            { span: 2 },
            { name: "userhpeople[民族]", type: "select", span: 6, options: baseData.mzOptions },
            { span: 1 },
            { name: "userhoccupation[职业]", type: "select", span: 6, options: baseData.zyOptions }
          ]
        },
        {
          columns: [
            { name: "userhmobile[手机]", type: "input", span: 5 },
            { name: "add_FIELD_husband_useridtype[证件类型]", type: "select", span: 4, options: baseData.zjlxOptions },
            { span: 2 },
            { name: "userhidno[证件号]", type: "input", span: 6 },
            { span: 1 },
            // { name: "userhconstant[户口属地]", type: "input", span: 6 }
          ]
        },
        {
          columns: [
            { name: "add_FIELD_husband_smoking(支/天)[抽烟]", type: "input", span: 5, valid: "number" },
            { name: entity => "add_FIELD_husband_drink_data[喝酒]" + (!entity.add_FIELD_husband_drink_data[0] || isMY(entity.add_FIELD_husband_drink_data[0]) ? "(ml/天)" : ""),
              className: "h_26", span: 6,
              type: [{ type: "select", options: baseData.jiuOptions, multiple: true, defaultValue: [], span: 15 },
                     { type: "input", span: 8, valid: "number", filter: data => !data || isMY(data[0])}]
            },
            { name: "userhjib[现有何病]", type: "input", span: 12 }
          ]
        },
        {
          columns: [
            { name: "h_root[户口地址]", className: "h_24", span: 20,
              type: [{ type: "districtSelect", span: 16 }, { type: "input", span: 8, placeholder: "请输入详细地址" }]
            },
            // { name: 'add_FIELD_h_coming_this_city[来本市时间]', type: 'date', span: 4,
            //   filter: entity => entity.h_root && entity.h_root[0][1] !== '广州市'
            // }
          ]
        },
      ]
    };
  }

  // handleChange(e, { name, value, target }){
  //   const { onChange } = this.props;
  //   onChange(e, { name, value, target })
  // }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}