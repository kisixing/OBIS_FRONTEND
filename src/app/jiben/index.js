import React, { Component } from "react";
import { Tabs, Button, Row, Col, message } from 'antd';
import Page from '../../render/page';
import { fireForm } from '../../render/form';
import service from '../../service';

import Yfxx from './yunfuxinxi';
import Zfxx from './zhangfuxinxi';
import store from "../store";
import { getAllFormDataAction, isFormChangeAction, isSaveAction } from "../store/actionCreators.js";

import editors from './editors';
import "./index.less";

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
        const { tabs } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        service.shouzhen.getForm(tab.key).then(res => {
            const action = getAllFormDataAction(service.praseJSON(res.object));
            store.dispatch(action);
            if (tab.key === 'tab-0') {
                tab.entity = service.praseJSON(res.object.gravidaInfo);
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
            } else if (tab.key === 'tab-1') {
                tab.entity = service.praseJSON(res.object.husbandInfo);
                tab.entity['add_FIELD_husband_drink_data'] = { 0: tab.entity["add_FIELD_husband_drink_type"], 1: tab.entity['add_FIELD_husband_drink'] }
            }
            console.log(tab.key, tab.entity);
            this.setState({ step }, () => {
              const form = document.querySelector(".shouzhen");
              fireForm(form, "valid");
            });
        }).catch(e => { 
            service.praseJSON(tab.entity);
            console.warn(e);
            this.setState({ step }, () => {
                const form = document.querySelector('.shouzhen');
                fireForm(form, 'valid');
            });
        });
    }

    handleChange(e, { name, value, target }, entity) {
        console.log(name, target, value, entity);
        entity[name] = value;
        this.change = true;
        const action = isFormChangeAction(true);
        store.dispatch(action);

        // 避免200ms内界面渲染多次
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.forceUpdate(), 200);
    }

    handleSave(key, type) {
        const { tabs, step } = this.state;
        const tab = tabs.filter(t => t.key === step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || { key: step };
        const action = isSaveAction(true);
        store.dispatch(action);
        let isJump = false;
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
            setTimeout(hide, 2000);

            if (this.change) {
                if (tab.key === "tab-0") {
                    tab.entity.userconstant = `${tab.entity.root[0].join(' ')},${tab.entity.root[1]}`;
                    tab.entity.useraddress = `${tab.entity.address[0].join(' ')},${tab.entity.address[1]}`;
                }
                if (tab.key === 'tab-1') {
                    tab.entity.add_FIELD_husband_drink_type = tab.entity.add_FIELD_husband_drink_data[0] || '';
                    tab.entity.add_FIELD_husband_drink = tab.entity.add_FIELD_husband_drink_data[1] || '';
                }      
                service.shouzhen.saveForm(tab.key, entitySave(tab.entity)).then(() => {
                    message.success('信息保存成功',3);
                    valid && this.activeTab(key || next.key);
                });  
            } else {
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
        const { tabs, step } = this.state;
        const printIvisit = () => {
            service.shouzhen.printPdfByFile().then(res => {
                this.printPdf(res.object);
            })
        }

        return (
          <Page className="shouzhen pad-T-mid">
            <Button type="primary" className="top-save-btn" size="small" onClick={() => this.handleSave(step, 'save')}>保存</Button>
            {/* <Button type="primary" className="top-savePDF-btn" size="small" onClick={() => printIvisit()}>打印</Button> */}

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
                    {step === key ? (<Content entity={{ ...entity }} onChange={(e, item) => this.handleChange(e, item, entity)}/>) : null}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Row>
              <Col span={21} />
              <Col>
                { step !== tabs[tabs.length - 1].key
                    ? <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave() }, 100)}>下一页</Button>
                    : <Button className="shouzhen-bbtn" icon="save" type="primary" onClick={() => setTimeout(() => { this.handleSave(step) }, 100)}>保存</Button>
                }
              </Col>
            </Row>
          </Page>
        );
    }
}