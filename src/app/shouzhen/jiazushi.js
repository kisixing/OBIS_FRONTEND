import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '个人史家族史';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {name:'userhistory[个人史]', type:'checkinput-4', valid: 'required',unselect:'无', options:baseData.grsOptions},
        {name:'add_FIELD_userhistory_fyys[服用叶酸]', type:'checkinput-4', valid: 'required',unselect:'无',options:baseData.ysOptions},
        {name:'mzxuan[家族史]', type:'checkinput-4', valid: 'required',options:baseData.jzsOptions},
        {columns:[
          {span:4},
          {rows:[
            {name:'add_FIELD_mzxuan61[遗传病（女方）]', icon:'female-Gender', type:'checkinput-4', valid: 'required',options:baseData.ychOptions},
            {name:'add_FIELD_mzxuan6[遗传病（男方）]', icon:'male-Gender', type:'checkinput-4', valid: 'required',options:baseData.ychOptions}
          ]}
        ]}
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
