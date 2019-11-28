import React, { Component } from "react";
import { Tabs, Button, Row, Col } from 'antd';

import Page from '../../render/page';
import {fireForm} from '../../render/form';
import service from '../../service';

import "./index.less";

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
            step: tabs[2].key
        }

        service.getuserDoc().then(res => this.setState({
            info: res
        }))
    }

    handleChange(e, { name, value, valid }, entity) {
        entity[name] = value
        this.forceUpdate();
    }
    
    handleSave(key) {
        const { tabs, step } = this.state;
        const tab = tabs.filter(t=>t.key===step).pop() || {};
        const form = document.querySelector('.shouzhen');
        const next = tabs[tabs.indexOf(tab) + 1] || {key: step}
        fireForm(form,'valid').then((valid)=>{
            if(valid){
                //service.shouzhen.saveForm(tab.key, tab.entity).then(() => {
                    this.setState({step:key || next.key});
                //});
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
                                {step === key ? <Content info={info} entity={entity} onChange={(e,item)=>this.handleChange(e,item,entity)}/> : null}
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
                <Row><Col span={20}/><Col><Button onClick={()=>this.handleSave()}>下一页</Button></Col></Row>>
            </Page>
        )
    }
}