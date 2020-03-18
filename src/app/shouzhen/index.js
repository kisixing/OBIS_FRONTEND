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
        isSaveAction
    } from "../store/actionCreators.js";

import * as baseData from './data';
import editors from './editors';
import "./index.less";

const tabConetnts = [Byqk, Gqs, Yjs, Ycs, Tgjc, Zkjc,Jyjc, Zdcl];

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
            ...store.getState(),
        }
        store.subscribe(this.handleStoreChange);

        this.componentWillUnmount = editors();

        service.authorize(service.getQueryString('doctorId')).then(res => {
            common.setCookie('docToken', res.object);
            service.getuserDoc().then(res => this.setState({
                info: res.object
            }))
            this.activeTab(this.state.step);
        })
    }

    handleStoreChange = () => {
        this.setState(store.getState());
    };

    activeTab(step) {
        const { tabs } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        service.shouzhen.getForm(tab.key).then(res => {
            const action = getAllFormDataAction(service.praseJSON(res.object));
            store.dispatch(action);
            // 如果想要使下面的数据转换放到对应的tab文件里面去，请实现entityParse这个方法，参考tab-0：yunfuxinxi.js这个文件
            const entityParse = tab.entityParse || (i => i);
            tab.entity = entityParse(res.object);

            if (tab.key === 'tab-0') {
                tab.entity = service.praseJSON(res.object.pregnantInfo);
            } else if (tab.key === 'tab-1'){
                tab.entity = service.praseJSON(res.object.hisInfo);
                // tab.entity['operationHistory'] = !!res.object.operationHistory.operationHistorys ? res.object.operationHistory.operationHistorys : [];
            } else if (tab.key === 'tab-2') {
                tab.entity = service.praseJSON({...res.object.menstruationMarriage, ...res.object.biography});
            } else if (tab.key === 'tab-3') {
                tab.entity = [];
                tab.entity['preghiss'] = !!res.object.gestation.preghiss ? res.object.gestation.preghiss : [];
                // let pregNum = 1
                // if(tab.entity['preghiss'].length > 0) {
                //     pregNum = parseInt(tab.entity['preghiss'][tab.entity['preghiss'].length - 1].pregnum) + 1;
                // }
                // baseData.initYCData.pregnum = pregNum;
                // tab.entity['preghiss'].push(baseData.initYCData);
            } else if (tab.key === 'tab-4') {
                tab.entity = service.praseJSON(res.object.checkUp);
                // 初始化BMI数值
                tab.entity["ckbmi"] = common.getBMI( tab.entity["cktizh"], tab.entity["cksheng"] );
                tab.entity.ckpressure = typeof tab.entity.ckpressure === "object" 
                                    ? tab.entity.ckpressure : [ tab.entity.ckshrinkpressure, tab.entity.ckdiastolicpressure ];
                // 体格检查数据初始化
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
                tab.entity = service.praseJSON(res.object.specialityCheckUp);
                let ckjc = tab.entity.add_FIELD_ckjc;
                if(tab.entity.add_FIELD_ckjc === null){
                    ckjc = '';
                }
                tab.entity['add_FIELD_ckjc'] = (ckjc !== '' && typeof ckjc !== 'object') ? JSON.parse(ckjc) : ckjc;
            } else if (tab.key === 'tab-6') {
                tab.entity = service.praseJSON(res.object.lis);
                if(tab.entity.ogtt[0]['label'] === "GDM") {
                    const data = {"value": {
                        "input0": tab.entity['add_FIELD_ogtt_gdm_empty'],
                        "input1": tab.entity['add_FIELD_ogtt_gdm_1h'],
                        "input2": tab.entity['add_FIELD_ogtt_gdm_2h'],
                    }};
                    tab.entity['ogtt'] = [Object.assign(tab.entity.ogtt[0], data)];
                }
            } else if (tab.key === 'tab-7') {
                tab.entity = service.praseJSON(res.object.diagnosis); 
            } else {
                tab.entity = service.praseJSON(res.object);
            }
            console.log(tab.key, tab.entity);
            this.setState({ step }, () => {
                const form = document.querySelector(".shouzhen");
                fireForm(form, "valid");
            });
        }).catch(e => { // TODO: 仅仅在mock时候用
            service.praseJSON(tab.entity);
            console.warn(e);
            this.setState({ step }, () => {
                const form = document.querySelector('.shouzhen');
                fireForm(form, 'valid');
            });
        });
    }

    // 如果想把handleChange的逻辑移动到对应的tab页里面去，请参考tab-0：yunfuxinxi.js这个文件的handleChange
    handleChange(e, { name, value, target }, entity) {
        console.log(name, target, value, entity);
        entity[name] = value
        switch (name) {
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

    handleSave(key, type) {
        const { tabs, step, allFormData, diagList } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step }
        const action = isSaveAction(true);
        store.dispatch(action);
        let isJump = false;
        if (key) {
            isJump = key.slice(-1) > step.slice(-1) ? false : true;
        }
        console.log('handleSave', key, step, tab.entity);

        message.destroy();
        const hide = message.loading('正在执行中...', 0);

        let allReminderModal = [];
        const getAllReminder = (modalObj) => {
            let bool = true;
            diagList && diagList.map(item => {
                if(item.data === modalObj.diagnosis) bool = false;
            })
            if(bool) allReminderModal.push(modalObj);
        }

        fireForm(form, 'valid').then((valid) => {
            console.log(valid, '543')
            // 数据提交前再对数据进行一些处理，请实现entitySave方法，请参考tab-0：yunfuxinxi.js这个文件
            const entitySave = tab.entitySave || (i=>i);
            tab.error = !valid;

            // 异步手动移除
            setTimeout(hide, 2000);

            if (this.change) {
                // if(tab.key === 'tab-1') {
                //     service.shouzhen.saveOperations(tab.key, entitySave(tab.entity)).then(() => {
                //         message.success('信息保存成功',3);
                //         valid && this.activeTab(key || next.key);
                //     });
                // }
                if (tab.key === 'tab-3') {
                    //删除空数据以及去掉本孕一行
                    tab.entity.preghiss = tab.entity.preghiss.filter(item => Object.keys(item).length !== 1)
                    // tab.entity.preghiss.pop();
                    // 孕产史数据同步  数据校验
                    let isDateSpecial = false;
                    let isPregSpecial = false;
                    let len = tab.entity.preghiss.length;
                    tab.entity.preghiss.forEach((item) => {
                        let bool = true;
                        tab.entity.preghiss.forEach((subItem) => {
                            if (item.datagridYearMonth == subItem.datagridYearMonth && bool) {
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

                    service.shouzhen.savePregnancies(tab.key, tab.entity).then(() => {
                        message.success('信息保存成功',3);
                        // tab.entity.preghiss.push(baseData.initYCData);
                        valid && this.activeTab(key || next.key);
                        service.getuserDoc().then(res => this.setState({
                            info: res.object
                        }, () => {
                            const action = getUserDocAction(res.object);
                            store.dispatch(action);
                        }))
                    });
                }
                if (tab.key === 'tab-4') {
                    tab.entity.ckshrinkpressure = tab.entity.ckpressure[0];
                    tab.entity.ckdiastolicpressure = tab.entity.ckpressure[1];
                }
                if (tab.key === 'tab-6') {
                    if (tab.entity.ogtt && tab.entity.ogtt[0] && tab.entity.ogtt[0].label === "GDM") {
                        tab.entity.add_FIELD_ogtt_gdm_empty = tab.entity.ogtt[0].value.input0;
                        tab.entity.add_FIELD_ogtt_gdm_1h = tab.entity.ogtt[0].value.input1;
                        tab.entity.add_FIELD_ogtt_gdm_2h = tab.entity.ogtt[0].value.input2;
                    }
                }
                if (tab.key === 'tab-7' && key === 'tab-7') {
                    const Lis = service.praseJSON(allFormData.lis);
                    if (Lis.ogtt && Lis.ogtt[0] && Lis.ogtt[0].label === "GDM") {
                        let modalObj = {'reminder': 'OGTT为GDM', 'diagnosis': '妊娠期糖尿病', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.add_FIELD_hbsAg_ALT && Lis.add_FIELD_hbsAg_ALT > 80) {
                        let modalObj = {'reminder': 'ALT > 正常范围上限的2倍', 'diagnosis': '慢性活动性肝炎', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.hbsAg && Lis.hbsAg[0] && Lis.hbsAg[0].label === '小三阳') {
                        let modalObj = {'reminder': '乙肝两对半为小三阳', 'diagnosis': '乙型肝炎小三阳', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.hbsAg && Lis.hbsAg[0] && Lis.hbsAg[0].label === '大三阳') {
                        let modalObj = {'reminder': '乙肝两对半为大三阳', 'diagnosis': '乙型肝炎大三阳', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.hcvAb && Lis.hcvAb[0] && Lis.hcvAb[0].label === '阳性') {
                        let modalObj = {'reminder': '丙肝抗体为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.add_FIELD_hcvAb_RNA && Lis.add_FIELD_hcvAb_RNA[0] && Lis.add_FIELD_hcvAb_RNA[0].label === '阳性') {
                        let modalObj = {'reminder': '丙肝RNA为阳性', 'diagnosis': '丙型肝炎病毒', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.rpr && Lis.rpr[0] && Lis.rpr[0].label === '阳性') {
                        let modalObj = {'reminder': '梅毒阳性', 'diagnosis': '梅毒', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.thalassemia && Lis.thalassemia[0] && Lis.thalassemia[0].label === '甲型') {
                        let modalObj = {'reminder': '女方地贫为甲型', 'diagnosis': 'α地中海贫血', 'visible': true};
                        getAllReminder(modalObj);
                    }
                    if(Lis.thalassemia && Lis.thalassemia[0] && Lis.thalassemia[0].label === '乙型') {
                        let modalObj = {'reminder': '女方地贫为乙型', 'diagnosis': 'β地中海贫血', 'visible': true};
                        getAllReminder(modalObj);
                    }

                    if(allReminderModal.length > 0) {
                        const action2 = allReminderAction(allReminderModal);
                        store.dispatch(action2);

                        const action3 = showReminderAction(true);
                        store.dispatch(action3);
                    }
                    if(type === 'open') {
                        if (allReminderModal.length > 0) {
                            const action = openMedicalAction(true);
                            store.dispatch(action);
                        } else {
                            common.closeWindow();
                        }
                    } else {
                        const action = openMedicalAction(false);
                        store.dispatch(action);
                    }
                }        
                if (tab.key !== 'tab-3') {
                    service.shouzhen.saveForm(tab.key, entitySave(tab.entity)).then(() => {
                        message.success('信息保存成功',3);
                        valid && this.activeTab(key || next.key);
                        /*修改预产期-B超 同步数据*/
                        if(tab.key === 'tab-0' || tab.key === 'tab-7') {
                            service.getuserDoc().then(res => this.setState({
                                info: res.object
                            }, () => {
                                const action = getUserDocAction(res.object);
                                store.dispatch(action);
                            }))
                        }
                        if(tab.key === 'tab-7' && type === 'open') {
                            service.shouzhen.uploadHisDiagnosis(1).then(res => { })
                        }
                    });
                }
            } else {
                if (type === 'open') {
                    common.closeWindow();
                }
                valid && this.activeTab(key || next.key);
            }
            this.change = false;
            const action = isFormChangeAction(false);
            store.dispatch(action);

            if (!valid && type !== 'save') {
                !isJump && message.error('必填项不能为空！');
                if (key && isJump) {
                    this.activeTab(key);
                } else {
                    this.forceUpdate();
                }  
                const action = isSaveAction(false);
                store.dispatch(action);
            }
        });
    }

    render() {
        const { tabs, info, step } = this.state;
        const printIvisit = () => {
            service.shouzhen.printPdfByFile().then(res => {
                common.printPdf(res.object);
            })
        }

        return (
          <Page className="shouzhen pad-T-mid">
            <Button type="primary" className="top-save-btn" size="small" onClick={() => this.handleSave(step, 'save')}>保存</Button>
            <Button type="primary" className="top-savePDF-btn" size="small" onClick={() => printIvisit()}>打印</Button>

            <div className="bgWhite" style={{ position: "fixed", top: "7.65em", left: "0", right: "0", bottom: "0"}}></div>
            <Tabs type="card" activeKey={step} onChange={key => this.handleSave(key)}>
              {tabs.map(({ key, title, entity, error, Content }) => (
                <Tabs.TabPane key={key}
                  tab={
                    <span style={error ? { color: "red" } : {}}>
                      {error ? ( <i className="anticon anticon-exclamation-circle" />) : null}
                      {title}
                    </span>
                  }>
                  <div className="bgWhite pad-mid " style={{ maxWidth: "1400px" }}>
                    {step === key ? (<Content info={info} entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)}/>) : null}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Row>
              <Col span={21} />
              <Col>
                { step !== tabs[tabs.length - 1].key
                    ? <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave() }, 100)}>下一页</Button>
                    : <div>
                        <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(step, 'open') }, 100)}>保存并开医嘱</Button>
                        <Button className="shouzhen-bbtn2" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(step) }, 100)}>保存</Button>
                      </div>
                }
              </Col>
            </Row>
          </Page>
        );
    }
}