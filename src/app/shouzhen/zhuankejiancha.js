import React, { Component } from "react";

import { Modal } from 'antd';
import formRender from '../../render/form';
import * as baseData from './data';
import * as baseData2 from './../fuzhen/data';

export default class extends Component {
  static Title = '专科检查';
  constructor(props) {
    super(props);
  }

  config() {
    const isShow = data => {
      return !data || !data.filter || !data.filter(i=>['拒绝检查','已查'].indexOf(i.label)!==-1).length;
    };
    return {
      step: 1,
      rows: [
        {
          className: 'zhuanke-group', columns: [
            { name: 'fkjc[妇科检查]', type: 'checkinput', radio: true, options: baseData.wjjOptions, span: 8 }
          ]
        },
        {
          filter: entity => !entity.fkjc || isShow(entity.fkjc), columns: [
            { span: 1 },
            { name: 'ckwaiy[外阴]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckyind[阴道]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckgongj[宫颈]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckgongt[子宫]', type: 'input', span: 5 }
          ]
        },
        {
          filter: entity => !entity.fkjc || isShow(entity.fkjc), columns: [
            { span: 1 },
            { name: 'ckfuj[附件]', type: 'input', span: 5 },
          ]
        },
        {
          className: 'zhuanke-group', columns: [
            { name: 'ckjc[产科检查]', type: '**', span: 8 },
          ]
        }, 
        {
          columns:[
            { span: 1 },
            {name:'ckgongg[宫高](cm)', type:'input',span:4,valid: 'required',},
            { span: 1 },
            // {name:'ckfuw[腹围](cm)', type:'input', span:5}
          ]
        },
        {
          name: 'add_FIELD_ckjc', groups: index => ({
            rows: [
              
              {
                columns: [
                  { span: 1, className: 'noContent', name: `[胎${index + 1}]`, type: '**' },
                  { name: 'tx(bpm)[胎心率]', type: 'input', span: 4 },
                  { span: 1 },
                  { name: 'xl[先露]', type: 'select', span: 4, options: baseData2.xlOptions },
                  { span: 1 },
                  // { name: 'tw[胎位]', type: 'input', span: 5 },
                  // { span: 1 },
                  {
                    name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small', 
                    filter: entity => entity.add_FIELD_ckjc.length !== 1, 
                    onClick: (e, text, resolve) => {
                      Modal.confirm({
                        title: '您是否确认要删除改记录',
                        width: '300',
                        style: {top:'50%', left: '30%', fontSize: '18px' },
                        onOk: () => this.handleChange(e, resolve, index)
                      });
                    }
                  },
                  { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small', 
                  filter: entity => entity.add_FIELD_ckjc.length === index + 1, 
                  onClick: (e, text, resolve) => this.handleChange(e, resolve) },
                ]
              },
            ]
          })
        },
        // {
        //   className: 'zhuanke-group', columns: [
        //     { name: 'gpwcl[骨盆外测量]', type: 'checkinput', radio: true, options: baseData.gwwjjOptions, span: 8 },
        //   ]
        // },
        // {
        //   filter: entity => !entity.gpwcl || isShow(entity.gpwcl), columns: [
        //     { span: 1 },
        //     { name: 'ckqiaj1(cm)[髂前上棘间径]', type: 'input', span: 5 },
        //     { span: 1 },
        //     { name: 'ckqiaj2(cm)[髂棘间径]', type: 'input', span: 5 },
        //     { span: 1 },
        //     { name: 'ckdichi(cm)[骶耻外径]', type: 'input', span: 5 },
        //     { span: 1 },
        //     { name: 'ckzugu(cm)[坐骨结节间径]', type: 'input', span: 5 }
        //   ]
        // },
      ]
    };
  }

  handleChange(e, resolve, index) {
    const { entity, onChange } = this.props;
    let add_FIELD_ckjc = entity.add_FIELD_ckjc || [{}];
    if (/^\d$/.test(index)) {
      add_FIELD_ckjc = add_FIELD_ckjc.filter((v, i) => i !== index);
    } else {
      add_FIELD_ckjc.push({});
    }
    onChange(e, { name: 'add_FIELD_ckjc', value: add_FIELD_ckjc });
    resolve();
  }

  render() {
    const { entity, onChange } = this.props;
    return (
      <div className="width_7 zhuanke">
        {/** TODO：这里的数据需要统一结构，最好是直接entity传入表单 */}
        {formRender({ add_FIELD_ckjc: entity.add_FIELD_ckjc || [{}], ...(entity || {}) }, this.config(), onChange)}
      </div>
    )
  }
}
