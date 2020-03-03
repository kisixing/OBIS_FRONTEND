import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tabs, Icon, Tree, Input, DatePicker } from 'antd';

import umodal from '../../utils/modal'
import formRender, {fireForm} from '../../render/form';
import formTable from '../../render/table';
import * as baseData0 from './../shouzhen/data';
import * as baseData from './../fuzhen/data';
import * as util from '../fuzhen/util';
import store from '../store';
import { getAlertAction, 
        showTrialAction, 
        showPharAction, 
        checkedKeysAction, 
        getDiagnisisAction,
      } from '../store/actionCreators.js';
import RegForm from '../components/reg-form';
import './index.less';
import service from '../../service';

function modal(type, title) {
  message[type](title, 3)
}

export default class extends Component{
  static Title = '诊断处理';
  constructor(props) {
    super(props);
    this.state = {
      entity: {},
      diagnosi: '',
      diagnosis: [],
      diagnosislist: {},
      isShowZhenduan: false,
      isMouseIn: false,
      isShowSetModal: false,
      adviceList: [],
      openAdvice: false,
      openMenzhen: false,
      menzhenData: new Date(),
      // modalState: [
      //   {
      //     "title": "糖尿病门诊预约",
      //     "gesmoc": "2019-07-03",
      //     "options": ["本周五", "下周五","下下周五",""]
      //   },
      //   {
      //     "title": "产前诊断预约",
      //     "gesmoc": "2019-07-31",
      //     "options": ["预约1","预约2","预约3"],
      //     "counts": "3"
      //   }
      // ],
      // modalData: {},
      treatTemp: [],
      treatKey1: [],
      treatKey2: [],
      isShowRegForm: false,
      openTemplate: false,
      ...store.getState(),
      chanc: 0,
      yunc: 1
    };
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount(){
    const { isMeetPhar } = this.state;
    if(isMeetPhar) {
      const action = showPharAction(true);
      store.dispatch(action);
    }

    service.fuzhen.treatTemp().then(res => this.setState({ treatTemp: res.object }));

    service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object}));

    service.shouzhen.getAdviceTreeList().then(res => {
      res.object.length > 1 && this.setState({adviceList: res.object, openAdvice: true})
    });

    this.getGPTimes();
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: "diagnosisHandle[处理措施]", type: "textarea", span: 8, className: "table-wrapper" },
            {
              name: "treatment[模板]",
              type: "buttons",
              span: 16,
              text:
                "(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(#1890ff)[更多]",
              onClick: this.handleTreatmentClick.bind(this)
            }
          ]
        },
        {
          columns: [
            { name: 'xiacsftype[下次复诊]', type:'select', valid: 'required', showSearch:true, options: baseData.rvisitOsTypeOptions, span: 5 },
            { name: 'nextRvisitWeek', type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions, span: 3 },
            { name: 'xiacsfdate', type:'date', valid: 'required', span: 4 },
            { name: 'xiacsfdatearea', type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions, span: 3 },
          ]
        }
      ]
    };
  }

  adddiagnosis() {
    const { diagList, diagnosi } = this.state;
    if (diagnosi && !diagList.filter(i => i.data === diagnosi).length) {
      service.fuzhen.adddiagnosis(diagnosi).then(() => {
        modal('success', '添加诊断信息成功');
        if (diagnosi==='瘢痕子宫' || diagnosi==='疤痕子宫') {
          const action = showTrialAction(true);
          store.dispatch(action);
        }
        service.fuzhen.checkHighriskAlert(diagnosi).then(res => {
          let data = res.object;
          if(data.length > 0) {
            data.map(item => ( item.visible = true ))
          }
          const action = getAlertAction(data);
          store.dispatch(action);
        })
        service.fuzhen.getdiagnosis().then(res => {
          const action = getDiagnisisAction(res.object.list);
          store.dispatch(action);
          this.setState({
            diagnosi: ''
        }, () => {
          if(diagnosi.indexOf("血栓") !== -1 || diagnosi.indexOf("静脉曲张") !== -1 || diagnosi === "妊娠子痫前期" || diagnosi === "多胎妊娠") {
            this.updateCheckedKeys();
            const action = showPharAction(true);
            store.dispatch(action);
          }
        })});
      })
    } else if (diagnosi) {
      modal('warning', '添加数据重复');
    }
  }

  updateCheckedKeys(data) {
    const { checkedKeys, diagList } = this.state;
    let newCheckedKeys = checkedKeys;

    diagList.map(item => {
      if(item.data.indexOf("静脉曲张") !== -1 && !newCheckedKeys.includes('11')) newCheckedKeys.push('11');
      if(item.data === "妊娠子痫前期" && !newCheckedKeys.includes('10')) newCheckedKeys.push("10");
      if(item.data === "多胎妊娠" && !newCheckedKeys.includes('14')) newCheckedKeys.push("14");
    })

    if(data && data.indexOf("静脉曲张") !== -1 && newCheckedKeys.includes('11')) {
      newCheckedKeys.splice(newCheckedKeys.indexOf('11'), 1)
    }
    if(data && data === "妊娠子痫前期" && newCheckedKeys.includes('10')) {
      newCheckedKeys.splice(newCheckedKeys.indexOf('10'), 1)
    }
    if(data && data === "多胎妊娠" && newCheckedKeys.includes('14')) {
      newCheckedKeys.splice(newCheckedKeys.indexOf('14'), 1)
    }

    const action = checkedKeysAction(newCheckedKeys);
    store.dispatch(action);
  }

  deldiagnosis(id, data) {
    service.fuzhen.deldiagnosis(id).then(() => {
      modal('info', '删除诊断信息成功');
      service.fuzhen.getdiagnosis().then(res => {
        const action = getDiagnisisAction(res.object.list);
        store.dispatch(action);
        this.updateCheckedKeys(data);
      })
    })
  }

  addTreatment(e, value){
    const { entity, onChange } = this.props;
    onChange(e, {
      name: 'diagnosisHandle',
      value: (entity.diagnosisHandle||'') + value + '； '
    })
  }

  handleTreatmentClick(e, {text,index},resolve){
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text);
    if(text==='糖尿病日间门诊') {
      this.setState({openMenzhen: true});
    }else if (text==='产前诊断') {
      this.setState({openMenzhen: true});
    }
  }

  getGPTimes() {
    const { allFormData } = this.state;
    const allPreghiss = allFormData.gestation.preghiss || [];
    if(allPreghiss.length > 0) {
      let newYunc = parseInt(allPreghiss[allPreghiss.length - 1].pregnum) + 1;  
      let times = 0;
      let bool = true;
      let preg = 0;
      this.setState({yunc: newYunc});
      allPreghiss&&allPreghiss.map(item => {
        if(item.births == 1) {
          times++;
        } else if(item.births > 1 && bool) {
          times++;
          bool = false;
          preg = item.pregnum;
        }
        if(preg !== item.pregnum) {
          bool = true;
        }
      })
      this.setState({chanc: times});
    }
  }

  renderZD(){
    const { info = {} } = this.props;
    const { diagnosi, diagList, diagnosislist, isMouseIn, isShowZhenduan, chanc, yunc } = this.state;
    // const delConfirm = (item) => {
    //   Modal.confirm({
    //     title: '您是否确认要删除这项诊断',
    //     width: '300',
    //     style: { left: '30%', fontSize: '18px' },
    //     onOk: () => this.deldiagnosis(item.id, item.data)
    //   });
    // };

    // 诊断小弹窗操作
    const content = (item, i) => {
      const handleHighriskmark = () => {
        let highriskmark = item.highriskmark == 1 ? 0 : 1;
        service.fuzhen.updateHighriskmark(item.id, highriskmark).then(() => {
          service.fuzhen.getdiagnosis().then(res => {
            const action = getDiagnisisAction(res.object.list);
            store.dispatch(action);
          })
        })
      }

      const handleVisibleChange = fx => () => {
        service.fuzhen.updateSort(item.id, fx).then(() => {
          service.fuzhen.getdiagnosis().then(res => {
            const action = getDiagnisisAction(res.object.list);
            store.dispatch(action);
          })
        })
      }
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('up')}>上 移</a></p> : null}
          {i + 1 < diagList.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('down')}>下 移</a></p> : null}
        </div>
      );
    }

    /**
     * 点击填充input
     */
    const setIptVal = (item, param) => {
      this.setState({
        isMouseIn: false,
        diagnosi: item
      }, () => {
        if(!param) this.adddiagnosis();
      })
      if(param) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          service.fuzhen.getDiagnosisInputTemplate(item).then(res => this.setState({diagnosislist: res.object}));
        }, 400)
      }
    }

    /**
     * 诊断设置窗口
     */
    const renderSetModal = () => {
      const { isShowSetModal } = this.state;
      const handleClick = (item) => {
        this.setState({isShowSetModal: false})
      }
      return (
        <Modal title="Title" visible={isShowSetModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <p>设置页面</p>
        </Modal>
      )
    }

    return (
      <div className="shouzhen-left-zd">
        <div className="pad-LR-mid">
          <Row className="shouzhen-left-default margin-TB-mid">
            <Col span={20}>
              <span className="font-12">1、&nbsp;</span>
              G&nbsp;<Input value={yunc}/>&nbsp;
              P&nbsp;<Input value={chanc}/>&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;
              妊娠&nbsp;<Input value={info.tuserweek}/>&nbsp;周
              &nbsp;&nbsp;&nbsp;&nbsp;
              {info.doctor}
            </Col>
          </Row>
          {diagList&&diagList.map((item, i) => (
            <Row key={`diagnos-${item.id}-${Date.now()}`}>
              <Col span={8}>
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                  <div title={item.data}>
                    <span className="font-12">{i + 2}、</span>
                    <span className={item.highriskmark==1 ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                  </div>
                </Popover>
              </Col>
              <Col span={6}>{item.createdate}</Col>
              <Col span={6}>{item.doctor||info.doctor}</Col>
              <Col span={4}>
                <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => this.deldiagnosis(item.id, item.data)} />
              </Col>
            </Row>
          ))}
        </div>
        <br/>
        <Row className="shouzhen-left-input font-16">
          <Col span={1} className="text-right" style={{width:'90px',paddingRight:'5px'}}>
            <span className="font-18">诊&nbsp;&nbsp;断:</span>
          </Col>
          <Col span={17} className="shouzhen-pop">
            {/* <Select combobox showSearch size="large" style={{ width: '100%' }} placeholder="请输入诊断信息" value={diagnosi} onChange={e => this.setState({ diagnosi: e })}>
              {baseData.diagnosis.filter(d=>d.top || diagnosi).map(o => <Select.Option key={`diagnosi-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
            </Select> */}

            <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value, true)}
                 onFocus={() => this.setState({isShowZhenduan: true})}
                 onBlur={() => setTimeout(() => this.setState({isShowZhenduan: false}), 200)}
                 />
            { isShowZhenduan || isMouseIn ?
            <div className="shouzhen-list" onMouseEnter={() => this.setState({isMouseIn: true})} onMouseLeave={() => this.setState({isMouseIn: false})}>
              <Tabs defaultActiveKey="1" tabBarExtraContent={<Icon type="setting" onClick={() => this.setState({isShowSetModal: true})}></Icon>}>
                <Tabs.TabPane tab="全部" key="1">
                  {diagnosislist['all'].map((item, i) => <p className="shouzhen-left-item" key={i} onClick={() => setIptVal(item.name)}>{item.name}</p>)}
                </Tabs.TabPane>
                <Tabs.TabPane tab="科室" key="2">
                  <Tree showLine onSelect={(K, e) => setIptVal(e.node.props.title)}>
                    {diagnosislist['department'].map((item, index) => (
                      <Tree.TreeNode selectable={false} title={item.name} key={`0-${index}`}>
                        {item.nodes.map((subItem, subIndex) => (
                          <Tree.TreeNode title={subItem.name} key={`0-0-${subIndex}`}></Tree.TreeNode>
                        ))}
                      </Tree.TreeNode>
                    ))}
                  </Tree>
                </Tabs.TabPane>
                <Tabs.TabPane tab="个人" key="3">
                  {diagnosislist['personal'].map((item, i) => <p className="shouzhen-left-item" key={i} onClick={() =>  setIptVal(item.name)}>{item.name}</p>)}
                </Tabs.TabPane>
              </Tabs>
            </div>  : ""}
            {renderSetModal()}
          </Col>
          <Col span={5}>
            <Button className="shouzhen-left-button" style={{marginLeft: '0.5em'}} type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
          </Col>
        </Row>
      </div>
    )
  }

  openLisi(){
    umodal({
      title: '历史首检记录',
      content: formTable(baseData0.lisiColumns,[{}],{editable:false,buttons:null, pagination: false,}),
      footer:''
    })
  }

    /**
   *预约窗口
   */
  renderMenZhen() {
    const { openMenzhen, menzhenData } = this.state;
    const handelShow = (isShow) => {
      this.setState({openMenzhen: false});
      if(isShow) {
        service.shouzhen.makeAppointment(1, menzhenData).then(res => console.log(res))
      };
    }
    const panelChange = (date, dateString) => {
      this.setState({menzhenData: dateString})
    }

    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
              visible={openMenzhen} onOk={() => handelShow(true)} onCancel={() => handelShow(false)} >
        <span>糖尿病门诊预约</span>
        <Select defaultValue={"本周五"} style={{ width: 120 }}>
          <Select.Option value={"本周五"}>本周五</Select.Option>
          <Select.Option value={"下周五"}>下周五</Select.Option>
          <Select.Option value={"下下周五"}>下下周五</Select.Option>
        </Select>
        <DatePicker defaultValue={menzhenData} onChange={(date, dateString) => panelChange(date, dateString)}/>
      </Modal>
    );
  }

  /**
   * 医嘱弹窗
   */
  renderAdviceModal() {
    const { openAdvice, adviceList } = this.state;
    const handelShow = (e, items=[]) => {
      this.setState({openAdvice: false});
      this.addTreatment(e, items.map(i => i.name).join('\n'));
    }

    const initTree = (pid) => adviceList.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.name}>
        {node.pid === 0 ? initTree(node.id) : null}
      </Tree.TreeNode>
    ));

    const handleCheck = (keys) => {
      adviceList.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };
    const treeNodes = initTree(0);

    return ( openAdvice ? 
      <Modal className="adviceModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 是否添加以下医嘱到处理措施？</span>}
              visible={openAdvice} onOk={e=> handelShow(e, adviceList.filter(i => i.checked && i.pid!==0))} onCancel={e => handelShow(e)} >
        <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes}</Tree>
      </Modal> 
      : null
    );
  }

  /**
   * 模板
   */
  renderTreatment() {
    const { treatTemp, openTemplate, treatKey1, treatKey2 } = this.state;
    const closeDialog = (e, items = []) => {
      this.setState({ openTemplate: false, treatKey1: [], treatKey2: [] });
      items.length > 0 && this.addTreatment(e, items.map(i => i.content).join('； '));
    }

    const initTree = (pid, level = 0) => treatTemp.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.content}>
        {level < 10 ? initTree(node.id, level + 1) : null}
      </Tree.TreeNode>
    ));

    const handleCheck1 = (keys) => {
      this.setState({treatKey1: keys});
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || treatKey2.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const handleCheck2 = (keys) => {
      this.setState({treatKey2: keys});
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || treatKey1.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const treeNodes = initTree(0);

    return (
      <Modal title="处理模板" closable visible={openTemplate} width={800} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked && i.pid!==0))}>
        <Row>
          <Col span={12}>
            <Tree checkable defaultExpandAll checkedKeys={treatKey1} onCheck={handleCheck1} style={{ maxHeight: '90%' }}>{treeNodes.slice(0,treeNodes.length/2)}</Tree>
          </Col>
          <Col span={12}>
            <Tree checkable defaultExpandAll checkedKeys={treatKey2} onCheck={handleCheck2} style={{ maxHeight: '90%' }}>{treeNodes.slice(treeNodes.length/2)}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }

  handleChange(e, { name, value, target }){
    const { onChange } = this.props;
    switch (name) {
      case 'xiacsftype':
        value.label === '入院'  ? this.setState({isShowRegForm: true}) : null;
      break;
    }
    console.log(name, value, target, '123')
    onChange(e, { name, value, target })
  }

  closeRegForm = () => {
    this.setState({isShowRegForm: false})
  }

  render(){
    const { isShowRegForm } = this.state;
    const { entity } = this.props;
    return (
      <div>
        {this.renderZD()}
        {formRender(entity, this.config(), this.handleChange.bind(this))}
        <Button onClick={() =>this.openLisi()}>首检信息历史修改记录</Button>
        {this.renderTreatment()}
        {this.renderMenZhen()}
        {this.renderAdviceModal()}
        <RegForm isShowRegForm={isShowRegForm} closeRegForm={this.closeRegForm} getDateHos={this.handleChange.bind(this)}/>
      </div>
    )
  }
}
