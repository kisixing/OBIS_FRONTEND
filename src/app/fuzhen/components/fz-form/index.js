
import React, { Component } from "react";
import { Row, Col, Input, Icon, Select, Button, message, Table, Modal, Spin, Tree, DatePicker } from 'antd';
import * as util from '../../util';
import * as common from '../../../../utils/common';
import * as baseData from '../../data';
import formRender, {fireForm} from '../../../../render/form';
import {valid} from '../../../../render/common';
import service from '../../../../service';
import cModal from '../../../../render/modal';
import {loadWidget} from '../../../../utils/common';
import './index.less';
import store from '../../../store';
import { isFormChangeAction, allReminderAction, getUserDocAction, openMedicalAction, showReminderAction
      } from '../../../store/actionCreators.js';
import RegForm from '../../../components/reg-form';
import TemplateModal from '../../../components/template-modal';
import DiabetesAppointment from '../../../components/diabetes-appointment';

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
      openYy: false,
      adviceList: [],
      openAdvice: false,
      isShowRegForm: false,
      isShowHighModal: false,
      appointmentNum: 0,
      addNum: 0,
      totalNum: 0,
      error: {},
      openTemplate: false,
      lisImportTree: null,
      openListImport: false,
      lisExpandedKeys: '',
      lisImportKey: [],
      lisCheckedNodes: [],
      lisImportTitle: '',
      openMenzhen: false,
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
    this.renderChart = renderChart();
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
        'diagKeyword': ['糖尿病'],    //  诊断关键词
        'digWord': [],                //  诊断
        'signWord': ['内分泌疾病']    //  诊断标记
      },
      'hypertension': {
        'diagKeyword': ['高血压', '子痫', '肾炎', '肾脏', '肾病', '红斑狼疮'],
        'digWord': ['红斑狼疮', '风湿性关节炎', '类风湿性关节炎', '硬皮病'],
        'signWord': ['高血压', '肾病', '免疫系统疾病']
      },
      'coronary': {
        'diagKeyword': ['心脏', '心肌', '心包', '心血管', '冠心病', '心力衰竭'],
        'digWord': ['妊娠合并心力衰竭', '风湿性心脏病', '妊娠合并风湿性心脏病', '先天性心脏病', '心肌病'],
        'signWord': ['心血管疾病', '血液系统疾病']
      },
      'twins': {
        'diagKeyword': ['双胎'],
        'digWord': [],
        'signWord': []
      },
      'multiple': {
        'diagKeyword': ['多胎'],
        'digWord': [],
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
        // {
        //   columns: [
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
            // {
              // span: 18, rows: [
                // {
                //   filter:()=>!check('twins')&&!check('multiple'), columns: [
                //     { name: 'cktaix(bmp)[胎心率]', type: 'input', span: 8 },
                //     { name: 'ckxian[先露]', type: 'select', span: 6, showSearch:true, options: baseData.xlOptions },
                //     { name: 'ckfuzh[下肢水肿]', type: 'select', span: 8, showSearch:true, options: baseData.ckfuzhOptions}
                //   ]
                // },
                {
                  name: 'fetalCondition', span: 24, filter: entity => (check('twins')||check('multiple')) && entity.singleflag !== '1', groups: index => ({
                    rows: [
                      {
                        label: `胎${index+1}`, columns: [
                          { name: 'location[位置]', type: 'select', span: 5, showSearch:true, options: baseData.wzOptions },
                          { span: 1 },
                          { name: 'taix(bmp)[胎心率]', type: 'input', span: 5 },
                          { span: 1 },
                          { name: 'xianl[先露]', type: 'select', span: 5, showSearch:true, options: baseData.xlOptions },
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
                          { span: 1 },
                          { 
                            name: 'singleflag', type: 'button', shape: "circle", icon: "rollback", span: 1, size: 'small', 
                            filter: entity => index === 0,
                            onClick: (e, text, resolve) => {
                              Modal.confirm({
                                title: '您是否确认要转换回单胎表单',
                                width: '320',
                                style: {top:'50%', left: '10%', fontSize: '18px' },
                                onOk: () =>  this.handleChange(e, {
                                  name: 'singleflag',
                                  value: '1'
                                })
                              });
                            }
                          },
                        ]
                      }
                    ]
                  })
                },
              // ]
            // }
        //   ]
        // },
        {
          columns:[
            { 
              name: 'singleflag', className: 'add-form', type: 'button', icon: "plus", text: '胎儿', span: 1, size: 'small', 
              filter: entity => (check('twins')||check('multiple')) && entity.singleflag === '1',
              onClick: (e, text, resolve) => {
                Modal.confirm({
                  title: '您是否确认要转换回双胎/多胎表单',
                  width: '350',
                  style: {top:'30%', right: '30%', fontSize: '18px' },
                  onOk: () =>  this.handleChange(e, {
                    name: 'singleflag',
                    value: ''
                  })
                });
              }
            },
          ]
        },
        {
          name: 'fetalUltrasound', span: 24, filter: entity => (check('twins')||check('multiple')) && entity.singleflag !== '1', groups: index => ({
            rows: [
              {
                label: `胎${index+1}超声`, columns: [
                  { name: 'tetz(g)[胎儿体重]', type: 'input', className: 'childLabel', span: 5 },
                  { span: 1 },
                  { name: 'teafv(MM)[AVF]', type: 'input', className: 'childLabel', span: 5 },
                  { span: 1 },
                  { name: 'teqxl[脐血流]', type: 'input', className: 'childLabel', span: 5 },
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
            { name: 'fpg(mmol/L)[空腹血糖]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'pbg2h(mmol/L)[餐后2H血糖]', type: 'input', className: 'long-label', span: 5 },
            { span: 1 },
            { name: 'hbAlc(%)[HbAlc]', type: 'input', span: 5 }
          ]
        },
        {
          filter:()=>check('diabetes'), label:'胰岛素方案', columns:[
            { name: 'riMo(U)[早]', span: 5, 
              type: [{type:'editableSelect', showSearch: true, autoInsert: true, options: baseData.ydsOptions, placeholder:'药物名称', span:16}, 
                    {type:'input', placeholder:'剂量', span:8}] 
            },
            { span: 1 },
            { name: 'riNo(U)[中]', span: 5, 
              type: [{type:'editableSelect', showSearch: true, autoInsert: true, options: baseData.ydsOptions, placeholder:'药物名称', span:16}, 
                    {type:'input', placeholder:'剂量', span:8}]
            },
            { span: 1 },
            { name: 'riEv(U)[晚]', span: 5, 
              type: [{type:'editableSelect', showSearch: true, autoInsert: true, options: baseData.ydsOptions, placeholder:'药物名称', span:16}, 
                    {type:'input',placeholder:'剂量', span:8}] 
            },
            { span: 1 },
            { name: 'riSl(U)[睡前]', span: 5, 
              type: [{type:'editableSelect', showSearch: true, autoInsert: true, options: baseData.ydsOptions, placeholder:'药物名称', span:16}, 
                    {type:'input',placeholder:'剂量', span:8}] 
            },
          ]
        },
        {
          filter:()=>check('hypertension'), rows: [
            {
              columns: [
                {
                  label: '尿蛋白', span: 12, columns: [
                    { name: 'upState[定性]', type: 'input', span: 10 },
                    { span: 2 },
                    { name: 'upDosage24h[24H定量]', type: 'input', span: 10 },
                  ]
                },
                {
                  label: '用药方案', name: 'medicationPlan', span: 12, groups: index => ({
                    rows: [
                      {
                        columns:[
                          { name: `name[用药${index + 1}]`, span: 21, type: 'input' },
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
                }
              ]
            },
          ]
        },
        {
          filter:()=>check('coronary'), rows: [
            {
              columns: [
                { name: 'heartRate(次/分)[心率]', type: 'input', span: 5 },
                { span: 7 },
                { name: 'otherAbnormalSigns[其他异常体征]', type: 'input', className: 'long-label', span: 12 },
              ]
            },
            {
              columns: [
                {
                  label: '用药方案', name: 'medicationPlan', span: 12, filter:()=>!check('hypertension'), groups: index => ({
                    rows: [
                      {
                        columns:[
                          { name: `name[用药${index + 1}]`, span: 21, type: 'input' },
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
            // {
            //   columns: [
            //     { name: 'examination[检验检查]', type: 'textarea', span: 12 }
            //   ]
            // }
          ]
        },
        // {
        //   columns:[
        //     { name: 'ckzijzhzqt[其他]', type: 'input', span: 12 }
        //   ]
        // },
        {
          columns:[
            { name: 'examination[检验检查]', type: 'textarea', span: 12 },
            { name: 'treatment[处理措施]', type: 'textarea', span: 12 },
          ]
        },
        {
          columns:[
            { name: 'examination[检验检查]', className: "examination-btn", type: 'buttons', span: 12,
              text: '(#535881)[检验结果导入],(#535881)[超声结果导入]',
              onClick: this.handleTreatmentClick.bind(this)
            },
            { name:'treatment[模板]', type: 'buttons',span: 12, 
              text: '(#535881)[糖尿病日间门诊],(#150F55)[更多]',
              onClick: this.handleTreatmentClick.bind(this)
            }
          ]
        },
        {
          columns:[
            { name: 'rvisitOsType[下次复诊]', type:'select', placeholder: '门诊类型', showSearch:true, options: baseData.rvisitOsTypeOptions, span: 5 },
            { name: 'ckappointmentWeek', type:'select', placeholder: '选择几周后/几天后', showSearch:true, options: baseData.nextRvisitWeekOptions, span: 2 },
            { name: 'ckappointment', type:'date', placeholder: '日期', valid: 'required', span: 3 },
            { name: 'ckappointmentArea', type:'select', placeholder: '选择上午/下午', showSearch:true, options: baseData.ckappointmentAreaOptions, span: 2 },
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

  addTreatment(e, value){
    const { initData } = this.props;
    if (!initData.treatment) {
      this.handleChange(e, {
        name: 'treatment',
        value: value + '； '
      })
    } else if (initData.treatment.indexOf(value) === -1) {
      this.handleChange(e, {
        name: 'treatment',
        value: initData.treatment + value + '； '
      })
    }
  }

  addExamination(e, value){
    const { initData } = this.props;
    if (!initData.examination) {
      this.handleChange(e, {
        name: 'examination',
        value: value + '； '
      })
    } else if (initData.examination.indexOf(value) === -1) {
      this.handleChange(e, {
        name: 'examination',
        value: initData.examination + value + '； '
      })
    }
  }

  getLisImport() {
    service.fuzhen.getLisImportTree().then(res => {
      if (res.object && res.object[0]) this.setState({ lisExpandedKeys: String(res.object[0].id) });
      this.setState({
        lisImportTitle: '检验结果导入',
        lisImportTree: res.object,
        openListImport: true
      })
    })
  }

  getPacsImportTree() {
    service.fuzhen.getPacsImportTree().then(res => {
      if (res.object && res.object[0]) this.setState({ lisExpandedKeys: String(res.object[0].id) });
      this.setState({
        lisImportTitle: '超声结果导入',
        lisImportTree: res.object,
        openListImport: true
      })
    })
  }

  handleTreatmentClick(e, {text,index},resolve){
    if (text==='糖尿病日间门诊') {
      this.setState({openMenzhen: true});
    } else if (text==='产前诊断') {
      // this.setState({openMenzhen: true});
    } else if (text==='入院') {
      this.setState({isShowRegForm: true})
    } else if (text==='更多') {
      this.setState({openTemplate: true})
    } else if (text==='检验结果导入') {
      this.getLisImport();
    } else if (text==='超声结果导入') {
      this.getPacsImportTree();
    }
    if (text!=='更多' && text!=='检验结果导入' && text!=='超声结果导入') this.addTreatment(e, text);
  }

  checkAddNum(e, select, value) {
    const { initData } = this.props;
    let type = null;
    let date = '';
    let noon = null;

    const getType = (theType) => {
      if (!!theType && theType.label) {
        if (theType.label === '高危门诊') type = 1;
        if (theType.label === '普通门诊' || theType.label === '教授门诊') type = 2;
      }
    }
    const getDate = (theDate) => {
      if (!!theDate) {
        date = theDate;
      } 
    }
    const getNoon = (theNoon) => {
      if (!!theNoon && theNoon.label) {
        if (theNoon.label === '上午') noon = 1;
        if (theNoon.label === '下午') noon = 2;
      }
    }

    if (select === 1) {
      getType(value);
      getDate(initData.ckappointment);
      getNoon(initData.ckappointmentArea);
    }
    if (select === 2) {
      getType(initData.rvisitOsType);
      getDate(value);
      getNoon(initData.ckappointmentArea);
    }
    if (select === 3) {
      getType(initData.rvisitOsType);
      getDate(initData.ckappointment);
      getNoon(value);
    }

    if (!!type && !!date && !!noon) {
      if (type === 1) {
        service.fuzhen.checkIsAddNum(date, noon).then(res => {
          if (res.object.isScheduling) {
            if (res.object.appointmentNum === res.object.totalNum) {
              this.setState({ 
                isShowHighModal: true,
                appointmentNum: res.object.appointmentNum,
                addNum: res.object.addNum,
                totalNum: res.object.totalNum,
              })
            }
          } else {
            service.fuzhen.checkImpact(date, noon, type).then(res => {
              this.handleChange(e, { name: 'ckappointment', value: res.object });
              message.error('该日期已设停诊，已延后选择最近日期！', 5);
            })
          }
        })
      } else if (type === 2) {
        service.fuzhen.checkImpact(date, noon, type).then(res => {
          if (date !== res.object) {
            this.handleChange(e, { name: 'ckappointment', value: res.object });
            message.error('该日期已设停诊，已延后选择最近日期！', 5);
          }
        })
      }
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
        if (value.label === '高危门诊') {
          data.ckappointmentArea = {"0":"上","1":"午","label":"上午","describe":"上","value":'上午'};
        }
        if (value.label === '留观') {
          data.ckappointment = util.futureDate(0);
        }
        this.checkAddNum(e, 1, value);
        break;
      case 'ckappointmentWeek':
        if (value && value.value) {
          data.ckappointment = util.futureDate(value.value);
          this.checkAddNum(e, 2, util.futureDate(value.value));
        }
        break;
      case 'ckappointment':
        data.ckappointmentWeek = '';
        this.checkAddNum(e, 2, value);
        break;
      case 'ckappointmentArea':
        this.checkAddNum(e, 3, value);
        break;
      default:
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
    const { onSave, initData } = this.props;
    const { allFormData, fzList } = this.state;
    let newEntity = initData;
    let ckpressure = initData.ckpressure.split('/');
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
      if(valid){
        console.log(newEntity, '可以保存')
        onSave(newEntity).then(() =>{
          this.setState({ error: {} }, () => {
            // getReminder();
            service.shouzhen.checkRemind('2').then(res => {
              let allReminderModal = res.object.items;
              if (allReminderModal.length > 0) {
                allReminderModal.forEach(item => {
                  item.visible = true;
                })
                const allAction = allReminderAction(allReminderModal);
                store.dispatch(allAction);

                const showAction = showReminderAction(true);
                store.dispatch(showAction);

                const openAction = openMedicalAction(false);
                store.dispatch(openAction);
              }
            })
            // if (act && allReminderModal.length === 0) {
            //   common.closeWindow();
            // }
          })
        });
      } else if(!valid) {
        message.error('必填项不能为空！');
      }
    });
  }

  /**
   * 高危门诊弹窗
   */
  renderHighModal = () => {
    const { isShowHighModal, appointmentNum, addNum, totalNum } = this.state;
    const content = () => {
      return (
        <div className="high-modal">
          <p className="high-info">该日期高危门诊已约满，是否给孕妇加号</p>
          <p className="high-msg">
            <span>已约：<i>{appointmentNum}</i></span>
            <span>已加号：<i>{addNum}</i></span>
            <span>限号：{totalNum}</span>
          </p>
        </div>
      )
    };
    const onCancel = () => {
      this.setState({ isShowHighModal: false });
    }
    const onOK = (e) => {
      this.handleChange(e, { name: 'ckappointment', value: '' });
      this.setState({ isShowHighModal: false });
    }
    const buttons = [
      <Button onClick={e => onOK(e)}>修改日期</Button>,
      <Button type="primary" onClick={() => onCancel()}>加号</Button>
    ]
    cModal({
      visible: isShowHighModal, 
      content: content, 
      onCancel: onCancel,
      footer: buttons,
      closable: false
    })
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
              visible={openAdvice} maskClosable={false} onOk={e=> handelShow(e, adviceList.filter(i => i.checked && i.pid!==0))} onCancel={e => handelShow(e)} >
        <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes}</Tree>
      </Modal> 
      : null
    );
  }

  /**
   * 检验结果导入
   */
  renderLisImport() {
    const { lisImportTree, openListImport, lisImportKey, lisExpandedKeys, lisCheckedNodes, lisImportTitle } = this.state;
    const unusualArr = ["↑", "↓"];
    const closeDialog = (e, bool) => {
      this.setState({ 
        openListImport: false, 
        lisImportKey: []
      });
      if (bool && lisCheckedNodes.length > 0) {
        let nodeStr = '查';
        lisCheckedNodes.forEach(item => {
          nodeStr += ' ' + item + '，';
        })
        nodeStr = nodeStr.substr(0, nodeStr.length - 1);  
        this.addExamination(e, nodeStr);
      }
    }

    const handleCheck = (keys, {checkedNodes}) => {
      let checkItems = [];
      checkedNodes.forEach(node => {
        if (node.props.children.length === 0) checkItems.push(node.props.title);
      })
      this.setState({
        lisImportKey: keys,
        lisCheckedNodes: checkItems
      });
    };

    const initTree = (list) => list && list.map(item => (
      <Tree.TreeNode 
        className={item.unusual==="1" ? "isRed" : 'noRed'} 
        key={item.id} 
        title={unusualArr.includes(item.unusualDesc) ? `${item.title}+${item.unusualDesc}` : item.title}
      >
        {initTree(item.items)}
      </Tree.TreeNode>
    ));

    const treeNodes = initTree(lisImportTree);

    const handleSelect = (value, node, extra) => {
      node.node.onExpand();
    }

    return (
      <Modal className="lis-modal" title={lisImportTitle} closable visible={openListImport} width={900} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, true)}>
        <Row>
          <Col span={24}>
            <Tree checkable defaultExpandedKeys={[lisExpandedKeys]} onSelect={handleSelect} checkedKeys={lisImportKey} onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }
  
  closeRegForm = () => {
    this.setState({isShowRegForm: false})
  }

  closeTemplateModal = (e, items) => {
    if (items.length > 0 ) {
      this.addTreatment(e, items.map(i => i.content).join('； '));
    }
    this.setState({ openTemplate: false });
  }

  closeMenzhen = () => {
    this.setState({ openMenzhen: false });
  }

  handlePrintBtn = () => {
    const { handlePrint } = this.props;
    handlePrint();
  }

  render() {
    const { isShowRegForm, openTemplate, openListImport, openMenzhen } = this.state;
    const { initData } = this.props;
    return (
      <div className="fuzhen-form">
        <strong>本次产检记录</strong>
        <div className="label-4 record-form">
          {formRender(initData, this.formConfig(), this.handleChange.bind(this))}
        </div>
        <div style={{ minHeight: '32px', textAlign: 'center' }}>
          <Button className="fz-save-btn print-btn" icon="print-white" type="primary" onClick={this.handlePrintBtn}>
            打印
          </Button>
          <Button className="fz-save-btn" icon="save" type="primary" onClick={() => setTimeout(() => this.handleSave(document.querySelector(".fuzhen-form")), 300)}>
            保存
          </Button>
          {/* <Button className="blue-btn" type="ghost"
            onClick={() => setTimeout(() => this.handleSave(document.querySelector(".fuzhen-form"), "open"), 100)}>
            保存并开立医嘱
          </Button> */}
        </div>
        {openListImport && this.renderLisImport()}
        {/* {this.renderAdviceModal()} */}
        {this.renderHighModal()}
        {openTemplate && <TemplateModal openTemplate={openTemplate} closeTemplateModal={this.closeTemplateModal} />}
        {openMenzhen && <DiabetesAppointment openMenzhen={openMenzhen} closeMenzhen={this.closeMenzhen} />}
        {/* {isShowRegForm && <RegForm isShowRegForm={isShowRegForm} closeRegForm={this.closeRegForm} getDateHos={this.handleChange.bind(this)} />} */}
      </div>
    );
  }
}

