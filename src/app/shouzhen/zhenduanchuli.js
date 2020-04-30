import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tabs, Icon, Tree, Input, DatePicker } from 'antd';

import umodal from '../../utils/modal'
import formRender, {fireForm} from '../../render/form';
import formTable from '../../render/table';
import * as baseData0 from './../shouzhen/data';
import * as baseData from './../fuzhen/data';
import * as util from '../fuzhen/util';
import store from '../store';
import { getAlertAction, showTrialAction, showPharAction, checkedKeysAction, getDiagnisisAction, getUserDocAction,
         showSypAction, szListAction, isFormChangeAction
      } from '../store/actionCreators.js';
import RegForm from '../components/reg-form';
import cModal from '../../render/modal';
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
      diagnosislist: null,
      isShowZhenduan: false,
      isMouseIn: false,
      isShowSetModal: false,
      adviceList: [],
      openAdvice: false,
      openMenzhen: false,
      menzhenData: new Date(),
      treatTemp: [],
      treatKey1: [],
      treatKey2: [],
      isShowRegForm: false,
      isShowHighModal: false,
      appointmentNum: 0,
      addNum: 0,
      totalNum: 0,
      openTemplate: false,
      ...store.getState(),
      signList: [
        { 'word': ['大三阳'], 'without': [], 'diag': '乙肝大三阳' },
        { 'word': ['小三阳'], 'without': [], 'diag': '乙肝小三阳' },
        { 'word': ['梅毒'], 'without': [], 'diag': '梅毒' },
        { 'word': ['HIV', '艾滋'], 'without': [], 'diag': 'HIV' },
        { 'word': ['乙肝', '乙型肝炎'], 'without': ['大三阳', '小三阳'], 'diag': '乙肝表面抗原携带者' },
      ],
    };
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount(){
    const { isMeetPhar, szList, userDoc, trialVisible } = this.state;
    if(isMeetPhar) {
      const action = showPharAction(true);
      store.dispatch(action);
    }

    szList && szList.forEach(item => {
      if((item.data === '瘢痕子宫' || item.data === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32 && !trialVisible) {
        const action = showTrialAction(true);
        store.dispatch(action);
      }
    })

    service.shouzhen.getAdviceTreeList().then(res => {
      res.object.length > 1 && this.setState({adviceList: res.object, openAdvice: true})
    });

    window.addEventListener('keyup', e => {
      if (e.keyCode === 13 || e.keyCode === 108) this.onKeyUp();
    })
  }

  onKeyUp() {
    const { diagnosi, isShowZhenduan } = this.state;
    if (!!diagnosi && isShowZhenduan) this.adddiagnosis();
  }

  topConfig() {
    return {
      rows: [
        {
          className: 'top-column',
          columns: [
            { name: 'yunc[1、G]', className: 'short-yunc', type: 'input', span: 3, valid: 'pureNumber' },
            { name: 'chanc[P]', className: 'short-chanc', type: 'input', span: 3, valid: 'pureNumber' },
            { name: 'add_FIELD_tuserweek[妊娠](周)', className: 'short-week', type: 'input', span: 3 },
          ]
        },
      ]
    }
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: "diagnosisHandle[处理措施]", type: "textarea", span: 10, className: "table-wrapper" },
            { name: "treatment[模板]", type: "buttons", span: 14,
              text: "(green)[糖尿病日间门诊],(#1890ff)[更多]",
              onClick: this.handleTreatmentClick.bind(this)
            }
          ]
        },
        {
          columns: [
            { name: 'xiacsftype[下次复诊]', type:'select', placeholder: '门诊类型', showSearch:true, options: baseData.rvisitOsTypeOptions, span: 5 },
            { name: 'nextRvisitWeek', type:'select', placeholder: '选择几周后/几天后', showSearch:true, options: baseData.nextRvisitWeekOptions, span: 3 },
            { name: 'xiacsfdate', type:'date', placeholder: '日期', valid: 'required', span: 4 },
            { name: 'xiacsfdatearea', type:'select', placeholder: '选择上午/下午', showSearch:true, options: baseData.ckappointmentAreaOptions, span: 3 },
          ]
        },
        {
          columns: [
            { name: 'add_FIELD_first_save_ivisit_time[初诊日期]', type:'date', span: 4 },
            { name: 'add_FIELD_first_clinical_doctor[初诊医生]', type:'input', span: 4 },
          ]
        }
      ]
    };
  }

  adddiagnosis() {
    const { szList, diagnosi, userDoc, signList } = this.state;
    const specialList = ['妊娠', '早孕', '中孕', '晚孕'];
    if (diagnosi && !szList.filter(i => i.data === diagnosi).length) {
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      // 诊断互斥项
      let specialIndex = -1;
      let diagData = { 'data': diagnosi, 'highriskmark': ''};
      szList.forEach((item, index) => {
        if (specialList.includes(item.data)) {
          specialIndex = index;
        }
      })
      if (specialIndex !== -1 && specialList.includes(diagnosi)) {
        szList.splice(specialIndex, 1);
        szList.unshift(diagData);
      } else if (specialIndex === -1 && specialList.includes(diagnosi)) {
        szList.unshift(diagData);
      } else {
        szList.push(diagData);
      }
      const action = szListAction(szList);
      store.dispatch(action);
      modal('success', '添加诊断信息成功');

      if ((diagnosi === '瘢痕子宫' || diagnosi === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32) {
        const action = showTrialAction(true);
        store.dispatch(action);
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

      // service.fuzhen.adddiagnosis(diagnosi).then(() => {
      //   modal('success', '添加诊断信息成功');
      //   if ((diagnosi === '瘢痕子宫' || diagnosi === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32) {
      //     const action = showTrialAction(true);
      //     store.dispatch(action);
      //   }
      //   if (diagnosi.indexOf("梅毒") !== -1) {
      //     if (!userDoc.infectious || (userDoc.infectious && userDoc.infectious.indexOf("梅毒") === -1)) {
      //       let arr = userDoc.infectious ? userDoc.infectious.split(',') : [];
      //       arr.push('梅毒');
      //       userDoc.infectious = arr.join();
      //       service.savehighriskform(userDoc).then(res => {
      //         service.getuserDoc().then(res => {
      //           const action = getUserDocAction(res.object);
      //           store.dispatch(action);
      //         })
      //       });
      //     }
      //     const action = showSypAction(true);
      //     store.dispatch(action);
      //   }
      //   service.fuzhen.checkHighriskAlert(diagnosi).then(res => {
      //     let data = res.object;
      //     if(data.length > 0) {
      //       data.map(item => ( item.visible = true ))
      //     }
      //     const action = getAlertAction(data);
      //     store.dispatch(action);
      //   })
      //   service.fuzhen.getdiagnosis().then(res => {
      //     const action = getDiagnisisAction(res.object.list);
      //     store.dispatch(action);
      //     this.setState({
      //       diagnosi: ''
      //   }, () => {
      //     if(diagnosi.indexOf("血栓") !== -1 || diagnosi.indexOf("静脉曲张") !== -1 || diagnosi === "妊娠子痫前期" || diagnosi === "多胎妊娠") {
      //       this.updateCheckedKeys();
      //       const action = showPharAction(true);
      //       store.dispatch(action);
      //     }
      //   })});
      //   service.getuserDoc().then(res => {
      //     const action = getUserDocAction(res.object);
      //     store.dispatch(action);
      //   })
      // })


    } else if (diagnosi) {
      modal('warning', '添加数据重复');
    }
  }

  deldiagnosis(id, diagnosi) {
    const { userDoc, szList, signList } = this.state;
    const newList = szList.filter(i => i.data !== diagnosi);
    const changeAction = isFormChangeAction(true);
    store.dispatch(changeAction);
    const action = szListAction(newList);
    store.dispatch(action);
    modal('info', '删除诊断信息成功');
    this.updateCheckedKeys(diagnosi);

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


    // service.fuzhen.deldiagnosis(id).then(() => {
    //   modal('info', '删除诊断信息成功');
    //   service.fuzhen.getdiagnosis().then(res => {
    //     const action = getDiagnisisAction(res.object.list);
    //     store.dispatch(action);
    //     this.updateCheckedKeys(data);

    //     let hasSyp = false;
    //     res.object.list && res.object.list.forEach(item => {
    //       if (item.data.indexOf('梅毒') !== -1) hasSyp = true;
    //     })

    //     if (!hasSyp && userDoc.infectious && userDoc.infectious.indexOf('梅毒') !== -1) {
    //       let arr = userDoc.infectious.split(',');
    //       arr.splice(arr.indexOf('梅毒'), 1);
    //       userDoc.infectious = arr.join();
    //       service.savehighriskform(userDoc).then(res => {
    //         service.getuserDoc().then(res => {
    //           const action = getUserDocAction(res.object);
    //           store.dispatch(action);
    //         })
    //       });
    //     } else {
    //       service.getuserDoc().then(res => {
    //         const action = getUserDocAction(res.object);
    //         store.dispatch(action);
    //       })
    //     }
    //   })
    // })

  }

  updateCheckedKeys(data) {
    const { checkedKeys, szList, templateTree1 } = this.state;
    let newCheckedKeys = checkedKeys;

    const getKey = (val) => {
      let ID = '';
      templateTree1&&templateTree1.map(item => {
        if(item.name === val) ID = item.id;
      })
      return ID.toString();
    }

    szList.map(item => {
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

  addTreatment(e, value){
    const { entity, onChange } = this.props;
    entity.diagnosisHandle = entity.diagnosisHandle || '';
    if (entity.diagnosisHandle.indexOf(value) === -1) {
      onChange(e, {
        name: 'diagnosisHandle',
        value: entity.diagnosisHandle + value + '； '
      })
    }
  }

  getTreatTemp() {
    service.fuzhen.treatTemp().then(res => this.setState({ 
      treatTemp: res.object,
      openTemplate: true
    }));
  }

  handleTreatmentClick(e, {text,index},resolve){
    if (text==='糖尿病日间门诊') {
      this.setState({openMenzhen: true});
    } else if (text==='产前诊断') {
      // this.setState({openMenzhen: true});
    } else if (text==='入院') {
      this.setState({isShowRegForm: true})
    } else if (text==='更多') {
      this.getTreatTemp();
    }
    if (text!=='更多') this.addTreatment(e, text);
  }

  renderZD(){
    const { info = {} } = this.props;
    const { diagnosi, szList, diagnosislist, isMouseIn, isShowZhenduan, } = this.state;
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
        item.highriskmark = item.highriskmark === 1 ? 0 : 1;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = szListAction(szList);
        store.dispatch(action);

        // let highriskmark = item.highriskmark == 1 ? 0 : 1;
        // service.fuzhen.updateHighriskmark(item.id, highriskmark).then(() => {
        //   service.fuzhen.getdiagnosis().then(res => {
        //     const action = getDiagnisisAction(res.object.list);
        //     store.dispatch(action);
        //   })
        // })

      }

      const handleVisibleChange = fx => () => {
        szList[i] = szList[i + fx];
        szList[i + fx] = item;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = szListAction(szList);
        store.dispatch(action);
        // service.fuzhen.updateSort(item.id, fx).then(() => {
        //   service.fuzhen.getdiagnosis().then(res => {
        //     const action = getDiagnisisAction(res.object.list);
        //     store.dispatch(action);
        //   })
        // })
      }
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(-1)}>上 移</a></p> : null}
          {i + 1 < szList.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(1)}>下 移</a></p> : null}
        </div>
      );
    }

    // 诊断备注输入
    const setRemark = (v, i) => {
      szList[i].remark = v;
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      const action = szListAction(szList);
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
      <div className="shouzhen-left-zd">
        <div className="shouzhen-left-top pad-LR-mid">
          {szList && szList.map((item, i) => (
            <Row key={`diagnos-${item.data}-${i}`}>
              <Col span={6}>
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                  <div title={item.data}>
                    <span className="zd-num">{i + 2}、</span>
                    <span className={item.highriskmark==1 ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                  </div>
                </Popover>
                <input className="remark-ipt" placeholder="备注" value={item.remark} onChange={e => setRemark(e.target.value, i)} />
              </Col>
              <Col span={2}>{item.createdate}</Col>
              <Col span={2}>{item.doctor||info.doctor}</Col>
              <Col span={2}>
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
          <Col span={7} className="shouzhen-pop">
            <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value, true)}
                 onFocus={() => handleIptFocus()}
                 onBlur={() => setTimeout(() => this.setState({isShowZhenduan: false}), 200)}
                 />
            { (isShowZhenduan || isMouseIn) && diagnosislist ?
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
            </div>  : null}
            {renderSetModal()}
          </Col>
          <Col span={5}>
            <Button className="shouzhen-left-button" style={{marginLeft: '0.5em'}} type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
          </Col>
        </Row>
      </div>
    )
  }

  openLisi() {
    service.shouzhen.getIvisitLog().then(res => {
      if(res.object.length > 0) {
        res.object.forEach(item => {
          item.operateField = "";
          item.itemList.forEach(subItem => {
            item.operateField += subItem.columnDisplay + "；";
          })
        })
      }
      umodal({
        title: '历史首检记录',
        content: formTable(baseData0.lisiColumns, res.object, {editable:false,buttons:null, pagination: false,}),
        width: '80%'
      })
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
        service.shouzhen.makeAppointment(20, menzhenData).then(res => console.log(res))
      };
    }
    const panelChange = (date, dateString) => {
      this.setState({menzhenData: dateString})
    }
    const timeSelect = v => {
      this.setState({
        menzhenData: util.getOrderTime(v)
      })
    }

    return (
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
              visible={openMenzhen} onOk={() => handelShow(true)} onCancel={() => handelShow(false)} >
        <span>糖尿病门诊预约</span>
        <Select onSelect={(value) => timeSelect(value)} defaultValue={"本周五"} style={{ width: 120 }}>
          <Select.Option value={"本周五"}>本周五</Select.Option>
          <Select.Option value={"下周五"}>下周五</Select.Option>
          <Select.Option value={"下下周五"}>下下周五</Select.Option>
        </Select>
        <DatePicker value={menzhenData} onChange={(date, dateString) => panelChange(date, dateString)}/>
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
      if (items.length > 0) {
        this.addTreatment(e, items.map(i => i.name).join('\n'));
      }
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
              visible={openAdvice} maskClosable={false} onOk={e=> handelShow(e, adviceList.filter(i => i.checked && i.pid!==0))} onCancel={e => handelShow(e)} >
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
      <Modal title="处理模板" closable visible={openTemplate} width={900} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked && i.pid!==0))}>
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

    /**
   * 高危门诊弹窗
   */
  renderHighModal = () => {
    const { isShowHighModal, appointmentNum, addNum, totalNum } = this.state;
    const { onChange } = this.props;
    const content = () => {
      return (
        <div className="high-modal">
          <p className="high-info">该日期高危门诊已约满，是否给孕妇加号</p>
          <p className="high-msg">
            <span>已约：<i>{appointmentNum}</i></span>
            <span>已加号：<i>{addNum}</i></span>
            <span>限号：{totalNum}</span>
          </p>
        </div>
      )
    };
    const onCancel = () => {
      this.setState({ isShowHighModal: false });
    }
    const onOK = (e) => {
      onChange(e, { name: 'nextRvisitWeek', value: '' });
      onChange(e, { name: 'xiacsfdate', value: '' });
      this.setState({ isShowHighModal: false });
    }
    const buttons = [
      <Button onClick={e => onOK(e)}>修改日期</Button>,
      <Button type="primary" onClick={() => onCancel()}>加号</Button>
    ]
    cModal({
      visible: isShowHighModal, 
      content: content, 
      onCancel: onCancel,
      footer: buttons,
      closable: false
    })
  }

  checkAddNum(e, select, value) {
    const { entity, onChange } = this.props;
    let type = null;
    let date = '';
    let noon = null;

    const getType = (theType) => {
      if (!!theType && theType.label) {
        if (theType.label === '高危门诊') type = 1;
        if (theType.label === '普通门诊' || theType.label === '教授门诊') type = 2;
      }
    }
    const getDate = (theDate) => {
      if (!!theDate) {
        date = theDate;
      } 
    }
    const getNoon = (theNoon) => {
      if (!!theNoon && theNoon.label) {
        if (theNoon.label === '上午') noon = 1;
        if (theNoon.label === '下午') noon = 2;
      }
    }

    if (select === 1) {
      getType(value);
      getDate(entity.xiacsfdate);
      getNoon(entity.xiacsfdatearea);
    }
    if (select === 2) {
      getType(entity.xiacsftype);
      getDate(value);
      getNoon(entity.xiacsfdatearea);
    }
    if (select === 3) {
      getType(entity.xiacsftype);
      getDate(entity.xiacsfdate);
      getNoon(value);
    }
    
    if (!!type && !!date && !!noon) {
      if (type === 1) {
        service.fuzhen.checkIsAddNum(date, noon).then(res => {
          if (res.object.isScheduling) {
            if (res.object.appointmentNum === res.object.totalNum) {
              this.setState({ 
                isShowHighModal: true,
                appointmentNum: res.object.appointmentNum,
                addNum: res.object.addNum,
                totalNum: res.object.totalNum,
              })
            }
          } else {
            service.fuzhen.checkImpact(date, noon, type).then(res => {
              onChange(e, { name: 'nextRvisitWeek', value: '' });
              onChange(e, { name: 'xiacsfdate', value: res.object });
              message.error('该日期已设停诊，已延后选择最近日期！', 5);
            })
          }
        })
      } else if (type === 2) {
        service.fuzhen.checkImpact(date, noon, type).then(res => {
          if (date !== res.object) {
            onChange(e, { name: 'nextRvisitWeek', value: '' });
            onChange(e, { name: 'xiacsfdate', value: res.object });
            message.error('该日期已设停诊，已延后选择最近日期！', 5);
          }
        })
      }
    }
  }

  handleChange(e, { name, value, target }){
    const { onChange } = this.props;
    onChange(e, { name, value, target });
    switch (name) {
      case 'xiacsftype':
        if (value.label === '高危门诊') {
          onChange(e, { name: 'xiacsfdatearea', value: {"0":"上","1":"午","label":"上午","describe":"上","value":'上午'} });
        }
        this.checkAddNum(e, 1, value);
        break;
      case 'nextRvisitWeek':
        if (value && value.value) {
          onChange(e, { name: 'xiacsfdate', value: util.futureDate(value.value) });
          this.checkAddNum(e, 2, util.futureDate(value.value));
        }
        break; 
      case 'xiacsfdate':
        onChange(e, { name: 'nextRvisitWeek', value: '' });
        this.checkAddNum(e, 2, value);
        break; 
      case 'xiacsfdatearea':
        this.checkAddNum(e, 3, value);
        break;
      default:
        break;
    }
  }

  closeRegForm = () => {
    this.setState({isShowRegForm: false})
  }

  render(){
    const { isShowRegForm, openTemplate } = this.state;
    const { entity } = this.props;
    return (
      <div className="zhen-duan">
        {formRender(entity, this.topConfig(), this.handleChange.bind(this))}
        {this.renderZD()}
        {formRender(entity, this.config(), this.handleChange.bind(this))}
        <Button onClick={() =>this.openLisi()}>首检信息历史修改记录</Button>
        {openTemplate && this.renderTreatment()}
        {this.renderMenZhen()}
        {this.renderAdviceModal()}
        {this.renderHighModal()}
        {/* {isShowRegForm && <RegForm isShowRegForm={isShowRegForm} closeRegForm={this.closeRegForm} getDateHos={this.handleChange.bind(this)}/>} */}
      </div>
    )
  }
}
