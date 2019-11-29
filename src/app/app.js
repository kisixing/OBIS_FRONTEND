import React, { Component } from "react";
import { Button } from 'antd';

import router from "../utils/router";
import service from '../service';

import Shouzhen from './shouzhen';
import Fuzhen from './fuzhen';

import "./app.less";

const ButtonGroup = Button.Group;

const routers = [
  { name: '首检信息', path: '/sz', component: Shouzhen },
  { name: '复诊记录', path: '/fz', component: Fuzhen },
  { name: '孕期曲线', path: '/yq', component: null },
  { name: '血糖记录', path: '/xt', component: null },
  { name: '影像报告', path: '/yx', component: null },
  { name: '检验报告', path: '/jy', component: null },
  { name: '胎监记录', path: '/tj', component: null }
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      muneIndex: 0
    };
    
    service.getuserDoc().then(res => this.setState({
      ...res, loading: false
    }));
  }

  componentDidMount() {
    const { location = {} } = this.props;
    const { muneIndex } = this.state;
    if(location.pathname !== routers[muneIndex].path){
      this.props.history.push(routers[muneIndex].path);
    }
    this.componentWillUnmount = service.watchInfo((info)=>this.setState(info));
  }

  onClick(item) {
    if (item.component) {
      this.props.history.push(item.path);
    }
  }

  renderHeader() {
    const { username, userhage, gesweek,gesmoc,usermcno } =this.state;
    return (
      <div className="main-header">
        <div className="patient-Info_title font-16">
          <div><strong>姓名:</strong>{username}</div>
          <div><strong>年龄:</strong>{userhage}</div>
          <div><strong>孕周:</strong>{gesweek}</div>
          <div><strong>孕产:</strong>1孕2产</div>
          <div><strong>预产期:</strong>{gesmoc}</div>
          <div><strong>就诊卡:</strong>{usermcno}</div>
          <div><strong>产检编号:</strong>{usermcno}</div>
        </div>
        <p className="patient-Info_tab">
          {routers.map((item, i) => <Button key={"mune" + i}
            type={this.state.muneIndex != i ? 'dashed' : 'primary'}
            onClick={() => { this.setState({ muneIndex: i }); this.onClick(item); }}>
            {item.name}
          </Button>
          )}
        </p>
        <div className="patient-Info_btnList">
          <ButtonGroup>
            <Button className="danger-btn">梅毒</Button>
            <Button className="view-btn">梅毒</Button>
            <Button>HTV</Button>
            <Button>乙肝</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='main-body'>
        {this.renderHeader()}
        <div className="main-content">
          {router(routers.filter(i => !!i.component))}
        </div>
      </div>
    )
  }
}