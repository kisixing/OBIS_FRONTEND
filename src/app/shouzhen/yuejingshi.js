import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '其他病史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { span: 1 },
            { name: 'yjcuch(岁)[初@潮]', type: 'select', span: 4, showSearch: true, options: baseData.ccOptions, valid: 'required'},
            { span: 1 },
            { name: 'yjzhouq(天)[周@@期]', type: 'input', span: 4, valid: 'number|required' },
            { span: 2 },
            { name: 'yjchix[持续天数]', className: 'input_width_4', type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'yjtongj[痛@@经]', type: 'checkinput', span: 6, valid: 'required', radio: true, options: baseData.plOptions },
          ]
        },
        {
          columns: [
            { span: 1 },
            { name: 'maritalHistory[婚姻史]', type: 'checkinput', className:'col-xz-sp',span: 11,  radio: true, valid: 'required', options: baseData.hysOptions },
            { name: 'userjiehn(岁)[本次结婚年龄]', className: 'input_width_4',  type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'userjinqjh[近亲结婚]', className:'col-yjs-sp', type: 'checkinput', span: 5, radio: true, valid: 'required', options: baseData.jinqOptions },
          ]
        },
        //kisi 2020/1/2 合并表单
        {
          label: '个人史', span: 12, className: 'labelclass'
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_grxiyan[吸@烟]', type:'checkinput-5',valid: 'required', options: baseData.nhOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_gryinjiu[饮@酒]', type:'checkinput-5', valid: 'required', options: baseData.nhOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_gryouhai[接触有害物质]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_grfangshe[接触放射线]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_grqita[其@他]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            { name: 'noneChecked2[ ]', type: 'checkinput', className:'none_check', radio: true, options: baseData.noneOptions,span:15 },
          ]
        },
        {
          label: '家族史', span: 12, columns: [],className:'labelclass'
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_jzgaoxueya[高血压]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_jztangniaobing[糖尿病]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_jzjixing[先天畸形]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_jzyichuanbing[遗传病]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_jzqita[其@他]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            { name: 'noneChecked3[ ]', type: 'checkinput', className:'none_check', radio: true, options: baseData.noneOptions,span:15 },
          ]
        },
        // {
        //   columns: [
        //     { name: 'historyOfInfertility[不孕病史]',className:'col-yjs-sp', type: 'checkinput-1', valid: 'required', unselect: '无', options: baseData.bybsOptions.map(v => ({ ...v, span: 8 })) },
        //   ]
        // }
      ]
    };
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="width_7">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
