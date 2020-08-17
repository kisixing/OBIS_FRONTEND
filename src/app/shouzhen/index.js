import React, { Component } from "react";
import { Tabs, Button, Row, Col, message, Icon } from 'antd';
import Page from '../../render/page';
import { fireForm } from '../../render/form';
import service from '../../service';
import * as common from '../../utils/common';
import * as util from '../fuzhen/util';
import cModal from '../../render/modal';
import YCQ from './components/YuChanQi';
import YBBS from './components/YiBanBingShi';
import QTBS from './components/QiTaBingShi';
import YCS from './components/YunChanShi';
import JYJC from './components/JianYanJianCha';
import TGJC from './components/TiGeJianCha';
import ZKJC from './components/ZhuanKeJianCha';
import ZDCL from './components/ZhenDuanChuLi';

import store from "../store";
import { getUserDocAction, getAllFormDataAction, isFormChangeAction, allReminderAction, showReminderAction, openMedicalAction,
         getIdAction, getWhichAction, setEmptyAction, szListAction
    } from "../store/actionCreators.js";

import * as baseData from './data';
import editors from './editors';
import "./index.less";

const tabConetnts = [YCQ, YBBS, QTBS, YCS, TGJC, ZKJC,JYJC, ZDCL];

export default class Patient extends Component {
    constructor(props) {
        super(props);
        const tabs = tabConetnts.map((tab, i) => ({
            key: `tab-${i}`,
            title: tab.Title,
            Content: tab,
            entity: { ...(tab.default || {}) }
        }));
        this.state = {
            tabs: tabs,
            step: tabs[0].key, // 从0开始
            requiredData: baseData.requiredForm,
            isShowWeekModal: false,
            weekMsg: '',
            adjustInfo: null,
            ...store.getState(),
        }
        store.subscribe(this.handleStoreChange);

        this.componentWillUnmount = editors();
  
        this.activeTab(this.state.step);
    }

    handleStoreChange = () => {
        this.setState(store.getState());
    };

    componentDidMount() {
        const { allFormData } = this.state;
        if (allFormData) {
            this.adjustGesexpectrv(allFormData.pregnantInfo);
        }
    }

    activeTab(step) {
        const { tabs, allFormData } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        if (!!allFormData) {
            // 如果想要使下面的数据转换放到对应的tab文件里面去，请实现entityParse这个方法，参考tab-0：yunfuxinxi.js这个文件
            const entityParse = tab.entityParse || (i => i);
            tab.entity = entityParse(allFormData);

            if (tab.key === 'tab-0') {
                tab.entity = service.praseJSON(allFormData.pregnantInfo);
                // 解决自然选项去掉空格之后没有勾选对应选项的问题
                if (tab.entity.add_FIELD_shouyun && tab.entity.add_FIELD_shouyun[0] && tab.entity.add_FIELD_shouyun[0].label === ' 自然') {
                    tab.entity.add_FIELD_shouyun = [{"label": "自然", "value": ""}];
                }
            } else if (tab.key === 'tab-1'){
                tab.entity = service.praseJSON(allFormData.hisInfo);
                // 其他病史默认选无
                // tab.entity.add_FIELD_qitabingshi = !!tab.entity.add_FIELD_qitabingshi ? tab.entity.add_FIELD_qitabingshi : [{"label": "无", "value": ""}];
                // 其他由 select 改成 textarea, 对之前的数据进项转换
                if (Object.prototype.toString.call(tab.entity.add_FIELD_symptom) === '[object Object]' && tab.entity.add_FIELD_symptom.value) {
                    tab.entity.add_FIELD_symptom = tab.entity.add_FIELD_symptom.value;
                }
            } else if (tab.key === 'tab-2') {
                tab.entity = service.praseJSON({...allFormData.menstruationMarriage, ...allFormData.biography});
                // 其他默认选无
                tab.entity.add_FIELD_grqita = !!tab.entity.add_FIELD_grqita ? tab.entity.add_FIELD_grqita : [{"label": "无", "value": ""}];
                tab.entity.add_FIELD_jzqita = !!tab.entity.add_FIELD_jzqita ? tab.entity.add_FIELD_jzqita : [{"label": "无", "value": ""}];
            } else if (tab.key === 'tab-3') {
                tab.entity = [];
                tab.entity['preghiss'] = !!allFormData.gestation.preghiss ? allFormData.gestation.preghiss : [];
                // 本孕胎数不显示
                if (tab.entity.preghiss && tab.entity.preghiss.length > 0) {
                    tab.entity.preghiss[tab.entity.preghiss.length - 1].births = '';
                }
            } else if (tab.key === 'tab-4') {
                tab.entity = service.praseJSON(allFormData.checkUp);
                // 初始化BMI数值
                tab.entity["ckbmi"] = common.getBMI( tab.entity["cktizh"], tab.entity["cksheng"] );
                tab.entity.ckpressure = { 0: tab.entity.ckshrinkpressure, 1: tab.entity.ckdiastolicpressure };
                tab.entity.secondCkpressure = { 0: tab.entity.secondBpSystolic, 1: tab.entity.secondBpDiastolic };
                tab.entity.threeCkpressure = { 0: tab.entity.threeBpSystolic, 1: tab.entity.threeBpDiastolic };

                // 体格检查数据初始化
                tab.entity.add_FIELD_headFeatures = !!tab.entity.add_FIELD_headFeatures ? tab.entity.add_FIELD_headFeatures : [{"label": "正常", "value": ""}];
                tab.entity.ckrut = !!tab.entity.ckrut ? tab.entity.ckrut : [{"label": "正常", "value": ""}];
                tab.entity.ckpifu = !!tab.entity.ckpifu ? tab.entity.ckpifu : [{"label": "正常", "value": ""}];
                tab.entity.ckjiazhx = !!tab.entity.ckjiazhx ? tab.entity.ckjiazhx : [{"label": "正常", "value": ""}];
                tab.entity.ckganz = !!tab.entity.ckganz ? tab.entity.ckganz : [{"label": "未触及", "value": ""}];
                tab.entity.ckpiz = !!tab.entity.ckpiz ? tab.entity.ckpiz : [{"label": "未触及", "value": ""}];
                tab.entity.ckshenz = !!tab.entity.ckshenz ? tab.entity.ckshenz : [{"label": "无", "value": ""}];
                tab.entity.ckjizh = !!tab.entity.ckjizh ? tab.entity.ckjizh : [{"label": "正常", "value": ""}];
                tab.entity.nervousReflex = !!tab.entity.nervousReflex ? tab.entity.nervousReflex : [{"label": "存在", "value": ""}];
                tab.entity.vascularMurmurOther = !!tab.entity.vascularMurmurOther ? tab.entity.vascularMurmurOther : [{"label": "无", "value": ""}];
                tab.entity.ckfuzh = !!tab.entity.ckfuzh ? tab.entity.ckfuzh : [{"label": "-", "value": ""}];
            } else if (tab.key === 'tab-5') {
                tab.entity = service.praseJSON(allFormData.specialityCheckUp);
                let ckjc = tab.entity.add_FIELD_ckjc;
                if(tab.entity.add_FIELD_ckjc === null){
                    ckjc = '';
                }
                tab.entity['add_FIELD_ckjc'] = (ckjc !== '' && typeof ckjc !== 'object') ? JSON.parse(ckjc) : ckjc;
            } else if (tab.key === 'tab-6') {
                const unusualArr = ["↑", "↓"];
                tab.entity = service.praseJSON(allFormData.lis);
                if(tab.entity.ogtt && tab.entity.ogtt[0] && tab.entity.ogtt[0].label === "GDM") {
                    const data = {"value": {
                        "input0": tab.entity['add_FIELD_ogtt_gdm_empty'],
                        "input1": tab.entity['add_FIELD_ogtt_gdm_1h'],
                        "input2": tab.entity['add_FIELD_ogtt_gdm_2h'],
                    }};
                    tab.entity['ogtt'] = [Object.assign(tab.entity.ogtt[0], data)];
                }
                // 异常指标处理
                if (tab.entity.add_FIELD_TSH && unusualArr.includes(tab.entity.add_FIELD_TSH_unusual)) {
                    tab.entity.all_add_FIELD_TSH = tab.entity.add_FIELD_TSH + tab.entity.add_FIELD_TSH_unusual;
                } else {
                    tab.entity.all_add_FIELD_TSH = tab.entity.add_FIELD_TSH;
                }
                if (tab.entity.add_FIELD_free_t3 && unusualArr.includes(tab.entity.add_FIELD_free_t3_unusual)) {
                    tab.entity.all_add_FIELD_free_t3 = tab.entity.add_FIELD_free_t3 + tab.entity.add_FIELD_free_t3_unusual;
                } else {
                    tab.entity.all_add_FIELD_free_t3 = tab.entity.add_FIELD_free_t3;
                }
                if (tab.entity.add_FIELD_free_t4 && unusualArr.includes(tab.entity.add_FIELD_free_t4_unusual)) {
                    tab.entity.all_add_FIELD_free_t4 = tab.entity.add_FIELD_free_t4 + tab.entity.add_FIELD_free_t4_unusual;
                } else {
                    tab.entity.all_add_FIELD_free_t4 = tab.entity.add_FIELD_free_t4;
                }
                // 乙肝两对半选项更改后作下特别处理
                if (tab.entity.hbsAg && tab.entity.hbsAg[0]) {
                    const hbsAgArr = ['阳性', '小三阳', '大三阳', '慢活肝', '其他'];
                    if (hbsAgArr.includes(tab.entity.hbsAg[0].label)) {
                        tab.entity.hbsAg = [{"label": "异常", "value": ""}];
                    }
                }
            } else if (tab.key === 'tab-7') {
                tab.entity = service.praseJSON(allFormData.diagnosis); 
                tab.entity.add_FIELD_first_clinical_doctor = (!tab.entity.xiacsfdate && !tab.entity.add_FIELD_first_clinical_doctor) ? common.getCookie('docName') : tab.entity.add_FIELD_first_clinical_doctor;
            } else {
                tab.entity = service.praseJSON(allFormData);
            }
            // console.log(tab.key, tab.entity);
            this.setState({ step });
        }
    }

    // 如果想把handleChange的逻辑移动到对应的tab页里面去，请参考tab-0：yunfuxinxi.js这个文件的handleChange
    async handleChange(e, { name, value, target }, entity) {
        const { step } = this.state;
        console.log(name, value, entity, 'change');
        if (!this.isSaving) {
            entity[name] = value;
            switch (name) {
                case 'gesexpectrv':
                    const res = await service.shouzhen.postGWeek(value);
                    if (res.object.respMsg) {
                        this.setState({
                            isShowWeekModal: true,
                            weekMsg: res.object
                        })
                    }
                    break;
                case 'gesexpect':
                    if (!value || !entity['ckzdate']) {
                        entity['ckztingj'] = '';
                    } else {
                        entity['ckztingj'] = util.getWeek(40, util.countWeek(value, entity['ckzdate']));
                    }
                    break;
                case 'ckzdate':
                    if (!value) {
                        entity['ckztingj'] = '';
                    } else {
                        entity['ckztingj'] = util.getWeek(40, util.countWeek(entity['gesexpect'], value));
                    }
                    break;
                case 'ckzweek':
                    this.adjustGesexpectrv(entity);
                    break;
                case 'gesmoc':
                    if (!!value) {
                        service.shouzhen.calcEddByLmp(value).then(res => {
                            this.handleChange(e, { name: 'gesexpect', value: res.object, target }, entity);
                            this.handleChange(e, { name: 'gesexpectrv', value: res.object, target }, entity);
                        })
                        service.shouzhen.findCkzdataByUserid(value).then(res => {
                            if (!!res.object.ckzdate) {
                                this.handleChange(e, { name: 'ckzdate', value: res.object.ckzdate, target }, entity);
                            } 
                            if (!!res.object.ckzcrl) {
                                this.handleChange(e, { name: 'ckzcrl', value: res.object.ckzcrl, target }, entity);
                            } 
                            if (!!res.object.ckzbpd) {
                                this.handleChange(e, { name: 'ckzbpd', value: res.object.ckzbpd, target }, entity);
                            };
                            if (!!res.object.ckzweek) {
                                this.handleChange(e, { name: 'ckzweek', value: res.object.ckzweek, target }, entity);
                            }
                            if (!!res.object.ckztingj) {
                                this.handleChange(e, { name: 'ckztingj', value: res.object.ckztingj, target }, entity);
                            }
                        })
                    }
                    break;
                case 'add_FIELD_gesmoc_unknown':
                    if (value && value[0] && value[0].label === '不详') {
                        entity['gesmoc'] = '';
                        entity['gesexpect'] = '';
                    }
                    break;
                // 脉搏同步心率
                case 'add_FIELD_pulse':
                    entity['cardiac'] = entity['add_FIELD_pulse'];
                    break;
                // 孕前体重
                case 'cktizh':
                    entity['ckbmi'] = common.getBMI(entity['cktizh'],entity['cksheng']);
                    break;
                case 'cksheng':
                    entity['ckbmi'] = common.getBMI(entity['cktizh'],entity['cksheng']);
                    break;
                case 'noneChecked1':
                    entity = common.ResetData(entity, 'noneChecked1');
                    break;
                case 'add_FIELD_gaoxueya': case 'add_FIELD_tangniaobing': case 'add_FIELD_xinzangbing': case 'add_FIELD_qitabingshi':
                    target==="有-checkbox" ? entity['noneChecked1'] = [{"label": "", "value": ""}] : null;
                    break;
                case 'noneChecked2':
                    entity = common.ResetData(entity, 'noneChecked2');
                    break;
                case 'add_FIELD_grxiyan': case 'add_FIELD_gryinjiu': case 'add_FIELD_gryouhai': case 'add_FIELD_grfangshe': case 'add_FIELD_grqita':
                    target==="有-checkbox" ? entity['noneChecked2'] = [{"label": "", "value": ""}] : null;
                    break;
                case 'noneChecked3':
                    entity = common.ResetData(entity, 'noneChecked3');
                    break;
                case 'add_FIELD_jzgaoxueya': case 'add_FIELD_jztangniaobing': case 'add_FIELD_jzjixing': case 'add_FIELD_jzyichuanbing': case 'add_FIELD_jzqita':
                    target==="有-checkbox" ? entity['noneChecked3'] = [{"label": "", "value": ""}] : null;
                    break;
                case 'preghiss':
                    var data = value.slice(-1);
                    if(data[0]['$type'] === 'CREATE') {
                        var item = entity['preghiss'].pop();
                        entity['preghiss'].splice(-1, 0, item);
                    }
                    break; 
                case 'maritalHistory':
                    if (entity['maritalHistory'][0] && entity['maritalHistory'][0].label === '未婚') {
                        entity['userjiehn'] = '';
                        entity['userjinqjh'] = [];
                    }
                default:
                    break;
            }
            this.change = true;
            const action = isFormChangeAction(true);
            store.dispatch(action);
        }

        // 避免200ms内界面渲染多次
        // clearTimeout(this.timeout);
        // this.timeout = setTimeout(() => this.forceUpdate(), 200);
    }

    handleSave(key, type) {
        const { tabs, step, allFormData, szList, emptyData, isFormChange } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step }
        let isJump = false;
        this.isSaving = true;
        if (key) {
            const keyNum = parseInt(key.slice(-1));
            const stepNum = parseInt(step.slice(-1));
            isJump = keyNum >= stepNum ? false : true;
        }
        // console.log('handleSave', key, step, tab.entity);

        message.destroy();
        const hide = message.loading('正在执行中...', 0);

        fireForm(form, 'valid').then((valid) => {
            // 数据提交前再对数据进行一些处理，请实现entitySave方法，请参考tab-0：yunfuxinxi.js这个文件
            const entitySave = tab.entitySave || (i=>i);
            tab.error = !valid;
            // 异步手动移除
            setTimeout(hide, 300);
            if (this.change) {
                if (tab.key === 'tab-2') {
                    // 方便移动端作的数据处理
                    let arr = [];
                    if (tab.entity.add_FIELD_jzgaoxueya && tab.entity.add_FIELD_jzgaoxueya[0] && tab.entity.add_FIELD_jzgaoxueya[0].label === '有') {
                        arr.push('高血压');
                    }
                    if (tab.entity.add_FIELD_jztangniaobing && tab.entity.add_FIELD_jztangniaobing[0] && tab.entity.add_FIELD_jztangniaobing[0].label === '有') {
                        arr.push('糖尿病');
                    }
                    if (tab.entity.add_FIELD_jzjixing && tab.entity.add_FIELD_jzjixing[0] && tab.entity.add_FIELD_jzjixing[0].label === '有') {
                        arr.push('先天畸形');
                    }
                    if (tab.entity.add_FIELD_jzyichuanbing && tab.entity.add_FIELD_jzyichuanbing[0] && tab.entity.add_FIELD_jzyichuanbing[0].label === '有') {
                        arr.push('遗传病');
                    }
                    if (tab.entity.add_FIELD_jzqita && tab.entity.add_FIELD_jzqita[0] && tab.entity.add_FIELD_jzqita[0].label === '有') {
                        arr.push(tab.entity.add_FIELD_jzqita[0].value);
                    }
                    tab.entity.mzxuan = arr.join(',');
                }
                if (tab.key === 'tab-3') {
                    //删除空数据
                    tab.entity.preghiss = tab.entity.preghiss.filter(item => Object.keys(item).length !== 1);
                    // 孕产史数据同步  数据校验
                    let isDateSpecial = false;
                    let isPregSpecial = false;
                    let hasYearMonth = true;
                    let len = tab.entity.preghiss.length;
                    tab.entity.preghiss.forEach((item) => {
                        let bool = true;
                        if (!item.hasOwnProperty('datagridYearMonth')) hasYearMonth = false;
                        tab.entity.preghiss.forEach((subItem) => {
                            if (item.datagridYearMonth == subItem.datagridYearMonth && bool) {
                                if (item.zir !== "true" && item.reng!== "true" && !item.yinch && subItem.zir !== "true" && subItem.reng!== "true" && !subItem.yinch) {
                                    item.zir = subItem.zir;
                                    item.removalUterus = subItem.removalUterus;
                                    item.reng = subItem.reng;
                                    item.yinch = subItem.yinch;
                                    item.sit = subItem.sit;
                                    item.zaoch = subItem.zaoch;
                                    item.zuych = subItem.zuych;
                                    item.shunch = subItem.shunch;
                                    item.shouShuChanType = subItem.shouShuChanType;
                                    item.chuxue = subItem.chuxue;
                                    item.chanrure = subItem.chanrure;
                                    item.bingfzh = subItem.bingfzh;
                                    item.hospital = subItem.hospital;
                                    item.xinseother = subItem.xinseother;
                                    bool = false;
                                }
                            }
                        })
                        if (item.datagridYearMonth && item.datagridYearMonth.indexOf('~') !== -1) isDateSpecial = true;
                        if (item.pregnum && item.pregnum.indexOf('-') !== -1) isPregSpecial = true;
                    })

                    if (isDateSpecial && !tab.entity.preghiss[len-1].pregnum) {
                        message.error('年月格式不规范，请手动输入本孕孕次！', 6);
                        key = step;
                    }  
                    if (isPregSpecial && !tab.entity.preghiss[len-1].pregnum) {
                        message.error('孕次格式不规范，请手动输入本孕孕次！', 6);
                        key = step;
                    } 
                    
                    if (hasYearMonth) {
                        service.shouzhen.savePregnancies(tab.key, tab.entity).then(() => {
                            message.success('信息保存成功',3);
                            service.shouzhen.getAllForm().then(res => {
                                const action = getAllFormDataAction(service.praseJSON(res.object));
                                store.dispatch(action);
                                if (valid) {
                                    this.activeTab(key || next.key);
                                }
                            })
                            service.getuserDoc().then(res => {
                                const action = getUserDocAction(res.object);
                                store.dispatch(action);
                            })
                        });
                    } else {
                        message.error('请输入年月！', 5);
                    }

                }
                if (tab.key === 'tab-4') {
                    tab.entity.ckshrinkpressure = tab.entity.ckpressure[0];
                    tab.entity.ckdiastolicpressure = tab.entity.ckpressure[1];
                    tab.entity.secondBpSystolic = tab.entity.secondCkpressure[0];
                    tab.entity.secondBpDiastolic = tab.entity.secondCkpressure[1];
                    tab.entity.threeBpSystolic = tab.entity.threeCkpressure[0];
                    tab.entity.threeBpDiastolic = tab.entity.threeCkpressure[1];
                }
                if (tab.key === 'tab-6') {
                    if (tab.entity.ogtt && tab.entity.ogtt[0] && tab.entity.ogtt[0].label === "GDM") {
                        tab.entity.add_FIELD_ogtt_gdm_empty = tab.entity.ogtt[0].value.input0;
                        tab.entity.add_FIELD_ogtt_gdm_1h = tab.entity.ogtt[0].value.input1;
                        tab.entity.add_FIELD_ogtt_gdm_2h = tab.entity.ogtt[0].value.input2;
                    }
                    if (!!tab.entity.all_add_FIELD_TSH && (tab.entity.all_add_FIELD_TSH.indexOf("↑") !== -1 || tab.entity.all_add_FIELD_TSH.indexOf("↓") !== -1)) {
                        let arrow = tab.entity.add_FIELD_TSH_unusual;
                        tab.entity.add_FIELD_TSH = tab.entity.all_add_FIELD_TSH.slice(0, tab.entity.all_add_FIELD_TSH.indexOf(arrow));
                    } else {
                        tab.entity.add_FIELD_TSH = tab.entity.all_add_FIELD_TSH;
                    }
                    if (!!tab.entity.all_add_FIELD_free_t3 && (tab.entity.all_add_FIELD_free_t3.indexOf("↑") !== -1 || tab.entity.all_add_FIELD_free_t3.indexOf("↓") !== -1)) {
                        let arrow = tab.entity.add_FIELD_free_t3_unusual;
                        tab.entity.add_FIELD_free_t3 = tab.entity.all_add_FIELD_free_t3.slice(0, tab.entity.all_add_FIELD_free_t3.indexOf(arrow));
                    } else {
                        tab.entity.add_FIELD_free_t3 = tab.entity.all_add_FIELD_free_t3;
                    }
                    if (!!tab.entity.all_add_FIELD_free_t4 && (tab.entity.all_add_FIELD_free_t4.indexOf("↑") !== -1 || tab.entity.all_add_FIELD_free_t4.indexOf("↓") !== -1)) {
                        let arrow = tab.entity.add_FIELD_free_t4_unusual;
                        tab.entity.add_FIELD_free_t4 = tab.entity.all_add_FIELD_free_t4.slice(0, tab.entity.all_add_FIELD_free_t4.indexOf(arrow));
                    } else {
                        tab.entity.add_FIELD_free_t4 = tab.entity.all_add_FIELD_free_t4;
                    }
                }   
                if (tab.key !== 'tab-3' && tab.key !== 'tab-7') {
                    service.shouzhen.saveForm(tab.key, entitySave(tab.entity)).then(() => {
                        message.success('信息保存成功',3);
                        /*修改预产期-B超    G、P、妊娠 同步数据*/
                        if(tab.key === 'tab-0') {
                            allFormData.pregnantInfo = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                            service.shouzhen.getAllForm().then(res => {
                                const action = getAllFormDataAction(service.praseJSON(res.object));
                                store.dispatch(action);
                            })
                            service.getuserDoc().then(res => {
                                const action = getUserDocAction(res.object);
                                store.dispatch(action);
                            })
                        }
                        if(tab.key === 'tab-1') {
                            allFormData.hisInfo = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                        }
                        if(tab.key === 'tab-2') {
                            allFormData.menstruationMarriage = tab.entity;
                            allFormData.biography = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                        }
                        if(tab.key === 'tab-4') {
                            allFormData.checkUp = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                        }
                        if(tab.key === 'tab-5') {
                            allFormData.specialityCheckUp = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                        }
                        if(tab.key === 'tab-6') {
                            allFormData.lis = tab.entity;
                            const action = getAllFormDataAction(allFormData);
                            store.dispatch(action);
                        }
                        if (valid || isJump) {
                            this.activeTab(key || next.key);
                        }
                    });
                }
            } else {
                if (valid || isJump) {
                    this.activeTab(key || next.key);
                }
            }
            if (tab.key === 'tab-7' && key === 'tab-7') {
                service.shouzhen.checkRemind('1').then(res => {
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

                // 校验中间必填项
                let emptyTab = '';
                for (let i = 0; i < 7; i++) {
                    if (emptyData[`tab-${i}`].length > 1) {
                        emptyTab += emptyData[`tab-${i}`][0] + '；';
                    }
                }
                if (emptyTab.length > 0) {
                    message.error(`${emptyTab}有必填项为空，请完善！`, 5);
                }
                
            }     
            // 保存诊断数据
            if(tab.key === 'tab-7' && isFormChange) {
                if (!tab.entity.add_FIELD_first_save_ivisit_time) {
                    tab.entity.add_FIELD_first_save_ivisit_time = util.futureDate(0);
                }
                service.shouzhen.saveForm(tab.key, entitySave(tab.entity)).then(res => {
                    message.success('信息保存成功',3);
                    allFormData.diagnosis = tab.entity;
                    const action = getAllFormDataAction(allFormData);
                    store.dispatch(action);
                    const idAction = getIdAction(res.object.ivisitId);
                    store.dispatch(idAction);
                    const whichAction = getWhichAction('sz');
                    store.dispatch(whichAction);
                    service.shouzhen.batchAdd(1, res.object.ivisitId, szList, 1, common.getCookie('redirectUrl')).then(res => {
                        service.getuserDoc().then(res => {
                            const action = getUserDocAction(res.object);
                            store.dispatch(action);
                        })
                        service.shouzhen.uploadHisDiagnosis(1).then(res => { })
                        service.shouzhen.getList(1).then(res => {
                            const action = szListAction(res.object);
                            store.dispatch(action);
                        })
                    })
                    this.getEmptyData(allFormData);
                })
            }
            this.getEmptyData(allFormData);
            this.change = false;
            this.isSaving = false;
            const action = isFormChangeAction(false);
            store.dispatch(action);

            if (!valid && type !== 'save') {
                !isJump && message.error('必填项不能为空！');
                if (key && isJump) {
                    this.activeTab(key);
                } else {
                    // this.forceUpdate();
                }
            }
        });
    }

    getIndex(val, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) return i;
        }
        return -1;
    }

    updateEmptyData(tab, name, value) {
        const { requiredData, emptyData } = this.state;
        if (requiredData[tab].includes(name)) {
            if (!value || JSON.stringify(value) === '[]' || JSON.stringify(value) === '{}' && !emptyData[tab].includes(name)) {
                emptyData[tab].push(name);
            } else if (value && JSON.stringify(value) !== '[]' && JSON.stringify(value) !== '{}' && emptyData[tab].includes(name)) {
                emptyData[tab].splice(this.getIndex(name, emptyData[tab]), 1);
            }
        }
        const action = setEmptyAction(emptyData);
        store.dispatch(action);
    }

    getEachData(tab, list) {
        const { requiredData, emptyData } = this.state;
        requiredData[tab].forEach(item => {
            if ((!list[item] || JSON.stringify(list[item]) === '[]' || JSON.stringify(list[item]) === '{}') && !emptyData[tab].includes(item)) {
                emptyData[tab].push(item);
            } else if (list[item] && JSON.stringify(list[item]) !== '[]' && JSON.stringify(list[item]) !== '{}' && emptyData[tab].includes(item)) {
                emptyData[tab].splice(emptyData[tab].indexOf(item), 1);
            }
        })
        const action = setEmptyAction(emptyData);
        store.dispatch(action);
    }

    getEmptyData(data) {
        this.getEachData('tab-0', data.pregnantInfo);
        this.getEachData('tab-1', data.hisInfo);
        this.getEachData('tab-2', {...data.menstruationMarriage, ...data.biography});
        this.getEachData('tab-4', data.checkUp);
        this.getEachData('tab-5', data.specialityCheckUp);
        this.getEachData('tab-6', data.lis);
        this.getEachData('tab-7', data.diagnosis);
    }

    // 更改预产期提示弹窗
    renderWeekModal = () => {
        const { isShowWeekModal, weekMsg, step } = this.state;
        const content = () => {
            return (
                <div>
                    {weekMsg.respMsg}
                </div>
            )
        };
        const onCancel = () => {
            this.setState({ isShowWeekModal: false });
        }
        const onOk = async (e) => {
            await service.shouzhen.adjustGWeek(weekMsg);
            this.handleSave(step);
            this.setState({ isShowWeekModal: false });
        }
        cModal({
            visible: isShowWeekModal, 
            content: content, 
            onCancel: onCancel,
            onOk: onOk,
        })
    }

    adjustGesexpectrv(pregnantInfo) {
        const { gesexpect, gesexpectrv, ckztingj, ckzweek } = pregnantInfo;
        if (gesexpect && ckztingj && ckzweek && ckztingj !== ckzweek) {
            const days = util.getDays(util.getWeek(ckztingj, ckzweek));
            if (days >= 7) {
                service.shouzhen.calculateGesexpectrv(gesexpect, ckztingj, ckzweek).then(res => {
                    if (gesexpectrv !== res.object.gesexpectrv) {
                        this.setState({
                            adjustInfo: res.object
                        })
                    }
                })
            }
        }
    }

    // 提示是否更改预产期-B超
    renderAdjustModal = () => {
        const { adjustInfo, tabs } = this.state;
        const content = () => {
            return (
                <div>
                    根据B超，是否调整预产期-B超为 {adjustInfo.gesexpectrv}
                </div>
            )
        };
        const onCancel = () => {
            const visible = { "remindFlag": false };
            this.setState({ adjustInfo: {...adjustInfo, ...visible} });
            service.shouzhen.closeRemindMark();
        }
        const onOk = (e) => {
            const visible = { "remindFlag": false };
            this.setState({ adjustInfo: {...adjustInfo, ...visible} });
            this.handleChange(e, { name: 'gesexpectrv', value: adjustInfo.gesexpectrv }, tabs[0].entity);
        }
        cModal({
            visible: adjustInfo.remindFlag, 
            content: content, 
            onCancel: onCancel,
            onOk: onOk,
            closable: false,
        })
    }

    render() {
        const { tabs, step, userDoc, allFormData, emptyData, isShowWeekModal, adjustInfo } = this.state;
        const printIvisit = () => {
            service.shouzhen.printPdfByFile('ivisitA5').then(res => {
                common.printPdf(res.object);
            })
        }
        
        // 首个tab页作下特别处理
        if (!!allFormData && JSON.stringify(tabs[0].entity) === "{}") {
            tabs[0].entity = allFormData.pregnantInfo;
            this.getEmptyData(allFormData);
            this.adjustGesexpectrv(allFormData.pregnantInfo);
        }
        
        return (
          <Page className="shouzhen">
            <Button icon="save" className="top-save-btn" size="small" onClick={() => this.handleSave(step, 'save')}>保存</Button>
            <Button icon="print-blue" className="top-savePDF-btn" size="small" onClick={() => printIvisit()}>打印</Button>

            <div className="bgWhite" style={{ position: "fixed", top: "148px", left: "0", right: "0", bottom: "0"}}></div>
            <Tabs type="card" activeKey={step} onChange={key => setTimeout(() => { this.handleSave(key) }, 300)}> 
              {tabs.map(({ key, title, entity, error, Content }) => (
                <Tabs.TabPane key={key}
                  tab={
                    <span style={error ? { color: "#ff0000" } : {}}>
                      {error ? ( <i className="anticon anticon-exclamation-circle" />) 
                            : emptyData[key].length===1 ? ( <i className="anticon anticon-check-circle" />) : null}
                      {title}
                    </span>
                  }>
                  <div className="bgWhite pad-mid" style={{ maxWidth: "1460px" }}>
                    {step === key ? (<Content info={userDoc} entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)}/>) : null}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Row>
              <Col span={21} />
              <Col>
                { step !== tabs[tabs.length - 1].key
                    ? <Button className="shouzhen-bbtn" type="primary" onClick={() => setTimeout(() => { this.handleSave() }, 300)}>下一页<Icon type="arrow-right" /></Button>
                    : <div>
                        {/* <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(step, 'open') }, 100)}>保存并开医嘱</Button> */}
                        <Button className="shouzhen-bbtn" type="primary" onClick={() => setTimeout(() => { this.handleSave(step) }, 100)}>保存<Icon type="save" /></Button>
                      </div>
                }
              </Col>
            </Row>
            { isShowWeekModal && this.renderWeekModal() }
            { adjustInfo && adjustInfo.remindFlag && this.renderAdjustModal() }
          </Page>
        );
    }
}