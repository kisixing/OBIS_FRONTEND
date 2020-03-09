import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message, DatePicker } from 'antd';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import tableRender from '../../render/table';
import FuzhenForm from './form';
import FuzhenTable from './table';
import Page from '../../render/page';
import JianYan from './jianyanjiacha';
import service from '../../service';
import * as baseData from './data';
import editors from '../shouzhen/editors';
import * as util from './util';
import store from '../store';
import { getAlertAction,
        showTrialAction, 
        showPharAction,
        checkedKeysAction,
        isFormChangeAction,
        openYCQAction,
        getDiagnisisAction,
        getUserDocAction
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
      diagnosislist: {},
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
      collapseActiveKey: ['1', '2', '3'],
      planData: [],
      initData: { ...baseData.formEntity },
      fzEntity: { ...baseData.fzFormEntity },
      hasRecord: false,
      isTwins: false,
      ycq: '',
      reportStr: '',
      jyEntity: {},
      ...store.getState(),
    };
    store.subscribe(this.handleStoreChange);
    this.componentWillUnmount = editors();
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    const { diagList, userDoc, trialVisible } = this.state;

    diagList && diagList.forEach(item => {
      if((item.data === '瘢痕子宫' || item.data === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32 && !trialVisible) {
        const action = showTrialAction(true);
        store.dispatch(action);
      }
      if(item.data === '双胎妊娠' || item.data === '多胎妊娠') {
        this.setState({ isTwins: true })
      }
    })

    Promise.all([
    service.getuserDoc().then(res => this.setState({ info: res.object, ycq: res.object.gesexpect }, () => {
      let param = {"ckweek": res.object.tuserweek, "checkdate": util.futureDate(0)};
      this.setState({initData: {...this.state.initData, ...param}});
    })),

    service.fuzhen.getdiagnosis().then(res => {
      const action = getDiagnisisAction(res.object.list);
      store.dispatch(action);
    }),

    service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object})),

    service.fuzhen.getRecentRvisit().then(res => {
      res.object = res.object || [];
      let bool = false;
      res.object && res.object.map(item => {
        if(item.checkdate == util.futureDate(0)) {
          bool = true;
          this.setState({hasRecord: true, initData: service.praseJSON(item)})
        }
      })
      if(!bool) res.object.push(this.state.initData);
      this.setState({recentRvisit: res.object})
    })]).then(() => this.setState({ loading: false }));

    service.fuzhen.getRvisitPage(this.state.pageCurrent).then(res => {
      if (res.object.list && res.object.list.length > 2) this.setState({isShowMoreBtn: true})
    });

    service.fuzhen.getDiagnosisPlanData().then(res => this.setState({ planData: res.object }));

    service.fuzhen.getLackLis().then(res => {
      this.setState({reportStr: String(res.object)})
    })

    service.fuzhen.getLisResult().then(res => 
      this.setState({jyEntity: service.praseJSON(res.object)}
    ))

  }

  adddiagnosis() {
    const { diagList, diagnosi, userDoc } = this.state;
    if (diagnosi && !diagList.filter(i => i.data === diagnosi).length) {
      service.fuzhen.adddiagnosis(diagnosi).then(() => {
        modal('success', '添加诊断信息成功');
        if ((diagnosi==='瘢痕子宫' || diagnosi==='疤痕子宫') && parseInt(userDoc.tuserweek) >= 32) {
          const action = showTrialAction(true);
          store.dispatch(action);
        }
        if(diagnosi === '双胎妊娠' || diagnosi === '多胎妊娠') {
          this.setState({ isTwins: true })
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
        service.getuserDoc().then(res => {
          const action = getUserDocAction(res.object);
          store.dispatch(action);
        })
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

        let bool = true;
        res.object.list && res.object.list.forEach(item => {
          if(item.data === '双胎妊娠' || item.data === '多胎妊娠') {
            bool = false;
          }
        })
        if(bool) this.setState({ isTwins: false })
      })
      service.getuserDoc().then(res => {
        const action = getUserDocAction(res.object);
        store.dispatch(action);
      })
    })
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

  saveForm(entity) {
    const { isTwins } = this.state;
    this.setState({ loading: true });
    const action = isFormChangeAction(false);
    store.dispatch(action);
    if(!isTwins) {
      entity.cktaix = entity.allTaix;
      entity.ckxianl = entity.allXianl;
    }
    return new Promise(resolve => {
      service.fuzhen.saveRvisitForm(entity).then(() => {
        modal('success', '诊断信息保存成功');
        service.fuzhen.getRecentRvisit().then(res => {
          let newInitData = service.praseJSON(res.object[res.object.length - 1]);
          console.log(newInitData, '543')
          this.setState({loading: false, recentRvisit: res.object, initData: newInitData})
        });
        resolve();
      }, () => this.setState({ loading: false }));
    })
  }

  /**
   * 诊断列表
   */
  renderZD() {
    const { diagnosi, diagList, diagnosislist, isShowZhenduan, isMouseIn, relatedObj } = this.state;
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

      let relatedformtype = item.relatedformtype.split(",");
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {item.relatedformtype!=="" ?
            <div><p>关联表单</p>
              {relatedformtype.map(subItem => <p className="pad-small"><a className="font-16" onClick={handleRelated(subItem, item.data)}>
              {relatedObj[item.data]&&relatedObj[item.data].includes(subItem) ? `${subItem} √` : subItem} </a></p>)}
            </div>
          : null}
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('down')}>上 移</a></p> : null}
          {i + 1 < diagList.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('up')}>下 移</a></p> : null}
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
          {diagList&&diagList.map((item, i) => (
            <li key={`diagnos-${item.id}-${Date.now()}`}>
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
                 onFocus={() => this.setState({isShowZhenduan: true})}
                 onBlur={() => setTimeout(() => this.setState({isShowZhenduan: false}), 200)}
                 />
          { isShowZhenduan || isMouseIn ?
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
            </div>  : ""}
          {renderSetModal()}
        </div>
        <Button className="fuzhen-left-button margin-TB-mid" type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
      </div>
    )
  }

  renderLeft() {
    const { loading, reportStr, planData, collapseActiveKey, jyEntity } = this.state;
    /**
   * 检验报告结果
   */
    const renderResultModal = () => {
      const { isShowResultModal } = this.state;
      const handleClick = (bool) => {
        // if(bool) {
        //   const form = document.querySelector('.jy-modal');
        //   fireForm(form, 'valid').then((valid) => {
        //     if(valid) {
        //       service.shouzhen.saveForm('tab-6', jyEntity).then(res => {
        //         this.setState({isShowResultModal: false});
        //         const action = isFormChangeAction(false);
        //         store.dispatch(action);
        //       })
        //     }else {
        //       message.error("必填项不能为空！");
        //     }
        //   })
        // } else {
          this.setState({isShowResultModal: false});
        // }
      }

      const handleChange = (e, { name, value, target }, jyEntity) => {
        // console.log(name, value, target, jyEntity, '434')
        const action = isFormChangeAction(true);
        store.dispatch(action);
        jyEntity[name] = value;
        this.setState({ jyEntity });
      }

      return (
        <Modal className="jy-modal"  title="检验报告" width="80%" visible={isShowResultModal} 
               onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <JianYan entity={{...jyEntity}} onChange={(e, item) => handleChange(e, item, jyEntity)} />
        </Modal>
      )
    }

      /**
     * 诊疗计划管理
     */
    const renderPlanModal = () => {
      const { isShowPlanModal, planDataList, info } = this.state;
      const handleClick = (item) => {
        this.setState({isShowPlanModal: false})
      }
      const changeRecentRvisit = () => {
        service.fuzhen.getDiagnosisPlanData().then(res => this.setState({ planData: res.object }));
      }
      // const initTable = (data) => tableRender(baseData.planKey(), data, { pagination: false, buttons: null, editable: true, onRowChange: this.handelTableChange.bind(this)});
      return (
        <Modal width="80%" footer={null} title="诊疗计划" visible={isShowPlanModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <FuzhenTable info={info} onReturn={(param) => this.setState({isShowPlanModal: param})} changeRecentRvisit={changeRecentRvisit} />
        </Modal>
      )
    }

    const handleBtnClick = (e) => {
      e.stopPropagation();
      service.fuzhen.getLisResult().then(res => 
        this.setState({jyEntity: service.praseJSON(res.object)}
      ))
      this.setState({isShowResultModal: true})
    }

    return (
      <div className="fuzhen-left ant-col-5">
        <Collapse defaultActiveKey={collapseActiveKey}>
          <Panel header="诊 断" key="1">
            {
            // loading ?
            //   <div style={{ height: '2em' }}><Spin />&nbsp;...</div> : this.renderZD()
              this.renderZD()
            }

          </Panel>
          <Panel header={<span>缺 少 检 验 报 告<Button type="ghost" size="small" onClick={e => handleBtnClick(e) }>其他</Button></span>} key="2">
            <p className="pad-small">{reportStr || '无'}</p>
          </Panel>
          <Panel header="诊 疗 计 划" key="3">
            <Timeline className="pad-small" pending={<Button type="ghost" size="small" onClick={() => this.setState({isShowPlanModal: true})}>管理</Button>}>
              {planData&&planData.length>0 ? planData.map((item, index) => (
                <Timeline.Item key={`planData-${item.id || index}-${Date.now()}`}>
                  <p className="font-16">{item.time}周后 - {item.gestation}孕周</p>
                  <p className="font-16">{item.event}</p>
                </Timeline.Item>
              ))
                : <div>无</div>}
            </Timeline>
          </Panel>
        </Collapse>
        {renderResultModal()}
        {renderPlanModal()}
      </div>
    );
  }

  renderTable() {
    const { info, recentRvisit=[], recentRvisitAll=[], recentRvisitShow, pageCurrent, totalRow, isShowMoreBtn, hasRecord, isTwins } = this.state;
    const handleMoreBtn = () => {
      service.fuzhen.getRvisitPage(pageCurrent).then(res => this.setState({
        recentRvisitAll: res.object.list,
        totalRow: res.object.totalRow
      })).then(() => {
        this.setState({ recentRvisitShow: true })
      });
    }

    const handleSaveChange = (e, {item, value, key}) => {
      if(key === "checkdate") {
        item.ckweek = util.getWeek(40, util.countWeek(info.gesexpect, item.checkdate));
      }
      this.setState({initData: item});
      const action = isFormChangeAction(true);
      store.dispatch(action);
    }

    const handleRowChange = ()=> {}

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
        service.fuzhen.getRecentRvisit().then(res => {
          let bool = false;
          res.object&&res.object.map(item => {
            if(item.checkdate == util.futureDate(0)) {
              bool = true;
              this.setState({hasRecord: true, initData: service.praseJSON(item)})
            }
          })
          if(!bool) res.object.push(this.state.initData);
          this.setState({recentRvisit: res.object})
        })
      })
    }

    const handlePageChange = (page) => {
      service.fuzhen.getRvisitPage(page).then(res => {
        this.setState({recentRvisitAll: res.object.list})})
    }

    let rvisitKeys = JSON.parse(JSON.stringify(baseData.tableKey()));
    let rvisitAllKeys = JSON.parse(JSON.stringify(baseData.tableKey()));

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
      let hasRiMo= false;
      let hasPlan = false;

      obj.map(item => {
        // 下次复诊数据处理
        let describe1 = '', describe2 = '';
        if(typeof item.ckappointmentArea === 'object') describe1 = item.ckappointmentArea.describe;
        if(typeof item.rvisitOsType === 'object') describe2 = item.rvisitOsType.describe;
        item.ckpressure = (!item.ckpressure || item.ckpressure === "") ?  item.ckshrinkpressure +'/'+ item.ckdiastolicpressure : item.ckpressure;
        item.nextRvisitText = item.ckappointment.slice(5) + ' ' + describe1 + ' ' + describe2;
        
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
          item.fetalUltrasound.map(subItem => {
            if(subItem.tetz) item.allTetz += subItem.tetz + '；';
            if(subItem.teafv) item.allTeafv += subItem.teafv + '；';
            if(subItem.teqxl) item.allTeqxl += subItem.teqxl + '；';
          })
        }

        // 胰岛素方案数据处理
        if(item.riMo && item.riMo[0] && item.riMo[1]) {
          hasRiMo = true;
          item.allRiMo = item.riMo[0] + '：' + item.riMo[1];
        }
        if(item.riNo && item.riNo[0] && item.riNo[1]) {
          hasRiMo = true;
          item.allRiNo = item.riNo[0] + '：' + item.riNo[1];
        }
        if(item.riEv && item.riEv[0] && item.riEv[1]) {
          hasRiMo = true;
          item.allRiEv = item.riEv[0] + '：' + item.riEv[1];
        }
        if(item.riSl && item.riSl[0] && item.riSl[1]) {
          hasRiMo = true;
          item.allRiSl = item.riSl[0] + '：' + item.riSl[1];
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
      
      if(fpgCount === obj.length) keys.splice(getIndex(keys, '空腹血糖'), 1);
      if(pbg2hCount === obj.length) keys.splice(getIndex(keys, '餐后2H'), 1);
      if(hbAlcCount === obj.length) keys.splice(getIndex(keys, 'HbAlc'), 1);
      if(upStateCount === obj.length && upDosage24hCount === obj.length) keys.splice(getIndex(keys, '尿蛋白'), 1);
      if(heartRateCount === obj.length) keys.splice(getIndex(keys, '心率'), 1);
      if(examinationCount === obj.length) keys.splice(getIndex(keys, '化验'), 1);
      if(!hasUltrasound) keys.splice(getIndex(keys, '胎儿超声'), 1);
      if(!hasRiMo) keys.splice(getIndex(keys, '胰岛素(U)方案'), 1)
      if(!hasPlan) keys.splice(getIndex(keys, '用药方案'), 1);
    }

    if(recentRvisit) {
      service.praseJSON(recentRvisit)
      resetData(recentRvisit, rvisitKeys);
    };
    if(recentRvisitAll) {
      service.praseJSON(recentRvisitAll)
      resetData(recentRvisitAll, rvisitAllKeys);
    };

    rvisitKeys[0].format=i=>(`${i||''}`).replace(/\d{4}-/,'');
    rvisitAllKeys[0].format=i=>(`${i||''}`).replace(/\d{4}-/,'');

    const newKeys = baseData.tableKey();
    newKeys.splice(9, 9);

    const initTable = (data, props) => tableRender(newKeys, data, { buttons: null, ...props });
    const allInitTable = (data, props) => tableRender(rvisitAllKeys, data, { buttons: null, ...props });
    return (
      <div className="fuzhen-table">
        {/* iseditable:({row})=>!!row, */}
        {recentRvisit && initTable(recentRvisit, {
          width: 1100,
          size: "small",
          pagination: false,
          editable: true,
          className: "fuzhenTable",
          onEdit: true,
          hasRecord: hasRecord,
          isTwins: isTwins,
          scroll: { x: 1100, y: 220 },
          iseditable: ({ row }) => hasRecord ? row === recentRvisit.length - 1 : row > recentRvisit.length - 2,
          onChange: handleSaveChange,
          onRowChange: handleRowChange
        })}
        {/* {!recentRvisit ? <div style={{ height: '4em' }}><Spin />&nbsp;...</div> : null} */}
        <Modal title="产检记录" footer={null} visible={recentRvisitShow} width="100%" maskClosable={true} onCancel={() => this.setState({ recentRvisitShow: false })}>
          <div className="table-content">
            {recentRvisitAll && allInitTable(recentRvisitAll, {
              className: "fuzhenTable",
              scroll: { x: 1100 },
              editable: true,
              onRowChange: handelTableChange,
              tableLayout: "fixed",
              pagination: {
                pageSize: 12,
                total: totalRow + 2,
                onChange: handlePageChange,
                showQuickJumper: true
              }
            })}
            <Button type="primary" className="bottom-savePDF-btn" size="small" onClick={() => alert("另存为PDF")}>
              另存为PDF
            </Button>
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
    const { openYCQ, info, ycq, initData, recentRvisit } = this.state;
    const handelClick = (e, isOk) => {
      const action = openYCQAction(false);
      store.dispatch(action);
      if(isOk){
        let newInitData = initData;
        let newRecentRvisit = recentRvisit;
        newInitData.ckweek = util.getWeek(40, util.countWeek(ycq, newInitData.checkdate))+'(修)';
        newRecentRvisit.pop();
        newRecentRvisit.push(newInitData)
        this.setState({initData: newInitData, recentRvisit: newRecentRvisit})
      }
    }
    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
             width={600} closable visible={openYCQ} onCancel={e => handelClick(e, false)} onOk={e => handelClick(e, true)}>
        <span>是否修改预产期-超声:</span>
        <DatePicker defaultValue={info.gesexpect} value={ycq} onChange={(e,v)=>{this.setState({ycq:v})}}/>
      </Modal>
    );
  }

  /**
   * 产后复诊记录表单
   */  
  fzFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'sfri[随访日期]', type: 'date', valid: 'required', span: 4 },
            { name: 'fmri[分娩日期]', type: 'date', valid: 'required', span: 4  },
            { name: 'fmyy[分娩医院]', type: 'input', valid: 'required', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'zs[主@@诉]', type: 'input', span: 8 }
          ]
        },
        {
          columns: [
            { 
              name: 'ckpressure(mmHg)[血@@压]', type: ['input(/)','input'], span: 4, valid: (value)=>{
              let message = '';
              if(value){
                message = [0,1].map(i=>valid(`number|required|rang(0,${[139,109][i]})`,value[i])).filter(i=>i).join();
              }else{
                message = valid('required',value)
              }
              return message;
            }},
            { name: 'tz[体@@重](kg)', type: 'input', span: 4 },
            { name: 'bmi[BMI]', type: 'input', span: 4  },
          ]
        },
        {
          columns:[
            { name: 'jkzk[健康状况]', type: 'input', span: 8, showSearch: true, options: baseData.jkzkOptions },
            { name: 'xlzk[心里状况]((EPDS: <span>12分<span>))', type: 'input', span: 8, valid: 'required', showSearch: true, options: baseData.xlzkOptions },
          ]
        },
        {
          columns:[
            { name: 'xsewy[新生儿喂养]', type: 'checkinput', radio: true, span: 12, options: baseData.xsewyOptions }
          ]
        },
        {
          columns:[
            { name: 'rf[乳@@房]', type: 'select', span: 4, showSearch: true, options: baseData.rfOptions },
            { name: 'el[恶@@露]', type: 'select', span: 4, showSearch: true, options: baseData.elOptions },
            { name: 'hy[会@@阴]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'yd[阴@@道]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
          ]
        },
        {
          columns:[
            { name: 'zg[子@@宫]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'fj[附@@件]', type: 'select', span: 4, showSearch: true, options: baseData.sfycOptions },
            { name: 'pdpf[盆地评分]', type: 'input', span: 4 },
            { name: 'pdhf[盆地恢复]', type: 'select', span: 4, showSearch: true, options: baseData.pdhfOptions },
          ]
        },
        {
          columns:[
            { name: 'qt[其@@他]', type: 'input', span: 10 },
          ]
        },
        {
          columns:[
            { name: 'gwzw[高危转归]', type: 'checkinput', radio: true, span: 12, options: baseData.gwzwOptions },
          ]
        },
        {
          columns:[
            { name: 'zd[诊@@断]', type: 'select', span: 10, valid: 'required', showSearch: true, options: baseData.zdOptions }
          ]
        },
        {
          columns:[
            { name: 'zhd[指@@导]', type: 'input', span: 10 }
          ]
        },
        {
          columns:[
            { name: 'cl[处@@理]', type: 'input', span: 10 }
          ]
        },
      ]
    }
  }

  handleFZChange(e, { name, value, valid }) {
    console.log(e, { name, value, valid })
  }

  handleFZSave(form) {
    fireForm(form,'valid').then((valid)=>{
      if(valid){
        console.log(666)
      }else {
        message.error("必填项不能为空！")
      }
    });
  }

  render() {
    const { loading, diagList, relatedObj, info, initData, ycq, fzEntity } = this.state;
    return (
      <Page className="fuzhen font-16 ant-col">
        <div className="bgDOM"></div>
        {this.renderLeft()}
        <div className="fuzhen-right ant-col-19 pad-mid">
          {this.renderTable()}
          <FuzhenForm
            ycq={ycq}
            info={info}
            initData={initData}
            diagList={diagList}
            relatedObj={relatedObj}
            onSave={data => this.saveForm(data)}
            onChange={this.handleChange.bind(this)}
            onChangeInfo={this.onChangeInfo.bind(this)}
          />
          <p className="pad_ie">
            &nbsp;<span className="hide">ie8下拉框只能向下，这里是占位</span>
          </p>
        </div>
        {this.renderYCQ()}
        {/* <div className="chanhou-form">
          <p className="chanhou-title">产后复诊记录</p>
          {formRender(fzEntity, this.fzFormConfig(), this.handleFZChange.bind(this))}
          <Button className="blue-btn chanhou-btn" type="ghost" 
                  onClick={() => this.handleFZSave(document.querySelector(".chanhou-form"))}>
            保存
          </Button>
        </div> */}
      </Page>
    );
  }
}