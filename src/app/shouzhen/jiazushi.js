import React, { Component } from "react";

import formRender from '../../render/form';

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
        {name:'id1(kg)[ID1]', type:'input', valid: 'required|number|rang(10,100)'},
        {
          columns:[
            {name:'id2[ID2]', type:'input', span:10, valid: 'number'},
            {span:4},
            {name:'id3[ID3]', type:'date', span:6},
          ]
        },
        {
          columns:[
            {name:'id4[ID7]', type:'date', span:10},
            {span:4},
            {name:'id5[ID5]', type:'input', span:6, valid: 'number'},
          ]
        },
        {name:'id6[ID6]', type:'input', valid: 'number'},
        {name:'id7[ID7]', type:'input', valid: 'number'},
        {name:'id8[ID8]', type:'checkinput', options:'A,B,C'.split(',')},
        {name:'id8[ID8]', type: ['input','input']}
      ]
    };
  }

  render(){
    const { entity, onChaneg } = this.props;
    return (
      <div>
        {formRender(entity, this.config(), onChaneg)}
      </div>
    )
  }
}
