import React, { Component } from "react";
import { Tabs, Button, Row, Col,message  } from 'antd';

import Page from '../../render/page';
import { fireForm } from '../../render/form';
import service from '../../service';
import * as common from '../../utils/common';
import * as util from '../fuzhen/util';

import Yfxx from './yunfuxinxi';
import Zfxx from './zhangfuxinxi';
import Byqk from './benyunqingkuang';
import Gqs from './guoqushi';
import Yjs from './yuejingshi';
import Jzs from './jiazushi';
import Ycs from './yuncanshi';
import Jyjc from './jianyanjiacha';
import Tgjc from './tigejiancha';
import Zkjc from './zhuankejiancha';
import Zdcl from './zhenduanchuli';

import store from "../store";
import { getUserDocAction,
        getAllFormDataAction,
        isFormChangeAction, 
        allReminderAction, 
        showReminderAction, 
        openMedicalAction,
    } from "../store/actionCreators.js";

import * as baseData from './data';
import editors from './editors';
import "./index.less";

const tabConetnts = [Yfxx, Zfxx, Byqk, Gqs, Yjs, Ycs, Tgjc, Zkjc,Jyjc, Zdcl];
const hideMessage = null;

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
            info: {},
            tabs: tabs,
            step: tabs[0].key, // 从0开始
            allData: null,
            ...store.getState(),
        }
        store.subscribe(this.handleStoreChange);

        this.componentWillUnmount = editors();

        service.getuserDoc().then(res => this.setState({
            info: res.object
        }))
        this.activeTab(this.state.step);
    }

    handleStoreChange = () => {
        this.setState(store.getState());
    };

    activeTab(step) {
        const { tabs } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        // if (!tab.init) {
            service.shouzhen.getForm(tab.key).then(res => {
                const action = getAllFormDataAction(res.object);
                store.dispatch(action);
                // 如果想要使下面的数据转换放到对应的tab文件里面去，请实现entityParse这个方法，参考tab-0：yunfuxinxi.js这个文件
                const entityParse = tab.entityParse || (i => i);
                tab.entity = entityParse(res.object);

                tab.init = true;
                if (tab.key === 'tab-0') {
                    tab.entity = res.object.gravidaInfo
                    tab.entity['useridtype'] = JSON.parse(res.object.gravidaInfo.useridtype);
                    // 逗号隔开string地址
                    const root = res.object.gravidaInfo.userconstant;
                    const rootArr = root.split(',');
                    tab.entity["root"] = {
                      0: rootArr[0].split(' '),
                      1: rootArr[1]
                    };
                    const address = res.object.gravidaInfo.useraddress;
                    const addressArr = address.split(",");
                    tab.entity["address"] = {
                      0: addressArr[0].split(" "),
                      1: addressArr[1]
                    };
                    // console.log("78787878", tab.entity["address"]);
                } else if (tab.key === 'tab-1') {
                    tab.entity = res.object.husbandInfo;
                    let t = tab.entity["add_FIELD_husband_drink_type"];
                    let type = "";
                    if (t && t.indexOf('{') !== -1) {
                      type = JSON.parse(t);
                    } else {
                      type = t;
                    }

                    // let type = tab.entity['add_FIELD_husband_drink_type'] ? JSON.parse(tab.entity['add_FIELD_husband_drink_type']) : '';
                    let drink = tab.entity['add_FIELD_husband_drink'] ? JSON.parse(tab.entity['add_FIELD_husband_drink']) : ''
                    tab.entity['add_FIELD_husband_drink_data'] = { 0: type, 1: drink }
                    tab.entity['add_FIELD_husband_useridtype'] = JSON.parse(res.object.husbandInfo.add_FIELD_husband_useridtype);
                    // console.log(tab.entity);
                } else if (tab.key === 'tab-2') {
                    tab.entity = res.object.pregnantInfo
                    tab.entity['ckyibzhzh'] = JSON.parse(tab.entity.ckyibzhzh);
                    // console.log(tab.entity);
                } else if (tab.key === 'tab-3'){
                    tab.entity = res.object.hisInfo
                    tab.entity['bsguomin'] = tab.entity.bsguomin;
                    tab.entity['bsjibing'] = tab.entity.bsjibing;
                    tab.entity['bsshoushu'] = tab.entity.bsshoushu;
                    tab.entity['hobtabp'] = tab.entity.hobtabp;
                    tab.entity['operationHistory'] = (res.object.operationHistory.operationHistorys!=null)?res.object.operationHistory.operationHistorys:[];
                } else if (tab.key === 'tab-4') {
                    //tab.entity = res.object.menstruationMarriage
                    tab.entity = {...res.object.menstruationMarriage,...res.object.biography};
                    tab.entity['maritalHistory'] = JSON.parse(tab.entity.maritalHistory);
                    tab.entity['userjinqjh'] = JSON.parse(tab.entity.userjinqjh);
                    tab.entity['historyOfInfertility'] = JSON.parse(tab.entity.historyOfInfertility);
                    tab.entity['yjtongj'] = JSON.parse(tab.entity.yjtongj);
                    tab.entity['yjcuch'] = JSON.parse(tab.entity.yjcuch);
                    console.log(tab.entity);
                } else if (tab.key === 'tab-5') {
                    tab.entity = [];
                    // preghiss
                    tab.entity['preghiss'] = (res.object.gestation.preghiss!=null)?res.object.gestation.preghiss:[];
                    tab.entity['preghiss'].push(baseData.initYCData);
                    // tab.entity['preghis'] ={"preghis": [{
                    //     "id":1,
                    //     "checkdate": "2019-02",
                    //     "xiych": "",
                    //     "abortion": ""},{
                    //         "id":2,
                    //         "checkdate": "2018-02",
                    //         "xiych": "",
                    //         "st":true,
                    //         "abortion": ""},{
                    //             "id":3,
                    //             "checkdate": "本孕",
                    //             "xiych": "",
                    //             "chux": true,
                    //             "abortion": ""}]
                    //     }
                } else if (tab.key === 'tab-') {
                    tab.entity = res.object.biography
                    tab.entity['mzxuan'] = JSON.parse(tab.entity.mzxuan);//[];
                    tab.entity['add_FIELD_mzxuan6'] = JSON.parse(tab.entity.add_FIELD_mzxuan6);//[];
                    tab.entity['add_FIELD_mzxuan61'] = JSON.parse(tab.entity.add_FIELD_mzxuan61);//[];
                    tab.entity['userhistory'] = JSON.parse(tab.entity.userhistory);//[];
                    tab.entity['add_FIELD_userhistory_fyys'] = JSON.parse(tab.entity.add_FIELD_userhistory_fyys);//[];
                } else if (tab.key === 'tab-8') {
                    tab.entity = res.object.lis;
                    if(JSON.parse(tab.entity.ogtt)[0]['label'] === "GDM") {
                        const data = {"value": {
                            "input0": tab.entity['add_FIELD_ogtt_gdm_empty'],
                            "input1": tab.entity['add_FIELD_ogtt_gdm_1h'],
                            "input2": tab.entity['add_FIELD_ogtt_gdm_2h'],
                        }};
                        tab.entity['ogtt'] = [Object.assign(JSON.parse(tab.entity.ogtt)[0], data)];
                    }
                    // tab.entity['aids'] = JSON.parse(tab.entity.aids);
                    // tab.entity['ogtt'] = JSON.parse(tab.entity.ogtt);
                    // tab.entity['thalassemia'] = JSON.parse(tab.entity.thalassemia);
                    // tab.entity['husbandThalassemia'] = JSON.parse(tab.entity.husbandThalassemia);
                    // tab.entity['husbandCkxuex'] = JSON.parse(tab.entity.husbandCkxuex);
                    // tab.entity['husbandRh'] = JSON.parse(tab.entity.husbandRh);
                    // tab.entity['ckxuex'] = JSON.parse(tab.entity.ckxuex);
                    // tab.entity['ckrh'] = JSON.parse(tab.entity.ckrh);
                    // tab.entity['hbsAg'] = JSON.parse(tab.entity.hbsAg);
                    // tab.entity['add_FIELD_GBS'] = JSON.parse(tab.entity.add_FIELD_GBS);
                    // tab.entity['add_FIELD_ndb'] = JSON.parse(tab.entity.add_FIELD_ndb);
                    // tab.entity['add_FIELD_hcvAb_RNA'] = JSON.parse(tab.entity.add_FIELD_hcvAb_RNA);
                    // tab.entity['rpr'] = JSON.parse(tab.entity.rpr);
                    // tab.entity['hcvAb'] = JSON.parse(tab.entity.hcvAb);
                    // tab.entity['add_FIELD_hcvAb_RNA'] = JSON.parse(tab.entity.add_FIELD_hcvAb_RNA);
                    console.log(tab.entity);
                } else if (tab.key === 'tab-6') {
                  tab.entity = res.object.checkUp;
                  // 初始化BMI数值
                  tab.entity["ckbmi"] = common.getBMI( tab.entity["cktizh"], tab.entity["cksheng"] );
                  tab.entity.ckpressure = typeof tab.entity.ckpressure === "object" 
                                        ? tab.entity.ckpressure : [ tab.entity.ckshrinkpressure, tab.entity.ckdiastolicpressure ];
                  tab.entity["vascularMurmur"] = typeof tab.entity.vascularMurmur != "object"
                                        ? JSON.parse(tab.entity.vascularMurmur) : tab.entity.vascularMurmur;
                  tab.entity["ckshenz"] = typeof tab.entity.ckshenz != "object" ? JSON.parse(tab.entity.ckshenz) : tab.entity.ckshenz;
                  tab.entity["ckrut"] = typeof tab.entity.ckrut != "object" ? JSON.parse(tab.entity.ckrut) : tab.entity.ckrut;
                  tab.entity["ckjiazhx"] = typeof tab.entity.ckjiazhx !== "object" ? JSON.parse(tab.entity.ckjiazhx) : tab.entity.ckjiazhx;
                  tab.entity["ckpifu"] = typeof tab.entity.ckpifu != "object" ? JSON.parse(tab.entity.ckpifu) : tab.entity.ckpifu;
                  tab.entity["ckpiz"] = typeof tab.entity.ckpiz != "object" ? JSON.parse(tab.entity.ckpiz) : tab.entity.ckpiz;
                  tab.entity["ckfuzh"] = typeof tab.entity.ckfuzh != "object" ? JSON.parse(tab.entity.ckfuzh) : tab.entity.ckfuzh;
                  tab.entity["nervousReflex"] = typeof tab.entity.nervousReflex != "object" ? JSON.parse( tab.entity.nervousReflex) : tab.entity.nervousReflex;
                  //病历反射
                  tab.entity["vascularMurmurOther"] = typeof tab.entity.vascularMurmurOther != "object"
                                                    ? JSON.parse(tab.entity.vascularMurmurOther) : tab.entity.vascularMurmurOther;
                  tab.entity["murmurs"] = typeof tab.entity.murmurs != "object" ? JSON.parse(tab.entity.murmurs) : tab.entity.murmurs;
                  tab.entity["ckganz"] = typeof tab.entity.ckganz != "object" ? JSON.parse(tab.entity.ckganz) : tab.entity.ckganz;
                  tab.entity["heart"] = typeof tab.entity.heart != "object" ? JSON.parse(tab.entity.heart) : tab.entity.heart;
                  tab.entity["ckjizh"] = typeof tab.entity.ckjizh != "object" ? JSON.parse(tab.entity.ckjizh) : tab.entity.ckjizh;
                  tab.entity["breathSounds"] = typeof tab.entity.breathSounds != "object" ? JSON.parse(tab.entity.breathSounds) : tab.entity.breathSounds;
                } else if (tab.key === 'tab-7') {
                    tab.entity = res.object.specialityCheckUp
                    let ckjc = tab.entity.add_FIELD_ckjc;
                    if(tab.entity.add_FIELD_ckjc === null){
                        ckjc = '';
                    }
                    tab.entity['add_FIELD_ckjc'] = (ckjc !== '' && typeof ckjc !== 'object') ? JSON.parse(ckjc) : ckjc;
                } else if (tab.key === 'tab-9') {
                    tab.entity = res.object.diagnosis
                    tab.entity['xiacsftype'] = JSON.parse(tab.entity.xiacsftype);
                    tab.entity['xiacsfdatearea'] = JSON.parse(tab.entity.xiacsfdatearea);
                } else {
                    tab.entity = res.object;
                }

                service.praseJSON(tab.entity);
                console.log(tab.key, tab.entity);
                this.setState({ step, allData: res.object }, () => {
                  const form = document.querySelector(".shouzhen");
                  fireForm(form, "valid");
                });
            }).catch(e => { // TODO: 仅仅在mock时候用
                tab.init = true;
                service.praseJSON(tab.entity);
                console.warn(e);
                this.setState({ step }, () => {
                    const form = document.querySelector('.shouzhen');
                    fireForm(form, 'valid');
                });
            });
        // } else {
        //     this.setState({ step });
        // }
    }

    // 如果想把handleChange的逻辑移动到对应的tab页里面去，请参考tab-0：yunfuxinxi.js这个文件的handleChange
    handleChange(e, { name, value, target }, entity) {
        console.log(name, target, value, entity);
        entity[name] = value
        switch (name) {
            // case 'root':
            //   entity["userconstant"] = `${value[0].join(' ')},${value[1]}`;
            //   break;
            // case 'address':
            //   entity["useraddress"] = `${value[0].join(" ")},${value[1]}`;
            //   break;
            case 'dopupt':
                entity['pupttm'] = common.GetWeek(entity['gesexpectrv'],value);
                break;
            case 'ckzdate':
                entity['ckztingj'] = common.GetWeek(entity['gesexpectrv'],value);
                break;
            case 'gesmoc':
                entity['gesexpect'] = common.GetExpected(value);
                entity['gesexpectrv'] = common.GetExpected(value);
                entity['pupttm'] = common.GetWeek(entity['gesexpectrv'],entity['dopupt']);
                entity['ckztingj'] = common.GetWeek(entity['gesexpectrv'],entity['ckzdate']);
                break;
            // case 'gesexpectrv':
            //     entity['pupttm'] = common.GetWeek(value,entity['dopupt']);
            //     entity['ckztingj'] = common.GetWeek(value,entity['ckzdate']);
            //     break;
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
            case 'treatment':
                entity['diagnosisHandle'] = value;
            break; 
            case 'nextRvisitWeek':
                entity['xiacsfdate'] = util.futureDate(value.value);
            break; 
        }
        this.change = true;
        const action = isFormChangeAction(true);
        store.dispatch(action);

        // 避免200ms内界面渲染多次
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.forceUpdate(), 200);
    }

    handleSave(isShowReminderModal, key) {
        const { tabs, step, allData } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step }
        console.log('handleSave', key, step, tab.entity);

        message.destroy();
        const hide = message.loading('正在执行中...', 0);

        let allReminderModal = [];
        const getAllReminder = (modalObj) => {
            let bool = true;
            allData.diagnosisList && allData.diagnosisList.map(item => {
                if(item.data === modalObj.diagnosis) bool = false;
            })
            if(bool) allReminderModal.push(modalObj);
        }

        fireForm(form, 'valid').then((valid) => {
            // 数据提交前再对数据进行一些处理，请实现entitySave方法，请参考tab-0：yunfuxinxi.js这个文件
            const entitySave = tab.entitySave || (i=>i);
            tab.error = !valid;

            // 异步手动移除
            setTimeout(hide, 2000);

            if (valid) {
                // 修复喝酒不触发API问题
                if(tab.key === 'tab-1'&& tab.entity.add_FIELD_husband_drink != tab.entity.add_FIELD_husband_drink_data[1]){
                    this.change=true;
                    const action = isFormChangeAction(true);
                    store.dispatch(action);
                }
                console.log("888888888888888", tab.key);
                if (this.change) {
                  console.log("89898989898", tab.key, tab.entity.root, tab.entity.address);
                    if (tab.key === "tab-0") {
                      tab.entity.userconstant = `${tab.entity.root[0].join(' ')},${tab.entity.root[1]}`;
                      tab.entity.useraddress = `${tab.entity.address[0].join(' ')},${tab.entity.address[1]}`;
                    }
                    if (tab.key === 'tab-1') {
                        tab.entity.add_FIELD_husband_drink_type = tab.entity.add_FIELD_husband_drink_data[0] || '';
                        tab.entity.add_FIELD_husband_drink = tab.entity.add_FIELD_husband_drink_data[1] || '';
                    }
                    if (tab.key === 'tab-6') {
                        tab.entity.ckdiastolicpressure = tab.entity.ckpressure[0];
                        tab.entity.ckshrinkpressure = tab.entity.ckpressure[1];
                    }
                    if (tab.key === 'tab-8') {
                        if (tab.entity.ogtt[0].label === "GDM") {
                            tab.entity.add_FIELD_ogtt_gdm_empty = tab.entity.ogtt[0].value.input0;
                            tab.entity.add_FIELD_ogtt_gdm_1h = tab.entity.ogtt[0].value.input1;
                            tab.entity.add_FIELD_ogtt_gdm_2h = tab.entity.ogtt[0].value.input2;
                            
                            let modalObj = {'reminder': 'OGTT为GDM', 'diagnosis': '妊娠期糖尿病', 'visible': true};
                            getAllReminder(modalObj);
                        }

                        if(tab.entity.add_FIELD_hbsAg_ALT > 80) {
                            let modalObj = {'reminder': 'ALT > 正常范围上限的2倍', 'diagnosis': '慢性活动性肝炎', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.hbsAg[0].label === '小三阳') {
                            let modalObj = {'reminder': '乙肝两对半为小三阳', 'diagnosis': '乙型肝炎小三阳', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.hbsAg[0].label === '大三阳') {
                            let modalObj = {'reminder': '乙肝两对半为大三阳', 'diagnosis': '乙型肝炎大三阳', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.hcvAb[0].label === '阳性') {
                            let modalObj = {'reminder': '丙肝抗体为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.add_FIELD_hcvAb_RNA[0].label === '阳性') {
                            let modalObj = {'reminder': '丙肝RNA为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.rpr[0].label === '阳性') {
                            let modalObj = {'reminder': '梅毒阳性', 'diagnosis': '梅毒', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.thalassemia[0].label === '甲型') {
                            let modalObj = {'reminder': '女方地贫为甲型', 'diagnosis': 'α地中海贫血', 'visible': true};
                            getAllReminder(modalObj);
                        }
                        if(tab.entity.thalassemia[0].label === '乙型') {
                            let modalObj = {'reminder': '女方地贫为乙型', 'diagnosis': 'β地中海贫血', 'visible': true};
                            getAllReminder(modalObj);
                        }

                        if(allReminderModal.length > 0) {
                            const action1 = openMedicalAction(false);
                            store.dispatch(action1);

                            const action2 = allReminderAction(allReminderModal);
                            store.dispatch(action2);

                            const action3 = showReminderAction(true);
                            store.dispatch(action3);
                        }
    
                    }
                    if (tab.key !== 'tab-5') {
                        if(tab.key === 'tab-3'){
                            service.shouzhen.saveOperations(tab.key, entitySave(tab.entity)).then(() => {
                                message.success('信息保存成功',3);
                                this.activeTab(key || next.key);
                            }, () => { // TODO: 仅仅在mock时候用
                                this.activeTab(key || next.key);
                            });
                        }
                        console.log(isShowReminderModal, '43666')
                        !isShowReminderModal && service.shouzhen.saveForm(tab.key, entitySave(tab.entity)).then(() => {
                            message.success('信息保存成功',3);
                            this.activeTab(key || next.key);
                            /*修改预产期-B超 同步数据*/
                            if(tab.key === 'tab-2') {
                                service.getuserDoc().then(res => this.setState({
                                    info: res.object
                                }, () => {
                                    const action = getUserDocAction(res.object);
                                    store.dispatch(action);
                                }))
                            }
                        }, () => { // TODO: 仅仅在mock时候用
                            this.activeTab(key || next.key);
                        });
                    } else {
                        tab.entity.preghiss.pop();
                        service.shouzhen.savePregnancies(tab.key, tab.entity).then(() => {
                            message.success('信息保存成功',3);
                            tab.entity.preghiss.push(baseData.initYCData);
                            this.activeTab(key || next.key);
                            return;
                        }, () => { // TODO: 仅仅在mock时候用
                            this.activeTab(key || next.key);
                            return;
                        });
                    }
                } else {
                    this.activeTab(key || next.key);
                }
                this.change = false;
                const action = isFormChangeAction(false);
                store.dispatch(action);
            } else {
                message.error('必填项不能为空！');
                if (key === 'openPDF') {
                    window.open("http://www.baidu.com?" + step, tab.entity, '_blank');
                } else if (key) {
                    this.activeTab(key);
                } else {
                    this.forceUpdate();
                }
            }
        });
    }

    printPdf(url) {
        var iframe = this._printIframe;
        if (!this._printIframe) {
            iframe = this._printIframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            iframe.style.display = 'none';
            iframe.onload = function() {
            setTimeout(function() {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
          };
        }
        iframe.src = service.getUrl(url);
    }

    render() {
        const { tabs, info, step, allData, isShowReminderModal } = this.state;
        const printIvisit = () => {
            service.shouzhen.printPdfByFile().then(res => {
                this.printPdf(res.object);
            })
        }

        return (
          <Page className="shouzhen pad-T-mid">
            <Button type="primary" className="top-save-btn" size="small" onClick={() => alert("保存")}>保存</Button>
            <Button type="primary" className="top-savePDF-btn" size="small" onClick={() => printIvisit()}>打印</Button>

            <div className="bgWhite" style={{ position: "fixed", top: "7.65em", left: "0", right: "0", bottom: "0"}}></div>
            <Tabs type="card" activeKey={step} onChange={key => this.handleSave(isShowReminderModal, key)}>
              {tabs.map(({ key, title, entity, error, Content }) => (
                <Tabs.TabPane key={key}
                  tab={
                    <span style={error ? { color: "red" } : {}}>
                      {error ? ( <i className="anticon anticon-exclamation-circle" />) : null}
                      {title}
                    </span>
                  }>
                  <div className="bgWhite pad-mid " style={{ maxWidth: "1400px" }}>
                    {step === key ? (<Content info={info} allData={allData} entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)}/>) : null}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Row>
              <Col span={21} />
              <Col>
                <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(isShowReminderModal) }, 100)}>
                  {step !== tabs[tabs.length - 1].key ? "下一页" : "保存并开医嘱"}
                </Button>
                {step === tabs[tabs.length - 1].key ?
                    <Button className="shouzhen-bbtn2" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(isShowReminderModal) }, 100)}>
                        保存
                    </Button>
                    : null
                }
              </Col>
            </Row>
          </Page>
        );
    }
}