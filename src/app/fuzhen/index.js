import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message } from 'antd';

import tableRender from '../../render/table';
import FuzhenForm from './form';
import FuzhenTable from './table';
import Page from '../../render/page';
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
      diagnosis: [],
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
      jianyanReport: '血常规、尿常规、肝功、生化、甲功、乙肝、梅毒、艾滋、地贫',
      planData: [],
      initData: { ...baseData.formEntity },
      hasRecord: false,
      modalState: [
        {
          "title": "糖尿病门诊预约",
          "gesmoc": "2019-07-03",
          "options": ["本周五", "下周五","下下周五",""]
        },
        {
          "title": "产前诊断预约",
          "gesmoc": "2019-07-31",
          "options": ["预约1","预约2","预约3"],
          "counts": "3"
        }
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
    Promise.all([
    service.getuserDoc().then(res => this.setState({ info: res.object }, () => {
      let param = {"ckweek": res.object.tuserweek, "checkdate": util.futureDate(0)};
      this.setState({initData: {...this.state.initData, ...param}});
    })),

    service.fuzhen.getdiagnosis().then(res => this.setState({ diagnosis: res.object.list })),

    service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object})),

    service.fuzhen.getRecentRvisit().then(res => {
      res.object = res.object || [];
      let bool = false;
      res.object&&res.object.map(item => {
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

  }

  adddiagnosis() {
    const { diagnosis, diagnosi } = this.state;
    if (diagnosi && !diagnosis.filter(i => i.data === diagnosi).length) {
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
        service.fuzhen.getdiagnosis().then(res => this.setState({
            diagnosis: res.object.list,
            diagnosi: ''
        }, () => {
          if(diagnosi.indexOf("血栓") !== -1 || diagnosi.indexOf("静脉曲张") !== -1 || diagnosi === "妊娠子痫前期" || diagnosi === "多胎妊娠") {
            this.updateCheckedKeys();
            const action = showPharAction(true);
            store.dispatch(action);
          }
        }));
      })
    } else if (diagnosi) {
      modal('warning', '添加数据重复');
    }
  }

  updateCheckedKeys(data) {
    const { checkedKeys, diagnosis } = this.state;
    let newCheckedKeys = checkedKeys;

    diagnosis.map(item => {
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
      service.fuzhen.getdiagnosis().then(res => this.setState({
          diagnosis: res.object.list
      }, () => {
        this.updateCheckedKeys(data);
      }));
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
    const { info } = this.state;
    this.setState({ loading: true });
    const action = isFormChangeAction(false);
    store.dispatch(action);
    return new Promise(resolve => {
      service.fuzhen.saveRvisitForm(entity).then(() => {
        modal('success', '诊断信息保存成功');
        service.fuzhen.getRecentRvisit().then(res => {
          this.setState({loading: false, recentRvisit: res.object})
        });
        resolve();
      }, () => this.setState({ loading: false }));
    })
  }

  /**
   * 诊断列表
   */
  renderZD() {
    const { diagnosi, diagnosis, diagnosislist, isShowZhenduan, isMouseIn, relatedObj } = this.state;
    const delConfirm = (item) => {
      Modal.confirm({
        title: '您是否确认要删除这项诊断',
        width: '300',
        style: { left: '-300px', fontSize: '18px' },
        onOk: () => this.deldiagnosis(item.id, item.data)
      });
    };

    // 诊断小弹窗操作
    const content = (item, i) => {
      const handleHighriskmark = () => {
        let highriskmark = item.highriskmark == 1 ? 0 : 1;
        service.fuzhen.updateHighriskmark(item.id, highriskmark).then(() => {
          service.fuzhen.getdiagnosis().then(res => this.setState({
            diagnosis: res.object.list
          }))
        })
      }

      const handleVisibleChange = fx => () => {
        service.fuzhen.updateSort(item.id, fx).then(() => {
          service.fuzhen.getdiagnosis().then(res => this.setState({
            diagnosis: res.object.list
          }))
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
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('up')}>上 移</a></p> : null}
          {i + 1 < diagnosis.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('down')}>下 移</a></p> : null}
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
          {diagnosis&&diagnosis.map((item, i) => (
            <li key={`diagnos-${item.id}-${Date.now()}`}>
              <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                <div title={title(item)}>
                  <span className="font-12">{i + 1}、</span>
                  <span className={item.highriskmark==1 ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                </div>
              </Popover>
              <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => delConfirm(item)} />
            </li>
          ))}
        </ol>
        <div className="fuzhen-left-input font-16">
          <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value, true)}
                 onFocus={() => this.setState({isShowZhenduan: true})}
                 onBlur={() => this.setState({isShowZhenduan: false})}
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
    const { loading, jianyanReport, planData, collapseActiveKey } = this.state;
    /**
   * 检验报告结果
   */
    const renderResultModal = () => {
      const { isShowResultModal } = this.state;
      const handleClick = (item) => {
        this.setState({isShowResultModal: false})
      }
      return (
        <Modal title="Title" visible={isShowResultModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <p>报告结果</p>
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
          <Panel header={<span>缺 少 检 验 报 告<Button type="ghost" size="small" onClick={e => { e.stopPropagation();this.setState({isShowResultModal: true})} }>其他</Button></span>} key="2">
            <p className="pad-small">{jianyanReport || '无'}</p>
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
    const { info, recentRvisit=[], recentRvisitAll=[], recentRvisitShow, pageCurrent, totalRow, isShowMoreBtn, hasRecord } = this.state;
    const handleMoreBtn = () => {
      service.fuzhen.getRvisitPage(pageCurrent).then(res => this.setState({
        recentRvisitAll: res.object.list,
        totalRow: res.object.totalRow
      })).then(() => {
        this.setState({ recentRvisitShow: true })
      });
    }

    const handleSaveChange = (type, row) => {
      console.log(type, row, '1234')
      // row.ckweek = info.tuserweek;
      this.setState({initData: row});
      const action = isFormChangeAction(true);
      store.dispatch(action);
    }

    const handelTableChange = (type, row) => {
      //血压
      let ckpressure = row.ckpressure.split('/');
      if(ckpressure[0]) row.ckshrinkpressure = ckpressure[0];
      if(ckpressure[1]) row.ckdiastolicpressure = ckpressure[1];

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

    const resetData = (obj) => {
      obj.map(item => {
        let describe1 = '', describe2 = '';
        if(typeof item.ckappointmentArea === 'object') describe1 = item.ckappointmentArea.describe;
        if(typeof item.rvisitOsType === 'object') describe2 = item.rvisitOsType.describe;
        item.ckpressure = (!item.ckpressure||item.ckpressure === "") ?  item.ckshrinkpressure +'/'+ item.ckdiastolicpressure : item.ckpressure;
        item.nextRvisitText = item.ckappointment.slice(5) + ' ' + describe1 + ' ' + describe2;
      })
    }

    let newRecentRvisit = recentRvisit;
    let newRecentRvisitAll = recentRvisitAll;
    if (recentRvisit) {
      service.praseJSON(newRecentRvisit)
      resetData(newRecentRvisit);
    };
    if (recentRvisitAll) {
      service.praseJSON(recentRvisitAll)
      resetData(newRecentRvisitAll);
    };

    const initTable = (data, props) => tableRender(baseData.tableKey(), data, { buttons: null, ...props });
    return (
      <div className="fuzhen-table">
        {/* iseditable:({row})=>!!row, */}
        {initTable(newRecentRvisit, {
          width: 1100,
          size: "small",
          pagination: false,
          editable: true,
          className: "fuzhenTable",
          onClick: true,
          hasRecord: hasRecord,
          scroll: { x: 1100, y: 220 },
          iseditable: ({ row }) => hasRecord ? row === 1 : row > recentRvisit.length - 2,
          onRowChange: handleSaveChange
        })}
        {/* {!recentRvisit ? <div style={{ height: '4em' }}><Spin />&nbsp;...</div> : null} */}
        <Modal title="产检记录" footer={null} visible={recentRvisitShow} width="100%" maskClosable={true} onCancel={() => this.setState({ recentRvisitShow: false })}>
          <div className="table-content">
            {initTable(newRecentRvisitAll, {
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

  render() {
    const { loading, diagnosis, relatedObj, info, modalState, initData } = this.state;

    return (
      <Page className="fuzhen font-16 ant-col">
        <div className="bgDOM"></div>
        {this.renderLeft()}
        <div className="fuzhen-right ant-col-19 pad-mid">
          {this.renderTable()}
          <FuzhenForm
            info={info}
            initData={initData}
            diagnosis={diagnosis}
            relatedObj={relatedObj}
            modalState={modalState}
            onSave={data => this.saveForm(data)}
            onChange={this.handleChange.bind(this)}
            onChangeInfo={this.onChangeInfo.bind(this)}
          />
          <p className="pad_ie">
            &nbsp;<span className="hide">ie8下拉框只能向下，这里是占位</span>
          </p>
        </div>
      </Page>
    );
  }
}