import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tabs, Icon, Tree, Input, DatePicker } from 'antd';

import umodal from '../../utils/modal'
import formRender, {fireForm} from '../../render/form';
import formTable from '../../render/table';
import * as baseData0 from './../shouzhen/data';
import * as baseData from './../fuzhen/data';

import store from '../store';
import { getAlertAction, showTrialAction, showPharAction, showPharCardAction} from '../store/actionCreators.js';

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
      openYy: false,
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
      modalData: {},
      treatTemp: [],
      regFormEntity: {...baseData.regFormEntity},
      isShowRegForm: false,
      openTemplate: false,
      ...store.getState(),
      templateTree1: [],
      templateTree2: [],
      checkedKeys: [],
      allFormData: null,
      chanc: 0,
      yunc: 1
    };
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount(){

    service.fuzhen.treatTemp().then(res => this.setState({ treatTemp: res.object }));

    service.fuzhen.getdiagnosis().then(res => this.setState({ diagnosis: res.object.list }));

    service.fuzhen.getDiagnosisInputTemplate().then(res => this.setState({diagnosislist: res.object}));

    service.shouzhen.findTemplateTree(0).then(res => this.setState({templateTree1: res.object}));

    service.shouzhen.findTemplateTree(1).then(res => this.setState({templateTree2: res.object}));

    service.shouzhen.getAllForm().then(res => {
      this.setState({allFormData: res.object});
      this.setCheckedKeys(res.object);
    });

    this.getGPTimes();
  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 8 },
            { name:'treatment[模板]', type: 'buttons',span: 16, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            {
              name: 'nextRvisit[下次复诊]',span: 15, type: [
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions, onclick: this.showRegForm.bind(this)},
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
                'date',
                {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions}
              ]
            }
          ]
        }
      ]
    };
  }

  // 入院登记表单
  regFormConfig() {
    return {
      rows: [
        {
          columns: [
            { name: 'hzxm[患者姓名]', type: 'input', span: 6, disabled: true },
            { name: 'xb[性别]', type: 'input', span: 6, disabled: true  },
            { name: 'csrq[出生日期]', type: 'input', span: 6, disabled: true  },
            { name: 'lxdh[联系电话]', type: 'input', span: 6, disabled: true  }
          ]
        },
        {
          columns: [
            { name: 'zyks[住院科室]', type: 'select', valid: 'required', span: 6, options: baseData.zyksOptions },
            { name: 'rysq[入院日期]', type: 'date', valid: 'required', span: 6 },
          ]
        },
        {
          columns:[
            { name: 'tsbz[特殊备注]', type: 'textarea', span: 12, placeholder: "请输入备注" }
          ]
        },
        {
          columns:[
            { name: 'sfzwyzy[是否在我院住院]', type: 'checkinput', radio: true, span: 16, options: baseData.sfzyOptions }
          ]
        },
        {
          columns:[
            { name: 'gj[国籍]', type: 'input', span: 6 },
            { name: 'jg[籍贯]', type: 'input', span: 6 },
            { name: 'mz[民族]', type: 'input', span: 6 }
          ]
        },
        {
          columns:[
            { name: 'csd1[出生地]', type: 'select', span: 4, options: baseData.csd1Options },
            { name: 'csd2[]', type: 'select', span: 4, options: baseData.csd2Options },
            { name: 'hy[婚姻]', type: 'checkinput', radio: true, span: 12, options: baseData.hyOptions }
          ]
        },
        {
          columns:[
            { name: 'xzz[现住址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'yb1[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'xzz[身份证地址]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'yb2[邮编]', type: 'input', span: 6, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'sfzhm[身份证号码(ID)]', type: 'input', span: 12 },
            { name: 'ly[来源]', type: 'checkinput', radio: true, span: 12, options: baseData.lyOptions }
          ]
        },
        {
          columns:[
            { name: 'zy[职业]', type: 'checkinput', radio: true, span: 24, options: baseData.zyOptions }
          ]
        },
        {
          columns:[
            { name: 'gzdwjdz[工作单位及地址]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'dwyb[单位邮编]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'dwlxdh[单位联系电话]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'lxrxm[联系人姓名]', type: 'input', span: 12, placeholder: "请输入" },
            { name: 'lxrdh[联系人电话]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'lxrdz[联系人地址]', type: 'input', span: 12, placeholder: "请输入" }
          ]
        },
        {
          columns:[
            { name: 'gx[联系人与患者关系]', type: 'checkinput', radio: true, span: 24, options: baseData.gxOptions }
          ]
        }
      ]
    }
  }

  adddiagnosis() {
    const { diagnosis, diagnosi, allFormData } = this.state;
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
            this.setCheckedKeys(allFormData);
          }  
        }));
      })
    } else if (diagnosi) {
      modal('warning', '添加数据重复');
    }
  }

  deldiagnosis(id) {
    service.fuzhen.deldiagnosis(id).then(() => {
      modal('info', '删除诊断信息成功');
      service.fuzhen.getdiagnosis().then(res => this.setState({
          diagnosis: res.object.list
      }));
    })
  }

  addTreatment(e, value){
    const { entity, onChange } = this.props;
    onChange(e, {
      name: 'treatment',
      value: (entity.treatment||'') + (entity.treatment ? '\n' : '') + value
    })
  }

  handleTreatmentClick(e, {text,index},resolve){
    const { modalState, modalData } = this.state;
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text);
    if(text==='糖尿病日间门诊') {
      this.setState({modalData: modalState[0]}, () => {
        this.setState({openYy: true});
      })
    }else if (text==='产前诊断') {
      this.setState({modalData: modalState[1]}, () => {
        this.setState({openYy: true});
      })
    }
  }

  getGPTimes() {
    const {entity} = this.props;
    const allPreghiss = entity.gestation.preghiss;
    this.setState({yunc: allPreghiss.length + 1});
    let times = 0;
    allPreghiss&&allPreghiss.map(item => {
      if(item.zuych === true) {
        times++;
      } else if (item.zaoch !== "") {
        times++;
      }
    })
    this.setState({chanc: times});
  }

  renderZD(){
    const { info = {} } = this.props;
    const { diagnosi, diagnosis, diagnosislist, isMouseIn, isShowZhenduan, chanc, yunc } = this.state;
    const delConfirm = (item) => {
      Modal.confirm({
        title: '您是否确认要删除这项诊断',
        width: '300',
        style: { left: '30%', fontSize: '18px' },
        onOk: () => this.deldiagnosis(item.id)
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
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>{item.highriskmark == 1 ? '高危诊断 √' : '高危诊断'}</a></p>
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('up')}>上 移</a></p> : null}
          {i + 1 < diagnosis.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange('down')}>下 移</a></p> : null}
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
          {diagnosis&&diagnosis.map((item, i) => (
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
                <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => delConfirm(item)} />
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
                 onBlur={() => this.setState({isShowZhenduan: false})}
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
  renderModal() {
    const { openYy, modalData } = this.state;
    const handelShow = (isShow) => {
      this.setState({openYy: false});
      if(isShow) {
        console.log("预约成功!")
      };
    }

    return (openYy ?
      <Modal className="yuModal" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
              visible={openYy} onOk={() => handelShow(true)} onCancel={() => handelShow(false)} >
        <span>{modalData.title}: </span>
        <Select defaultValue={modalData.options[0]} style={{ width: 120 }}>
          {modalData.options.map((item) => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
        <DatePicker defaultValue={modalData.gesmoc} />
        {modalData.counts ? <p>（已约：{modalData.counts}）</p> : null}
      </Modal>
      : null
    );
  }

  setCheckedKeys(params) {
    const { checkedKeys, templateTree1, diagnosis } = this.state;
    const bmi = params.checkUp.ckbmi; 
    const age = params.gravidaInfo.userage; 
    const preghiss = params.gestation.preghiss.length;  
    const xiyan = JSON.parse(params.biography.add_FIELD_grxiyan);  

    const show = () => {
      const action = showPharAction(true);
      store.dispatch(action);
    }

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
    if(xiyan[0].label==="有") checkedKeys.push(getKey("吸烟"));

    diagnosis.map(item => {
      if(item.data.indexOf("血栓") !== -1) show();
      if(item.data.indexOf("静脉曲张") !== -1) checkedKeys.push(getKey("静脉曲张"));
      if(item.data === "妊娠子痫前期") checkedKeys.push(getKey("本次妊娠子痫前期"));
      if(item.data === "多胎妊娠") checkedKeys.push(getKey("多胎妊娠"));
    })
    if(checkedKeys.length>0) show();
  }

  /**
   * 孕期用药筛查表
   */
  renderPharModal() {
    const { checkedKeys, templateTree1, templateTree2, isShowPharModal } = this.state;
    let newTemplateTree1 = templateTree1;
    let newTemplateTree2 = templateTree2;
 
    const closeModal = (bool) => {
      const action = showPharAction(false);
      store.dispatch(action);
      if (bool) {
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
      <Modal title="深静脉血栓高危因素孕期用药筛查表" visible={isShowPharModal} width={800} className="phar-modal"
            onCancel={() => closeModal()} onOk={() => closeModal(true)}>
        <Row>
          <Col span={12}>
            <div className="title">高危因素</div>
            <Tree checkable defaultCheckedKeys={checkedKeys} onCheck={handleCheck1} style={{ maxHeight: '90%' }}>{treeNodes1}</Tree>
            <p>建议用药：克赛0.4ml 皮下注射qd</p>
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

  /**
   * 模板
   */
  renderTreatment() {
    const { treatTemp, openTemplate } = this.state;
    const closeDialog = (e, items = []) => {
      this.setState({ openTemplate: false }, ()=>openTemplate&&openTemplate());
      items.forEach(i => i.checked = false);
      this.addTreatment(e, items.map(i => i.content).join('\n'));
    }

    const initTree = (pid, level = 0) => treatTemp.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode key={node.id} title={node.content}>
        {level < 10 ? initTree(node.id, level + 1) : null}
      </Tree.TreeNode>
    ));

    const handleCheck = (keys, { checked }) => {
      treatTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1) {
          tt.checked = checked;
        }
      })
    };

    const treeNodes = initTree(0);

    return (
      <Modal title="处理模板" closable visible={openTemplate} width={800} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked))}>
        <Row>
          <Col span={12}>
            <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes.slice(0,treeNodes.length/2)}</Tree>
          </Col>
          <Col span={12}>
            <Tree checkable defaultExpandAll onCheck={handleCheck} style={{ maxHeight: '90%' }}>{treeNodes.slice(treeNodes.length/2)}</Tree>
          </Col>
        </Row>
      </Modal>
    )
  }

   // 入院登记表
   showRegForm() {
    const { regFormEntity, isShowRegForm } = this.state;
    const handleClick = (item) => { this.setState({isShowRegForm: false})};
    const handleChange = (e, { name, value, valid }) => {
      const data = {[name]: value};
      this.setState({
        regFormEntity: {...regFormEntity, ...data}
      })
    }
    const handleSave = (form) => {
      fireForm(form, 'valid').then((valid) => {
        if(valid) {
          // service.fuzhen.saveRvisitForm(regFormEntity).then(() => {
          //   this.setState({regFormEntity: {...baseData.regFormEntity}})
          // })
        }
      })
    }
    const printForm = () => {
      console.log('print')
    }

    return (isShowRegForm ?
      <Modal width="80%" title="入院登记表" footer={null} className="reg-form"
        visible={isShowRegForm} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
        {formRender(regFormEntity, this.regFormConfig(), handleChange)}
        <div style={{overflow: 'hidden'}}>
          <Button className="pull-right blue-btn" type="ghost" onClick={() => printForm()}>打印入院登记表</Button>
          <Button className="pull-right blue-btn margin-R-1" type="ghost" onClick={() => handleSave(document.querySelector('.reg-form'))}>保存</Button>
        </div>
      </Modal>
      : null
    )
  }

  handleChange(e, { name, value, target }){
    const { onChange } = this.props;
    switch (name) {
      case 'nextRvisit':
        value[0].label === '入院'  ? this.setState({isShowRegForm: true}) : null;
      break;
    }
    onChange(e, { name, value, target })
  }

  render(){
    const { entity, onChange } = this.props;
    return (
      <div>
        {this.renderZD()}
        {formRender(entity, this.config(), this.handleChange.bind(this))}
        <Button onClick={() =>this.openLisi()}>首检信息历史修改记录</Button>
        {this.renderTreatment()}
        {this.renderModal()}
        {this.showRegForm()}
        {this.renderPharModal()}
      </div>
    )
  }
}
