import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '过去史';
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
        {name:'jbs[疾病史]', type:'checkinput', valid: 'required',options:baseData.jibOptions},
        {name:'wss[外伤史]', type:'checkinput', valid: 'required',options:['无','有']},
        {name:'sss[手术史]', type:'table', valid: 'required',pagination: false,options:baseData.shoushushiColumns},
        {name:'gjtp[既往宫颈涂片结果]', type:'checkinput',options:baseData.gjtpOptions},
        {name:'xzp[输血及血制品史]', type:'checkinput', valid: 'required',options:baseData.xzpOptions},
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
      <div className="guoqishi">
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
