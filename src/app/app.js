import React, { Component } from "react";
import { Prompt } from 'react-router-dom';
import { Row, Col, Input, Button, Select, Modal, Tree, Icon } from "antd";

import router from "../utils/router";
import bundle from "../utils/bundle";
import service from '../service';
import * as util from './fuzhen/util';
import store from "./store";
import {
  getUserDocAction,
  isFormChangeAction,
  getAlertAction,
  closeAlertAction,
  showTrialAction,
  showTrialCardAction,
  showPharAction,
  showPharCardAction,
  isMeetPharAction,
  checkedKeysAction,
  showReminderAction,
  closeReminderAction,
} from "./store/actionCreators.js";

import Shouzhen from "bundle-loader?lazy&name=shouzhen!./shouzhen";
import Fuzhen from "bundle-loader?lazy&name=fuzhen!./fuzhen";
import Yingxiang from "bundle-loader?lazy&name=yingxiang!./yingxiang";
import Jianyan from "bundle-loader?lazy&name=jianyan!./jianyan";
import Yunqi from "bundle-loader?lazy&name=yunqi!./yunqi";
import Xuetang from "bundle-loader?lazy&name=xuetang!./xuetang";

import "./app.less";

const ButtonGroup = Button.Group;

const routers = [
  { name: "首检信息", path: "/sz", component: bundle(Shouzhen) },
  { name: "复诊记录", path: "/fz", component: bundle(Fuzhen) },
  { name: "孕期曲线", path: "/yq", component: bundle(Yunqi) },
  { name: "血糖记录", path: "/xt", component: bundle(Xuetang) },
  { name: "影像报告", path: "/yx", component: bundle(Yingxiang) },
  { name: "检验报告", path: "/jy", component: bundle(Jianyan) },
  { name: "胎监记录", path: "/tj", component: null }
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
      templateTree: [],
      templateTree1: [],
      templateTree2: [],
      expandedKeys: [],
    };
    store.subscribe(this.handleStoreChange);

    service.getuserDoc().then(res =>
      this.setState({ ...res.object, loading: false, highriskEntity: { ...res.object }}, () => { 
        const action = getUserDocAction(res.object);
        store.dispatch(action);
        service.checkHighriskAlert(res.object.userid).then(res => {
          let data = res.object;
          if (data && data.length > 0) {
            data.map(item => (item.visible = true));
          }
          const action = getAlertAction(data);
          store.dispatch(action);
        });
      })
    );

    service.highrisk().then(res => {
      let list = res.object;
      list && list.map(item => {
        if (item.icon) {
          item.level = item.icon.substring(item.icon.length-5, item.icon.length-4);
        }
      })
      this.setState({highriskList: list})
    })

    service.shouzhen.findTemplateTree(2).then(res => this.setState({templateTree: res.object}));

    service.shouzhen.findTemplateTree(0).then(res => this.setState({templateTree1: res.object}));
    service.shouzhen.findTemplateTree(1).then(res => this.setState({templateTree2: res.object}));

    service.shouzhen.getAllForm().then(res => {
      this.setCheckedKeys(res.object);
    });
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    const { location = {} } = this.props;
    const { muneIndex } = this.state;
    if (location.pathname !== routers[muneIndex].path) {
      this.props.history.push(routers[muneIndex].path);
    }
    this.componentWillUnmount = service.watchInfo(info =>
      this.setState(info.object)
    );
  }

  /**
   * 高危弹出窗口
   */
  renderHighrisk() {
    const { highriskAlert, userid } = this.state;
    const handelClose = (index, params) => {
      const action = closeAlertAction(index);
      store.dispatch(action);
      if (params) {
        service.closeHighriskAlert(userid, params).then(res => {});
      }
    };

    const addHighrisk = (highrisk, level, index) => {
      const action = closeAlertAction(index);
      store.dispatch(action);
      service.addHighrisk(userid, highrisk, level).then(res => {});
    };

    return highriskAlert && highriskAlert.length > 0 
        ? highriskAlert.map((item, index) =>item.alertMark == 1 && item.visible ? (
          <div className="highrisk-wrapper">
            <div>
              <span className="exc-icon">
                <Icon type="exclamation-circle" style={{ color: "#FCCD68" }}/>{" "}
                请注意！
              </span>
              <span className="close-icon pull-right" onClick={() => { handelClose(index) }}>
                <Icon type="close" />
              </span>
            </div>
            <div className="highrisk-content">
              <div>孕妇诊断有<span className="highrisk-word">{item.content}</span>,请标记高危因素</div>
              <div className="highrisk-item">
                {item.items.map(subItem => (
                  <Button className="blue-btn margin-R-1 margin-TB-mid" type="ghost"
                          onClick={() => addHighrisk(subItem.highrisk, subItem.level, index)}>
                    {subItem.name}
                  </Button>
                ))}
              </div>
              <div>
                <Button className="blue-btn colorGray margin-R-1" type="ghost" onClick={() => handelClose(index, item.content)}>
                  关闭，不再提示
                </Button>
                <Button className="blue-btn colorGray" type="ghost" onClick={() => handelClose(index)}>
                  关闭
                </Button>
              </div>
            </div>
          </div>
        ) : null
      )
    : null;
  }

  /**
   * 诊断提醒窗口
   */
  renderReminder() {
    const { allReminderModal, isOpenMedicalAdvice } = this.state;
    
    const closeWebPage = () => {
      if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
          window.opener = null;
          window.close();
        } else {
          window.open('', '_top');
          window.top.close();
        }
      } else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
        window.location.href = 'about:blank ';
      } else {//close chrome;It is effective when it is only one.
        window.opener = null;
        window.open('', '_self');
        window.close();
      }
    }
 
    const handelClose = (index, item) => {
      const action = closeReminderAction(index);
      store.dispatch(action);

      item && service.fuzhen.adddiagnosis(item.diagnosis).then(() => { 
        if (index === 0 && isOpenMedicalAdvice) {
          closeWebPage();
        }
      })

      if (index === 0) {
        const action2 = showReminderAction(false);
        store.dispatch(action2);
      }
    };

    const footer = (index, item) => {
      return (
        <div>
          {isOpenMedicalAdvice ? <Button onClick={() => closeWebPage()}>取消, 开立医嘱</Button> : null}
          <Button onClick={() => handelClose(index)}>{isOpenMedicalAdvice ? '取消并返回' : '取消'}</Button>
          <Button type="primary" onClick={() => handelClose(index, item)}>确定</Button>
        </div>
      )
    }

    return allReminderModal && allReminderModal.length > 0  ?
    allReminderModal.map((item, index) => item.visible ? 
      (
        <Modal className="reminder-wrapper" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
          visible={item.visible} footer={footer(index, item)} onCancel={() => handelClose(index)} >
          <div className="reminder-content"><span className="reminder-word">{item.reminder}</span>,是否添加诊断</div>
          <div className="reminder-item">
            慢性活动
          </div>
        </Modal>
      )
      : null
    )
    : null;
  }

  /**
   * 瘢痕子宫阴道试产表
   */
  handleCardClick = (name) => {
    const action1 = showTrialAction(true);
    const action2 = showPharAction(true);
    switch(name) {
      case 'trial':
        store.dispatch(action1);
        break;
      case 'phar':
        store.dispatch(action2);
        break;
    }
  }
  renderTrialModal() {
    const { templateTree, isShowTrialModal, username } = this.state;
    let newTemplateTree = templateTree;

    const closeModal = (bool) => {
      const action = showTrialAction(false);
      store.dispatch(action);
      if (bool) {
        service.shouzhen.saveTemplateTreeUser(2, newTemplateTree).then(res => {
          const action = showTrialCardAction(true);
          store.dispatch(action);
        })
      }
    }

    const initTree = (arr) => arr.map(node => (
      <Tree.TreeNode key={node.id} title={node.name} className="modal-title">
        {node&&node.child.map(item => (
          <Tree.TreeNode key={item.id} title={item.name} ></Tree.TreeNode>
        ))}
      </Tree.TreeNode>
    ));

    const handleCheck = (keys, { checked }) => {
      newTemplateTree.forEach(tt => {
        tt.child.forEach(item => {
          if (keys.indexOf(`${item.id}`) !== -1) {
            item.note = checked;
          }else {
            item.note = null;
          }
        })
      })
    };

    let buttons = [
      <Button onClick={() => closeModal()}>取消</Button>,
      <Button type="primary" onClick={() => closeModal(true)}>保存</Button>,
      <Button onClick={() => closeModal()}>打印</Button>
    ]

    const treeNodes = initTree(newTemplateTree);
    return (
      templateTree.length>0 ?
      <Modal title="瘢痕子宫阴道试产表" visible={isShowTrialModal} width={800} className="trial-modal"
              footer={buttons} onCancel={() => closeModal()}>
        <p className="trial-username">孕妇姓名：{username}</p>
        <Row>
          <Col span={24}>
            <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes}</Tree>
          </Col>
        </Row>
      </Modal>
      : null
    )
  }


  setCheckedKeys(params) {
    const { checkedKeys, templateTree1 } = this.state;
    const diagnosis = params.diagnosisList;
    const bmi = params.checkUp.ckbmi;
    const age = params.gravidaInfo.userage;
    const preghiss = params.gestation.preghiss ? params.gestation.preghiss.length : [];
    const xiyan = JSON.parse(params.biography.add_FIELD_grxiyan);

    const getKey = (val) => {
      let ID = '';
      templateTree1&&templateTree1.map(item => {
        if(item.name === val) ID = item.id;
      })
      return ID.toString();
    }

    if(bmi>30) checkedKeys.push(getKey("肥胖（BMI>30kg/m  )"));
    if(age>35) checkedKeys.push(getKey("年龄>35岁"));
    if(preghiss>=3) checkedKeys.push(getKey("产次≥3"));
    if(xiyan && xiyan[0].label==="有") checkedKeys.push(getKey("吸烟"));

    if(checkedKeys.length > 0) {
      const action = isMeetPharAction(true);
      store.dispatch(action);
    }

    diagnosis && diagnosis.map(item => {
      if(item.data.indexOf("静脉曲张") !== -1) checkedKeys.push(getKey("静脉曲张"));
      if(item.data === "妊娠子痫前期") checkedKeys.push(getKey("本次妊娠子痫前期"));
      if(item.data === "多胎妊娠") checkedKeys.push(getKey("多胎妊娠"));
    })

    const action = checkedKeysAction(checkedKeys);
    store.dispatch(action);
  }

  /**
   * 孕期用药筛查表
   */
  renderPharModal() {
    const { checkedKeys, templateTree1, templateTree2, isShowPharModal, tuserweek } = this.state;
    let newTemplateTree1 = templateTree1;
    let newTemplateTree2 = templateTree2;

    const closeModal = (bool) => {
      const action = showPharAction(false);
      store.dispatch(action);
      if (bool) {   
        // 新增与诊疗计划关联
        if (newTemplateTree2[3].selected === true) {
          let data = {
            "userid": "6",
            "time": "",
            "gestation": "28",
            "item": "",
            "event": "VTE预防用药"
          };
          data.time = util.getWeek(28, tuserweek);
          service.fuzhen.addRecentRvisit(data).then(res => {})
        }
        Promise.all([
          service.shouzhen.saveTemplateTreeUser(0, newTemplateTree1).then(res => {}),
          service.shouzhen.saveTemplateTreeUser(1, newTemplateTree2).then(res => {})
        ]).then(() => {
          const action = showPharCardAction(true);
          store.dispatch(action);
        })
      }
    }

    const initTree = (arr) => arr.map(node => (
      <Tree.TreeNode key={node.id} title={node.name} ></Tree.TreeNode>
    ));

    const handleCheck1 = (keys, { checked }) => {
      this.setState({checkedKeys: keys})
      newTemplateTree1.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.selected = checked;
        }else {
          tt.selected = null;
        }
      })
    };
    const handleCheck2 = (keys, { checked }) => {
      newTemplateTree2.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.selected = checked;
        }else {
          tt.selected = null;
        }
      })
    };
    const treeNodes1 = newTemplateTree1&&initTree(newTemplateTree1);
    const treeNodes2 = newTemplateTree2&&initTree(newTemplateTree2);

    return (
      <Modal title="深静脉血栓高危因素孕期用药筛查表" visible={isShowPharModal} width={900} className="phar-modal"
            onCancel={() => closeModal()} onOk={() => closeModal(true)}>
        <Row>
          <Col span={12}>
            <div className="title">高危因素</div>
            <Tree className="phar-left" checkedKeys={checkedKeys} checkable onCheck={handleCheck1} style={{ maxHeight: '90%' }}>{treeNodes1}</Tree>
            {/* <p>建议用药：克赛0.4ml 皮下注射qd</p> */}
          </Col>
          <Col span={1}></Col>
          <Col span={11}>
            <div className="title">预防用药指导</div>
            <Tree className="phar-right" checkable onCheck={handleCheck2} style={{ maxHeight: '90%' }}>{treeNodes2}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }


  onClick(item) {
    if (item.component) {
      this.props.history.push(item.path);
    }
  }

  renderHeader() {
    const { userDoc, isShowTrialCard, isShowPharCard } =this.state;
    const handleDanger = () => {
      service.highrisk().then(res => {
        let list = res.object;
        list && list.map(item => {
          if (item.icon) {
            item.level = item.icon.substring(item.icon.length-5, item.icon.length-4);
          }
        })
        this.setState({highriskList: list, highriskShow:true})
      })
    }
    return (
      <div className="main-header">
        <div className="patient-Info_title font-16">
          <div><strong>姓名:</strong>{userDoc.username}</div>
          <div><strong>年龄:</strong>{userDoc.userage}</div>
          <div><strong>孕周:</strong>{userDoc.tuserweek}</div>
          <div><strong>孕产:</strong>{userDoc.tuseryunchan}</div>
          <div><strong>预产期:</strong>{userDoc.gesexpect}</div>
          <div><strong>就诊卡:</strong>{userDoc.usermcno}</div>
          <div><strong>产检编号:</strong>{userDoc.chanjno}</div>
        </div>
        <p className="patient-Info_tab">
          {routers.map((item, i) => (
            <Button
              key={"mune" + i}
              type={this.state.muneIndex != i ? "dashed" : "primary"}
              onClick={() => {
                this.setState({ muneIndex: i });
                this.onClick(item);
              }}
            >
              {item.name}
            </Button>
          ))}
        </p>
        <div className="patient-Info_btnList">
          <ButtonGroup>
            <Button className="danger-btn-5" onClick={()=>handleDanger()}>{userDoc.risklevel}</Button>
            {userDoc.infectious ? <Button className="danger-btn-infectin" onClick={()=>handleDanger()}>{userDoc.infectious}</Button> : null}
            {isShowTrialCard ? <Button className="danger-btn-trial" onClick={() => this.handleCardClick('trial')}>疤</Button> : null}
            {isShowPharCard ? <Button className="danger-btn-phar" onClick={() => this.handleCardClick('phar')}>栓</Button> : null}
          </ButtonGroup>
        </div>
      </div>
    );
  }

  renderDanger() {
    const { highriskList, highriskShow, highriskEntity, expandedKeys } = this.state;
    const searchList = highriskEntity && highriskList.filter(i  => !highriskEntity.search || i.name.indexOf(highriskEntity.search) !== -1);
    let allExpandedKeys = [];
    searchList && searchList.map(item => {
      allExpandedKeys.push(item.id.toString())
    })
    
    const handleOk = () => {
      this.setState({ highriskShow: false });
      service.savehighriskform(highriskEntity).then(() => {})
    };

    const handleClear = () => {
      highriskEntity['risklevel'] = '';
      highriskEntity['highrisk'] = '';
      this.setState({ highriskEntity });
    };

    const handleChange = (name, value) => {
      highriskEntity[name] = value;
      this.setState({ highriskEntity });
    };

    const handleCheck = keys => {
      this.setState({expandedKeys: keys})
    }

    const handleSelect = keys => {
      let initLevel = highriskEntity.risklevel;
      initLevel = initLevel === 'Ⅰ' ? '1' : initLevel === 'Ⅱ' ? '2' : initLevel === 'Ⅲ' ? '3' : initLevel === 'Ⅳ' ? '4' : initLevel === 'Ⅴ' ? '5' : '0';

      const node = searchList.filter(i => i.id == keys[0]).pop();
      if(node && node.level && node.level > initLevel) {
        let newLevel = node.level;
        newLevel = newLevel === '1' ? 'Ⅰ' : newLevel === '2' ? 'Ⅱ' : newLevel === '3' ? 'Ⅲ' : newLevel === '4' ? 'Ⅳ' : 'Ⅴ';
        handleChange("risklevel", newLevel)
      }
      
      const gettitle = n => {
        const p = searchList.filter(i => i.id === n.pId).pop();
        if (p) {
          return [...gettitle(p), n.name];
        }
        return [n.name];
      };
      if ( node && !searchList.filter(i => i.pId === node.id).length &&
           highriskEntity.highrisk && highriskEntity.highrisk.split("\n").indexOf(node.name) === -1) {
        handleChange( "highrisk", highriskEntity.highrisk.replace(/\n+$/, "") + "\n" + gettitle(node).join(":") );
      } else if (node && !searchList.filter(i => i.pId === node.id).length) {
        handleChange( "highrisk", gettitle(node).join(":") );
      }
    };

    const initTree = (pid, level = 0) =>
      searchList.filter(i => i.pId === pid).map(node => (
        <Tree.TreeNode key={node.id} title={node.name} onClick={() => handleCheck(node)} isLeaf={!searchList.filter(i => i.pId === node.id).length}>
          {node.shorthand ? initTree(node.id, level + 1) : null}
        </Tree.TreeNode>
      ));

    return highriskEntity ? (
      <Modal className="highriskPop" title="高危因素" visible={highriskShow} width={1000} maskClosable={true}
             onCancel={() => this.setState({ highriskShow: false })} onOk={() => handleOk()}>
        <div>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <Row>
                <Col span={3}>高危等级：</Col>
                <Col span={7}>
                  <Select value={highriskEntity.risklevel} onChange={e => handleChange("risklevel", e)}>
                    {"Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ".split(",").map(i => (
                      <Select.Option key={i} value={i}>{i}</Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={2}>传染病：</Col>
                <Col span={10}>
                  <Select multiple value={ highriskEntity.infectious && highriskEntity.infectious.split(",")}
                          onChange={e => handleChange("infectious", e.join())}>
                    {"<乙肝大三阳,乙肝小三阳,梅毒,HIV,结核病,重症感染性肺炎,特殊病毒感染（H1N7、寨卡等）,传染病：其他".split(",").map(i => (
                        <Select.Option key={i} value={i}>{i}</Select.Option>
                      ))}
                  </Select>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={3}>高危因素：</Col>
                <Col span={16}>
                  <Input type="textarea" rows={5} value={highriskEntity.highrisk} onChange={e => handleChange("highrisk", e.target.value)}/>
                </Col>
                <Col span={1}></Col>
                <Col span={2}>
                  <Button size="small" onClick={() => handleClear()}>重置</Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={16}>
                  <Input value={highriskEntity.search} onChange={e => handleChange("search", e.target.value)} placeholder="输入模糊查找"/>
                </Col>
                <Col span={3}>
                  <Button size="small" onClick={() => this.setState({expandedKeys: []})}>全部收齐</Button>
                </Col>
                <Col span={3}>
                  <Button size="small" onClick={() => this.setState({expandedKeys: allExpandedKeys})}>全部展开</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <div style={{ height: 200, overflow: "auto", padding: "0 16px" }}>
            <Tree expandedKeys={expandedKeys} onExpand={handleCheck} onSelect={handleSelect} style={{ maxHeight: "90%" }}>
              {initTree(0)}
            </Tree>
          </div>
        </div>
      </Modal>
    ) : null;
  }

  render() {
    const { isFormChange, muneIndex } = this.state;
    const alertConfirm = () => {
      if (!isFormChange) {
        return true;
      } else {
        let leave = window.confirm("有未保存的更新，是否离开？")
        if(leave) {
          const action = isFormChangeAction(false);
          store.dispatch(action);
          return true
        } 
      }
        this.setState({muneIndex})
        return false;
      }
    
    return (
      <div className="main-body">
        {this.renderHeader()}
        <div className="main-content">
          {router(routers.filter(i => !!i.component))}
        </div>
        <div>{this.renderDanger()}</div>
        {this.renderHighrisk()}
        {this.renderTrialModal()}
        {this.renderPharModal()}
        {this.renderReminder()}
        <Prompt message={alertConfirm} when={isFormChange}/>
      </div>
    );
  }
}
