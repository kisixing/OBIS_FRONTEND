import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '个人史家族史';
  constructor(props) {
    super(props);
    this.state = {
      entity: {}
    };
  }

  config(){
    return {
      step: 1,
      rows: [
        {name:'jbs[药物或食物过敏史]', type:'checkinput', valid: 'required',options:baseData.ywgmOptions},
        {name:'wss[个人史]', type:'checkinput', valid: 'required',options:baseData.grsOptions},
        {name:'sss[家族史]', type:'checkinput', valid: 'required',options:baseData.jzsOptions},
        {name:'gjtp[遗传病（男方）]', type:'checkinput',options:baseData.ychOptions},
        {name:'xzp[遗传病（女方）]', type:'checkinput', valid: 'required',options:baseData.ychOptions}
      ]
    };
  }

  handleChange(e, {name,value,valid}){
    this.setState({
      [name]: value
    });
  }

  render(){
    const { entity } = this.state;
    return (
      <div>
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
