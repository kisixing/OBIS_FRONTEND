import React, { Component } from "react";
import { Button } from 'antd';

import router from "../utils/router";
import bundle from "../utils/bundle";
import modal from "../utils/modal";
import service from '../service';

import Shouzhen from 'bundle-loader?lazy&name=shouzhen!./shouzhen';
import Fuzhen from 'bundle-loader?lazy&name=fuzhen!./fuzhen';

import "./app.less";

const ButtonGroup = Button.Group;

const routers = [
  { name: '首检信息', path: '/sz', component: bundle(Shouzhen) },
  { name: '复诊记录', path: '/fz', component: bundle(Fuzhen) },
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
      muneIndex: 0 // 从0开始
    };
    
    service.getuserDoc().then(
      res => this.setState({
      ...res.object, loading: false
    }));
  }

  componentDidMount() {
    const { location = {} } = this.props;
    const { muneIndex } = this.state;
    if(location.pathname !== routers[muneIndex].path){
      this.props.history.push(routers[muneIndex].path);
    }
    this.componentWillUnmount = service.watchInfo((info)=>this.setState(info.object));
  }

  onClick(item) {
    if (item.component) {
      this.props.history.push(item.path);
    }
  }

  renderHeader() {
    const { username, userage, tuserweek,tuseryunchan,gesexpect,usermcno,chanjno,risklevel,infectious } =this.state;
    return (
      <div className="main-header">
        <div className="patient-Info_title font-16">
          <div><strong>姓名:</strong>{username}</div>
          <div><strong>年龄:</strong>{userage}</div>
          <div><strong>孕周:</strong>{tuserweek}</div>
          <div><strong>孕产:</strong>{tuseryunchan}</div>
          <div><strong>预产期:</strong>{gesexpect}</div>
          <div><strong>就诊卡:</strong>{usermcno}</div>
          <div><strong>产检编号:</strong>{chanjno}</div>
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
          <ButtonGroup onClick={()=>this.renderDanger()}>
            <Button className="danger-btn-5">{risklevel}</Button>
            <Button className="danger-btn-infectin">{infectious}</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

renderDanger() {
  modal({title:'高危选择',content:'此功能还在开发中...',onOk: ()=>{
    console.log('你点击了Ok');
  }})
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