import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message, Table } from 'antd';
import formRender, {fireForm} from '../../../../render/form';
import PlanTable from './plan-table';
import JYJC from './JianYanJianCha';
import service from '../../../../service';
import * as common from '../../../../utils/common';
import * as szBaseData from '../../../shouzhen/data';
import editors from '../../../shouzhen/editors';
import store from '../../../store';
import { getAlertAction, showTrialAction, showPharAction, checkedKeysAction, isFormChangeAction, 
         getUserDocAction, showSypAction, fzListAction, getAllFormDataAction, 
      } from '../../../store/actionCreators.js';

import "../../../index.less";
import "../../index.less";

const Panel = Collapse.Panel;

function modal(type, title) {
  message[type](title, 3)
}

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      info: {},
      diagnosi: '',
      diagnosislist: null,
      relatedObj: {},
      isShowZhenduan: false,
      isMouseIn: false,
      isShowSetModal: false,
      isShowResultModal: false,
      isShowPlanModal: false,
      collapseActiveKey: ['1', '2', '3', '4'],
      planData: [],
      isTwins: false,
      reportStr: '',
      jyEntity: {},
      listHistory: null,
      isShowHis: false,
      signList: [
        { 'word': ['大三阳'], 'without': [], 'diag': '乙肝大三阳' },
        { 'word': ['小三阳'], 'without': [], 'diag': '乙肝小三阳' },
        { 'word': ['梅毒'], 'without': [], 'diag': '梅毒' },
        { 'word': ['HIV', '艾滋'], 'without': [], 'diag': 'HIV' },
        { 'word': ['乙肝', '乙型肝炎'], 'without': ['大三阳', '小三阳'], 'diag': '乙肝表面抗原携带者' },
      ],
      unusualFlag: '',
      ...store.getState(),
    };
    store.subscribe(this.handleStoreChange);
    this.componentWillUnmount = editors();
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    const { userDoc, trialVisible } = this.state;

    service.shouzhen.getList(2).then(res => {
      res.object && res.object.forEach(item => {
        if((item.data === '瘢痕子宫' || item.data === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32 && !trialVisible) {
          const action = showTrialAction(true);
          store.dispatch(action);
        }
        if(item.data.indexOf('双胎') !== -1 || item.data.indexOf('多胎') !== -1) {
          this.setState({ isTwins: true })
        }
        if (item.data.indexOf('梅毒') !== -1) {
          const action = showSypAction(true);
          store.dispatch(action);
        }
      })
      const action = fzListAction(res.object);
      store.dispatch(action);
    })
    
    Promise.all([
      service.fuzhen.getDiagnosisPlanData().then(res => this.setState({ planData: res.object })),

      service.fuzhen.getLackLis().then(res => {
        this.setState({reportStr: String(res.object)})
      })
    ]).then(() => this.setState({ loading: false }));

    service.fuzhen.getLisResult().then(res => {
      this.setState({ unusualFlag: res.object.unusualFlag })
    })

    window.addEventListener('keyup', e => {
      if (e.keyCode === 13 || e.keyCode === 108) this.onKeyUp();
    })
  }

  onKeyUp() {
    const { diagnosi, isShowZhenduan } = this.state;
    if (!!diagnosi && isShowZhenduan) this.adddiagnosis();
  }

  adddiagnosis() {
    const { fzList, diagnosi, userDoc, signList } = this.state;
    const { initData } = this.props;
    const specialList = ['妊娠', '早孕', '中孕', '晚孕'];
    if (diagnosi && !fzList.filter(i => i.data === diagnosi).length) {
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      // 诊断互斥项
      let specialIndex = -1;
      let diagData = { 'data': diagnosi, 'highriskmark': ''};
      fzList.forEach((item, index) => {
        if (specialList.includes(item.data)) {
          specialIndex = index;
        }
      })
      if (specialIndex !== -1 && specialList.includes(diagnosi)) {
        fzList.splice(specialIndex, 1);
        fzList.unshift(diagData);
      } else if (specialIndex === -1 && specialList.includes(diagnosi)) {
        fzList.unshift(diagData);
      } else {
        fzList.push(diagData);
      }
      const action = fzListAction(fzList);
      store.dispatch(action);
      modal('success', '添加诊断信息成功');

      if ((diagnosi === '瘢痕子宫' || diagnosi === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32) {
        const action = showTrialAction(true);
        store.dispatch(action);
      }
      if((diagnosi.indexOf('双胎') !== -1 || diagnosi.indexOf('多胎') !== -1) && initData.singleflag !== '1') {
        this.setState({ isTwins: true })
      }
      // 传染病标记
      let signDiag = '';
      signList.forEach(item => {
        let hasWord = false;
        let isSign = true;
        item.word.forEach(wordItem => {
          if (diagnosi.indexOf(wordItem) !== -1) hasWord = true;
        })
        if (hasWord) {
          item.without.forEach(withItem => {
            if (diagnosi.indexOf(withItem) !== -1) isSign = false;
          })
          if (isSign) signDiag = item.diag;
        }
      })
      if (!!signDiag) {
        if (!userDoc.infectious || (userDoc.infectious && userDoc.infectious.indexOf(signDiag) === -1)) {
          let arr = userDoc.infectious ? userDoc.infectious.split(',') : [];
          arr.push(signDiag);
          userDoc.infectious = arr.join();
          service.savehighriskform(userDoc).then(res => {
            service.getuserDoc().then(res => {
              const action = getUserDocAction(res.object);
              store.dispatch(action);
            })
          });
        }
        if (signDiag === '梅毒') {
          const action = showSypAction(true);
          store.dispatch(action);
        }
      }

      if(diagnosi.indexOf("血栓") !== -1 || diagnosi.indexOf("静脉曲张") !== -1 || diagnosi === "妊娠子痫前期" || diagnosi === "多胎妊娠") {
        this.updateCheckedKeys();
        const action = showPharAction(true);
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
      this.setState({ diagnosi: '' });
      service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object}));
    } else if (diagnosi) {
      modal('warning', '添加数据重复');
    }
  }

  deldiagnosis(id, diagnosi) {
    const { userDoc, fzList, signList } = this.state;
    const newList = fzList.filter(i => i.data !== diagnosi);
    const changeAction = isFormChangeAction(true);
    store.dispatch(changeAction);
    const action = fzListAction(newList);
    store.dispatch(action);
    modal('info', '删除诊断信息成功');
    this.updateCheckedKeys(diagnosi);

    let bool = true;
    newList && newList.forEach(item => {
      if (item.data.indexOf('双胎') !== -1 || item.data.indexOf('多胎') !== -1) bool = false;
    })
    if (bool) this.setState({ isTwins: false });

    // 删除传染病标记
    let signDiag = '';
    let signWord = [];
    let signDel = true;
    signList.forEach(item => {
      let hasWord = false;
      let isSign = true;
      item.word.forEach(wordItem => {
        if (diagnosi.indexOf(wordItem) !== -1) hasWord = true;
      })
      if (hasWord) {
        item.without.forEach(withItem => {
          if (diagnosi.indexOf(withItem) !== -1) isSign = false;
        })
        if (isSign) {
          signDiag = item.diag;
          signWord = item.word;
        } 
        newList && newList.forEach(subItem => {
          signWord.forEach(wordItem => {
            if (subItem.data.indexOf(wordItem) !== -1) {
              signDel = false;
            }
          })
        })
      }
    })
    if (!!signDiag && signDel && userDoc.infectious && userDoc.infectious.indexOf(signDiag) !== -1) {
      let arr = userDoc.infectious.split(',');
      arr.splice(arr.indexOf(signDiag), 1);
      userDoc.infectious = arr.join();
      service.savehighriskform(userDoc).then(res => {
        service.getuserDoc().then(res => {
          const action = getUserDocAction(res.object);
          store.dispatch(action);
        })
      });
    }
  }

  updateCheckedKeys(data) {
    const { checkedKeys, fzList, templateTree1 } = this.state;
    let newCheckedKeys = checkedKeys;

    const getKey = (val) => {
      let ID = '';
      templateTree1&&templateTree1.map(item => {
        if(item.name === val) ID = item.id;
      })
      return ID.toString();
    }

    fzList.map(item => {
      if(item.data.indexOf("静脉曲张") !== -1 && !newCheckedKeys.includes(getKey("静脉曲张"))) {
        newCheckedKeys.push(getKey("静脉曲张"));
      } 
      if(item.data === "妊娠子痫前期" && !newCheckedKeys.includes(getKey("本次妊娠子痫前期"))) {
        newCheckedKeys.push(getKey("本次妊娠子痫前期"));
      } 
      if(item.data === "多胎妊娠" && !newCheckedKeys.includes(getKey("多胎妊娠"))) {
        newCheckedKeys.push(getKey("多胎妊娠"));
      } 
    })

    if(data && data.indexOf("静脉曲张") !== -1 && newCheckedKeys.includes(getKey("静脉曲张"))) {
      newCheckedKeys.splice(newCheckedKeys.indexOf(getKey("静脉曲张")), 1)
    }
    if(data && data === "妊娠子痫前期" && newCheckedKeys.includes(getKey("本次妊娠子痫前期"))) {
      newCheckedKeys.splice(newCheckedKeys.indexOf(getKey("本次妊娠子痫前期")), 1)
    }
    if(data && data === "多胎妊娠" && newCheckedKeys.includes(getKey("多胎妊娠"))) {
      newCheckedKeys.splice(newCheckedKeys.indexOf(getKey("多胎妊娠")), 1)
    }

    const action = checkedKeysAction(newCheckedKeys);
    store.dispatch(action);
  }


  /**
   * 诊断列表
   */
  renderZD() {
    const { diagnosi, fzList, diagnosislist, isShowZhenduan, isMouseIn, relatedObj, allFormData, userDoc } = this.state;
    const { getRelatedObj } = this.props;
    // const delConfirm = (item) => {
    //   Modal.confirm({
    //     title: '您是否确认要删除这项诊断',
    //     width: '300',
    //     style: { left: '-300px', fontSize: '18px' },
    //     onOk: () => this.deldiagnosis(item.id, item.data)
    //   });
    // };

    // 诊断小弹窗操作
    const content = (item, i) => {
      const handleHighriskmark = () => {
        item.highriskmark = item.highriskmark === 1 ? 0 : 1;
        item.visible = false;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = fzListAction(fzList);
        store.dispatch(action);
      }

      const handleSortChange = fx => () => {
        item.visible = false;
        fzList[i] = fzList[i + fx];
        fzList[i + fx] = item;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = fzListAction(fzList);
        store.dispatch(action);
      }

      const handleRelated = (subItem, data) => () => {
        let newRelatedObj = relatedObj;
        if (newRelatedObj.hasOwnProperty(data)) {
          if (newRelatedObj[data].includes(subItem)) {
            newRelatedObj[data].splice(newRelatedObj[data].indexOf(subItem), 1);
          } else {
            newRelatedObj[data].push(subItem)
          }
        } else {
           newRelatedObj[data] = [subItem];
        }
        let relatedItem = newRelatedObj[data].join(',');
        this.setState({relatedObj: newRelatedObj}, () => {
          service.fuzhen.relatedformtype(relatedItem).then(res => {})
        });
        
        getRelatedObj(newRelatedObj);
      }

      let relatedformtype = item.relatedformtype && item.relatedformtype.split(",");
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {item.relatedformtype && item.relatedformtype!=="" ?
            <div><p>关联表单</p>
              {relatedformtype.map(subItem => <p className="pad-small"><a className="font-16" onClick={handleRelated(subItem, item.data)}>
              {relatedObj[item.data]&&relatedObj[item.data].includes(subItem) ? `${subItem} √` : subItem} </a></p>)}
            </div>
          : null}
          {i ? <p className="pad-small"><a className="font-16" onClick={handleSortChange(-1)}>上 移</a></p> : null}
          {i + 1 < fzList.length ? <p className="pad-small"><a className="font-16" onClick={handleSortChange(1)}>下 移</a></p> : null}
        </div>
      );
    }

    const handleVisibleChange = (visible, i) => {
      fzList[i].visible = visible;
      const action = fzListAction(fzList);
      store.dispatch(action);
    }

    const title = item => {
      const data = {
        "诊断时间": item.createdate,
        "诊断全称": item.data,
        "诊断医生": item.doctor,
      }
      return JSON.stringify(data, null, 4)
    }

    // 诊断备注输入
    const setRemark = (v, i) => {
      fzList[i].remark = v;
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      const action = fzListAction(fzList);
      store.dispatch(action);
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

    const handleIptFocus = () => {
      service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object}));
      this.setState({isShowZhenduan: true});
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
      <div className="fuzhen-left-zd">
        <div className="first-diag">
          <span className="zd-num font-12">1、</span>
          G<Input value={userDoc.g} />
          P<Input value={userDoc.p} />
          妊娠<Input className="tuserweek-ipt" value={userDoc.tuserweek} />周
        </div>
        <ol>
          {fzList&&fzList.map((item, i) => (
            <li key={`diagnos-${item.data}-${i}`} className={item.highriskmark==1 ? 'highriskmark' : ''}>
              <div className="diag-wrapper">
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)} visible={item.visible} onVisibleChange={(visible) => handleVisibleChange(visible, i)}>
                  <div title={title(item)}>
                    <span className="zd-num font-12">{i + 2}、</span>
                    <span className='character7'>{item.data}</span>
                  </div>
                </Popover>
                <input className="remark-ipt" placeholder="备注" value={item.remark} onChange={e => setRemark(e.target.value, i)} />
              </div>
              <Button className="delBTN colorRed" type="dashed" size="small" shape="circle" icon="cross" onClick={() => this.deldiagnosis(item.id, item.data)} />
            </li>
          ))}
        </ol>
        <div className="fuzhen-left-input font-16">
        <div className="ant-search-input-wrapper">
          <Input.Group>
            <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value, true)} onFocus={() => handleIptFocus()}
                   onBlur={() => setTimeout(() => this.setState({isShowZhenduan: false}), 200)}/>
            <div className="ant-input-group-wrap">
              <Button className="ant-input-group-btn" size="small" onClick={() => this.adddiagnosis()}>添加</Button>
            </div>
          </Input.Group>
        </div>
          { (isShowZhenduan || isMouseIn) && diagnosislist ?
            <div onMouseEnter={() => this.setState({isMouseIn: true})} onMouseLeave={() => this.setState({isMouseIn: false})}>
              <Tabs defaultActiveKey="1" tabBarExtraContent={<Icon type="setting" onClick={() => this.setState({isShowSetModal: true})}></Icon>}>
                <Tabs.TabPane tab="全部" key="1">
                  {diagnosislist['all'].map((item, i) => <p className="fuzhen-left-item" key={i} onClick={() => setIptVal(item.name)}>{item.name}</p>)}
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
                  {diagnosislist['personal'].map((item, i) => <p className="fuzhen-left-item" key={i} onClick={() =>  setIptVal(item.name)}>{item.name}</p>)}
                </Tabs.TabPane>
              </Tabs>
            </div>  : null}
          {renderSetModal()}
        </div>
        {/* <Button className="fuzhen-left-button margin-TB-mid" type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button> */}
      </div>
    )
  }

  renderLeft() {
    const { reportStr, planData, collapseActiveKey, jyEntity, info, loading, unusualFlag, allFormData } = this.state;
    /**
   * 检验报告结果
   */
    const renderResultModal = () => {
      const { isShowResultModal } = this.state;
      const handleClick = (bool) => {
        if (jyEntity.ogtt && jyEntity.ogtt[0] && jyEntity.ogtt[0].label === "GDM") {
          jyEntity.ogttGdmEmpty = jyEntity.ogtt[0].value.input0;
          jyEntity.ogttGdm1H = jyEntity.ogtt[0].value.input1;
          jyEntity.ogttGdm2H = jyEntity.ogtt[0].value.input2;
        }
        if (!!jyEntity.all_tsh && (jyEntity.all_tsh.indexOf("↑") !== -1 || jyEntity.all_tsh.indexOf("↓") !== -1)) {
          let arrow = jyEntity.tshUnusual;
          jyEntity.tsh = jyEntity.all_tsh.slice(0, jyEntity.all_tsh.indexOf(arrow));
        } else {
            jyEntity.tsh = jyEntity.all_tsh;
        }
        if (!!jyEntity.all_freeT3 && (jyEntity.all_freeT3.indexOf("↑") !== -1 || jyEntity.all_freeT3.indexOf("↓") !== -1)) {
            let arrow = jyEntity.freeT3Unusual;
            jyEntity.freeT3 = jyEntity.all_freeT3.slice(0, jyEntity.all_freeT3.indexOf(arrow));
        } else {
            jyEntity.freeT3 = jyEntity.all_freeT3;
        }
        if (!!jyEntity.all_freeT4 && (jyEntity.all_freeT4.indexOf("↑") !== -1 || jyEntity.all_freeT4.indexOf("↓") !== -1)) {
            let arrow = jyEntity.freeT4Unusual;
            jyEntity.freeT4 = jyEntity.all_freeT4.slice(0, jyEntity.all_freeT4.indexOf(arrow));
        } else {
            jyEntity.freeT4 = jyEntity.all_freeT4;
        }
        if(bool) {
          const form = document.querySelector('.jy-modal');
          fireForm(form, 'valid').then((valid) => {
            if(valid) {
              service.fuzhen.saveLisResult(jyEntity).then(res => {
                this.setState({isShowResultModal: false});
                const action = isFormChangeAction(false);
                store.dispatch(action);
              })
            }else {
              message.error("必填项不能为空！");
            }
          })
        } else {
          this.setState({isShowResultModal: false});
        }
      }

      const handleChange = (e, { name, value, target }, jyEntity) => {
        // console.log(name, value, target, jyEntity, '434')
        const action = isFormChangeAction(true);
        store.dispatch(action);
        jyEntity[name] = value;
        this.setState({ jyEntity });
      }

      const printReport = () => {
        service.fuzhen.printLisResultPdfPath().then(res => {
          common.printPdf(res.object);
        })
      }

      const footer = [
        <div>
          <Button onClick={() => handleClick(false)}>取消</Button>
          <Button type="primary" onClick={() => handleClick(true)}>确定</Button>
          <Button type="primary" onClick={() => printReport()}>打印</Button>
        </div>
      ]

      return (
        <Modal className="jy-modal"  title="检验报告" width="80%" visible={isShowResultModal} 
            onCancel={() => handleClick(false)} footer={footer}>
          <JYJC entity={{...jyEntity}} onChange={(e, item) => handleChange(e, item, jyEntity)} />
        </Modal>
      )
    }

      /**
     * 诊疗计划管理
     */
    const renderPlanModal = () => {
      const { isShowPlanModal, info } = this.state;
      const handleClick = () => {
        this.setState({isShowPlanModal: false})
      }
      const changeRecentRvisit = () => {
        service.fuzhen.getDiagnosisPlanData().then(res => this.setState({ planData: res.object }));
      }
      return (
        <Modal width="80%" footer={null} title="诊疗计划" visible={isShowPlanModal} onCancel={() => handleClick(false)}>
          <PlanTable info={info} onReturn={(param) => this.setState({isShowPlanModal: param})} changeRecentRvisit={changeRecentRvisit} />
        </Modal>
      )
    }

      /**
     * 诊断历史记录
     */
    const renderHisnModal = () => {
      const { isShowHis, listHistory, userDoc, fzList } = this.state;
      const handleClick = () => {
        this.setState({isShowHis: false})
      }
      const setLine = (text, record) => {
        return (
          <div>
            {text && text.map(item => (
              <span className={item.flag === 'ADD' ? 'add-class' : item.flag === 'DEL' ? 'del-class' : 'normal-class'}>{item.data};</span>
            ))}
          </div>
        )
      }
      const columns = [
        { title: '诊断', dataIndex: 'items', key: 'items',
          render: (text, record) => setLine(text, record) },
        { title: '诊断医生', dataIndex: 'doctor', key: 'doctor', width: 150  },
        { title: '诊断孕周', dataIndex: 'gesweek', key: 'gesweek', width: 150 },
        { title: '诊断日期', dataIndex: 'createdate', key: 'createdate', width: 150 },
      ];

      const printDiagnosis = () => {
        $(".print-diagnosis").jqprint();
      }

      const buttons = <Button type="primary" onClick={() => printDiagnosis()}>打印最新诊断</Button>;

      return (
        <Modal className="hisn-modal" width="80%" footer={buttons} title="诊断历史" visible={isShowHis} onCancel={() => handleClick()}>
          <Table columns={columns} dataSource={listHistory} pagination={false}/> 
          <div className="print-diagnosis">
            <div className="first-diag">
              <span className="zd-num font-12">诊断：1、</span>
              G{userDoc.g} 
              P{userDoc.p}
              妊娠{userDoc.tuserweek}周
            </div>
            <ol>
              {fzList&&fzList.map((item, i) => (
                <li key={`diagnos-${item.data}-${i}`} className={item.highriskmark==1 ? 'highriskmark' : ''}>
                  <div className="diag-wrapper">
                    <Popover placement="bottomLeft" trigger="click">
                      <div>
                        <span className="zd-num font-12">{i + 2}、</span>
                        <span className='character7'>{item.data}</span>
                        <span className="diag-remark">{item.remark}</span>
                      </div>
                    </Popover>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Modal>
      )
    }

    const handleOtherClick = e => {
      e.stopPropagation();
      service.fuzhen.getLisResult().then(res => {
        const unusualArr = ["↑", "↓"];
        let data = service.praseJSON(res.object);
        if(data.ogtt && data.ogtt[0] && data.ogtt[0].label === "GDM") {
          const param = {"value": {
            "input0": data['ogttGdmEmpty'],
            "input1": data['ogttGdm1H'],
            "input2": data['ogttGdm2H'],
          }};
          data['ogtt'] = [Object.assign(data.ogtt[0], param)];
        }
          // 异常指标处理
          if (data.tsh && unusualArr.includes(data.tshUnusual)) {
              data.all_tsh = data.tsh + data.tshUnusual;
          } else {
              data.all_tsh = data.tsh;
          }
          if (data.freeT3 && unusualArr.includes(data.freeT3Unusual)) {
              data.all_freeT3 = data.freeT3 + data.freeT3Unusual;
          } else {
              data.all_freeT3 = data.freeT3;
          }
          if (data.freeT4 && unusualArr.includes(data.freeT4Unusual)) {
              data.all_freeT4 = data.freeT4 + data.freeT4Unusual;
          } else {
              data.all_freeT4 = data.freeT4;
          }
        // 乙肝两对半选项更改后作下特别处理
        if (data.hbsAg && data.hbsAg[0]) {
          const hbsAgArr = ['阳性', '小三阳', '大三阳', '慢活肝', '其他'];
          if (hbsAgArr.includes(data.hbsAg[0].label)) {
              data.hbsAg = [{"label": "异常", "value": ""}];
          }
        }
        this.setState({jyEntity: data})
      })
      this.setState({isShowResultModal: true})
    }

    const handleHisClick = e => {
      e.stopPropagation();
      service.fuzhen.getHistory().then(res => {
        this.setState({ 
          isShowHis: true,
          listHistory: res.object
        })
      })
    }

    /**
     * 产前筛查和诊断
     */
    const cqCnfig = () => {
      return {
        step: 1,
        rows: [
          {
            columns:[
              {name:'add_FIELD_early_downs_syndrome[早唐]', type:'checkinput-2', radio:true, options: szBaseData.fxOptions, span: 24},
            ]
          },
          {
            columns:[
              {name:'add_FIELD_mk_downs_syndrome[中唐]', type:'checkinput-2', radio:true, options: szBaseData.fxOptions, span: 24},
            ]
          },
          {
            columns:[
              {name:'add_FIELD_nipt[NIPT]', type:'checkinput-2', radio:true, options: szBaseData.fxOptions, span: 24},
            ]
          },
          {
            columns:[
              {name:'add_FIELD_outpatient[产前诊断]', className: 'cq-diag', type:'checkinput-2', radio:true, options: szBaseData.cqzdOptions, span: 24},
            ]
          },
        ]
      }
    }
    const cqChange = (e, {name, value}) => {
      const data = {[name]: value};
      allFormData.lis = {...allFormData.lis, ...data};
      const action = getAllFormDataAction(allFormData);
      store.dispatch(action);
      service.shouzhen.saveForm('tab-6', allFormData.lis).then(res => console.log(res, '666'))
    }
    return (
      <div className="fuzhen-left ant-col-5">
        <Collapse defaultActiveKey={collapseActiveKey}>
          <Panel header={<span>诊 断<Button type="ghost" className="header-btn" size="small" onClick={e => handleHisClick(e) }>历史</Button></span>} key="1">
            { this.renderZD() }
          </Panel>
          <Panel className="panel-jy" header={<span>缺少检验报告<Button type="ghost" className={unusualFlag === '1' ? "header-btn isUnusual" : "header-btn"} size="small" onClick={e => handleOtherClick(e) }>必查清单</Button></span>} key="2">
            {loading ? <div style={{ height: '4em', textAlign: 'center' }}><Spin />&nbsp;...</div> : <p className="pad-small">{reportStr || '无'}</p>}
          </Panel>
          
          <Panel className="panel-cq" header="产前筛查和诊断" key="3">
              {allFormData && formRender(allFormData.lis, cqCnfig(), cqChange)}
          </Panel>

          <Panel header={<span>诊疗计划<Button type="ghost" className="header-btn" size="small" onClick={() => this.setState({isShowPlanModal: true})}>管理</Button></span>} key="4">
            <Timeline className="pad-small">
              {loading 
                ? <div style={{ height: '4em', textAlign: 'center' }}><Spin />&nbsp;...</div> 
                : planData&&planData.length>0 ? planData.map((item, index) => (
                  <Timeline.Item key={`planData-${item.id || index}-${Date.now()}`}>
                    <p className="font-16">{item.time}周后 - {item.gestation}孕周</p>
                    <p className="font-16">{item.event}</p>
                  </Timeline.Item>
                )) : <div>无</div>
              }
            </Timeline>
          </Panel>
        </Collapse>
        {renderResultModal()}
        {renderPlanModal()}
        {renderHisnModal()}
      </div>
    );
  }


  render() {
    return (
      <div>
        {this.renderLeft()}
      </div>
    );
  }
}