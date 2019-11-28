import React, { Component } from "react";

import formRender from '../../render/form';

export default class extends Component{
  static Title = '专科检查';
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
            {name:'id2[外阴]', type:'input', span:5, valid: 'number'},
            {span:1},
            {name:'id3[阴道]', type:'date', span:5},
          ]
        },
        {
          columns:[
            {name:'id2[宫颈]', type:'input', span:5},
            {span:1},
            {name:'id3[子宫]', type:'input', span:5},
            {span:1},
            {name:'id3[附件]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {name:'id4(cm)[宫高]', type:'date', span:5, valid: 'number'},
            {span:1},
            {name:'id5(cm)[腹围]', type:'input', span:5, valid: 'number'},
          ]
        },
        {
          columns:[
            {name:'id4(次/分)[胎心]', type:'date', span:5},
            {span:1},
            {name:'id5[先露]', type:'input', span:5},
            {span:1},
            {name:'id5[胎位]', type:'input', span:5},
          ]
        },
        {
          columns:[
        {name:'id6(cm)[髂前上棘间径]', type:'input', span:5},
        {span:1},
        {name:'id7(cm)[髂棘间径]', type:'input', span:5},
        {span:1},
        {name:'id8(cm)[骶耻外径]', type:'input', span:5 },
        {span:1},
        {name:'id8(cm)[坐骨结节间径]', type: 'input', span:5}
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
