import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '孕产史';
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
        {name:'sss', type:'table', valid: 'required',pagination: false,options:baseData.pregnanciesColumns},
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
