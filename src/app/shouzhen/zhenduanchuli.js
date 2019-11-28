import React, { Component } from "react";
import { Select, Button, Popover } from 'antd';

import formRender from '../../render/form';
import * as baseData from './../fuzhen/data';

export default class extends Component{
  static Title = '诊断处理';
  constructor(props) {
    super(props);
    this.state = {
      entity: {},
      diagnosi: '',
      diagnosis: []
    };
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 8 },
            { name:'treatment[模板]', type: 'buttons',span: 16, text: '(green)[产检一套],(green)[B 超],(green)[早唐],(green)[胎监],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 15, type: [
                'date',
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions},
                {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions}
              ]
            }
          ]
        }
      ]
    };
  }

  addTreatment(e, value){
    const { entity } = this.state;
    this.handleChange(e, {
      name: 'treatment',
      value: entity.treatment + (entity.treatment ? '\n' : '') + value
    })
  }

  handleTreatmentClick(e, {text,index},resolve){
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text)
  }


  handleChange(e, {name,value,valid}){
    const { entity, onChaneg } = this.props;
    this.setState({
      [name]: value
    });
    onChaneg(e, {name,value,valid}, entity)
  }

  render(){
    const { entity,diagnosi,diagnosis} = this.state;
    return (
      <div>
        <div className="fuzhen-left-zd">
        <ol>
          {diagnosis.map((item, i) => (
            <li key={`diagnos-${item.id}-${Date.now()}`}>
              <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                <span title={title(item)}><span>{i + 1}、</span>
                <span className={item.highriskmark ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span></span>
              </Popover>
              <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => delConfirm(item)} />
            </li>
          ))}
        </ol>
        <div className="fuzhen-left-input font-16">
          <Select combobox showSearch size="large" style={{ width: '100%' }} placeholder="请输入诊断信息" value={diagnosi} onChange={e => this.setState({ diagnosi: e })}>
            {baseData.diagnosis.map(o => <Select.Option key={`diagnosi-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
          </Select>
        </div>
        <Button className="fuzhen-left-button margin-TB-mid" type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
      </div>
        {formRender(entity, this.config(), this.handleChange.bind(this))}
      </div>
    )
  }
}
