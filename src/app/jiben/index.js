import React, { Component } from "react";
import { Tabs, Button, Row, Col, message, Icon } from 'antd';
import Page from '../../render/page';
import { fireForm } from '../../render/form';
import service from '../../service';
import * as common from '@/utils/common';
import Yfxx from './components/YunFuXinXi';
import Zfxx from './components/ZhangFuXinXi';
import store from "../store";
import { getAllFormDataAction, getUserDocAction, isFormChangeAction } from "../store/actionCreators.js";
import editors from './editors';

const tabConetnts = [Yfxx, Zfxx];
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
            step: tabs[0].key,
            ...store.getState(),
        }
        store.subscribe(this.handleStoreChange);

        this.componentWillUnmount = editors();
        this.activeTab(this.state.step);
    }

    handleStoreChange = () => {
        this.setState(store.getState());
    };

    activeTab(step) {
        const { tabs, allFormData } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        if (!!allFormData) {
            if (tab.key === 'tab-0') {
                tab.entity = service.praseJSON(allFormData.gravidaInfo);
                const userconstant = allFormData.gravidaInfo.userconstant;
                const userconstantd = allFormData.gravidaInfo.userconstantd;
                tab.entity["root"] = {
                  0: userconstant ? userconstant.split(",") : [],
                  1: userconstantd ? userconstantd : ''
                };
                const useraddress = allFormData.gravidaInfo.useraddress;
                const useraddressd = allFormData.gravidaInfo.useraddressd;
                tab.entity["address"] = {
                  0: useraddress ? useraddress.split(",") : [],
                  1: useraddressd ? useraddressd : ''
                };
            } else if (tab.key === 'tab-1') { 
                tab.entity = service.praseJSON(allFormData.husbandInfo);
                const h_userconstant = allFormData.husbandInfo.add_FIELD_h_userconstant;
                const h_userconstantd = allFormData.husbandInfo.add_FIELD_h_userconstantd;
                tab.entity["h_root"] = {
                  0: h_userconstant ? h_userconstant.split(",") : [],
                  1: h_userconstantd ? h_userconstantd : ''
                };
                tab.entity['add_FIELD_husband_drink_data'] = { 0: tab.entity["add_FIELD_husband_drink_type"], 1: tab.entity['add_FIELD_husband_drink'] }
            }
            console.log(tab.key, tab.entity);
            this.setState({ step });
        }
    }

    handleChange(e, { name, value, target }, entity) {
        if (!this.isSaving) {
          entity[name] = value;
          this.change = true;
          const action = isFormChangeAction(true);
          store.dispatch(action);
        }

        // 避免200ms内界面渲染多次
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.forceUpdate(), 200);
    }

    handleSave(key, type) {
        const { tabs, step, allFormData } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step };
        let isJump = false;
        this.isSaving = true;
        if (key) {
            isJump = key.slice(-1) > step.slice(-1) ? false : true;
        }
        console.log('handleSave', key, step, tab.entity);

        message.destroy();
        const hide = message.loading('正在执行中...', 0);

        fireForm(form, 'valid').then((valid) => {
            const entitySave = tab.entitySave || (i=>i);
            tab.error = !valid;

            // 异步手动移除
            setTimeout(hide, 300);

            if (this.change) {
                if (tab.key === "tab-0") {
                    tab.entity.userconstant = `${tab.entity.root[0].join(',')}`;
                    tab.entity.useraddress = `${tab.entity.address[0].join(',')}`;
                    tab.entity.userconstantd = `${tab.entity.root[1]}`;
                    tab.entity.useraddressd = `${tab.entity.address[1]}`;
                }
                if (tab.key === 'tab-1') {
                    tab.entity.add_FIELD_husband_drink_type = tab.entity.add_FIELD_husband_drink_data[0] || [];
                    tab.entity.add_FIELD_husband_drink = tab.entity.add_FIELD_husband_drink_data[1] || '';
                    tab.entity.add_FIELD_h_userconstant = `${tab.entity.h_root[0].join(',')}`;
                    tab.entity.add_FIELD_h_userconstantd = `${tab.entity.h_root[1]}`;
                }
                service.jiben.saveForm(tab.key, entitySave(tab.entity)).then(() => {
                    message.success('信息保存成功',3);
                    if(tab.key === 'tab-0') {
                        allFormData.gravidaInfo = tab.entity;
                        const action = getAllFormDataAction(allFormData);
                        store.dispatch(action);
                        service.getuserDoc().then(res => {
                            const action = getUserDocAction(res.object);
                            store.dispatch(action);
                      })
                    }
                    if(tab.key === 'tab-1') {
                        allFormData.husbandInfo = tab.entity;
                        const action = getAllFormDataAction(allFormData);
                        store.dispatch(action);
                    }
                    valid && this.activeTab(key || next.key);
                });
            } else {
                valid && this.activeTab(key || next.key);
            }
            this.change = false;
            this.isSaving = false;
            const action = isFormChangeAction(false);
            store.dispatch(action);

            if (!valid && type !== 'save') {
                !isJump && message.error('必填项不能为空！');
                if (key && isJump) {
                    this.activeTab(key);
                } else {
                    this.forceUpdate();
                }
            }
        });
    }

    render() {
        const { tabs, step } = this.state;
        const printIvisit = async () => {
            const res = await service.shouzhen.printPdfByFile('tmc');
            common.printPdf(res.object);
        }

        return (
          <Page className="shouzhen">
            <div className="bgWhite" style={{ position: "fixed", top: "148px", left: "0", right: "0", bottom: "0"}}></div>
            <Tabs type="card" activeKey={step} onChange={key => setTimeout(() => { this.handleSave(key) }, 100)}>
              {tabs.map(({ key, title, entity, error, Content }) => (
                <Tabs.TabPane key={key}
                  tab={
                    <span style={error ? { color: "#ff0000" } : {}}>
                      {error ? ( <i className="anticon anticon-exclamation-circle" />) : null}
                      {title}
                    </span>
                  }>
                  <div className="bgWhite pad-mid" style={{ maxWidth: "1460px" }}>
                    {step === key ? (<Content entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)}/>) : null}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            <div className="btn-wrapper">
              <Button icon="save" className="shouzhen-btn" size="small" onClick={() => this.handleSave(step, 'save')}>保存</Button>
              <Button icon="print-white" className="shouzhen-btn" size="small" onClick={() => printIvisit()}>打印</Button>
              { step !== tabs[tabs.length - 1].key
                  ? <Button className="shouzhen-btn" type="primary" onClick={() => setTimeout(() => { this.handleSave() }, 100)}><Icon type="arrow-right" />下一页</Button>
                  : <Button icon="save" className="shouzhen-btn" type="primary" onClick={() => setTimeout(() => { this.handleSave(step) }, 100)}>提交</Button>
              }
             </div>
          </Page>
        );
    }
}