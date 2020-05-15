import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message, Table } from 'antd';
import formRender, {fireForm} from '../../render/form';
import {valid} from '../../render/common';
import tableRender from '../../render/table';
import FuzhenForm from './components/fz-form';
import FuzhenSidebar from './components/fz-sidebar'
import Page from '../../render/page';
import PrintTable from './components/print-table';
import service from '../../service';
import * as common from '../../utils/common';
import * as baseData from './data';
import editors from '../shouzhen/editors';
import * as util from './util'; 
import store from '../store';
import { isFormChangeAction, openYCQAction, getUserDocAction, fzListAction, getIdAction, getWhichAction,
         getYCQAction, 
      } from '../store/actionCreators.js';

import "../index.less";
import "./index.less";

function modal(type, title) {
  message[type](title, 3)
}

export default class FuZhen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      info: {},
      recentRvisit: null,
      recentRvisitAll: null,
      recentRvisitShow: false,
      pageCurrent: 1,
      totalRow: 0,
      isShowMoreBtn: false,
      initData: { ...baseData.formEntity },
      pureInitDate: null,
      hasRecord: false,
      isTwins: false,
      isChangeYCQ: false,
      printData: null,
      hasPrint: false,
      relatedObj: {},
      ...store.getState(),
    };
    store.subscribe(this.handleStoreChange);
    this.componentWillUnmount = editors();
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    const { initData } = this.state;

    Promise.all([
      service.getuserDoc().then(res => {
        let param = {"ckweek": res.object.tuserweek, "checkdate": util.futureDate(0)};
        this.setState({ info: res.object });
        service.fuzhen.getRvisitPhysicalExam().then(res => {
          param.ckdiastolicpressure = res.object.diastolic ? res.object.diastolic : '';
          param.ckshrinkpressure = res.object.systolic ? res.object.systolic : '';
          param.cktizh = res.object.weight;
          this.setState({ initData: {...initData, ...param}, pureInitDate: {...initData, ...param} }, () => {
            this.getRecentList();
          });
        });
      }),
    ]).then(() => this.setState({ loading: false }));
  }

  getRecentList() {
    const { initData } = this.state;
    service.fuzhen.getRecentRvisit().then(res => {
      res.object = res.object || [];
      let bool = false;
      res.object && res.object.map(item => {
        if(item.checkdate === util.futureDate(0)) {
          bool = true;
          if (!item.medicationPlan) item.medicationPlan = [{}];
          if (!item.fetalCondition) item.fetalCondition = [{}, {}];
          if (!item.fetalUltrasound) item.fetalUltrasound = [{}, {}];
          this.setState({
            hasRecord: true, 
            initData: service.praseJSON(item)
          })
          if (item.singleflag === '1') {
            this.setState({ isTwins: false })
          }
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

  onChangeInfo(info) {
    this.setState({ info: info }, () => service.fuzhen.fireWatch(info));
  }

  handleChange(e, data) {
    const { initData, recentRvisit } = this.state;
    if (data.hasOwnProperty('singleflag') && data.singleflag === '1') {
      this.setState({ isTwins: false });
    } else if (data.hasOwnProperty('singleflag') && !data.singleflag) {
      this.setState({ isTwins: true });
    }
    let newInitData = initData;
    let newRecentRvisit = recentRvisit;
    newInitData = {...newInitData, ...data} 
    newRecentRvisit.pop();
    newRecentRvisit.push(newInitData)
    this.setState({initData: newInitData, recentRvisit: newRecentRvisit})
  }

  renderTable() {
    const { recentRvisit=[], recentRvisitAll=[], recentRvisitShow, pageCurrent, totalRow, isShowMoreBtn, 
            hasRecord, isTwins, printData, userDoc, hasPrint, loading, initData, pureInitDate } = this.state;
    const handleMoreBtn = () => {
      service.fuzhen.getRvisitPage(10, pageCurrent).then(res => this.setState({
        recentRvisitAll: res.object.list,
        totalRow: res.object.totalRow
      })).then(() => {
        this.setState({ recentRvisitShow: true })
      });
    }

    const handleAddRecord = () => {
      if (recentRvisit.length < 3) {
        recentRvisit.push(pureInitDate);
        this.setState({
          initData: pureInitDate,
          recentRvisit
        })
      }
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
      if(!isTwins) {
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
      let hasTz = false;
      let hasAvf = false;
      let hasQxl = false;
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
        if(isTwins) {
          item.allTaix = "";
          item.allXianl = "";
          if(item.fetalCondition) {
            item.fetalCondition.map(subItem => {
              let locLabel = subItem.location ? `${subItem.location.label}:` : '';
              if(subItem.taix) {
                item.allTaix += `${locLabel}${subItem.taix}；`;
              }
              if(subItem.xianl) {
                item.allXianl += `${locLabel}${subItem.xianl.label}；`;
              }
            })
          } 
        } else {
          item.allTaix = item.cktaix;
          item.allXianl = item.ckxianl;
        }

        // 胎儿超声数据处理
        if(item.fetalUltrasound) {
          item.allTetz = "";
          item.allTeafv = "";
          item.allTeqxl = "";
          item.fetalUltrasound.map((subItem, index) => {
            if(subItem.tetz) {
              hasTz = true;
              item.allTetz += subItem.tetz + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
            } 
            if(subItem.teafv) {
              hasAvf = true;
              item.allTeafv += subItem.teafv + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
            } 
            if(subItem.teqxl) {
              hasQxl = true;
              item.allTeqxl += subItem.teqxl + ((index === item.fetalUltrasound.length - 1) ? '' : '/');
            } 
          })
        }

        // 胰岛素方案数据处理
        if(item.riMo && item.riMo[0] && item.riMo[1]) {
          hasRiMo = true;
          let firstParam = typeof item.riMo[0] === 'object' ? item.riMo[0].label : item.riMo[0];
          item.allRiMo = firstParam + ':' + item.riMo[1] + 'U';
        }
        if(item.riNo && item.riNo[0] && item.riNo[1]) {
          hasRiNo = true;
          let firstParam = typeof item.riNo[0] === 'object' ? item.riNo[0].label : item.riNo[0];
          item.allRiNo = firstParam + ':' + item.riNo[1] + 'U';
        }
        if(item.riEv && item.riEv[0] && item.riEv[1]) {
          hasRiEv = true;
          let firstParam = typeof item.riEv[0] === 'object' ? item.riEv[0].label : item.riEv[0];
          item.allRiEv = firstParam + ':' + item.riEv[1] + 'U';
        }
        if(item.riSl && item.riSl[0] && item.riSl[1]) {
          hasRiSl = true;
          let firstParam = typeof item.riSl[0] === 'object' ? item.riSl[0].label : item.riSl[0];
          item.allRiSl = firstParam + ':' + item.riSl[1] + 'U';
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

      if(fpgCount === obj.length) keys[getIndex(keys, '空腹血糖')].className = 'isHide';
      if(pbg2hCount === obj.length) keys[getIndex(keys, '餐后2H')].className = 'isHide';
      if(hbAlcCount === obj.length) keys[getIndex(keys, 'HbAlc')].className = 'isHide';
      if(upStateCount === obj.length && upDosage24hCount === obj.length) {
        keys[getIndex(keys, '定性')].className = 'isHide';
        keys[getIndex(keys, '定量')].className = 'isHide';
      }
      if(heartRateCount === obj.length) keys[getIndex(keys, '心率')].className = 'isHide';
      // if(examinationCount === obj.length) keys[getIndex(keys, '检验检查')].className = 'isHide';
      if(!hasTz) {
        keys[getIndex(keys, '胎儿体重')].className = 'isHide';
      } 
      if(!hasAvf) {
        keys[getIndex(keys, 'AVF')].className = 'isHide';
      } 
      if(!hasQxl) {
        keys[getIndex(keys, '脐血流')].className = 'isHide';
      } 
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
        {recentRvisit && initTable(recentRvisit, { width: 1200, size: "small", pagination: false, editable: true, className: "fuzhenTable",
          onEdit: true, hasRecord: hasRecord, isTwins: isTwins, tableLayout: "fixed", scroll: { x: 1200, y: 300 },
          iseditable: ({ row }) => hasRecord ? row === recentRvisit.length - 1 : row > recentRvisit.length - 2, onRowChange: handleSaveChange
        })}
        {loading ? <div style={{ height: '4em', textAlign: 'center' }}><Spin />&nbsp;...</div> : null}
        <Modal title="产检记录" footer={null} visible={recentRvisitShow} width="100%" maskClosable={true} onCancel={() => this.setState({ recentRvisitShow: false })}>
          <div className="table-content">
            {recentRvisitAll && allInitTable(recentRvisitAll, { className: "fuzhenTable", scroll: { x: 1100 }, editable: true,
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
          {
            hasRecord 
            ? <Button size="small" type="dashed" className="margin-TB-mid margin-R-1 pull-right" onClick={handleAddRecord}>新增产检记录</Button>
            : null
          }
        </div>
        {this.renderYCQ()} 
      </div>
    );
  }

  /**
   * 孕产期
   */
  renderYCQ(){
    const { openYCQ, initData, recentRvisit, ycqEntity, isChangeYCQ, userDoc } = this.state;
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
      // if(name !== 'ckztingj') this.setState({ isChangeYCQ: true });
      let newYcqEntity = {...ycqEntity, ...data};
      if (name === 'ckzdate' || name === 'ckzweek') {
        service.fuzhen.autoGesweekForm(newYcqEntity).then(res => {
          const getAction = getYCQAction(res.object);
          store.dispatch(getAction);
        })
      } else {
        const getAction = getYCQAction(newYcqEntity);
        store.dispatch(getAction);
      }
    }
    const handelClick = (e, isOk) => {
      const action = openYCQAction(false);
      store.dispatch(action);
      if(isOk){
        if(userDoc.gesexpectrv !== ycqEntity.gesexpectrv) {
          const dateTip = ycqEntity.ckzdate ? `B超时间:${ycqEntity.ckzdate}；` : '';
          const tingjTip = ycqEntity.ckztingj ? `停经${ycqEntity.ckztingj}周；` : '';
          const weekTip = ycqEntity.ckzweek ? `如孕${ycqEntity.ckzweek}周；` : '';
          const trvTip = ycqEntity.gesexpectrv ? `修订预产期为${ycqEntity.gesexpectrv}；` : '';
          initData.ckweek = util.getWeek(40, util.countWeek(ycqEntity.gesexpectrv, initData.checkdate));
          initData.updateExpectFlag = '1';
          initData.treatment += dateTip + tingjTip + weekTip + trvTip;

          recentRvisit.pop();
          recentRvisit.push(initData);
          this.setState({initData, recentRvisit, isChangeYCQ: false});
        }
        service.fuzhen.saveGesweekForm(ycqEntity).then(res => {
          service.getuserDoc().then(res => {
            const action = getUserDocAction(res.object);
            store.dispatch(action);
          })
        });
      }
    }
    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
             width={800} closable visible={openYCQ} onCancel={e => handelClick(e, false)} onOk={e => handelClick(e, true)}>
        {ycqEntity && formRender(ycqEntity, ycqConfig(), handleYCQChange)}
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
        message.info('本次产检记录保存成功！', 5);
        const idAction = getIdAction(res.object);
        store.dispatch(idAction);
        const whichAction = getWhichAction('fz');
        store.dispatch(whichAction);
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

  setRelatedObj(obj) {
    this.setState({ relatedObj: obj });
  }

  render() {
    const { fzList, relatedObj, initData } = this.state;
    return (
      <Page className="fuzhen font-16 ant-col">
        <div className="bgDOM"></div>
        <div className="fuzhen-right ant-col-19 pad-mid">
          {this.renderTable()}
          <FuzhenForm 
            initData={initData} 
            diagList={fzList} 
            relatedObj={relatedObj}
            onSave={data => this.saveForm(data)} 
            onChange={this.handleChange.bind(this)} 
            onChangeInfo={this.onChangeInfo.bind(this)}
          />
          <p className="pad_ie">
            &nbsp;<span className="hide">ie8下拉框只能向下，这里是占位</span>
          </p>
        </div>
        <FuzhenSidebar 
          initData={initData} 
          getRelatedObj={this.setRelatedObj.bind(this)} 
        />
      </Page>
    );
  }
}