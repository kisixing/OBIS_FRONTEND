import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '丈夫信息';
  constructor(props) {
    super(props);
  }

  config() {
    const isMY = data => data && data!=='没有' && data.value!=='没有';
    return {
      rows: [
        {
          columns: [
            { name: 'userhname[丈夫姓名]', type: 'input', span: 5 },
            { name: 'userhage[年龄]', type: 'input', span: 4 },
            { span: 2 },
            { name: 'userhmcno[门诊号]', type: 'input', span: 6 },
          ]
        },
        {
          columns: [           
            { name: 'userhnation[国籍]', type: 'input', span: 5 },
            { name: 'add_FIELD_husband_userroots[籍贯]', type: 'input', span: 4 },
            { span: 2 },
            { name: 'userhpeople[民族]', type: 'input', span: 6 },
            { span: 1 },
            { name: 'userhoccupation[职业]', type: 'input', span:  6},
          ]
        },
        {
          columns: [
            { name: 'userhmobile[手机]', type: 'input', span: 5 },
            { name: 'add_FIELD_husband_useridtype[证件类型]', type: 'select', span: 4, options: baseData.zjlxOptions },
            { span: 2 },
            { name: 'userhidno[证件号]', type: 'input', span: 6 },
            { span: 1 },
            { name: 'userhconstant[户口属地]', type: 'input', span: 6 }
          ]
        },
        {
          columns: [
            { name: 'add_FIELD_husband_smoking(支/天)[抽烟]', type: 'input', span: 5 },
            { name: entity=>'add_FIELD_husband_drink_data[喝酒]' + (!entity.add_FIELD_husband_drink_data[0]||isMY(entity.add_FIELD_husband_drink_data[0])?'(ml/天)':''), className:'h_26', span: 6, type: [
                { type: 'select', options: baseData.jiuOptions },
                { type:'input',filter: data=>!data||isMY(data[0])}
              ] 
            },
            { name: 'userhjib[现有何病]', type: 'input', span: 12 }
          ]
        },
      ]
    }
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity/*.husbandInfo*/, this.config(), onChange)}
      </div>
    )
  }
}
