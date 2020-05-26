import React, { Component } from "react";

import formRender from '../../../../render/form';
import * as baseData from '../../data';

export default class extends Component{
  static Title = '孕产史';
  constructor(props) {
    super(props);
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          name: "preghiss",
          type: "table",
          valid: "required",
          pagination: false,
          editable: true,
          // iseditable: ({ entity }) => entity.datagridYearMonth !== "本孕",
          options: baseData.pregnanciesColumns,
          className: "table-wrapper",
          isPreghiss: true,
        }
      ]
    };
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div className="yun-can-shi">
        {formRender(entity, this.config(), onChange)}
      </div>
    );
  }
}