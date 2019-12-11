import React, { Component } from "react";
import { Row, Col, Input, Button, Select, Modal, Tree } from 'antd';

import router from "../utils/router";
import bundle from "../utils/bundle";
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
      highriskList: [],
      highriskEntity: null,
      highriskShow: false,
      muneIndex: 0 // 从0开始
    };
    
    service.getuserDoc().then(
      res => this.setState({
      ...res.object, loading: false,
      highriskEntity: {...res.object}
    }));
    service.highrisk().then(res => this.setState({
      highriskList: res.object
    }))
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
          <ButtonGroup onClick={()=>this.setState({highriskShow:true})}>
            <Button className="danger-btn-5">{risklevel}</Button>
            <Button className="danger-btn-infectin">{infectious}</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

renderDanger() {
  const {highriskList, highriskShow, highriskEntity} = this.state;
  const searchList = highriskEntity && highriskList.filter(i => !highriskEntity.search || i.name.indexOf(highriskEntity.search) !==-1);
  const handleOk = () => {
    console.log('保存高危数据: ', highriskEntity);
  };
  const handleChange = (name, value) => {
    highriskEntity[name] = value;
    this.setState({highriskEntity});
  }
  const handleSelect = (keys) => {
    const node = searchList.filter(i => i.id == keys[0]).pop();
    const gettitle = n => {
      const p = searchList.filter(i => i.id === n.pId).pop();
      if(p){
        return [...gettitle(p), n.name];
      }
      return [n.name];
    }
    if(node && !searchList.filter(i => i.pId === node.id).length && highriskEntity.highrisk.split('\n').indexOf(node.name) === -1){
      handleChange('highrisk', highriskEntity.highrisk.replace(/\n+$/,'') + '\n' + gettitle(node).join(':'));
    }
  };
  const initTree = (pid, level = 0) => searchList.filter(i => i.pId === pid).map(node => (
    <Tree.TreeNode key={node.id} title={node.name} onClick={()=>handleCheck(node)} isLeaf={!searchList.filter(i => i.pId === node.id).length}>
      {level < 10 ? initTree(node.id, level + 1) : null}
    </Tree.TreeNode>
  ));
  
  return highriskEntity ? (
    <Modal title="高危因素" visible={highriskShow} width={1000} maskClosable={true} onCancel={() => this.setState({ highriskShow: false })} onOk={()=>handleOk()}>
      <div>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Row>
              <Col span={2}>高危等级：</Col>
              <Col span={8}><Select value={highriskEntity.risklevel} onChange={e=>handleChange('risklevel', e)}>{'Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ'.split(',').map(i=><Select.Option value={i}>{i}</Select.Option>)}</Select></Col>
              <Col span={2}>传染病：</Col>
              <Col span={10}><Select multiple value={highriskEntity.infectious.split(',')} onChange={e=>handleChange('infectious', e.join())}>{'<乙肝大三阳,乙肝小三阳,梅毒,HIV,结核病,重症感染性肺炎,特殊病毒感染（H1N7、寨卡等）,传染病：其他'.split(',').map(i=><Select.Option value={i}>{i}</Select.Option>)}</Select></Col>
            </Row>
            <br />
            <Row>
              <Col span={2}>高危因素：</Col>
              <Col span={17}><Input type="textarea" rows={5} value={highriskEntity.highrisk} onChange={e=>handleChange('highrisk', e.target.value)}/></Col>
              <Col span={1}></Col>
              <Col span={2}><Button size="small" onClick={()=>handleChange('highrisk', '')}>重置</Button></Col>
            </Row>
            <br />
            <Row>
            <Col span={16}><Input value={highriskEntity.search} onChange={e=>handleChange('search', e.target.value)} placeholder="输入模糊查找"/></Col>
            <Col span={3}><Button size="small" onClick={()=>handleChange('expandAll', false)}>全部收齐</Button></Col>
            <Col span={3}><Button size="small" onClick={()=>handleChange('expandAll', true)}>全部展开</Button></Col>
          </Row>
          </Col>
        </Row>
        <div style={{height:200, overflow:'auto', padding: '0 16px'}}>
          <Tree defaultExpandAll={highriskEntity.expandAll} onSelect={handleSelect} style={{ maxHeight: '90%' }}>{initTree(0)}</Tree>
        </div>
      </div>
    </Modal>
  ) : null;
}

  render() {
    return (
      <div className='main-body'>
        {this.renderHeader()}
        <div className="main-content">
          {router(routers.filter(i => !!i.component))}
        </div>
        <div>
          {this.renderDanger()}
        </div>
      </div>
    )
  }
}
