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
        {name:'jbs[药物或食物过敏史]', type:'checkinput', valid: 'required',options:baseData.ywgmOptions},
        {name:'wss[个人史]', type:'checkinput', valid: 'required',options:baseData.grsOptions},
        {name:'sss[家族史]', type:'checkinput', valid: 'required',options:baseData.jzsOptions},
        {columns:[
          {span:4},
          {rows:[
            {name:'gjtp[遗传病（男方）]', icon:'man', type:'checkinput',options:baseData.ychOptions},
            {name:'xzp[遗传病（女方）]', icon:'woman', type:'checkinput', valid: 'required',options:baseData.ychOptions}
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
