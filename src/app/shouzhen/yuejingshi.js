import React, { Component } from "react";

import formRender from '../../render/form';
import * as baseData from './data';

export default class extends Component {
  static Title = '既往史';
  constructor(props) {
    super(props);
  }

  config() {
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: 'yjcuch(岁)[初潮]', type: 'select', span: 4, showSearch: true, options: baseData.ccOptions, valid: 'required'},
            { span: 2 },
            { name: 'yjzhouq(天)[周期]', type: 'input', span: 4, valid: 'number|required' },
            { span: 2 },
            { name: 'yjchix[持续天数]', className: 'input_width_4', type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'yjtongj[痛经]', type: 'checkinput', span: 6, valid: 'required', radio: true, options: baseData.plOptions },
          ]
        },
        {
          columns: [
            { name: 'maritalHistory[婚姻史]', type: 'checkinput', className:'col-xz-sp',span: 12,  radio: true, valid: 'required', options: baseData.hysOptions },
            { name: 'userjiehn(岁)[本次结婚年龄]', className: 'input_width_4',  type: 'input', span: 5, valid: 'number|required' },
            { span: 1 },
            { name: 'userjinqjh[近亲结婚]', className:'col-yjs-sp', type: 'checkinput', span: 5, radio: true, valid: 'required', options: baseData.jinqOptions },
          ]
        },
        //kisi 2020/1/2 合并表单
        {
          label: '个人史', span: 12, className:'labelclass'
        },
        {
          columns:[
            { span: 1 },
            {name:'hcvAb[吸烟]', type:'checkinput-5',valid: 'required', options: baseData.nhOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'add_FIELD_hcvAb_RNA[饮酒]', type:'checkinput-5', valid: 'required', options: baseData.nhOptions,radio:true,span:15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[接触有害物质]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[接触放射线]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },       
        {
          columns:[
            { span: 1 },
            {name:'rpr[其他个人史]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          label: '家族史', span: 12, columns: [],className:'labelclass'
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[高血压]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[糖尿病]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },       
        {
          columns:[
            { span: 1 },
            {name:'rpr[先天畸形]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[遗传病]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
          ]
        },
        {
          columns:[
            { span: 1 },
            {name:'rpr[其他]', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 15}
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
