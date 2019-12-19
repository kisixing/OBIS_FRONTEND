import React, { Component } from "react";
import { Tabs, Button, Row, Col,message  } from 'antd';

import Page from '../../render/page';
import { fireForm } from '../../render/form';
import service from '../../service';
import * as common from '../../utils/common';

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

import editors from './editors';
import "./index.less";

const tabConetnts = [Yfxx, Zfxx, Byqk, Gqs, Yjs, Ycs, Jzs, Jyjc, Tgjc, Zkjc, Zdcl];

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
            step: tabs[9].key // 从0开始
        }

        this.componentWillUnmount = editors();

        service.getuserDoc().then(res => this.setState({
            info: res.object
        }))
        this.activeTab(this.state.step);
    }

    activeTab(step) {
        const { tabs } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        if (!tab.init) {
            service.shouzhen.getForm(tab.key).then(res => {
                tab.init = true;
                if (tab.key === 'tab-0') {
                    tab.entity = res.object.gravidaInfo
                    tab.entity['useridtype'] = JSON.parse(res.object.gravidaInfo.useridtype)
                } else if (tab.key === 'tab-1') {
                    tab.entity = res.object.husbandInfo
                    tab.entity['add_FIELD_husband_drink'] = { "0": tab.entity['add_FIELD_husband_drink_type'],"1":tab.entity['add_FIELD_husband_drink']}
                    tab.entity['add_FIELD_husband_useridtype'] = JSON.parse(res.object.husbandInfo.add_FIELD_husband_useridtype);
                    console.log(tab.entity);
                } else if (tab.key === 'tab-2') {
                    tab.entity = res.object.pregnantInfo
                    tab.entity['ckyibzhzh'] = JSON.parse(tab.entity.ckyibzhzh);
                    console.log(tab.entity);
                } else if (tab.key === 'tab-3'){
                    tab.entity = res.object.hisInfo
                    tab.entity['bsguomin'] = JSON.parse(tab.entity.bsguomin);    
                    tab.entity['bsjibing'] = JSON.parse(tab.entity.bsjibing);    
                    tab.entity['bsshoushu'] = JSON.parse(tab.entity.bsshoushu);    
                    tab.entity['hobtabp'] = JSON.parse(tab.entity.hobtabp);    
                    tab.entity['operationHistory'] = res.object.operationHistory;             
                }
                else if (tab.key === 'tab-4') {
                    tab.entity = res.object.menstruationMarriage
                    tab.entity['maritalHistory'] = JSON.parse(tab.entity.maritalHistory);
                    tab.entity['userjinqjh'] = JSON.parse(tab.entity.userjinqjh);
                    tab.entity['historyOfInfertility'] = JSON.parse(tab.entity.historyOfInfertility);
                    tab.entity['yjtongj'] = JSON.parse(tab.entity.yjtongj);
                    console.log(tab.entity);
                } else if (tab.key === 'tab-5') {
                    tab.entity['preghis'] = res.object.gestation;
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
                } else if (tab.key === 'tab-6') {
                    tab.entity = res.object.biography
                    tab.entity['mzxuan'] = JSON.parse(tab.entity.mzxuan);//[];
                    tab.entity['add_FIELD_mzxuan6'] = JSON.parse(tab.entity.add_FIELD_mzxuan6);//[];
                    tab.entity['add_FIELD_mzxuan61'] = JSON.parse(tab.entity.add_FIELD_mzxuan61);//[];
                    tab.entity['userhistory'] = JSON.parse(tab.entity.userhistory);//[];
                    tab.entity['add_FIELD_userhistory_fyys'] = JSON.parse(tab.entity.add_FIELD_userhistory_fyys);//[];
                } else if (tab.key === 'tab-7') {
                    tab.entity = res.object.lis;
                    tab.entity['aids'] = JSON.parse(tab.entity.aids);
                    tab.entity['ogtt'] = JSON.parse(tab.entity.ogtt);
                    tab.entity['thalassemia'] = JSON.parse(tab.entity.thalassemia);
                    tab.entity['husbandThalassemia'] = JSON.parse(tab.entity.husbandThalassemia);
                    tab.entity['husbandCkxuex'] = JSON.parse(tab.entity.husbandCkxuex);
                    tab.entity['husbandRh'] = JSON.parse(tab.entity.husbandRh);
                    tab.entity['ckxuex'] = JSON.parse(tab.entity.ckxuex);
                    tab.entity['ckrh'] = JSON.parse(tab.entity.ckrh);
                    tab.entity['hbsAg'] = JSON.parse(tab.entity.hbsAg);
                    tab.entity['add_FIELD_GBS'] = JSON.parse(tab.entity.add_FIELD_GBS);
                    tab.entity['add_FIELD_ndb'] = JSON.parse(tab.entity.add_FIELD_ndb);
                    tab.entity['add_FIELD_hcvAb_RNA'] = JSON.parse(tab.entity.add_FIELD_hcvAb_RNA);
                    tab.entity['rpr'] = JSON.parse(tab.entity.rpr);
                    tab.entity['hcvAb'] = JSON.parse(tab.entity.hcvAb);
                    tab.entity['add_FIELD_hcvAb_RNA'] = JSON.parse(tab.entity.add_FIELD_hcvAb_RNA);
                    console.log(tab.entity);
                    //tab.entity['vfdp'] = { "未查": {} }
                } else if (tab.key === 'tab-8') {
                    tab.entity = res.object.checkUp
                } else if(tab.key === 'tab-9'){
                    tab.entity = res.object.specialityCheckUp
                }
                else {
                    tab.entity = res.object;
                }
                console.log(tab.key, tab.entity);
                this.setState({ step });
            }).catch(() => { // TODO: 仅仅在mock时候用
                tab.init = true;
                this.setState({ step });
            });
        } else {
            this.setState({ step });
        }
    }

    handleChange(e, { name, value, valid }, entity) {
        console.log(name, entity,entity[name]);
        entity[name] = value
        switch (name) {
            case 'dopupt':
                entity['pupttm'] = common.GetWeek(enity['gesexpectrv'],value);
                break;
            case 'ckzdate':
                entity['ckztingj'] = common.GetWeek(enity['gesexpectrv'],value);
                break;
            case 'gesmoc':
                entity['gesexpect'] = common.GetExpected(value);
                entity['gesexpectrv'] = common.GetExpected(value);
                entity['pupttm'] = common.GetWeek(entity['gesexpectrv'],entity['dopupt']);
                entity['ckztingj'] = common.GetWeek(entity['gesexpectrv'],entity['ckzdate']);
                break;
            case 'gesexpectrv':
                entity['pupttm'] = common.GetWeek(value,entity['dopupt']);
                entity['ckztingj'] = common.GetWeek(value,entity['ckzdate']);
                break;
            case 'yqtz':
                entity['ckbmi'] = common.getBMI(entity['yqtz'],entity['cksheng']);
                break;
            case 'cksheng':
                entity['ckbmi'] = common.getBMI(entity['yqtz'],entity['cksheng']);
                break;

        }
        this.change = true;

        // 避免200ms内界面渲染多次
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.forceUpdate(), 200);
    }

    handleSave(key) {
        const { tabs, step } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step }
        console.log('handleSave', key, step, tab.entity);
        fireForm(form, 'valid').then((valid) => {
            tab.error = !valid;
            if (valid) {
                if (this.change) {
                    console.log('handleSave', key);
                    service.shouzhen.saveForm(tab.key, tab.entity).then(() => {
                        message.success('信息保存成功',3);
                        this.activeTab(key || next.key);
                    }, () => { // TODO: 仅仅在mock时候用
                        this.activeTab(key || next.key);
                    });
                } else {
                    this.activeTab(key || next.key);
                }
                this.change = false;
            } else {
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

    render() {
        const { tabs, info, step } = this.state;
        return (
            <Page className='shouzhen pad-T-mid'>
                <Button type="primary" className="top-save-btn" size="small" onClick={() => alert('保存')}>保存</Button>
                <Button type="primary" className="top-savePDF-btn" size="small" onClick={() => alert('另存为PDF')}>另存为PDF</Button>
                <div className="bgWhite" style={{ position: 'fixed', top: '9em', left: '0', right: '0', bottom: '0' }}></div>
                <Tabs type="card" activeKey={step} onChange={key => this.handleSave(key)}>
                    {tabs.map(({ key, title, entity, error, Content }) => (
                        <Tabs.TabPane key={key} tab={<span style={error ? { color: 'red' } : {}}>{error ? <i className="anticon anticon-exclamation-circle" /> : null}{title}</span>}>
                            <div className="bgWhite pad-mid ">
                                {step === key ? <Content info={info} entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)} /> : null}
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
                <Row><Col span={21}/><Col>
                    <Button icon="save" type="primary" onClick={() => this.handleSave()}>{step !== tabs[tabs.length - 1].key ? '下一页' : '保存'}</Button>
                </Col></Row>
            </Page>
        )
    }
}