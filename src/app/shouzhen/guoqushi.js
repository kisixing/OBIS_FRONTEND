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
        { name: 'jbs[疾病史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.jibOptions.map(v=>({label:`${v.label}(input)`})) },
        { name: 'wss[外伤史]', type: 'checkinput', valid: 'required', span:12, radio:true, options: ['无', '有[input]'] },
        { name: 'sss[手术史]', type: 'table', valid: 'required', pagination: false, editable: true, options: baseData.shoushushiColumns },
        { name: 'gjtp[既往宫颈涂片结果]', type: 'checkinput', unselect:'无', options: baseData.gjtpOptions.map(v=>({label:`${v.label}(input)`})) },
        { name: 'xzp[输血及血制品史]', type: 'checkinput', valid: 'required', unselect:'无', options: baseData.xzpOptions.map(v=>({label:`${v.label}(input)`})) },
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
