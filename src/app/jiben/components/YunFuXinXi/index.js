import React, { Component } from "react";

import * as baseData from '../../../shouzhen/data';
import formRender from '../../../../render/form';
import options from '../../../../utils/cascader-address-options';

export default class extends Component {
  static Title = '孕妇信息';
  static entityParse(obj = {}) {
    return {
      ...obj.gravidaInfo,
      useridtype: JSON.parse(obj.gravidaInfo.useridtype)
    }
  }
  static entitySave(entity = {}){
    return {
      ...entity
    }
  }
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: "userage[年龄]", type: "input", span: 5, valid: "required|pureNumber" },
            { span: 1 },
            { name: "userbirth[出生日期]", type: "date", span: 5, valid: "required" },
            { span: 1 },
            { name: "usercuzh[建档日期]", type: "date", span: 5, valid: "required" }
          ]
        },
        {
          columns: [
            { name: "usernation[国籍]", type: "input", span: 5, valid: "required" },
            { span: 1 },
            { name: "userroots[籍贯]", type: "select", span: 5, valid: "required", options: baseData.jgOptions },
            { span: 1 },
            { name: "userpeople[民族]", type: "select", span: 4, valid: "required", options: baseData.mzOptions },
            { span: 1 },
            { name: "useroccupation[职业]", type: "select", options: baseData.zyOptions, span: 6, valid: "required" }
          ]
        },
        {
          columns: [
            { name: "usermobile[手机]", type: "input", span: 5, valid: "pureNumber|required" },
            { span: 1 },
            { name: "phone[固话]", type: "input", span: 5, valid: "symbol(-)" },
            { span: 1 },
            { name: "useridtype[证件类型]", type: "select", span: 4, showSearch: false, options: baseData.sfzOptions, valid: "required" },
            { span: 1 },
            { name: "useridno[证件号码]", type: "input", span: 6, valid: "required" }
          ]
        },
        {
          columns: [
            { name: "root[户口地址]", className: "h_24", span: 17, valid: "required",
              type: [{ type: "districtSelect", span: 16 }, { type: "input", span: 8, placeholder: "请输入详细地址" }]
            },
            { name: 'add_FIELD_coming_this_city[来本市时间]', type: 'date', span: 4,
              filter: entity => entity.root && entity.root[0][1] !== '广州市'
            }
          ]
        },
        {
          columns: [
            { name: "address[现居地址]", className: "h_24", span: 17, valid: "required",
              type: [{ type: "districtSelect", span: 16 }, { type: "input", span: 8, placeholder: "请输入详细地址" }]
            }
          ]
        },
        // {
        //   columns: [
        //     {
        //       name: "root[户口地址]",
        //       className: "h_26",
        //       span: 11,
        //       valid: "required",
        //       type: [{ type: "cascader", options: options }, { type: "input" }]
        //     },
        //     { span: 1 },
        //     {
        //       name: "address[现居地址]",
        //       className: "h_26",
        //       span: 11,
        //       valid: "required",
        //       type: [{ type: "cascader", options: options }, { type: "input" }]
        //     },
        //     { span: 1 }
        //   ]
        // },
        {
          columns: [{ name: "add_FIELD_readdress[产休地址]", type: "input", span: 11, valid: "required" }]
        }
      ]
    };
  }

  handleChange(e, { name, value, target }){
    const { onChange } = this.props;
    onChange(e, { name, value, target })
    // 关联变动请按如下方式写，这些onChange页可以写在form配置的行里
    // if(name === 'test'){
    //   onChange(e, { name: 'test01', value: [value,value] })
    // }
  }

  render(){
    const { entity } = this.props;
    return (
      <div className="">
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
