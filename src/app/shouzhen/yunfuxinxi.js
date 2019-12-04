import React, { Component } from "react";

import * as baseData from './data';
import formRender from '../../render/form';

export default class extends Component {
  static Title = '孕妇信息';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: 'userhage[年龄]', type: 'input', span: 5, valid: 'number' },
            { span: 1 }, 
            { name: 'userbirth[出生日期]', type: 'date', span: 5 },
            { span: 1 },
            { name: 'usercuzh[建档日期]', type: 'date', span: 5 },
          ]
        },
        {
          columns: [
            { name: 'userhnation[国籍]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'userroots[籍贯]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'userpeople[民族]', type: 'input', span: 4 },
            { span: 1 },
            { name: 'useroccupation[职业]', type: 'input', span: 6 },
          ]
        }, {
          columns: [
            { name: 'usermobile[手机]', type: 'input', span: 5, valid: 'number' },
            { span: 1 },
            { name: 'phone[固话]', type: 'input', span: 5},
            { span: 1 },
            { name: 'useridtype[证件类型]', type: 'select', span: 4, showSearch: false, options: baseData.sfzOptions },
            { span: 1 },
            { name: 'useridno[身份证号]', type: 'input', span: 6 }
          ]
        }, {
          columns: [
            { name: 'constant[户口地址]', type: 'input', span: 11},
            { span: 1 },
            { name: 'address[现住地址]', type: 'input', span: 11},
            { span: 1 },
          ]
        }
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity.gravidaInfo, this.config(), onChange)}
      </div>
    )
  }
}
