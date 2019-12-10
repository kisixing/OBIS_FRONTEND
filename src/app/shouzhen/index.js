import React, { Component } from "react";
import { Tabs, Button, Row, Col } from 'antd';

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
                } else if (tab.key === 'tab-2') {
                    tab.entity = res.object.pregnantInfo
                    tab.entity['ckyibzhzh'] = { "头晕": ",,,,", "头痛": 'www', '呕吐': ',白带增多,胸闷,腰酸,流血' }
                } else if (tab.key === 'tab-4') {
                    tab.entity = res.object.menstruationMarriage
                    tab.entity['yjtongj'] = { "偶尔": "" }
                } else if (tab.key === 'tab-7') {
                    tab.entity = res.object.lis
                    tab.entity['ogtt'] = { 'GDM': { 'input0': "1", 'input1': "2", 'input3': "3" } }
                    tab.entity['vfdp'] = { "未查": {} }
                } else {
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
        console.log(name, entity);
        entity[name] = value

        switch (name) {
            case 'dopupt':
                entity['pupttm'] = common.countWeek(value);
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