import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message, Table } from 'antd';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import tableRender from '../../render/table';
import FuzhenForm from './form';
import FuzhenTable from './table';
import Page from '../../render/page';
import JianYan from './jianyanjiacha';
import PrintTable from './print-table';
import service from '../../service';
import * as common from '../../utils/common';
import * as baseData from './data';
import editors from '../shouzhen/editors';
import * as util from './util'; 
import store from '../store';
import { getAlertAction, showTrialAction, showPharAction, checkedKeysAction, isFormChangeAction, openYCQAction,
         getDiagnisisAction, getUserDocAction, showSypAction, fzListAction, getIdAction, getWhichAction
      } from '../store/actionCreators.js';

import "../index.less";
import "./index.less";

const Panel = Collapse.Panel;

function modal(type, title) {
  // const modal = Modal[type]({
  //   title,
  //   content,
  //   className: 'modal-withoutBTN',
  //   closable: false,
  //   width: '260',
  //   style: { left: '-300px', fontSize: '18px' },
  // });
  // setTimeout(() => modal.destroy(), 2000);
  message[type](title, 3)
}

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTable: true,
      loading: true,
      activeElement: '',
      info: {},
      diagnosi: '',
      diagnosislist: null,
      relatedObj: {},
      recentRvisit: null,
      recentRvisitAll: null,
      recentRvisitShow: false,
      pageCurrent: 1,
      totalRow: 0,
      isShowMoreBtn: false,
      isShowZhenduan: false,
      isMouseIn: false,
      isShowSetModal: false,
      isShowResultModal: false,
      isShowPlanModal: false,
      treatTemp: [],
      templateShow: false,
      collapseActiveKey: ['1', '2', '3', '4'],
      planData: [],
      initData: { ...baseData.formEntity },
      hasRecord: false,
      isTwins: false,
      ycqEntity: {},
      isChangeYCQ: false,
      reportStr: '',
      jyEntity: {},
      scArr: [
        {key: '0', id: 'add_FIELD_early_downs_syndrome', name: '早唐'},
        {key: '1', id: 'add_FIELD_mk_downs_syndrome', name: '中唐'},
        {key: '2', id: 'add_FIELD_nipt', name: 'NIPT'},
        {key: '3', id: 'add_FIELD_outpatient', name: '产前诊断'},
        {key: '4', id: 'add_FIELD_refuse_outpatient', name: '拒绝产前诊断和知情同意书'},
      ],
      scKeys: [],
      printData: null,
      hasPrint: false,
      listHistory: null,
      isShowHis: false,
      signList: [
        { 'word': '大三阳', 'diag': '乙肝大三阳' },
        { 'word': '小三阳', 'diag': '乙肝小三阳' },
        { 'word': '梅毒', 'diag': '梅毒' },
        { 'word': 'HIV', 'diag': 'HIV' },
        { 'word': '艾滋', 'diag': 'HIV' },
      ],
      ...store.getState(),
    };
    store.subscribe(this.handleStoreChange);
    this.componentWillUnmount = editors();
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    const { fzList, userDoc, trialVisible, initData } = this.state;

    fzList && fzList.forEach(item => {
      if((item.data === '瘢痕子宫' || item.data === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32 && !trialVisible) {
        const action = showTrialAction(true);
        store.dispatch(action);
      }
      if(item.data === '双胎妊娠' || item.data === '多胎妊娠') {
        this.setState({ isTwins: true })
      }
      if (item.data.indexOf('梅毒') !== -1) {
        const action = showSypAction(true);
        store.dispatch(action);
      }
    })

    Promise.all([
      service.getuserDoc().then(res => {
        let param = {"ckweek": res.object.tuserweek, "checkdate": util.futureDate(0)};
        let arr = [];
        for (let k in res.object) {
          if(res.object[k] === 'true') arr.push(k);
        }
        this.setState({ info: res.object, scKeys: arr });
        service.fuzhen.getRvisitPhysicalExam().then(res => {
          param.ckdiastolicpressure = res.object.diastolic ? res.object.diastolic : '';
          param.ckshrinkpressure = res.object.systolic ? res.object.systolic : '';
          param.cktizh = res.object.weight;
          this.setState({ initData: {...initData, ...param} }, () => {
            this.getRecentList();
          });
        });
      }),

      service.fuzhen.getdiagnosis().then(res => {
        const action = getDiagnisisAction(res.object.list);
        store.dispatch(action);
      }),
    ]).then(() => this.setState({ loading: false }));
    
    service.fuzhen.getDiagnosisPlanData().then(res => this.setState({ planData: res.object }));

    service.fuzhen.getLackLis().then(res => {
      this.setState({reportStr: String(res.object)})
    })

    service.fuzhen.getGesweekForm().then(res => {
      this.setState({ ycqEntity: res.object })
    })

    window.addEventListener('keyup', e => {
      if (e.keyCode === 13 || e.keyCode === 108) this.onKeyUp();
    })
  }

  onKeyUp() {
    const { diagnosi, isShowZhenduan } = this.state;
    if (!!diagnosi && isShowZhenduan) this.adddiagnosis();
  }

  getRecentList() {
    const { initData } = this.state;
    service.fuzhen.getRecentRvisit().then(res => {
      res.object = res.object || [];
      let bool = false;
      res.object && res.object.map(item => {
        if(item.checkdate == util.futureDate(0)) {
          bool = true;
          if (!!item.medicationPlan) item.medicationPlan = [{}];
          if (!!item.fetalCondition) item.fetalCondition = [{}, {}];
          if (!!item.fetalUltrasound) item.fetalUltrasound = [{}, {}];
          this.setState({
            hasRecord: true, 
            initData: service.praseJSON(item)
          })
        }
      })
      if(!bool) {
        const hours = new Date().getHours();
        if (hours >= 12) {
          initData.ckappointmentArea = {"0":"下","1":"午","label":"下午","describe":"下","value":'下午'};
        } else {
          initData.ckappointmentArea = {"0":"上","1":"午","label":"上午","describe":"上","value":'上午'};
        }
        this.setState({ initData }, () => {
          res.object.push(initData);
        })
      } 
      this.setState({recentRvisit: res.object})
    })
  }

  adddiagnosis() {
    const { fzList, diagnosi, userDoc, signList } = this.state;
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
      if(diagnosi === '双胎妊娠' || diagnosi === '多胎妊娠') {
        this.setState({ isTwins: true })
      }
      // 传染病标记
      let signDiag = '';
      signList.forEach(item => {
        if (diagnosi.indexOf(item.word) !== -1) {
          signDiag = item.diag;
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

  deldiagnosis(id, data) {
    const { userDoc, fzList, signList } = this.state;
    const newList = fzList.filter(i => i.data !== data);
    const changeAction = isFormChangeAction(true);
    store.dispatch(changeAction);
    const action = fzListAction(newList);
    store.dispatch(action);
    modal('info', '删除诊断信息成功');
    this.updateCheckedKeys(data);

    let bool = true;
    newList && newList.forEach(item => {
      if (item.data === '双胎妊娠' || item.data === '多胎妊娠') bool = false;
    })
    if (bool) this.setState({ isTwins: false });

    // 删除传染病标记
    let signDiag = '';
    let signDel = true;
    signList.forEach(item => {
      if (data.indexOf(item.word) !== -1) {
        signDiag = item.diag;
        newList && newList.forEach(subItem => {
          if (subItem.data.indexOf(item.word) !== -1) {
            signDel = false;
          }
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

  onChangeInfo(info) {
    this.setState({ info: info }, () => service.fuzhen.fireWatch(info));
  }

  handleChange(e, data) {
    const { initData, recentRvisit } = this.state;
    let newInitData = initData;
    let newRecentRvisit = recentRvisit;
    newInitData = {...newInitData, ...data} 
    newRecentRvisit.pop();
    newRecentRvisit.push(newInitData)
    this.setState({initData: newInitData, recentRvisit: newRecentRvisit})
  }

  /**
   * 诊断列表
   */
  renderZD() {
    const { diagnosi, fzList, diagnosislist, isShowZhenduan, isMouseIn, relatedObj } = this.state;
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
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = fzListAction(fzList);
        store.dispatch(action);
      }

      const handleVisibleChange = fx => () => {
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
        this.setState({relatedObj, newRelatedObj}, () => {
          service.fuzhen.relatedformtype(relatedItem).then(res => {})
        });
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
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(-1)}>上 移</a></p> : null}
          {i + 1 < fzList.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(1)}>下 移</a></p> : null}
        </div>
      );
    }

    const title = item => {
      const data = {
        "诊断时间": item.createdate,
        "诊断全称": item.data,
        "诊断医生": item.doctor,
      }
      return JSON.stringify(data, null, 4)
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
        <ol>
          {fzList&&fzList.map((item, i) => (
            <li key={`diagnos-${item.data}-${i}-${Date.now()}`}>
              <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                <div title={title(item)}>
                  <span className="font-12">{i + 1}、</span>
                  <span className={item.highriskmark==1 ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                </div>
              </Popover>
              <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => this.deldiagnosis(item.id, item.data)} />
            </li>
          ))}
        </ol>
        <div className="fuzhen-left-input font-16">
          <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value, true)}
                 onFocus={() => handleIptFocus()}
                 onBlur={() => setTimeout(() => this.setState({isShowZhenduan: false}), 200)}
                 />
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
        <Button className="fuzhen-left-button margin-TB-mid" type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
      </div>
    )
  }

  renderLeft() {
    const { reportStr, planData, collapseActiveKey, jyEntity, info, scArr, scKeys, loading } = this.state;
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
          <JianYan entity={{...jyEntity}} onChange={(e, item) => handleChange(e, item, jyEntity)} />
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
          <FuzhenTable info={info} onReturn={(param) => this.setState({isShowPlanModal: param})} changeRecentRvisit={changeRecentRvisit} />
        </Modal>
      )
    }

      /**
     * 诊断历史记录
     */
    const renderHisnModal = () => {
      const { isShowHis, listHistory } = this.state;
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

      return (
        <Modal className="hisn-modal" width="80%" footer={null} title="诊断历史" visible={isShowHis} onCancel={() => handleClick()}>
          <Table columns={columns} dataSource={listHistory} pagination={false}/> 
        </Modal>
      )
    }

    const handleOtherClick = e => {
      e.stopPropagation();
      service.fuzhen.getLisResult().then(res => {
        let data = service.praseJSON(res.object);
        if(data.ogtt && data.ogtt[0] && data.ogtt[0].label === "GDM") {
          const param = {"value": {
            "input0": data['ogttGdmEmpty'],
            "input1": data['ogttGdm1H'],
            "input2": data['ogttGdm2H'],
          }};
          data['ogtt'] = [Object.assign(data.ogtt[0], param)];
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

    const handleCheck = (keys) => {
      this.setState({ scKeys: keys });
      const allKeys = ['add_FIELD_early_downs_syndrome','add_FIELD_mk_downs_syndrome', 
            'add_FIELD_nipt', 'add_FIELD_outpatient', 'add_FIELD_refuse_outpatient'];

      allKeys.forEach(item => {
        let k = item;
        info[k] = false;
      })
      
      keys.forEach(item => {
        let k = item;
        info[k] = true;
      })
      service.shouzhen.saveForm('sc', info).then(res => {})
    }

    return (
      <div className="fuzhen-left ant-col-5">
        <Collapse defaultActiveKey={collapseActiveKey}>
          <Panel header={<span>诊 断<Button type="ghost" className="header-btn" size="small" onClick={e => handleHisClick(e) }>历史</Button></span>} key="1">
            { this.renderZD() }
          </Panel>
          <Panel header={<span>缺少检验报告<Button type="ghost" className="header-btn" size="small" onClick={e => handleOtherClick(e) }>其他</Button></span>} key="2">
            {loading ? <div style={{ height: '4em', textAlign: 'center' }}><Spin />&nbsp;...</div> : <p className="pad-small">{reportStr || '无'}</p>}
          </Panel>
          
          <Panel className="cq-check" header="产前筛查和诊断" key="3">
              <Tree checkable checkedKeys={scKeys} onCheck={handleCheck}>
                {scArr.map(item => <Tree.TreeNode key={item.id} title={item.name}></Tree.TreeNode>)}
              </Tree>
          </Panel>

          <Panel header="诊疗计划" key="4">
            <Timeline className="pad-small" pending={<Button type="ghost" size="small" onClick={() => this.setState({isShowPlanModal: true})}>管理</Button>}>
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

  renderTable() {
    const { recentRvisit=[], recentRvisitAll=[], recentRvisitShow, pageCurrent, totalRow, isShowMoreBtn, 
            hasRecord, isTwins, printData, userDoc, hasPrint, loading, initData } = this.state;
    const handleMoreBtn = () => {
      service.fuzhen.getRvisitPage(10, pageCurrent).then(res => this.setState({
        recentRvisitAll: res.object.list,
        totalRow: res.object.totalRow
      })).then(() => {
        this.setState({ recentRvisitShow: true })
      });
    }

    const handleSaveChange = (type, item) => {
      if (!isTwins) {
        item.cktaix = item.allTaix;
        item.ckxianl = item.allXianl;
      }
      this.setState({initData: item});
      const action = isFormChangeAction(true);
      store.dispatch(action);
    }

    const handelTableChange = (type, row) => {
      //血压
      let ckpressure = row.ckpressure.split('/');
      if(ckpressure[0]) row.ckshrinkpressure = ckpressure[0];
      if(ckpressure[1]) row.ckdiastolicpressure = ckpressure[1];
      if(row.cktaix || row.ckxianl) {
        row.cktaix = row.allTaix;
        row.ckxianl = row.allXianl;
      }

      service.fuzhen.saveRvisitForm(row).then(res => {
        this.getRecentList();
      })
    }

    const handlePageChange = (page) => {
      service.fuzhen.getRvisitPage(10, page).then(res => {
        this.setState({recentRvisitAll: res.object.list})})
    }

    const printFZ = (bool) => {
      service.fuzhen.getRvisitPage(100, pageCurrent).then(res => {
        this.setState({ printData: res.object.list});
        if (bool) {
          this.setState({ hasPrint: false}, () => {
            $(".fz-print").jqprint();
          })
        } else {
          this.setState({ hasPrint: true}, () => {
            $(".fz-print").jqprint();
          })
        }
      })
    }

    let rvisitKeys = JSON.parse(JSON.stringify(baseData.tableKey()));
    let rvisitAllKeys = JSON.parse(JSON.stringify(baseData.tableKey()));
    let printKeys = JSON.parse(JSON.stringify(baseData.tableKey()));

    const getIndex = (keys, title) => {
      let index = 99;
      keys.forEach((item, i) => {
        if(item.title === title) index = i;
      })
      return index;
    }

    const resetData = (obj, keys) => {
      let fpgCount = 0;
      let pbg2hCount = 0;
      let hbAlcCount = 0; 
      let upStateCount = 0;
      let upDosage24hCount = 0;    
      let heartRateCount = 0;
      let examinationCount = 0;
      let hasUltrasound = false;
      let hasPlan = false;
      let hasRiMo = false;
      let hasRiNo = false;
      let hasRiEv = false;
      let hasRiSl = false;

      obj.map(item => {
        // 是否修改过预产期-超声
        if (item.updateExpectFlag === '1' && item.ckweek && String(item.ckweek).indexOf('修') === -1) {
          item.ckweek += '(修)';
        }

        // 下次复诊数据处理
        let describe1 = '', describe2 = '';
        if(typeof item.ckappointmentArea === 'object') describe1 = item.ckappointmentArea.describe;
        if(typeof item.rvisitOsType === 'object') describe2 = item.rvisitOsType.describe;
        item.ckpressure = (!item.ckpressure || item.ckpressure === "") ?  item.ckshrinkpressure +'/'+ item.ckdiastolicpressure : item.ckpressure;
        if (item.ckappointment) {
          item.nextRvisitText = item.ckappointment.slice(5) + ' ' + describe1 + ' ' + describe2;
        }
        
        // 胎心率、先露数据处理
        if(!item.cktaix && !item.ckxianl) {
          item.allTaix = "";
          item.allXianl = "";
          if(item.fetalCondition && item.fetalCondition[0].location) {
            item.fetalCondition.map(subItem => {
              if(subItem.location && subItem.taix) {
                item.allTaix += `${subItem.location.label}：${subItem.taix}；`;
              }
              if(subItem.location && subItem.xianl) {
                item.allXianl += `${subItem.location.label}：${subItem.xianl.label}；`;
              }
            })
          } 
        } else {
          item.allTaix = item.cktaix;
          item.allXianl = item.ckxianl;
        }

        // 胎儿超声数据处理
        if(item.fetalUltrasound && item.fetalUltrasound[0].tetz) {
          hasUltrasound = true;
          item.allTetz = "";
          item.allTeafv = "";
          item.allTeqxl = "";
          item.fetalUltrasound.map((subItem, index) => {
            if(subItem.tetz) item.allTetz += subItem.tetz + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
            if(subItem.teafv) item.allTeafv += subItem.teafv + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
            if(subItem.teqxl) item.allTeqxl += subItem.teqxl + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
          })
        }

        // 胰岛素方案数据处理
        if(item.riMo && item.riMo[0] && item.riMo[1]) {
          hasRiMo = true;
          let firstParam = typeof item.riMo[0] === 'object' ? item.riMo[0].label : item.riMo[0];
          item.allRiMo = firstParam + '：' + item.riMo[1] + 'U';
        }
        if(item.riNo && item.riNo[0] && item.riNo[1]) {
          hasRiNo = true;
          let firstParam = typeof item.riNo[0] === 'object' ? item.riNo[0].label : item.riNo[0];
          item.allRiNo = firstParam + '：' + item.riNo[1] + 'U';
        }
        if(item.riEv && item.riEv[0] && item.riEv[1]) {
          hasRiEv = true;
          let firstParam = typeof item.riEv[0] === 'object' ? item.riEv[0].label : item.riEv[0];
          item.allRiEv = firstParam + '：' + item.riEv[1] + 'U';
        }
        if(item.riSl && item.riSl[0] && item.riSl[1]) {
          hasRiSl = true;
          let firstParam = typeof item.riSl[0] === 'object' ? item.riSl[0].label : item.riSl[0];
          item.allRiSl = firstParam + '：' + item.riSl[1] + 'U';
        }

        // 用药方案数据处理
        if(item.medicationPlan) {
          item.allMedicationPlan = "";
          item.medicationPlan.map(subItem => {
            if(subItem.name) {
              item.allMedicationPlan += subItem.name + '；';
              hasPlan = true;
            } 
          })
        }

        if(!item.fpg) fpgCount++;
        if(!item.pbg2h) pbg2hCount++;
        if(!item.hbAlc) hbAlcCount++;
        if(!item.upState) upStateCount++;
        if(!item.upDosage24h) upDosage24hCount++;
        if(!item.heartRate) heartRateCount++;
        if(!item.examination) examinationCount++;
      })
      
      // if(fpgCount === obj.length) keys.splice(getIndex(keys, '空腹血糖'), 1);
      // if(pbg2hCount === obj.length) keys.splice(getIndex(keys, '餐后2H'), 1);
      // if(hbAlcCount === obj.length) keys.splice(getIndex(keys, 'HbAlc'), 1);
      // if(upStateCount === obj.length && upDosage24hCount === obj.length) keys.splice(getIndex(keys, '尿蛋白'), 1);
      // if(heartRateCount === obj.length) keys.splice(getIndex(keys, '心率'), 1);
      // if(examinationCount === obj.length) keys.splice(getIndex(keys, '化验'), 1);
      // if(!hasUltrasound) keys.splice(getIndex(keys, '胎儿超声'), 1);
      // if(!hasRiMo) keys.splice(getIndex(keys, '胰岛素(U)方案'), 1)
      // if(!hasPlan) keys.splice(getIndex(keys, '用药方案'), 1);


      // if(fpgCount === obj.length) keys[getIndex(keys, '空腹血糖')].className = 'isHide';
      // if(pbg2hCount === obj.length) keys[getIndex(keys, '餐后2H')].className = 'isHide';
      // if(hbAlcCount === obj.length) keys[getIndex(keys, 'HbAlc')].className = 'isHide';
      // if(upStateCount === obj.length && upDosage24hCount === obj.length) keys[getIndex(keys, '尿蛋白')].className = 'isHide';
      // if(heartRateCount === obj.length) keys[getIndex(keys, '心率')].className = 'isHide';
      // if(examinationCount === obj.length) keys[getIndex(keys, '化验')].className = 'isHide';
      // if(!hasUltrasound) {
        // keys[getIndex(keys, '胎儿超声')].className = 'isHide';
        // keys[getIndex(keys, '胎儿超声')].children.forEach(item => {
        //   item.className = 'isHide';
        // })
      // };
      // if(!hasRiMo) keys[getIndex(keys, '胰岛素(U)方案')].className = 'isHide';
      // if(!hasPlan) keys[getIndex(keys, '用药方案')].className = 'isHide';



      if(fpgCount === obj.length) keys[getIndex(keys, '空腹血糖')].className = 'isHide';
      if(pbg2hCount === obj.length) keys[getIndex(keys, '餐后2H')].className = 'isHide';
      if(hbAlcCount === obj.length) keys[getIndex(keys, 'HbAlc')].className = 'isHide';
      if(upStateCount === obj.length && upDosage24hCount === obj.length) {
        keys[getIndex(keys, '定性')].className = 'isHide';
        keys[getIndex(keys, '定量')].className = 'isHide';
      }
      if(heartRateCount === obj.length) keys[getIndex(keys, '心率')].className = 'isHide';
      if(examinationCount === obj.length) keys[getIndex(keys, '化验')].className = 'isHide';
      if(!hasUltrasound) {
        keys[getIndex(keys, '胎儿体重')].className = 'isHide';
        keys[getIndex(keys, 'AVF')].className = 'isHide';
        keys[getIndex(keys, '脐血流')].className = 'isHide';
      };
      if(!hasRiMo) {
        keys[getIndex(keys, '早')].className = 'isHide';
      } 
      if(!hasRiNo) {
        keys[getIndex(keys, '中')].className = 'isHide';
      } 
      if(!hasRiEv) {
        keys[getIndex(keys, '晚')].className = 'isHide';
      } 
      if(!hasRiSl) {
        keys[getIndex(keys, '睡前')].className = 'isHide';
      } 
      if(!hasPlan) keys[getIndex(keys, '用药方案')].className = 'isHide';

    }

    if(recentRvisit) {
      service.praseJSON(recentRvisit)
      resetData(recentRvisit, rvisitKeys);
    };
    if(recentRvisitAll) {
      service.praseJSON(recentRvisitAll)
      resetData(recentRvisitAll, rvisitAllKeys);
    };
    if(printData) {
      service.praseJSON(printData)
      resetData(printData, printKeys);
    };

    rvisitKeys[0].format=i=>(`${i||''}`).replace(/\d{4}-/,'');
    rvisitAllKeys[0].format=i=>(`${i||''}`).replace(/\d{4}-/,'');
    printKeys[0].format=i=>(`${i||''}`).replace(/\d{4}-/,'');
    // printKeys.splice(printKeys.length - 1, 1);

    // const newKeys = baseData.tableKey();
    // newKeys.splice(9, 9);

    // console.log(printKeys, '432')
    printData && printData.forEach(item  => {
      if(item.ckpressure === "/") item.ckpressure = '';
    })
    const initTable = (data, props) => tableRender(rvisitKeys, data, { buttons: null, ...props });
    const allInitTable = (data, props) => tableRender(rvisitAllKeys, data, { buttons: null, ...props });
    return (
      <div className="fuzhen-table">
        {recentRvisit && initTable(recentRvisit, { width: 1100, size: "small", pagination: false, editable: true, className: "fuzhenTable",
          onEdit: true, hasRecord: hasRecord, isTwins: isTwins, tableLayout: "fixed", scroll: { x: 1100, y: 220 },
          iseditable: ({ row }) => hasRecord ? row === recentRvisit.length - 1 : row > recentRvisit.length - 2, onRowChange: handleSaveChange
        })}
        {loading ? <div style={{ height: '4em', textAlign: 'center' }}><Spin />&nbsp;...</div> : null}
        <Modal title="产检记录" footer={null} visible={recentRvisitShow} width="100%" maskClosable={true} onCancel={() => this.setState({ recentRvisitShow: false })}>
          <div className="table-content">
            {recentRvisitAll && allInitTable(recentRvisitAll, { className: "fuzhenTable2", scroll: { x: 1100 }, editable: true,
              onRowChange: handelTableChange, tableLayout: "fixed",
              pagination: { pageSize: 12, total: totalRow + 2, onChange: handlePageChange, showQuickJumper: true }
            })}
            <Button type="primary" className="bottom-savePDF-btn margin-R-1" size="small" onClick={() => printFZ()}>逐次打印</Button>
            <Button type="primary" className="bottom-savePDF-btn" size="small" onClick={() => printFZ(true)}>全部打印</Button>
            <div className={hasPrint ? "fz-print has-print" : "fz-print"}>
              {printData && <PrintTable printKeys={printKeys} printData={printData} highriskFactor={userDoc.highriskFactor}></PrintTable>}
            </div>
          </div>
        </Modal>
        <div className="clearfix">
          <Button size="small" type="dashed" className="margin-TB-mid pull-right" onClick={handleMoreBtn}>更多产检记录</Button>
        </div>
      </div>
    );
  }

  /**
   * 孕产期
   */
  renderYCQ(){
    const { openYCQ, initData, recentRvisit, ycqEntity, isChangeYCQ } = this.state;
    const ycqConfig = () => {
      return {
        rows: [
          {
            columns: [
              { name: "ckzdate[B超时间]", type: "date", span: 7 },
              { name: "ckztingj[停经]", type: "input", span: 7 },
              { name: "ckzweek[如孕]", type: "input", span: 7 },
            ]
          },
          {
            columns: [
              { name: "gesexpectrv[预产期-超声]", className: "yu-ges", type: "date", span: 21 },
            ]
          },
        ]
      }
    }
    const handleYCQChange = (e, { name, value, target }) => {
      let data = {[name]: value};
      if(name === 'gesexpectrv') this.setState({ isChangeYCQ: true });
      this.setState({ ycqEntity: {...ycqEntity, ...data} });
    }
    const handelClick = (e, isOk) => {
      const action = openYCQAction(false);
      store.dispatch(action);
      if(isOk){
        if(isChangeYCQ) {
          const dateTip = ycqEntity.ckzdate ? `B超时间：${ycqEntity.ckzdate}；` : '';
          const tingjTip = ycqEntity.ckztingj ? `停经${ycqEntity.ckztingj}周；` : '';
          const weekTip = ycqEntity.ckzweek ? `如孕${ycqEntity.ckzweek}周；` : '';
          const trvTip = ycqEntity.gesexpectrv ? `修订预产期为${ycqEntity.gesexpectrv}；` : '';
          // initData.ckweek = util.getWeek(40, util.countWeek(ycqEntity.gesexpectrv, initData.checkdate))+'(修)';
          initData.ckweek = util.getWeek(40, util.countWeek(ycqEntity.gesexpectrv, initData.checkdate));
          initData.updateExpectFlag = '1';
          initData.treatment += dateTip + tingjTip + weekTip + trvTip;

          recentRvisit.pop();
          recentRvisit.push(initData);
          this.setState({initData, recentRvisit});
        }
      } else {
        this.setState({ isChangeYCQ: false });
      }
    }
    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
             width={800} closable visible={openYCQ} onCancel={e => handelClick(e, false)} onOk={e => handelClick(e, true)}>
        {formRender(ycqEntity, ycqConfig(), handleYCQChange)}
      </Modal>
    );
  }

  saveForm(entity) {
    const { fzList, ycqEntity, isChangeYCQ } = this.state;
    const action = isFormChangeAction(false);
    store.dispatch(action);
    // 处理下加了‘修’字的孕周
    if (entity.ckweek && String(entity.ckweek).indexOf('修') !== -1) {
      entity.ckweek = entity.ckweek.slice(0, -3);
    }
    return new Promise(resolve => {
      service.fuzhen.saveRvisitForm(entity).then((res) => {
        modal('success', '诊断信息保存成功');
        const idAction = getIdAction(res.object);
        store.dispatch(idAction);
        const whichAction = getWhichAction('fz');
        store.dispatch(whichAction);
        // 更新修订孕产期-B超
        if (isChangeYCQ) {
          service.fuzhen.saveGesweekForm(ycqEntity).then(res => {
            this.setState({ isChangeYCQ: false })
          });
        }
        // 保存诊断数据
        service.shouzhen.batchAdd(2, res.object, fzList, 1).then(res => {
          service.getuserDoc().then(res => {
            const action = getUserDocAction(res.object);
            store.dispatch(action);
          })
          service.shouzhen.uploadHisDiagnosis(2).then(res => { })
          service.shouzhen.getList(2).then(res => {
            const action = fzListAction(res.object);
            store.dispatch(action);
          })
        })
        service.fuzhen.getRecentRvisit().then(res => {
          let newInitData = service.praseJSON(res.object[res.object.length - 1]);
          console.log(newInitData, '543')
          this.setState({loading: false, recentRvisit: res.object, initData: newInitData})
        });
        resolve();
      });
    })
  }

  render() {
    const { fzList, relatedObj, initData } = this.state;
    return (
      <Page className="fuzhen font-16 ant-col">
        <div className="bgDOM"></div>
        <div className="fuzhen-right ant-col-19 pad-mid">
          {this.renderTable()}
          <FuzhenForm initData={initData} diagList={fzList} relatedObj={relatedObj}
            onSave={data => this.saveForm(data)} onChange={this.handleChange.bind(this)} onChangeInfo={this.onChangeInfo.bind(this)}/>
          <p className="pad_ie">
            &nbsp;<span className="hide">ie8下拉框只能向下，这里是占位</span>
          </p>
        </div>
        {this.renderLeft()}
        {this.renderYCQ()}
      </Page>
    );
  }
}