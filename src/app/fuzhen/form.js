
import React, { Component } from "react";
import { Row, Col, Input, Icon, Select, Button, message, Table, Modal, Spin, Tree, DatePicker } from 'antd';
import addrOptions from '../../utils/cascader-address-options';
import * as util from './util';
import * as baseData from './data';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import service from '../../service';
import modal from '../../utils/modal';
import {loadWidget} from '../../utils/common';
import './form.less';
import store from '../store';
import { isFormChangeAction,
        allReminderAction,
        getUserDocAction,
        openMedicalAction,
      } from '../store/actionCreators.js';

import RegForm from '../components/reg-form';
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
      // ycq: '',
      // openYCQ: false,
      // openQX: false,
      openTemplate: false,
      openYy: false,
      adviceList: [],
      openAdvice: false,
      isShowRegForm: false,
      error: {},
      treatTemp: [],
      treatKey1: [],
      treatKey2: [],
      getPacsGrowth: {},
      openMenzhen: false,
      menzhenData: new Date(),
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
    this.renderChart = renderChart();
    service.fuzhen.treatTemp().then(res => this.setState({
      treatTemp: res.object
    }));
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    service.shouzhen.getAdviceTreeList().then(res => {
      res.object.length > 1 && this.setState({adviceList: res.object, openAdvice: true})
    });
  }

  // 2 检测孕妇高危诊断，修改表格以及表单型式
  checkDiagnosisHighrisk(type) {
    const { diagList, relatedObj } = this.props;

    let diagItem = [];
    let signItem = [];
    diagList.map(item => { diagItem.push(item.data)});
    for (var k in relatedObj) { signItem = signItem.concat(relatedObj[k]) };

    /*关联表单操作*/
    const searchParam = {
      'diabetes': {
        'diagKeyword': ['糖尿病'],
        'digWord': [],
        'signWord': ['内分泌疾病']
      },
      'hypertension': {
        'diagKeyword': ['高血压', '子痫', '肾炎', '肾脏', '肾病', '红斑狼疮'],
        'digWord': ['红斑狼疮', '风湿性关节炎', '类风湿性关节炎', '硬皮病'],
        'signWord': ['高血压', '肾病', '免疫系统疾病']
      },
      'coronary': {
        'diagKeyword': ['心脏', '心肌', '心包', '心血管'],
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
        // {
        //   columns: [
        //     { name: 'checkdate[日期]', type: 'date', span: 6 },
        //     { name: 'ckweek(周)[孕周]', type: 'input', span: 4, onClick:this.handleYz.bind(this) },
        //     {
        //       span: 8,
        //       columns:[
        //         { name: 'cktizh(kg)[体重]', type: 'input', span: 16, valid: 'number|rang(40,100)' },
        //         { type:  'button', span: 8, text: '体重曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
        //       ]
        //     },
        //     {
        //       name: 'ckpressure(mmHg)[血压]', type: [{type: 'input(/)'},{type: 'input'}], span: 6, valid: (value)=>{
        //       let message = '';
        //       if(value){
        //         if(value[0] && valid('number|rang(0,140)',value[0])){
        //           message += '第1个值' + valid('number|rang(0,140)',value[0])
        //         }else if(value[0] && valid('number|rang(0,110)',value[1])){
        //           message += '第2个值' + valid('number|rang(0,140)',value[1])
        //         }
        //       }

        //       return message;
        //     }},
        //   ]
        // },
        // {
        //   columns:[
        //     { name: 'ckzijzhz[自觉症状]', type:'select', showSearch:true, span: 12, options: baseData.ckzijzhzOptions }
        //   ]
        // },
        {
          columns: [
            // {
            //   span: 6, columns:[
            //     { name: 'ckgongg(cm)[宫高]', type: 'input', span: 16 },
            //     { type:  'button', span: 8, text: '生长曲线', color:'#1890ff', size:'small', onClick:this.renderQX.bind(this)}
            //   ]
            // },
            // {
            //   span: 6, filter:()=>check('twins')||check('multiple'), columns:[
            //     { name: 'ckfuzh[下肢水肿]', type: 'select', showSearch:true, options: baseData.ckfuzhOptions}
            //   ]
            // },
            {
              span: 18, rows: [
                // {
                //   filter:()=>!check('twins')&&!check('multiple'), columns: [
                //     { name: 'cktaix(bmp)[胎心率]', type: 'input', span: 8 },
                //     { name: 'ckxian[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                //     { name: 'ckfuzh[下肢水肿]', type: 'select', span: 8, showSearch:true, options: baseData.ckfuzhOptions}
                //   ]
                // },
                {
                  filter:()=>check('twins')||check('multiple'), name: 'fetalCondition', span: 24, groups: index => ({
                    rows: [
                      {
                        label: `胎${index+1}`, columns: [
                          { name: 'location[位置]', type: 'select', span: 8, showSearch:true, options: baseData.wzOptions },
                          { name: 'taix(bmp)[胎心率]', type: 'input', span: 7, valid: 'number' },
                          { name: 'xianl[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                          { span: 1 },
                          {
                            name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                            filter: entity => entity.fetalCondition.length !== 1&&check('multiple'),
                            onClick: (e, text, resolve) => {
                              Modal.confirm({
                                title: '您是否确认要删除该记录',
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
                        title: '您是否确认要删除该记录',
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
                      { name: `name[用药${index + 1}]`, span: 18, type: 'input' },
                      // { name: `frequency[频率]`, span: 7, type: 'select', showSearch: true, options: baseData.yyfaOptions },
                      // { name: `dosages[剂量]`, span: 7, type: 'input' },
                      { span: 1 },
                      {
                        name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                        filter: entity => entity.medicationPlan.length !== 1,
                        onClick: (e, text, resolve) => {
                          Modal.confirm({
                            title: '您是否确认要删除该记录',
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
                          { name: `name[用药${index + 1}]`, span: 18, type: 'input' },
                          // { name: `frequency[频率]`, span: 6, type: 'select', showSearch: true, options: baseData.yyfaOptions },
                          // { name: `dosages[剂量]`, span: 6, type: 'input' },
                          { span: 1 },
                          {
                            name: 'ckjcbtn1', type: 'button', shape: "circle", icon: "minus", span: 1, size: 'small',
                            filter: entity => entity.medicationPlan.length !== 1,
                            onClick: (e, text, resolve) => {
                              Modal.confirm({
                                title: '您是否确认要删除该记录',
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
        // {
        //   columns:[
        //     { name: 'ckzijzhzqt[其他]', type: 'input', span: 12 }
        //   ]
        // },
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 10 },
            { name:'treatment[模板]', type: 'buttons',span: 14, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { name: 'rvisitOsType[下次复诊]', type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions, span: 5 },
            { name: 'ckappointmentWeek', type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions, span: 3 },
            { name: 'ckappointment', type:'date', valid: 'required', span: 2 },
            { name: 'ckappointmentArea', type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions, span: 3 },
            // {
            //   name: 'nextRvisit[下次复诊]', valid: 'required', span: 16, type: [
            //     {type:'select', valid: 'required', showSearch:true, options: baseData.rvisitOsTypeOptions},
            //     {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
            //     {type: 'date', valid: 'required'},
            //     {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions},
            //   ]
            // }
          ]
        }
      ]
    }
  }

  handleBtnChange(e, params, index) {
    const { initData, onChange } = this.props;
    let newEntity = initData;
    if (/^\d$/.test(index)) {
      newEntity[params] = newEntity[params].filter((v, i) => i !== index);
    } else {
      newEntity[params].push({});
    }
    onChange(e, newEntity);
  }

  // handleYz() {
  //   const { openYCQ } = this.state;
  //   this.setState({openYCQ: true});
  // }

  addTreatment(e, value){
    const { initData } = this.props;
    this.handleChange(e, {
      name: 'treatment',
      value: initData.treatment + value + '； '
    })
  }

  handleTreatmentClick(e, {text,index},resolve){
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text);
    if(text==='糖尿病日间门诊') {
      // this.setState({openMenzhen: true});
    }else if (text==='产前诊断') {
      // this.setState({openMenzhen: true});

    }
  }

  handleChange(e, { name, value, valid }) {
    console.log(name, '11')
    console.log(value, '22')
    const { error } = this.state;
    const { onChange } = this.props;
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
        case 'rvisitOsType':
          value.label === '入院' ? this.setState({isShowRegForm: true}) : null;
          break;
        case 'ckappointmentWeek':
          data.ckappointment = util.futureDate(value.value);
        break;
    }
    onChange(e, data);
    this.setState({
      error:{
        ...error,
        ...errorData
      }
    })
    const action = isFormChangeAction(true);
    store.dispatch(action);
  }

  handleSave(form, act) {
    const { onSave, initData, ycq } = this.props;
    const { allFormData, isFormChange, diagList } = this.state;
    let newEntity = initData;
    console.log(newEntity, '321')
    let ckpressure = initData.ckpressure.split('/');
    const getReminder = () => {
      if(act) {
        const action = openMedicalAction(true);
        store.dispatch(action);
      } else {
        const action = openMedicalAction(false);
        store.dispatch(action);
      }
      const lis = service.praseJSON(allFormData.lis);
      let allReminderModal = [];
      const getAllReminder = (modalObj) => {
          let bool = true;
          diagList && diagList.map(item => {
              if(item.data === modalObj.diagnosis) bool = false;
          })
          if(bool) allReminderModal.push(modalObj);
      }

      if (lis.ogtt && lis.ogtt[0] && lis.ogtt[0].label === "GDM") {
        let modalObj = {'reminder': 'OGTT为GDM', 'diagnosis': '妊娠期糖尿病', 'visible': true};
        getAllReminder(modalObj);
      }
      if(lis.add_FIELD_hbsAg_ALT && lis.add_FIELD_hbsAg_ALT > 80) {
        let modalObj = {'reminder': 'ALT > 正常范围上限的2倍', 'diagnosis': '慢性活动性肝炎', 'visible': true};
        getAllReminder(modalObj);
      }
      if(lis.hbsAg && lis.hbsAg[0] && lis.hbsAg[0].label === '小三阳') {
          let modalObj = {'reminder': '乙肝两对半为小三阳', 'diagnosis': '乙型肝炎小三阳', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.hbsAg && lis.hbsAg[0] && lis.hbsAg[0].label === '大三阳') {
          let modalObj = {'reminder': '乙肝两对半为大三阳', 'diagnosis': '乙型肝炎大三阳', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.hcvAb && lis.hcvAb[0] && lis.hcvAb[0].label === '阳性') {
          let modalObj = {'reminder': '丙肝抗体为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.add_FIELD_hcvAb_RNA && lis.add_FIELD_hcvAb_RNA[0] && lis.add_FIELD_hcvAb_RNA[0].label === '阳性') {
          let modalObj = {'reminder': '丙肝RNA为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.rpr && lis.rpr[0] && lis.rpr[0].label === '阳性') {
          let modalObj = {'reminder': '梅毒阳性', 'diagnosis': '梅毒', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.thalassemia && lis.thalassemia[0] && lis.thalassemia[0].label === '甲型') {
          let modalObj = {'reminder': '女方地贫为甲型', 'diagnosis': 'α地中海贫血', 'visible': true};
          getAllReminder(modalObj);
      }
      if(lis.thalassemia && lis.thalassemia[0] && lis.thalassemia[0].label === '乙型') {
          let modalObj = {'reminder': '女方地贫为乙型', 'diagnosis': 'β地中海贫血', 'visible': true};
          getAllReminder(modalObj);
      }

      if(allReminderModal.length > 0) {
        const action = allReminderAction(allReminderModal);
        store.dispatch(action);
      }
    }

    newEntity.checkdate = initData.checkdate;
    newEntity.ckweek = initData.ckweek;
    newEntity.cktizh = initData.cktizh;
    newEntity.ckzijzhz = initData.ckzijzhz;

    newEntity.ckgongg = initData.ckgongg;
    newEntity.cktaix = initData.cktaix;
    newEntity.ckxianl = initData.ckxianl;
    newEntity.ckfuzh = initData.ckfuzh;
    // //血压
    if(ckpressure[0]) newEntity.ckshrinkpressure = ckpressure[0];
    if(ckpressure[1]) newEntity.ckdiastolicpressure = ckpressure[1];
    // //胰岛素方案
    if(!!newEntity.riMo && newEntity.riMo[0]) newEntity.riMoMedicine = newEntity.riMo[0];
    if(!!newEntity.riMo && newEntity.riMo[1]) newEntity.riMoDosage = newEntity.riMo[1];
    if(!!newEntity.riNo && newEntity.riNo[0]) newEntity.riNoMedicine = newEntity.riNo[0];
    if(!!newEntity.riNo && newEntity.riNo[1]) newEntity.riNoDosage = newEntity.riNo[1];
    if(!!newEntity.riEv && newEntity.riEv[0]) newEntity.riEvMedicine = newEntity.riEv[0];
    if(!!newEntity.riEv && newEntity.riEv[1]) newEntity.riEvDosage = newEntity.riEv[1];
    if(!!newEntity.riSl && newEntity.riSl[0]) newEntity.riSlMedicine = newEntity.riSl[0];
    if(!!newEntity.riSl && newEntity.riSl[1]) newEntity.riSlDosage = newEntity.riSl[1];

    fireForm(form,'valid').then((valid)=>{
      if(valid && isFormChange){
        console.log(newEntity, '可以保存')
        onSave(newEntity).then(() =>{
          this.setState({ error: {} }, () => {
            getReminder();
          })
          service.fuzhen.updateDocGesexpectrv(ycq).then(() => {
            service.getuserDoc().then(res => {
              const action = getUserDocAction(res.object);
              store.dispatch(action)
            })
          })
          if(act) {
            service.shouzhen.uploadHisDiagnosis().then(res => { })
          }
        });
      } else if(!valid) {
        message.error('必填项不能为空！');
      }
    });
  }

  /**
   * 孕产期
   */
  // renderYCQ(){
  //   const { info, onChangeInfo } = this.props;
  //   const { openYCQ, ycq } = this.state;

  //   const handelClick = (e, isOk) => {
  //     this.setState({openYCQ:false},()=>{
  //       // openYCQ();
  //       if(isOk){
  //         onChangeInfo({...info, gesexpect:ycq });
  //         this.handleChange(e, {name: 'checkdate', value: ycq});
  //       }
  //     });
  //   }

  //   return (
  //     <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
  //            width={600} closable visible={!!openYCQ} onCancel={e => handelClick(e, false)} onOk={e => handelClick(e, true)}>
  //       <span>是否修改孕产期：</span>
  //       <DatePicker defaultValue={info.gesexpect} value={ycq} onChange={(e,v)=>{this.setState({ycq:v})}}/>
  //     </Modal>
  //   );
  // }

  /**
   *预约窗口
   */
  renderMenZhen() {
    const { openMenzhen, menzhenData } = this.state;
    const handelShow = (isShow) => {
      this.setState({openMenzhen: false});
      if(isShow) {
        service.shouzhen.makeAppointment(1, menzhenData).then(res => console.log(res))
      };
    }
    const panelChange = (date, dateString) => {
      this.setState({menzhenData: dateString})
    }

    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
              visible={openMenzhen} onOk={() => handelShow(true)} onCancel={() => handelShow(false)} >
        <span>糖尿病门诊预约</span>
        <Select defaultValue={"本周五"} style={{ width: 120 }}>
          <Select.Option value={"本周五"}>本周五</Select.Option>
          <Select.Option value={"下周五"}>下周五</Select.Option>
          <Select.Option value={"下下周五"}>下下周五</Select.Option>
        </Select>
        <DatePicker defaultValue={menzhenData} onChange={(date, dateString) => panelChange(date, dateString)}/>
      </Modal>
    );
  }

  /**
   * 曲线
   */
  // renderQX(e,text,resolve){
  //   const canvas = 'canvas';
  //   const canvas2 = 'canvas2';
  //   console.log(demodata, '111')

  //   service.fuzhen.getPacsGrowth().then(res => {
  //     if (res.code === '10') {
  //       demodata = [];
  //       modal({
  //         title: text,
  //         className: "canvasContent",
  //         content:[<canvas id={canvas} style={{height: 600, width: 550}}><p>Your browserdoes not support the canvas element.</p></canvas>,
  //                 // <canvas id={canvas2} className="z3" style={{height: 450, width: '40%'}}><p>Your browserdoes not support the canvas element.</p></canvas>,
  //                 <canvas style={{height: 600, width: 550}}><p>Your browserdoes not support the canvas element.</p></canvas>],
  //         footer:'',
  //         width:'90%',
  //         maskClosable:true,
  //         onCancel:resolve
  //       }).then(() => {
  //         setTimeout(
  //           ()=>{
  //             drawgrid('canvas');
  //             drawgrid('canvas2');
  //             // printline();
  //           },200)
  //         }
  //       );
  //     } else {

  //     }
  //   })
  // }

  closeRegForm = () => {
    this.setState({isShowRegForm: false})
  }

    /**
   * 医嘱弹窗
   */
  renderAdviceModal() {
    const { openAdvice, adviceList } = this.state;
    const handelShow = (e, items=[]) => {
      this.setState({openAdvice: false});
      if (items.length > 0) {
        this.addTreatment(e, items.map(i => i.name).join('\n'));
      }
    }

    const initTree = (pid) => adviceList.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.name}>
        {node.pid === 0 ? initTree(node.id) : null}
      </Tree.TreeNode>
    ));

    const handleCheck = (keys) => {
      adviceList.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };
    const treeNodes = initTree(0);

    return ( openAdvice ? 
      <Modal className="adviceModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 是否添加以下医嘱到处理措施？</span>}
              visible={openAdvice} onOk={e=> handelShow(e, adviceList.filter(i => i.checked && i.pid!==0))} onCancel={e => handelShow(e)} >
        <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes}</Tree>
      </Modal> 
      : null
    );
  }

  /**
   * 模板
   */
  renderTreatment() {
    const { treatTemp, openTemplate, treatKey1, treatKey2 } = this.state;
    const closeDialog = (e, items = []) => {
      this.setState({ openTemplate: false, treatKey1: [], treatKey2: [] });
      items.length > 0 && this.addTreatment(e, items.map(i => i.content).join('； '));
    }

    const initTree = (pid, level = 0) => treatTemp.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.content}>
        {level < 10 ? initTree(node.id, level + 1) : null}
      </Tree.TreeNode>
    ));

    const handleCheck1 = (keys) => {
      this.setState({treatKey1: keys});
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || treatKey2.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const handleCheck2 = (keys) => {
      this.setState({treatKey2: keys});
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || treatKey1.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const treeNodes = initTree(0);

    return (
      <Modal title="处理模板" closable visible={openTemplate} width={800} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked && i.pid!==0))}>
        <Row>
          <Col span={12}>
            <Tree checkable defaultExpandAll checkedKeys={treatKey1} onCheck={handleCheck1} style={{ maxHeight: '90%' }}>{treeNodes.slice(0,treeNodes.length/2)}</Tree>
          </Col>
          <Col span={12}>
            <Tree checkable defaultExpandAll checkedKeys={treatKey2} onCheck={handleCheck2} style={{ maxHeight: '90%' }}>{treeNodes.slice(treeNodes.length/2)}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }

  render() {
    const { isShowRegForm } = this.state;
    const { initData } = this.props;
    return (
      <div className="fuzhen-form">
        <strong className="fuzhen-form-TIT">本次产检记录</strong>
        {formRender(initData, this.formConfig(), this.handleChange.bind(this))}
        <div style={{ minHeight: '32px', textAlign: 'right' }}>
          <Button className="blue-btn" type="ghost" style={{ marginRight: '12px' }}
            onClick={() => this.handleSave(document.querySelector(".fuzhen-form"))}>
            保存
          </Button>
          <Button className="blue-btn" type="ghost"
            onClick={() => this.handleSave(document.querySelector(".fuzhen-form"), "open")}>
            保存并开立医嘱
          </Button>
        </div>
        {/* {this.renderQX()} */}
        {this.renderTreatment()}
        {/* {this.renderYCQ()} */}
        {this.renderMenZhen()}
        {this.renderAdviceModal()}
        <RegForm isShowRegForm={isShowRegForm} closeRegForm={this.closeRegForm} getDateHos={this.handleChange.bind(this)} />
      </div>
    );
  }
}

