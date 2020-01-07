import React, { Component } from "react";
import { Row, Col, Input, Button, Select, Modal, Tree, Icon } from 'antd';

import router from "../utils/router";
import bundle from "../utils/bundle";
import service from '../service';
import formRender, {fireForm} from '../render/form';
import * as baseData from './fuzhen/data';

import store from './store';
import { getAlertAction, closeAlertAction, showTrialAction } from './store/actionCreators.js';

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
      muneIndex: 0, // 从0开始
      ...store.getState(),
      trialFormEntity: {...baseData.trialFormEntity},
    };
    store.subscribe(this.handleStoreChange);
    
    service.getuserDoc().then(
      res => this.setState({
      ...res.object, loading: false,
      highriskEntity: {...res.object}
    }, () => {
      service.checkHighriskAlert(res.object.userid).then(res => {
        let data = res.object;
        if(data&&data.length > 0) {
          data.map(item => ( item.visible = true ))
        }
        const action = getAlertAction(data);
        store.dispatch(action);
      });
    }));

    service.highrisk().then(res => this.setState({
      highriskList: res.object
    }))
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  }

  componentDidMount() {
    const { location = {} } = this.props;
    const { muneIndex } = this.state;
    if(location.pathname !== routers[muneIndex].path){
      this.props.history.push(routers[muneIndex].path);
    }
    this.componentWillUnmount = service.watchInfo((info)=>this.setState(info.object));
  }

    /**
   * 高危弹出窗口
   */
  renderHighrisk() {
    const { highriskAlert, userid } = this.state;
    const handelClose = (index, params) => {
      const action = closeAlertAction(index);
      store.dispatch(action);
      if(params) {
        service.closeHighriskAlert(userid, params).then(res => {})
      }
    };

    const addHighrisk = (highrisk, level, index) => {
      const action = closeAlertAction(index);
      store.dispatch(action);
      service.addHighrisk(userid, highrisk, level).then(res => {})
    }

    return ( highriskAlert && highriskAlert.length>0 ?
      highriskAlert.map((item, index) => (
        item.alertMark==1&&item.visible ?
          <div className="highrisk-wrapper">
            <div>
              <span className="exc-icon"><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>
              <span className="close-icon pull-right" onClick={() => {handelClose(index)}}><Icon type="close" /></span>
            </div>
            <div className="highrisk-content">
            <div>孕妇诊断有<span className="highrisk-word">{item.content}</span>,请标记高危因素</div>     
              <div className="highrisk-item">
                {item.items.map(subItem => (
                <Button className="blue-btn margin-R-1 margin-TB-mid" type="ghost" onClick={() => addHighrisk(subItem.highrisk, subItem.level, index)}>{subItem.name}</Button>
                ))}
              </div>
              <div><Button className="blue-btn colorGray margin-R-1" type="ghost" onClick={() => handelClose(index, item.content)}>关闭，不再提示</Button>
              <Button className="blue-btn colorGray" type="ghost" onClick={() => handelClose(index)}>关闭</Button></div>
            </div>
          </div>
        : null
      ))
      : null
    );
  }

  // 试产表单
  trialFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'syz[TOLAC的适应症]', type: 'checkinput', radio: true, span: 24, options: baseData.syzOptions }
          ]
        },
        {
          columns: [
            { name: 'jjz[TOLAC的禁忌症]', type: 'checkinput', radio: true, span: 24, options: baseData.jjzOptions }
          ]
        },
        {
          columns: [
            { name: 'qk[不建议催、引产的情况]', type: 'checkinput', radio: true, span: 24, options: baseData.qkOptions }
          ]
        },
        {
          columns: [
            { name: 'jy[分娩方式建议]', type: 'checkinput', radio: true, span: 24, options: baseData.jyOptions }
          ]
        },
      ]
    }
  }
    /**
   * 瘢痕子宫阴道试产表
   */
  renderTrial() {
    const { trialFormEntity, isShowTrialModal } = this.state;
    const handleClick = (bool) => { 
      const action = showTrialAction(bool);
      store.dispatch(action);
    };
    const handleChange = (e, { name, value, valid }) => {
      const data = {[name]: value};
      console.log(data, '11')
      this.setState({
        trialFormEntity: {...trialFormEntity, ...data}
      })
    }
    const handleSave = (form) => {
      fireForm(form, 'valid').then((valid) => {
        if(valid) {
          // service.fuzhen.saveRvisitForm(trialFormEntity).then(() => {
          //   this.setState({trialFormEntity: {...baseData.trialFormEntity}})
          // })
        }
      })
    }
    const printForm = () => {
      console.log('print')
    }

    return (isShowTrialModal ?
      <Modal width="80%" title="瘢痕子宫阴道试产表" className="trial-form"
        visible={isShowTrialModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
        <div>孕妇姓名： xxx</div>
        {formRender(trialFormEntity, this.trialFormConfig(), handleChange)}
        {/* <div style={{overflow: 'hidden'}}> 
          <Button className="pull-right blue-btn" type="ghost" onClick={() => printForm()}>打印入院登记表</Button>
          <Button className="pull-right blue-btn margin-R-1" type="ghost" onClick={() => handleSave(document.querySelector('.reg-form'))}>保存</Button>
        </div> */}
      </Modal>
      : null
    )

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
    this.setState({ highriskShow: false });
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
    <Modal className="highriskPop" title="高危因素" visible={highriskShow} width={1000} maskClosable={true} onCancel={() => this.setState({ highriskShow: false })} onOk={()=>handleOk()}>
      <div>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Row>
              <Col span={3}>高危等级：</Col>
              <Col span={7}><Select value={highriskEntity.risklevel} onChange={e=>handleChange('risklevel', e)}>{'Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ'.split(',').map(i=><Select.Option value={i}>{i}</Select.Option>)}</Select></Col>
              <Col span={2}>传染病：</Col>
              <Col span={10}><Select multiple value={highriskEntity.infectious&&highriskEntity.infectious.split(',')} onChange={e=>handleChange('infectious', e.join())}>{'<乙肝大三阳,乙肝小三阳,梅毒,HIV,结核病,重症感染性肺炎,特殊病毒感染（H1N7、寨卡等）,传染病：其他'.split(',').map(i=><Select.Option value={i}>{i}</Select.Option>)}</Select></Col>
            </Row>
            <br />
            <Row>
              <Col span={3}>高危因素：</Col>
              <Col span={16}><Input type="textarea" rows={5} value={highriskEntity.highrisk} onChange={e=>handleChange('highrisk', e.target.value)}/></Col>
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
        {this.renderHighrisk()}
        {this.renderTrial()}
      </div>
    )
  }
}
