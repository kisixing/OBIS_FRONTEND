import React, { Component } from "react";
import { Tabs, Button } from 'antd';

import Page from '../../render/page';
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
        this.state = {
            info: {},
            step: null
        }

        service.fuzhen.userId().then(res => this.setState({
            info: res
        }))
    }

    handleStep(nextStep) {
        this.setState({
            step: nextStep
        });
    }

    render() {
        const { step, info } = this.state;
        const key = i => `tab-${/\d/.test(i) ? i : 2}`;
        return (
            <Page className='shouzhen pad-T-mid'>
                <div className="bgWhite" style={{ position: 'fixed', top: '9em', left: '0', right: '0',bottom:'0' }}></div>
                <Tabs type="card" defaultActiveKey={key(2)} onChange={index => this.setState({ step: index })}>
                    {
                        tabConetnts.map((TabConetnt, index) => (
                            <Tabs.TabPane key={key(index)} tab={TabConetnt.Title}>
                                <div className="bgWhite pad-mid ">
                                    {(step || key(2)) === key(index) ? <TabConetnt info={info} onStep={() => handleStep(nextStep)} /> : null}

                                </div>
                            </Tabs.TabPane>
                        ))
                    }
                </Tabs>

            </Page>
        )
    }
}