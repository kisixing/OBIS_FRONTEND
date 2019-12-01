import React, { Component } from "react";
import { Tabs, Button, Row, Col } from 'antd';

import Page from '../../render/page';
import {fireForm} from '../../render/form';
import service from '../../service';

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

const tabConetnts = [Yfxx, Zfxx, Byqk, Gqs, Yjs, Jzs, Ycs, Jyjc, Tgjc, Zkjc, Zdcl];

export default class Patient extends Component {
    constructor(props) {
        super(props);
        const tabs = tabConetnts.map((tab,i)=>({
            key:`tab-${i}`,
            title:tab.Title, 
            Content: tab, 
            entity: {...(tab.default||{})}
        }));
        this.state = {
            info: {},
            tabs: tabs,
            step: tabs[8].key // 从0开始
        }

        this.componentWillUnmount = editors();

        service.getuserDoc().then(res => this.setState({
            info: res
        }))
    }

    handleChange(e, { name, value, valid }, entity) {
        entity[name] = value
        this.change = true;
        this.forceUpdate();
    }
    
    handleSave(key) {
        const { tabs, step } = this.state;
        const tab = tabs.filter(t=>t.key===step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || {key: step}
        fireForm(form,'valid').then((valid)=>{
            if(valid){
                if(this.change){
                    service.shouzhen.saveForm(tab.key, tab.entity).then(() => {
                        this.setState({step:key || next.key});
                    }, ()=>{ // TODO: 仅仅在mock时候用
                        this.setState({step:key || next.key});
                    });
                }else{
                    this.setState({step:key || next.key});
                }
                this.change = false;
            }else{
                tab.error = true;
                if(key){
                    this.setState({step:key});
                }else{
                    this.forceUpdate();
                }
            }
        });
    }

    render() {
        const { tabs, info, step } = this.state;
        return (
            <Page className='shouzhen pad-T-mid'>
                <div className="bgWhite" style={{ position: 'fixed', top: '9em', left: '0', right: '0',bottom:'0' }}></div>
                <Tabs type="card" activeKey={step} onChange={key => this.handleSave(key)}>
                    {tabs.map(({key,title,entity,error,Content}) => (
                        <Tabs.TabPane key={key} tab={<span style={error&&{color:'red'}}>{title}</span>}>
                            <div className="bgWhite pad-mid ">
                                {step === key ? <Content info={info} entity={{...entity}} onChange={(e,item)=>this.handleChange(e,item,entity)}/> : null}
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
                <Row><Col span={20}/><Col>
                    <Button icon = "save" type = "primary" onClick={()=>this.handleSave()}>{step!==tabs[tabs.length-1].key?'下一页':'保存'}</Button>
                </Col></Row>>
            </Page>
        )
    }
}