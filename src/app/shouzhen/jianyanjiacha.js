import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component{
  static Title = '检验检查';
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
        {
          columns:[
            {name:'id2[女方血型]', type: 'select',span:4, valid: 'required', options: baseData.xuexingOptions},
            {name:'id3[]', type: 'select',span:3, valid: 'required', options: baseData.xuexingOptions},
          ]
        },      
        {
          columns:[
            {name:'id2[男方血型]', type: 'select',span:4, valid: 'required', options: baseData.xuexingOptions},
            {name:'id3[]', type: 'select',span:3, valid: 'required', options: baseData.xuexingOptions},
          ]
        },
        {
          columns:[
            {name:'id8[乙肝两对半]', type:'checkinput', options: baseData.ygOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[乙肝DNA]', type:'checkinput', options: baseData.yywOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[丙肝抗体]', type:'checkinput', options: baseData.yywOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[丙肝RNA]', type:'checkinput', options: baseData.yywOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[梅毒]', type:'checkinput', options: baseData.yyw2Options,span:9}
          ]
        },
        {
          columns:[
            {name:'id8[OGTT]', type:'checkinput', options: baseData.ogttOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[女方地贫]', type:'checkinput', options: baseData.dpOptions,span:18}
          ]
        },
        {
          columns:[
            {name:'id8[男方地贫]', type:'checkinput', options: baseData.dpOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'id8[尿蛋白]', type:'checkinput', options: baseData.dbnOptions,span:16}
          ]
        },
        {
          columns:[
            {name:'id8[HIV]', type:'checkinput', options: baseData.yywOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8[GBS]', type:'checkinput', options: baseData.yywOptions,span:8}
          ]
        },
        {
          columns:[
            {name:'id8(g/L)[Hb]', type:'input', span:5},
            {span:1},
            {name:'id8(fL)[MCV]',type:'input', span:5},
            {span:1},
            {name:'id3(x10^9L)[PLT]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'id8[其他]', type:'input', span:11},
          ]
        },
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
