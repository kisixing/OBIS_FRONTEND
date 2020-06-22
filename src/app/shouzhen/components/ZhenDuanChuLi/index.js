import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tabs, Icon, Tree, Input, DatePicker } from 'antd';
import umodal from '../../../../utils/modal'
import formRender, {fireForm} from '../../../../render/form';
import formTable from '../../../../render/table';
import * as baseData0 from '../../data';
import * as baseData from '../../../fuzhen/data';
import * as util from '../../../fuzhen/util';
import store from '../../../store';
import { getAlertAction, showTrialAction, showPharAction, checkedKeysAction, getDiagnisisAction, getUserDocAction,
         showSypAction, szListAction, isFormChangeAction, showDiagSearchAction, setDiagAction,
      } from '../../../store/actionCreators.js';
import RegForm from '../../../components/reg-form';
import TemplateModal from '../../../components/template-modal';
import DiagSearch from '../../../components/diagnosis-search';
import DiabetesAppointment from '../../../components/diabetes-appointment';
import cModal from '../../../../render/modal';
import '../../index.less';
import service from '../../../../service';
import * as common from '../../../../utils/common';

function modal(type, title) {
  message[type](title, 3)
}

export default class extends Component{
  static Title = '诊断处理';
  constructor(props) {
    super(props);
    this.state = {
      entity: {},
      adviceList: [],
      openAdvice: false,
      openMenzhen: false,
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
    const { isMeetPhar, userDoc, trialVisible } = this.state;
    if(isMeetPhar) {
      const action = showPharAction(true);
      store.dispatch(action);
    }

    service.shouzhen.getList(1).then(res => {
      res.object && res.object.forEach(item => {
        if((item.data === '瘢痕子宫' || item.data === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32 && !trialVisible) {
          const action = showTrialAction(true);
          store.dispatch(action);
        }
      })
      const action = szListAction(res.object);
      store.dispatch(action);
    })

    service.shouzhen.getAdviceTreeList().then(res => {
      res.object.length > 1 && this.setState({adviceList: res.object, openAdvice: true})
    });

    window.addEventListener('keyup', e => {
      if (e.keyCode === 13 || e.keyCode === 108) this.onKeyUp();
    })
  }

  onKeyUp() {
    const { diagnosis, isShowDiagSearch } = this.state;
    if (!!diagnosis && isShowDiagSearch) this.adddiagnosis();
  }

  topConfig() {
    return {
      rows: [
        {
          className: 'top-column',
          columns: [
            { name: 'yunc[1、G]', className: 'hide-icon short-yunc', type: 'input', span: 3, valid: 'pureNumber' },
            { name: 'chanc[P]', className: 'hide-icon short-chanc', type: 'input', span: 3, valid: 'pureNumber' },
            { name: 'add_FIELD_tuserweek[妊娠](周)', className: 'hide-icon short-week', type: 'input', span: 3 },
          ]
        },
      ]
    }
  }

  showAdd = (entity) => {
    const docArr = ['黄林环','彭田玉','周祎','刘斌','蒋伟莹','蔡坚','黄顺英','黄轩','梁润彩','杨建波','张颖','方群','王冬昱','罗艳敏','王子莲'];
    if (
        (entity.xiacsftype && entity.xiacsftype.label && entity.xiacsftype.label === '教授门诊') &&
        (entity.xiacsfdate && entity.xiacsfdatearea && entity.xiacsfdatearea.value) &&
        docArr.includes(common.getCookie('docName'))
      ) {
        return true;
    }
    return false;
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns: [
            { name: "diagnosisHandle[处理措施]", type: "textarea", span: 24, className: "table-wrapper" },
          ]
        },
        {
          columns: [
            { 
              name: "treatment[模板]", type: "buttons", span: 14, text: "(green)[糖尿病日间门诊],(#1890ff)[更多]",
              onClick: this.handleTreatmentClick.bind(this)
            }
          ]
        },
        {
          columns: [
            { name: 'xiacsftype[下次复诊]', type:'select', placeholder: '门诊类型', showSearch:true, options: baseData.rvisitOsTypeOptions, span: 8},
            { name: 'nextRvisitWeek', type:'select', placeholder: '选择几周后/几天后', showSearch:true, options: baseData.nextRvisitWeekOptions, span: 5 },
            { name: 'xiacsfdate', type:'date', placeholder: '日期', valid: 'required', span: 5 },
            { name: 'xiacsfdatearea', type:'select', placeholder: '选择上午/下午', showSearch:true, options: baseData.ckappointmentAreaOptions, span: 3 },
            // { 
            //   name: 'addnum_iv_professor_outpatient', type: 'checkinput', span: 3, options: baseData.jhOptions,
            //   filter: entity => this.showAdd(entity) 
            // }
          ]
        },
        {
          columns: [
            { name: 'add_FIELD_first_save_ivisit_time[初诊日期]', type:'date', span: 9 },
            { span: 1 },
            { name: 'add_FIELD_first_clinical_doctor[初诊医生]', type:'input', span: 8 },
          ]
        }
      ]
    };
  }

  adddiagnosis() {
    const { szList, diagnosis, userDoc, signList } = this.state;
    const specialList = ['妊娠', '早孕', '中孕', '晚孕'];
    if (diagnosis && !szList.filter(i => i.data === diagnosis).length) {
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      // 诊断互斥项
      let specialIndex = -1;
      let diagData = { 'data': diagnosis, 'highriskmark': ''};
      szList.forEach((item, index) => {
        if (specialList.includes(item.data)) {
          specialIndex = index;
        }
      })
      if (specialIndex !== -1 && specialList.includes(diagnosis)) {
        szList.splice(specialIndex, 1);
        szList.unshift(diagData);
      } else if (specialIndex === -1 && specialList.includes(diagnosis)) {
        szList.unshift(diagData);
      } else {
        szList.push(diagData);
      }
      const action = szListAction(szList);
      store.dispatch(action);
      modal('success', '添加诊断信息成功');

      if ((diagnosis === '瘢痕子宫' || diagnosis === '疤痕子宫') && parseInt(userDoc.tuserweek) >= 32) {
        const action = showTrialAction(true);
        store.dispatch(action);
      }
      // 传染病标记
      let signDiag = '';
      signList.forEach(item => {
        let hasWord = false;
        let isSign = true;
        item.word.forEach(wordItem => {
          if (diagnosis.indexOf(wordItem) !== -1) hasWord = true;
        })
        if (hasWord) {
          item.without.forEach(withItem => {
            if (diagnosis.indexOf(withItem) !== -1) isSign = false;
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

      if(diagnosis.indexOf("血栓") !== -1 || diagnosis.indexOf("静脉曲张") !== -1 || diagnosis === "妊娠子痫前期" || diagnosis === "多胎妊娠") {
        this.updateCheckedKeys();
        const action = showPharAction(true);
        store.dispatch(action);
      }
      service.fuzhen.checkHighriskAlert(diagnosis).then(res => {
        let data = res.object;
        if(data.length > 0) {
          data.map(item => ( item.visible = true ))
        }
        const action = getAlertAction(data);
        store.dispatch(action);
      })

      const DiagAction = setDiagAction('');
      store.dispatch(DiagAction);
      const DSAction = showDiagSearchAction(false);
      store.dispatch(DSAction);
    } else if (diagnosis) {
      modal('warning', '添加数据重复');
    }
  }

  deldiagnosis(id, diagnosis) {
    const { userDoc, szList, signList } = this.state;
    const newList = szList.filter(i => i.data !== diagnosis);
    const changeAction = isFormChangeAction(true);
    store.dispatch(changeAction);
    const action = szListAction(newList);
    store.dispatch(action);
    modal('info', '删除诊断信息成功');
    this.updateCheckedKeys(diagnosis);

    // 删除传染病标记
    let signDiag = '';
    let signWord = [];
    let signDel = true;
    signList.forEach(item => {
      let hasWord = false;
      let isSign = true;
      item.word.forEach(wordItem => {
        if (diagnosis.indexOf(wordItem) !== -1) hasWord = true;
      })
      if (hasWord) {
        item.without.forEach(withItem => {
          if (diagnosis.indexOf(withItem) !== -1) isSign = false;
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

  handleTreatmentClick(e, {text,index},resolve){
    if (text==='糖尿病日间门诊') {
      this.setState({openMenzhen: true});
    } else if (text==='产前诊断') {
      // this.setState({openMenzhen: true});
    } else if (text==='入院') {
      this.setState({isShowRegForm: true})
    } else if (text==='更多') {
      this.setState({openTemplate: true})
    }
    if (text!=='更多') this.addTreatment(e, text);
  }

  renderZD(){
    const { info = {}, entity } = this.props;
    const { szList } = this.state;
    // const delConfirm = (item) => {
    //   Modal.confirm({
    //     title: '您是否确认要删除这项诊断',
    //     width: '300',
    //     style: { left: '30%', fontSize: '18px' },
    //     onOk: () => this.deldiagnosis(item.id, item.data)
    //   });
    // };

    const handleIptClick = () => {
      const action = showDiagSearchAction(true);
      store.dispatch(action);
    }

    // 诊断小弹窗操作
    const content = (item, i) => {
      const handleHighriskmark = () => {
        item.highriskmark = item.highriskmark == 1 ? 0 : 1;
        item.visible = false;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = szListAction(szList);
        store.dispatch(action);
      }

      const handleSortChange = fx => () => {
        item.visible = false;
        szList[i] = szList[i + fx];
        szList[i + fx] = item;
        const changeAction = isFormChangeAction(true);
        store.dispatch(changeAction);
        const action = szListAction(szList);
        store.dispatch(action);
      }
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {i ? <p className="pad-small"><a className="font-16" onClick={handleSortChange(-1)}>上 移</a></p> : null}
          {i + 1 < szList.length ? <p className="pad-small"><a className="font-16" onClick={handleSortChange(1)}>下 移</a></p> : null}
        </div>
      );
    }

    const handleVisibleChange = (visible, i) => {
      szList[i].visible = visible;
      const action = szListAction(szList);
      store.dispatch(action);
    }

    const title = item => {
      const data = {
        "诊断时间": item.createdate,
        "诊断全称": item.data,
        "诊断备注": item.remark,
        "诊断医生": item.doctor,
      }
      return JSON.stringify(data, null, 4)
    }


    // 诊断备注输入
    const setRemark = (v, i) => {
      szList[i].remark = v;
      const changeAction = isFormChangeAction(true);
      store.dispatch(changeAction);
      const action = szListAction(szList);
      store.dispatch(action);
    }

    return (
      <div className="shouzhen-left-zd">
        <Button className="zhen-duan-btn" icon="plus-circle-o" onClick={handleIptClick}>添加诊断</Button>
        {formRender(entity, this.topConfig(), this.handleChange.bind(this))}
        <div className="shouzhen-left-top">
          {szList && szList.map((item, i) => (
            <Row className="diag-row" key={`diagnos-${item.data}-${i}`} title={title(item)}>
              <Col span={16} className={item.highriskmark==1 ? 'highriskmark single-diag' : 'single-diag'}>
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)} visible={item.visible} onVisibleChange={(visible) => handleVisibleChange(visible, i)}>
                  <div className="diag-words" >
                    <span className="zd-num">{i + 2}、</span>
                    <span>{item.data}</span>
                  </div>
                </Popover>
                <input className="remark-ipt" placeholder="备注" value={item.remark} onChange={e => setRemark(e.target.value, i)} />
              </Col>
              <Col className="diag-date" span={4}>{item.createdate}</Col>
              <Col className="diag-doc" span={3}>{item.doctor||info.doctor}</Col>
              <Col span={1} style={{display: 'flex'}}>
                <Icon className="delBTN" type="cancel" onClick={() => this.deldiagnosis(item.id, item.data)}></Icon>
              </Col>
            </Row>
          ))}
        </div>
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
        if (value.label === '留观') {
          onChange(e, { name: 'xiacsfdate', value: util.futureDate(0) });
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
    this.setState({ isShowRegForm: false })
  }

  closeTemplateModal = (e, items) => {
    if (items.length > 0 ) {
      this.addTreatment(e, items.map(i => i.content).join('； '));
    }
    this.setState({ openTemplate: false });
  }

  closeMenzhen = () => {
    this.setState({ openMenzhen: false });
  }

  render(){
    const { isShowRegForm, openTemplate, isShowDiagSearch, openMenzhen } = this.state;
    const { entity } = this.props;
    return (
      <div className="zhen-duan">
        <Row>
          <Col span="10" className="zd-wrapper">
            {this.renderZD()}
          </Col>
          <Col span="1"></Col>
          <Col span="13" className="form-wrapper">
            {formRender(entity, this.config(), this.handleChange.bind(this))}
            <Button className="record-btn" icon="record" onClick={() =>this.openLisi()}>首检信息历史修改记录</Button>
          </Col>
        </Row>

        {/* {this.renderAdviceModal()} */}
        {this.renderHighModal()}
        {openTemplate && <TemplateModal openTemplate={openTemplate} closeTemplateModal={this.closeTemplateModal} />}
        {isShowDiagSearch && <DiagSearch addDiag={this.adddiagnosis.bind(this)} />}
        {openMenzhen && <DiabetesAppointment openMenzhen={openMenzhen} closeMenzhen={this.closeMenzhen} />}
        {/* {isShowRegForm && <RegForm isShowRegForm={isShowRegForm} closeRegForm={this.closeRegForm} getDateHos={this.handleChange.bind(this)}/>} */}
      </div>
    )
  }
}
