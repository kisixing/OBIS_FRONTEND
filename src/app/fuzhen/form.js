
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
      ycq: '',
      openYCQ: false,
      openQX: false,
      openTemplate: false,
      openYy: false,
      entity: { ...baseData.formEntity },
      regFormEntity: {...baseData.regFormEntity},
      isShowRegForm: false,
      error: {},
      treatTemp: [],
      modalState: {},
      getPacsGrowth: {},
      getbmi: [],
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

  componentWillReceiveProps(props) {
    const { entity } = this.state;
    let param = {"ckweek": util.countWeek(props.info.gesexpect)};
    this.setState({entity: {...entity, ...param}});
  }

  // 2 检测孕妇高危诊断，修改表格以及表单型式
  checkDiagnosisHighrisk(type) {
    const { diagnosis, relatedObj } = this.props;

    let diagItem = [];
    let signItem = [];
    diagnosis.map(item => { diagItem.push(item.data)});
    for (var k in relatedObj) { signItem = signItem.concat(relatedObj[k]) };

    const searchParam = {
      'diabetes': {
        'diagKeyword': ['糖尿病'],
        'digWord': [],
        'signWord': ['内分泌疾病']
      },
      'hypertension': {
        'diagKeyword': ['高血压', '子痫', '肾炎', '肾病', '红斑狼疮'],
        'digWord': ['红斑狼疮', '风湿性关节炎', '类风湿性关节炎', '硬皮病'],
        'signWord': ['高血压', '肾病', '免疫系统疾病']
      },
      'coronary': {
        'diagKeyword': [],
        'digWord': ['冠心病', '心力衰竭', '妊娠合并心力衰竭', '风湿性心脏病', '妊娠合并风湿性心脏病', '先天性心脏病', '心肌病'],
        'signWord': ['心血管疾病', '血液系统疾病']
      },
      'twins': {
        'diagKeyword': [],
        'digWord': ['双胎妊娠'],
        'signWord': []
      },
      'multiple': {
        'diagKeyword': [],
        'digWord': ['多胎妊娠'],
        'signWord': []
      },
    }

    function refreshFrom(type) {
      let searchObj = searchParam[type];
      let bool = false;

      diagItem.length>0 && diagItem.map(item => {
        searchObj['diagKeyword'].map(subItem => {
          if (item.indexOf(subItem) != -1) bool = true;
        })
      })

      diagItem.length>0 && diagItem.map(item => {
        if (searchObj['digWord'].includes(item)) bool = true;
      })

      signItem.length>0 && signItem.map(item => {
        if (searchObj['signWord'].includes(item)) bool = true;
      })   
      return bool;
    }

    return refreshFrom(type);
  }

  //本次产检记录表单
  formConfig() {
    const check = t => this.checkDiagnosisHighrisk(t);
    return {
      rows: [
        {
          columns: [
            { name: 'checkdate[日期]', type: 'date', span: 6 },
            { name: 'ckweek(周)[孕周]', type: 'input', span: 4, onClick:this.handleYz.bind(this) },
            { 
              span: 8,
              columns:[
                { name: 'cktizh(kg)[体重]', type: 'input', span: 16, valid: 'number|rang(40,100)' },
                { type:  'button', span: 8, text: '体重曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
              ] 
            },
            { 
              name: 'ckpressure(mmHg)[血压]', type: [{type: 'input(/)'},{type: 'input'}], span: 6, valid: (value)=>{
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
            { name: 'ckzijzhz[自觉症状]', type:'select', showSearch:true, span: 12, options: baseData.ckzijzhzOptions }
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
              span: 6, filter:()=>check('twins')||check('multiple'), columns:[
                { name: 'ckfuzh[下肢水肿]', type: 'select', showSearch:true, options: baseData.ckfuzhOptions}
              ]
            },
            {
              span: 18, rows: [
                {
                  filter:()=>!check('twins')&&!check('multiple'), columns: [
                    { name: 'cktaix(bmp)[胎心]', type: 'input', span: 8 },
                    { name: 'ckxian[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                    { name: 'ckfuzh[下肢水肿]', type: 'select', span: 8, showSearch:true, options: baseData.ckfuzhOptions}
                  ]
                },
                {
                  filter:()=>check('twins')||check('multiple'), name: 'fetalCondition', span: 24, groups: index => ({
                    rows: [
                      {
                        label: `胎${index+1}`, columns: [
                          { name: 'location[位置]', type: 'select', span: 8, showSearch:true, options: baseData.wzOptions },
                          { name: 'taix(bmp)[胎心]', type: 'input', span: 7 },
                          { name: 'xianl[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                          { span: 1 },
                          {
                            name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                            filter: entity => entity.fetalCondition.length !== 1&&check('multiple'), 
                            onClick: (e, text, resolve) => {
                              Modal.confirm({
                                title: '您是否确认要删除改记录',
                                width: '300',
                                style: {top:'50%', left: '30%', fontSize: '18px' },
                                onOk: () => this.handleBtnChange(e, 'fetalCondition', index)
                              });
                            }
                          },
                          { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small',
                            filter: entity => entity.fetalCondition.length === index + 1&&check('multiple'),
                            onClick: (e, text, resolve) => this.handleBtnChange(e, 'fetalCondition')},
                        ]
                      }
                    ]
                  })
                },
              ]
            }
          ]
        },
        {
          name: 'fetalUltrasound', span: 3, filter:()=>check('twins')||check('multiple'), groups: index => ({
            rows: [
              {
                label: `胎${index+1}超声`, columns: [
                  { name: 'tetz(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 6 },
                  { name: 'teafv(MM)[AVF]', type: 'input', className: 'childLabel', span: 6 },
                  { name: 'teqxl[脐血流]', type: 'input', className: 'childLabel', span: 6 },
                  { span: 1 },
                  {
                    name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                    filter: entity => entity.fetalUltrasound.length !== 1&&check('multiple'), 
                    onClick: (e, text, resolve) => {
                      Modal.confirm({
                        title: '您是否确认要删除改记录',
                        width: '300',
                        style: {top:'50%', left: '30%', fontSize: '18px' },
                        onOk: () => this.handleBtnChange(e, 'fetalUltrasound', index)
                      });
                    }
                  },
                  { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small',
                    filter: entity => entity.fetalUltrasound.length === index + 1&&check('multiple'),
                    onClick: (e, text, resolve) => this.handleBtnChange(e, 'fetalUltrasound')},
                ]
              }
            ]
          })
        },
        {
          filter:()=>check('diabetes'), columns:[
            { name: 'fpg(mmol/L)[空腹血糖]', type: 'input', span: 6 },
            { name: 'pbg2h(mmol/L)[餐后2H]', type: 'input', span:6 },
            { name: 'hbAlc(%)[HbAlc]', type: 'input', span: 6 }
          ]
        },
        {
          filter:()=>check('diabetes'), label:'胰岛素方案', columns:[
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
              label: '用药方案', name: 'medicationPlan', span: 14, filter:()=>!check('coronary'), groups: index => ({
                rows: [
                  {
                    columns:[
                      { name: `name[药物]`, span: 7, type: 'input' },
                      { name: `frequency[频率]`, span: 7, type: 'select', showSearch: true, options: baseData.yyfaOptions },
                      { name: `dosages[剂量]`, span: 7, type: 'input' },
                      { span: 1 },
                      {
                        name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                        filter: entity => entity.medicationPlan.length !== 1, 
                        onClick: (e, text, resolve) => {
                          Modal.confirm({
                            title: '您是否确认要删除改记录',
                            width: '300',
                            style: {top:'50%', left: '30%', fontSize: '18px' },
                            onOk: () => this.handleBtnChange(e, 'medicationPlan', index)
                          });
                        }
                      },
                      { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small',
                        filter: entity => entity.medicationPlan.length === index + 1,
                        onClick: (e, text, resolve) => this.handleBtnChange(e, 'medicationPlan')},
                    ]
                  }
                ]
              })  
            },
          ]
        },
        {
          filter:()=>check('coronary'), rows: [
            {
              columns: [
                { name: 'heartRate(次/分)[心率]', type: 'input', span: 6 },
                { 
                  label: '用药方案', name: 'medicationPlan', span: 18,  groups: index => ({
                    rows: [
                      {
                        columns:[
                          { name: `name[药物]`, span: 6, type: 'input' },
                          { name: `frequency[频率]`, span: 6, type: 'select', showSearch: true, options: baseData.yyfaOptions },
                          { name: `dosages[剂量]`, span: 6, type: 'input' },
                          { span: 1 },
                          {
                            name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                            filter: entity => entity.medicationPlan.length !== 1, 
                            onClick: (e, text, resolve) => {
                              Modal.confirm({
                                title: '您是否确认要删除改记录',
                                width: '300',
                                style: {top:'50%', left: '30%', fontSize: '18px' },
                                onOk: () => this.handleBtnChange(e, 'medicationPlan', index)
                              });
                            }
                          },
                          { name: 'ckjcbtn', type: 'button', className: 'zhuanke-group-addBTN', shape: "circle", icon: "plus", span: 1, size: 'small',
                            filter: entity => entity.medicationPlan.length === index + 1,
                            onClick: (e, text, resolve) => this.handleBtnChange(e, 'medicationPlan')},
                        ]
                      }
                    ]
                  })  
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
          columns:[
            { name: 'ckzijzhzqt[其他]', type: 'input', span: 12 }
          ]
        },
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 10 },
            { name:'treatment[模板]', type: 'buttons',span: 14, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 16, type: [          
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions, onclick: this.showRegForm.bind(this)},
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

  handleBtnChange(e, params, index) {
    const { entity } = this.state;
    let newEntity = entity;
    if (/^\d$/.test(index)) {
      newEntity[params] = newEntity[params].filter((v, i) => i !== index);
    } else {
      newEntity[params].push({});
    }
    this.setState({entity: newEntity})
  }

  // 入院登记表单
  regFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'hzxm[患者姓名]', type: 'input', span: 6, disabled: true },
            { name: 'xb[性别]', type: 'input', span: 6, disabled: true  },
            { name: 'csrq[出生日期]', type: 'input', span: 6, disabled: true  },
            { name: 'lxdh[联系电话]', type: 'input', span: 6, disabled: true  }
          ]
        },
        {
          columns: [
            { name: 'zyks[住院科室]', type: 'select', valid: 'required', span: 6, options: baseData.zyksOptions },
            { name: 'rysq[入院日期]', type: 'date', valid: 'required', span: 6 },
          ]
        },
        {   
          columns:[
            { name: 'tsbz[特殊备注]', type: 'textarea', span: 12, placeholder: "请输入备注" }
          ]
        },
        {   
          columns:[
            { name: 'sfzwyzy[是否在我院住院]', type: 'checkinput', radio: true, span: 16, options: baseData.sfzyOptions }
          ]
        },
        {   
          columns:[
            { name: 'gj[国籍]', type: 'input', span: 6 },
            { name: 'jg[籍贯]', type: 'input', span: 6 },
            { name: 'mz[民族]', type: 'input', span: 6 }
          ]
        },
        {   
          columns:[
            { name: 'csd1[出生地]', type: 'select', span: 4, options: baseData.csd1Options },
            { name: 'csd2[]', type: 'select', span: 4, options: baseData.csd2Options },
            { name: 'hy[婚姻]', type: 'checkinput', radio: true, span: 12, options: baseData.hyOptions }
          ]
        },
        {   
          columns:[
            { name: 'xzz[现住址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'yb1[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'xzz[身份证地址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'yb2[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'sfzhm[身份证号码(ID)]', type: 'input', span: 12 },
            { name: 'ly[来源]', type: 'checkinput', radio: true, span: 12, options: baseData.lyOptions }
          ]
        },
        {   
          columns:[
            { name: 'zy[职业]', type: 'checkinput', radio: true, span: 24, options: baseData.zyOptions }
          ]
        },
        {   
          columns:[
            { name: 'gzdwjdz[工作单位及地址]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'dwyb[单位邮编]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'dwlxdh[单位联系电话]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'lxrxm[联系人姓名]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'lxrdh[联系人电话]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'lxrdz[联系人地址]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {   
          columns:[
            { name: 'gx[联系人与患者关系]', type: 'checkinput', radio: true, span: 24, options: baseData.gxOptions }
          ]
        }
      ]
    }
  }

  handleYz() {
    const { openYCQ } = this.state;
    this.setState({openYCQ: true});
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
    console.log(name, '11')
    console.log(value, '22')
    const { entity, error } = this.state;
    let data = { [name]: value };
    let errorData = { [name]: valid };
    if (name=='ckzijzhz' || name=='ckxianl' || name=='ckfuzh') {
      data = { [name]: value['label'] };
    }

    switch (name) {
      case 'checkdate':
        data.ckweek = util.countWeek(value);
        errorData.ckweek = null;
        break;
        case 'ckweek':
          this.state.openYCQ = ()=>{};
        break;
        case 'nextRvisit':
          value[0].label === '入院'  ? this.setState({isShowRegForm: true}) : null;
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

    let newEntity = entity;
    // //血压
    if(newEntity.ckpressure[0]) newEntity.ckshrinkpressure = newEntity.ckpressure[0];
    if(newEntity.ckpressure[1]) newEntity.ckdiastolicpressure = newEntity.ckpressure[1];
    // //下次复诊
    if(newEntity.nextRvisit[0]) newEntity.rvisitOsType = newEntity.nextRvisit[0].label;  
    if(newEntity.nextRvisit[2]) newEntity.ckappointment = newEntity.nextRvisit[2];
    if(newEntity.nextRvisit[3]) newEntity.ckappointmentArea = newEntity.nextRvisit[3].label;
    // //胰岛素方案
    if(newEntity.riMo[0]) newEntity.riMoMedicine = newEntity.riMo[0];
    if(newEntity.riMo[1]) newEntity.riMoDosage = newEntity.riMo[1];
    if(newEntity.riNo[0]) newEntity.riNoMedicine = newEntity.riNo[0];
    if(newEntity.riNo[1]) newEntity.riNoDosage = newEntity.riNo[1];
    if(newEntity.riEv[0]) newEntity.riEvMedicine = newEntity.riEv[0];
    if(newEntity.riEv[1]) newEntity.riEvDosage = newEntity.riEv[1];
    if(newEntity.riSl[0]) newEntity.riSlMedicine = newEntity.riSl[0];
    if(newEntity.riSl[1]) newEntity.riSlDosage = newEntity.riSl[1];

    fireForm(form,'valid').then((valid)=>{
      if(valid){
        console.log(entity, '可以保存')
        onSave(newEntity).then(() => this.setState({
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

    const handelClick = (e, isOk) => {
      this.setState({openYCQ:false},()=>{
        // openYCQ();
        if(isOk){
          onChangeInfo({...info, gesexpect:ycq });
          this.handleChange(e, {name: 'checkdate', value: ycq});
        }
      });
    }

    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
             width={600} closable visible={!!openYCQ} onCancel={e => handelClick(e, false)} onOk={e => handelClick(e, true)}>
        <span>是否修改孕产期：</span>
        <DatePicker defaultValue={info.gesexpect} value={ycq} onChange={(e,v)=>{this.setState({ycq:v})}}/>
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
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
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
    const canvas = 'canvas';
    const canvas2 = 'canvas2';
    console.log(demodata, '111')

    service.fuzhen.getPacsGrowth().then(res => {
      if (res.code === '10') {
        demodata = [];
        modal({
          title: text,
          className: "canvasContent",
          content:[<canvas id={canvas} style={{height: 600, width: 550}}><p>Your browserdoes not support the canvas element.</p></canvas>, 
                  // <canvas id={canvas2} className="z3" style={{height: 450, width: '40%'}}><p>Your browserdoes not support the canvas element.</p></canvas>,
                  <canvas style={{height: 600, width: 550}}><p>Your browserdoes not support the canvas element.</p></canvas>],
          footer:'',
          width:'90%',
          maskClosable:true,
          onCancel:resolve
        }).then(() => {
          setTimeout(
            ()=>{
              drawgrid('canvas');
              drawgrid('canvas2');
              // printline();
            },200)
          }
        );
      } else {
        
      }
    })
  }

  // 入院登记表
  showRegForm() {
    const { regFormEntity, isShowRegForm } = this.state;
    const handleClick = (item) => { this.setState({isShowRegForm: false})};
    const handleChange = (e, { name, value, valid }) => {
      const data = {[name]: value};
      this.setState({
        regFormEntity: {...regFormEntity, ...data}
      })
    }
    const handleSave = (form) => {
      fireForm(form, 'valid').then((valid) => {
        if(valid) {
          // service.fuzhen.saveRvisitForm(regFormEntity).then(() => {
          //   this.setState({regFormEntity: {...baseData.regFormEntity}})
          // })
        }
      })
    }
    const printForm = () => {
      console.log('print')
    }

    return (isShowRegForm ?
      <Modal width="80%" title="入院登记表" footer={null} className="reg-form"
        visible={isShowRegForm} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
        {formRender(regFormEntity, this.regFormConfig(), handleChange)}
        <div style={{overflow: 'hidden'}}> 
          <Button className="pull-right blue-btn" type="ghost" onClick={() => printForm()}>打印入院登记表</Button>
          <Button className="pull-right blue-btn margin-R-1" type="ghost" onClick={() => handleSave(document.querySelector('.reg-form'))}>保存</Button>
        </div>
      </Modal>
      : null
    )
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
        <Button className="pull-right blue-btn bottom-btn save-btn" type="ghost" onClick={() => this.handleSave(document.querySelector('.fuzhen-form'))}>保存</Button>
        <Button className="pull-right blue-btn bottom-btn" type="ghost" onClick={() => this.handleSave(document.querySelector('.fuzhen-form'), "open")}>保存并开立医嘱</Button>
        {/* {this.renderQX()} */}
        {this.renderTreatment()}
        {this.renderYCQ()}
        {this.renderModal()}
        {this.showRegForm()}
      </div> 
    )
  }
}

