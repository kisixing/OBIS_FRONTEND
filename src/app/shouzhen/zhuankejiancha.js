import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';
import * as baseData2 from './../fuzhen/data';

export default class extends Component{
  static Title = '专科检查';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          className:'zhuanke-group', columns:[
            {name:'fkjc[妇科检查]', type:'checkinput',radio:true,options:baseData.wjjOptions,span:8}
          ]
        },
        {
          columns:[
            {span:1},
            {name:'wy[外阴]', type:'input', span:5},
            {span:1},
            {name:'yd[阴道]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {span:1},
            {name:'gj[宫颈]', type:'input', span:5},
            {span:1},
            {name:'zg[子宫]', type:'input', span:5},
            {span:1},
            {name:'fj[附件]', type:'input', span:5},
          ]
        },
        {
          className:'zhuanke-group', columns:[
            {name:'ckjc[参科检查]',type:'**', span:8},
          ]
        },
        {
          columns:[
            {span:1},
            {name:'gg(cm)[宫高]', type:'input', span:5, valid: 'number'},
            {span:1},
            {name:'fw(cm)[腹围]', type:'input', span:5, valid: 'number'},
          ]
        },
        {
          columns:[
            {span:1},
            {name:'tx(次/分)[胎心]', type:'input', span:5},
            {span:1},
            {name:'xl[先露]', type:'select', span:5, options: baseData2.xlOptions},
            {span:1},
            {name:'tw[胎位]', type:'input', span:5},
          ]
        },
        {
          className:'zhuanke-group', columns:[
            {name:'gpwcl[骨盆外测量]', type:'checkinput',radio:true,options:baseData.wjjOptions,span:8},
          ]
        },
        {
          columns:[
            {span:1},
            {name:'sjjj(cm)[髂前上棘间径]', type:'input', span:5},
            {span:1},
            {name:'gsjj(cm)[髂棘间径]', type:'input', span:5},
          ]
        },
        {
          columns:[
            {span:1},
            {name:'dcwj(cm)[骶耻外径]', type:'input', span:5 },
            {span:1},
            {name:'zgjj(cm)[坐骨结节间径]', type: 'input', span:5}
          ]
        },
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="width_7">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
