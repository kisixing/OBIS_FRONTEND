import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '过去史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
<<<<<<< HEAD
        { name: 'jbs[疾病史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.jibOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        { name: 'wss[外伤史]', type: 'checkinput', valid: 'required', span:12, radio:true, options: ['无', '有[input]'] },
        { name: 'sss[手术史]', type: 'table', valid: 'required', pagination: false, editable: true, options: baseData.shoushushiColumns },
        {name:'jbs[药物或食物过敏史]', type:'checkinput', valid: 'required',options:baseData.ywgmOptions},
        { name: 'xzp[输血及血制品史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.xzpOptions },
=======
        { name: 'bsjibing[疾病史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.jibOptions.map(v=>({...v, label:`${v.label}(input)`})) },
        { name: 'bsshoushu[外伤史]', type: 'checkinput', valid: 'required', span:12, radio:true, options: ['无', '有[input]'] },
        { name: 'operationHistory[手术史]', type: 'table', valid: 'required', pagination: false, editable: true, options: baseData.shoushushiColumns },
        { name: 'bsguomin[药物或食物过敏史]', type:'checkinput', valid: 'required',options:baseData.ywgmOptions},
        { name: 'hobtabp[输血及血制品史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.xzpOptions },
>>>>>>> b6c5197479842292ff666bb0457a11184a135eea
      ]
    };
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="guoqishi">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
