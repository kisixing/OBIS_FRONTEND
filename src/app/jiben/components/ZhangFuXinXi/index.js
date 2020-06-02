import React, { Component } from "react";
import formRender from '../../../../render/form';
import * as baseData from '../../../shouzhen/data';

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
            { span: 1 },
            { name: "userhage[年龄]", type: "input", span: 4, valid: "pureNumber" },
            { span: 1 },
            { name: "userhmcno[门诊号]", type: "input", span: 6, valid: "pureNumber" }
          ]
        },
        {
          columns: [
            { name: "userhnation[国籍]", type: "input", span: 5 },
            { span: 1 },
            { name: "userhroots[籍贯]", type: "select", span: 4, options: baseData.jgOptions },
            { span: 1 },
            { name: "userhpeople[民族]", type: "select", span: 6, options: baseData.mzOptions },
          ]
        },
        {
          columns: [
            { name: "userhmobile[手机]", type: "input", span: 5 },
            { span: 1 },
            { name: "add_FIELD_husband_useridtype[证件类型]", type: "select", span: 4, options: baseData.zjlxOptions },
            { span: 1 },
            { name: "userhidno[证件号]", type: "input", span: 6 },
            { span: 1 },
            // { name: "userhconstant[户口属地]", type: "input", span: 6 }
          ]
        },
        {
          columns: [      
            { name: "userhoccupation[职业]", type: "select", span: 5, options: baseData.zyOptions },
            { span: 1 },
            { name: "add_FIELD_husband_smoking(支/天)[抽烟]", type: "input", span: 4, valid: "number" },
            { span: 1 },
            { name: entity => "add_FIELD_husband_drink_data[喝酒]" + (!entity.add_FIELD_husband_drink_data[0] || isMY(entity.add_FIELD_husband_drink_data[0]) ? "(ml/天)" : ""),
              className: "h_26", span: 6,
              type: [{ type: "select", options: baseData.jiuOptions, multiple: true, defaultValue: [], span: 15 },
                     { type: "input", span: 8, valid: "number", filter: data => !data || isMY(data[0])}]
            },
          ]
        },
        {
          columns: [
            { name: "userhjib[现有何病]", type: "input", span: 17 }
          ]
        },
        {
          columns: [
            { name: "h_root[户口地址]", className: "h_24", span: 17,
              type: [{ type: "districtSelect", span: 16 }, { type: "input", span: 8, placeholder: "请输入详细地址" }]
            },
          ]
        },
      ]
    };
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="label-4">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
