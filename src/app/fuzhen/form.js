
import React, { Component } from "react";
import { Row, Col, Input, Icon, Select, Button, message, Table, Modal, Spin, Tree, DatePicker } from 'antd';

import * as util from './util';
import * as baseData from './data';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import service from '../../service';
import modal from '../../utils/modal';
import {loadWidget} from '../../utils/common';
import './form.less';

import chartDemoData from './chart-demo';

const renderChart = function(){
  var loaded = new Promise(resolve=>setTimeout(()=>loadWidget('echarts').then(resolve), 1000));
  return (id, option) => {
    loaded.then(() => {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(option);
    });
  }
};

export default class FuzhenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openYCQ: false,
      openQX: false,
      openTemplate: false,
      openYy: false,
      entity: { ...baseData.formEntity },
      error: {},
      treatTemp: [],
      modalState: {},
      getPacsGrowth: {},
      getbmi: []
    }

    this.renderChart = renderChart();
    service.fuzhen.treatTemp().then(res => this.setState({
      treatTemp: res.object
    }));

    service.fuzhen.getPacsGrowth().then(res => this.setState({
      getPacsGrowth: res.object
    }));

    service.fuzhen.getbmi().then(res => this.setState({
      getbmi: res.list
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
            { name: 'ckweek(周)[孕周]', type: 'input', span: 4 },
            { 
              span: 8,
              columns:[
                { name: 'cktizh(kg)[体重]', type: 'input', span: 16, valid: 'number|rang(40,100)' },
                { type:  'button', span: 8, text: '体重曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
              ] 
            },
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
                { name: 'ckgongg(cm)[宫高]', type: 'input', span: 16 },
                { type:  'button', span: 8, text: '生长曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
              ] 
            },
            {
              span: 18, rows: [
                {
                  label: (check('dtrz')||check('strz'))?'胎1':'', columns: [
                    { name: 'wz1[位置]', type: 'select', span: 8, showSearch:true, options: baseData.wzOptions },
                    { name: 'tx1(bmp)[胎心]', type: 'input', span: 8 },
                    { name: 'xl1[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                    { name: 'ckfuzh[下肢水肿]', type: 'select', span: 8, showSearch:true, options: baseData.ckfuzhOptions}
                  ]
                },
                {
                  label: '胎2', filter:()=>check('dtrz,strz'), columns: [
                    { name: 'wz2[位置]', type: 'select', span: 8, showSearch:true, options: baseData.wzOptions },
                    { name: 'tx2(bmp)[胎心]', type: 'input', span: 8 },
                    { name: 'xl2[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions }
                  ]
                },
                {
                  label: '胎3', filter:()=>check('strz'), columns: [
                    { name: 'wz3[位置]', type: 'select', span: 8, showSearch:true, options: baseData.wzOptions },
                    { name: 'tx3(bpm)[胎心]', type: 'input', span: 8 },
                    { name: 'xl3[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions }
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
            { name: 'riMo(U)[早]', span: 6, type: [{type:'input( )',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}]},
            { name: 'riNo(U)[中]', span: 6,type: [{type:'input( )',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
            { name: 'riEv(U)[晚]', span: 6,type: [{type:'input( )',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
            { name: 'riSl(U)[睡前]', span: 6,type: [{type:'input( )',placeholder:'药物名称',span:16},{type:'input',placeholder:'剂量',span:8}] },
          ]
        },
        {
          filter:()=>check('hypertension'), columns: [
            {
              label: '尿蛋白', span: 10, columns: [
                { name: 'upState[定性]', type: 'input', span: 12 },
                { name: 'upDosage24h[24H定量]', type: 'input', span: 11 },
              ]
            },
            {
              label: '用药方案', span: 14, filter:()=>!check('chd'), columns: [
                { name: 'medicineId[药物]', type: 'input', span: 8 },
                { name: 'medicineTimes[频率]', type: 'select', span: 8, options: baseData.yyfaOptions },
                { name: 'medicineDosage form-control[剂量]', type: 'input', span: 8 },
              ]
            },
          ]
        },
        {
          filter:()=>check('chd'), rows: [
            {
              columns: [
                { name: 'heartRate(次/分)[心率]', type: 'input', span: 6 },
                { 
                  label: '用药方案', span: 18, columns:[
                    { name: 'upStateName[药物]', span: 6, type: 'input' },
                    { name: 'medicineTimes[频率]', span: 6, type: 'select', options: baseData.yyfaOptions },
                    { name: 'upStateCount[剂量]', span: 6, type: 'input' },
                  ] 
                }
              ]
            },
            {
              columns: [
                { name: 'examination[化验]', type: 'textarea', span: 12 }
              ]
            }
          ]
        },
        {
          label: '胎1超声', span: 3, filter:()=>check('dtrz,strz'), columns: [
            { name: 'tetz1(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teafv1(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teqxl1[脐血流]', type: 'input', className: 'childLabel', span: 6 },
            {span: 6},
          ]
        },
        {
          label: '胎2超声', span: 3, filter:()=>check('dtrz,strz'), columns: [
            { name: 'tetz2(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teafv2(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
            { name: 'teqxl2[脐血流]', type: 'input', className: 'childLabel', span: 6 },
            {span: 6},
          ]
        },
        {
          label: '胎3超声', span: 3, filter:()=>check('strz'), columns: [
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
            { name: 'treatment[处理措施]', type: 'textarea', span: 10 },
            { name:'treatment[模板]', type: 'buttons',span: 14, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(green)[入院],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 16, type: [          
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions},
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
                'date',
                {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions},
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
    const { modalState } = this.props;
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text);
    if(text==='糖尿病日间门诊') {
      this.setState({modalState: modalState[0]}, () => {
        this.setState({openYy: true});
      })
    }else if (text==='产前诊断') {
      this.setState({modalState: modalState[1]}, () => {
        this.setState({openYy: true});
      })
    }
  }

  handleChange(e, { name, value, valid }) {
    const { entity, error } = this.state;
    const data = { [name]: value };
    console.log(data)
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

  handleSave(form, act) {
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
    if(act === "open") {
      console.log(111);
    }
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
      <Modal className="yuModal" title={<span><Icon type="info-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
             width={600} closable visible={!!openYCQ} onCancel={e => handelClick(false)} onOk={e => handelClick(true)}>
        <span>是否修改孕产期：</span>
        <DatePicker defaultValue={info.gesmoc} value={ycq} onChange={(e,v)=>{this.setState({ycq:v})}}/>
      </Modal>
    );
  }

  
  /**
   *预约窗口
   */
  renderModal() {
    const { openYy, modalState } = this.state;
    const handelShow = (isShow) => {
      this.setState({openYy: false});
      if(isShow) {
        console.log("预约成功!")
      };
    }

    return (openYy ?
      <Modal className="yuModal" title={<span><Icon type="info-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
              visible={openYy} onOk={() => handelShow(true)} onCancel={() => handelShow(false)} >
        <span>{modalState.title}: </span>    
        <Select defaultValue={modalState.options[0]} style={{ width: 120 }}>
          {modalState.options.map((item) => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
        <DatePicker defaultValue={modalState.gesmoc} />
        {modalState.counts ? <p>（已约：{modalState.counts}）</p> : null}
      </Modal>
      : null
    );
  }

  /**
   * 曲线
   */
  renderQX(e,text,resolve){
    var canvas = 'canvas';
    modal({
      title: text,
      content:<canvas id={canvas} style={{height: 450, width: '99%'}}><p>Your browserdoes not support the canvas element.</p></canvas>,
      footer:'',
      width:'90%',
      maskClosable:true,
      onCancel:resolve
    }).then(() => {
      setTimeout(
        ()=>{
          drawgrid('canvas');
          printline();
        },200
      );
      
    });
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
    const { entity, openYy } = this.state;
    return (
      <div className="fuzhen-form">
        <strong className="fuzhen-form-TIT">本次产检记录</strong>
        {formRender(entity, this.formConfig(), this.handleChange.bind(this))}
        <Button className="pull-right blue-btn bottom-btn save-btn" type="ghost" onClick={() => this.handleSave(document.querySelector('.fuzhen-form'))}>保存</Button>
        <Button className="pull-right blue-btn bottom-btn" type="ghost" onClick={() => this.handleSave(document.querySelector('.fuzhen-form'), "open")}>保存并开立医嘱</Button>
        {/* {this.renderQX()} */}
        {this.renderTreatment()}
        {this.renderYCQ()}
        {this.renderModal()}
      </div>
    )
  }
}

