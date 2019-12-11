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
        {name:'preghis', type:'table', valid: 'required',pagination: false,editable:true,options:baseData.pregnanciesColumns},
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
