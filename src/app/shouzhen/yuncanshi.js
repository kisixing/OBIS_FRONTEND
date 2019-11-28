import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '孕产史';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {name:'sss', type:'table', valid: 'required',pagination: false,options:baseData.pregnanciesColumns},
      ]
    };
  }

  render(){
    const { entity, onChaneg } = this.props;
    return (
      <div className="guoqishi">
        {formRender(entity, this.config(), onChaneg)}
      </div>
    )
  }
}
