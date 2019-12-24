import React, { Component } from "react";

import * as baseData from './data';
import formRender from '../../render/form';

export default class extends Component {
  static Title = '孕妇信息';
  static entityParse(obj = {}){
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
            { name: 'userage[年龄]', type: 'input', span: 5, valid: 'required|number'},
            { span: 1 }, 
            { name: 'userbirth[出生日期]', type: 'date', span: 5,valid: 'required'},
            { span: 1 },
            { name: 'usercuzh[建档日期]', type: 'date', span: 5 ,valid: 'required'},
          ]
        },
        {
          columns: [
            { name: 'usernation[国籍]', type: 'input', span: 5 ,valid: 'required'},
            { span: 1 },
            { name: 'userroots[籍贯]', type: 'input', span: 5 ,valid: 'required'},
            { span: 1 },
            { name: 'userpeople[民族]', type: 'input', span: 4 ,valid: 'required'},
            { span: 1 },
            { name: 'useroccupation[职业]', type: 'input', span: 6 ,valid: 'required'},
          ]
        }, {
          columns: [
            { name: 'usermobile[手机]', type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'phone[固话]', type: 'input', span: 5},
            { span: 1 },
            { name: 'useridtype[证件类型]', type: 'select', span: 4, showSearch: false, options: baseData.sfzOptions ,valid: 'required'},
            { span: 1 },
            { name: 'useridno[证件号码]', type: 'input', span: 6 ,valid: 'required'}
          ]
        }, {
          columns: [
            { name: 'userconstant[户口地址]', type: 'input', span: 11,valid: 'required'},
            { span: 1 },
            { name: 'useraddress[现住地址]', type: 'input', span: 11,valid: 'required'},
            { span: 1 },
          ]
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
