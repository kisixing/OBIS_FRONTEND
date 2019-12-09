
import React, { Component } from "react";
import { Row, Col, Input, Button, message, Table, Modal, Spin, Tree, DatePicker } from 'antd';

import * as util from './util';
import * as baseData from './data';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import service from '../../service';
import modal from '../../utils/modal';
import {loadWidget} from '../../utils/common';

export default class FuzhenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openYCQ: false,
      openQX: false,
      openTemplate: false,
      entity: { ...baseData.formEntity },
      error: {},
      treatTemp: []
    }

    service.fuzhen.treatTemp().then(res => this.setState({
      treatTemp: res.object
    }));
  }

  // 2 检测孕妇高危诊断，修改表格以及表单型式
  checkDiagnosisHighrisk(type) {
    const { diagnosis } = this.props;
    const types = { gdm: '妊娠期糖尿病', hypertension: '高血压', chd: '冠心病', dtrz: '双胎妊娠', strz: '多胎妊娠' };
    return diagnosis.filter(i => type.split(',').filter(t=>types[t] === i.data).length).length;
  }

  formConfig() {
    const check = t => this.checkDiagnosisHighrisk(t);
    return {
      rows: [
        {
          columns: [
            { name: 'checkdate[日期]', type: 'date', span: 6 },
            { name: 'ckweek(周)[孕周]', type: 'input', span: 6 },
            { name: 'cktizh(kg)[体重]', type: 'input', span: 6, valid: 'number|rang(40,100)' },
            { 
              name: 'ckpressure(mmHg)[血压]', type: ['input(/)','input'], span: 6, valid: (value)=>{
              let message = '';
              if(value){
                if(value[0] && valid('number|rang(0,140)',value[0])){
                  message += '第1个值' + valid('number|rang(0,140)',value[0])
                }else if(value[0] && valid('number|rang(0,110)',value[1])){
                  message += '第2个值' + valid('number|rang(0,140)',value[1])
                }
              }
              
              return message;
            }},
          ]
        },
        {   
          columns:[
            { name: 'ckzijzhz[自觉症状]', type: 'combobox', span: 12, options: baseData.ckzijzhzOptions }
          ]
        },
        {
          columns: [
            { 
              span: 6, columns:[
                { name: 'ckgongg(cm)[宫高]', type: 'input', span: 18 },
                { type:  'button', span: 6, text: '曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
              ] 
            },
            {
              span: 18, rows: [
                {
                  label: (check('dtrz')||check('strz'))?'胎1':'', columns: [
                    { name: 'tx1(bmp)[胎心]', type: 'input', span: 8 },
                    { name: 'xl1[先露]', type: 'select', span: 8, showSearch:true, options: baseData.xlOptions },
                    { name: 'ckfuzh[下肢水肿]', type: 'select', span: 8, showSearch:true, options: baseData.ckfuzhOptions}
                  ]
                },
                {
                  label: '胎2', filter:()=>check('dtrz,strz'), columns: [
                    { name: 'tx2(bmp)[胎心]', type: 'input', span: 8 },
                    { name: 'xl2[先露]', type: 'select', span: 8, showSearch:true, options: baseData.xlOptions }
                  ]
                },
                {
                  label: '胎3', filter:()=>check('strz'), columns: [
                    { name: 'tx3(bpm)[胎心]', type: 'input', span: 8 },
                    { name: 'xl3[先露]', type: 'select', span: 8, showSearch:true, options: baseData.xlOptions }
                  ]
                }
              ]
            }
          ]
        },
        {
          filter:()=>check('gbd'), columns:[
            { name: 'fpg(mmol/L)[空腹血糖]', type: 'input', span: 6 },
            { name: 'pbg2h(mmol/L)[餐后2H]', type: 'input', span:6 },
            { name: 'pbghb(%)[HbAlc]', type: 'input', span: 6 }
          ]
        },
        {
          filter:()=>check('gbd'), label:'胰岛素方案', columns:[
            { name: 'riMo(U)[早]', span: 6, type: [{type:'input',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}]},
            { name: 'riNo(U)[中]', span: 6,type: [{type:'input',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
            { name: 'riEv(U)[晚]', span: 6,type: [{type:'input',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
            { name: 'riSl(U)[睡前]', span: 6,type: [{type:'input',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
          ]
        },
        {
          filter:()=>check('hypertension'), columns: [
            {
              label: '尿蛋白', span: 12, columns: [
                { name: 'upState[定性]', type: 'input', span: 12 },
                { name: 'upDosage24h[24H定量]', type: 'input', span: 11 },
              ]
            },
            {
              label: '用药方案', span: 12, filter:()=>!check('chd'), columns: [
                { name: 'medicineId[药物]', type: 'input', span: 12 },
                { name: 'medicineDosage form-control[剂量]', type: 'input', span: 11 },
              ]
            },
          ]
        },
        {
          filter:()=>check('chd'), columns: [
            { name: 'heartRate(次/分)[心率]', type: 'input', span: 6 },
            { 
              label: '用药方案', span: 6, rows:[
                { name: 'upStateName[药物]', type: 'input' },
                { name: 'upStateCount[剂量]', type: 'input' },
              ] 
            },
            { name: 'examination[化验]', type: 'textarea', span: 12 }
          ]
        },
        {
          label: '超声胎1', span: 3, filter:()=>check('dtrz,strz'), columns: [
            { name: 'tetz1(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teafv1(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teqxl1[脐血流]', type: 'input', className: 'childLabel', span: 6 },
            {span: 6},
          ]
        },
        {
          label: '超声', span: 3, filter:()=>check('dtrz,strz'), columns: [
            { name: 'tetz2(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teafv2(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teqxl2[脐血流]', type: 'input', className: 'childLabel', span: 6 },
            {span: 6},
          ]
        },
        {
          label: '超声', span: 3, filter:()=>check('strz'), columns: [
            { name: 'tetz3(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teafv3(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teqxl3[脐血流]', type: 'input', className: 'childLabel', span: 6 },
            { span: 6 },
          ]
        },
        {
          columns:[
            { name: 'other[其他]', type: 'input', span: 12 }
          ]
        },
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 8 },
            { name:'treatment[模板]', type: 'buttons',span: 16, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 16, type: [
                'date',
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions},
                {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions}
              ]
            }
          ]
        } 
      ]
    }
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

  handleChange(e, { name, value, valid }) {
    const { entity, error } = this.state;
    const data = { [name]: value };
    const errorData = { [name]: valid };
    switch (name) {
      case 'checkdate':
        data.ckweek = util.countWeek(value);
        errorData.ckweek = null;
        break;
        case 'ckweek':
          this.state.openYCQ = ()=>{};
        break;
    }
    this.setState({
      entity: {
        ...entity,
        ...data
      },
      error:{
        ...error,
        ...errorData
      }
    })
  }

  handleSave(form) {
    const { onSave } = this.props;
    const { entity } = this.state;
    fireForm(form,'valid').then((valid)=>{
      if(valid){
        onSave(entity).then(() => this.setState({
          entity: { ...baseData.formEntity },
          error: {}
        }));
      }
    });
  }

  /**
   * 孕产期
   */
  renderYCQ(){
    const { info, onChangeInfo } = this.props;
    const { openYCQ, ycq } = this.state;
    const handelClick = (isOk) => {
      this.setState({openYCQ:false},()=>{
        openYCQ();
        if(isOk){
          onChangeInfo({...info, gesmoc:ycq });
        }
      });
    }

    return (
      <Modal title="修订预产期" width={600} closable visible={!!openYCQ} onCancel={e => handelClick(false)} onOk={e => handelClick(true)}>
        <DatePicker defaultValue={info.gesmoc} value={ycq} onChange={(e,v)=>{this.setState({ycq:v})}}/>
      </Modal>
    );
  }

  /**
   * 曲线
   */
  renderQX(e,text,resolve){
    loadWidget('echarts').then(()=>{
      var canvas = `canvas-${Date.now()}`;
      modal({
        title: text,
        content:`<div id="${canvas}"></div>`,
        footer:'',
        width:1100,
        maskClosable:true,
        onCancel:resolve
      }).then(()=>{
        var myChart = echarts.init(document.getElementById(canvas));
        myChart.setOption(option);
      })
    })
  }

  /**
   * 模板
   */
  renderTreatment() {
    const { treatTemp, openTemplate } = this.state;
    const closeDialog = (e, items = []) => {
      this.setState({ openTemplate: false }, ()=>openTemplate&&openTemplate());
      items.forEach(i => i.checked = false);
      this.addTreatment(e, items.map(i => i.content).join('\n'));
    }

    const initTree = (pid, level = 0) => treatTemp.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.content}>
        {level < 10 ? initTree(node.id, level + 1) : null}
      </Tree.TreeNode>
    ));

    const handleCheck = (keys, { checked }) => {
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.checked = checked;
        }
      })
    };

    const treeNodes = initTree(0);

    return (
      <Modal title="处理模板" closable visible={openTemplate} width={800} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked))}>
        <Row>
          <Col span={12}>
            <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes.slice(0,treeNodes.length/2)}</Tree>
          </Col>
          <Col span={12}>
            <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes.slice(treeNodes.length/2)}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }

  render() {
    const { entity } = this.state;
    return (
      <div className="fuzhen-form">
        <strong className="fuzhen-form-TIT">本次产检记录</strong>
        {formRender(entity, this.formConfig(), this.handleChange.bind(this))}
        <Button className="pull-right blue-btn bottom-btn" type="ghost" onClick={() => this.handleSave(document.querySelector('.fuzhen-form'))}>保存</Button>
        {/*this.renderQX()*/}
        {this.renderTreatment()}
        {this.renderYCQ()}
      </div>
    )
  }
}

