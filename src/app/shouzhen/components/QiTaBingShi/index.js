import React, { Component } from "react";
import formRender from '../../../../render/form';
import * as baseData from '../../data';

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
            { name: '[月经史和婚姻史]', className: 'section-title', type: '**', span: 21 },
          ]
        },
        {
          columns: [
            { name: 'yjcuch(岁)[初潮]', type: 'select', span: 4, showSearch: true, options: baseData.ccOptions, valid: 'required'},
            { span: 1 },
            { name: 'yjzhouq(天)[周期]', type: 'input', span: 4, valid: 'pureNumber|required' },
            { span: 2 },
            { name: 'yjchix[持续天数]', className: 'input_width_4', type: 'input', span: 5, valid: 'pureNumber|required' },
            { span: 1 },
            { name: 'yjtongj[痛经]', className: 'tong-jing', type: 'checkinput', span: 7, valid: 'required', radio: true, options: baseData.hnOptions },
          ]
        },
        {
          columns: [
            { name: 'maritalHistory[婚姻史]', className:'hun-yin-shi', type: 'checkinput', span: 11, radio: true, valid: 'required', options: baseData.hysOptions },
            { name: 'userjiehn(岁)[本次结婚年龄]', className: 'input_width_4',  type: 'input', span: 5, valid: 'pureNumber', 
              filter: entity => entity.maritalHistory && entity.maritalHistory[0] && entity.maritalHistory[0].label !== '未婚'
            },
            { span: 1 },
            { name: 'userjinqjh[近亲结婚]', className:'col-yjs-sp', type: 'checkinput', span: 5, radio: true, options: baseData.jinqOptions, 
              filter: entity => entity.maritalHistory && entity.maritalHistory[0] && entity.maritalHistory[0].label !== '未婚'
            },
          ]
        },
        //kisi 2020/1/2 合并表单
        {
          columns: [
            { name: '[个人史]', className: 'section-title', type: '**', span: 10 },
            { span: 1 },
            { name: '[家族史]', className: 'section-title', type: '**', span: 10 },
          ]
        },
        {
          columns:[
            { name:'add_FIELD_grxiyan[吸烟]', className: 'long-ipt', type:'checkinput-5',valid: 'required', options: baseData.nhOptions, radio:true, span: 10},
            { span: 1 },
            { name:'add_FIELD_jzgaoxueya[高血压]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions, span: 10}
          ]
        },
        {
          columns:[
            { name:'add_FIELD_gryinjiu[饮酒]', className: 'long-ipt', type:'checkinput-5', valid: 'required', options: baseData.nhOptions, radio:true, span: 10},
            { span: 1 },
            { name:'add_FIELD_jztangniaobing[糖尿病]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 10}
          ]
        },
        {
          columns:[
            { name:'add_FIELD_gryouhai[接触有害物质]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions, span: 10},
            { span: 1 },
            { name:'add_FIELD_jzjixing[先天畸形]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions,span: 10}
          ]
        },
        {
          columns:[
            { name:'add_FIELD_grfangshe[接触放射线]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions, span: 10},
            { span: 1 },
            { name:'add_FIELD_jzyichuanbing[遗传病]', className: 'long-ipt', type:'checkinput-5',radio:true, valid: 'required', options: baseData.nhOptions, span: 10}
          ]
        },
        {
          columns:[
            { name:'add_FIELD_grqita[其他]', className: 'long-ipt', type:'checkinput-5',radio:true, options: baseData.nhOptions, span: 10},
            { span: 1 },
            { name:'add_FIELD_jzqita[其他]', className: 'long-ipt', type:'checkinput-5',radio:true, options: baseData.nhOptions, span: 10}
          ]
        },
        // {
        //   columns:[
        //     { span: 1 },
        //     { name: 'noneChecked2[ ]', type: 'checkinput', className:'none_check', radio: true, options: baseData.noneOptions,span:15 },
        //   ]
        // },
        // {
        //   columns:[
        //     { name: 'noneChecked3[ ]', type: 'checkinput', className:'none_check', radio: true, options: baseData.noneOptions,span:15 },
        //   ]
        // },
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
      <div className="yue-jing-shi">
        {formRender(entity, this.config(), onChange)}
      </div>
    )
  }
}
