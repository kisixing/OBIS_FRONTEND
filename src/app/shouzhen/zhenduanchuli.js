import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tree, Input } from 'antd';

import modal from '../../utils/modal'
import formRender from '../../render/form';
import formTable from '../../render/table';
import * as baseData0 from './../shouzhen/data';
import * as baseData from './../fuzhen/data';

import service from '../../service';


export default class extends Component{
  static Title = '诊断处理';
  constructor(props) {
    super(props);
    this.state = {
      entity: {},
      diagnosi: '',
      diagnosis: [],
      treatTemp: [], 
      openTemplate: false
    };
  }

  componentDidMount(){
    service.fuzhen.treatTemp().then(res => this.setState({
      treatTemp: res.object
    }));
    service.shouzhen.getdiagnosis().then(res => this.setState({
      diagnosis: res.object.list
    }))

  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 8 },
            { name:'treatment[模板]', type: 'buttons',span: 16, text: '(green)[尿常规],(green)[B 超],(green)[胎监],(green)[糖尿病日间门诊],(green)[产前诊断],(green)[入院],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 15, type: [
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
                'date',
                {type:'select', showSearch:true, options: baseData.rvisitOsTypeOptions},
                {type:'select', showSearch:true, options: baseData.ckappointmentAreaOptions}
              ]
            }
          ]
        }
      ]
    };
  }

  adddiagnosis() {
    const { diagnosis, diagnosi } = this.state;
    if (diagnosi && !diagnosis.filter(i => i.data === diagnosi).length) {
      service.shouzhen.adddiagnosis(diagnosi).then(() => {
        message.success('添加诊断信息成功',3);
        // service.shouzhen.getdiagnosis().then(res => this.setState({
        //     diagnosis: res.list
        // }));
        // 使用mock时候才用这个
        this.setState({
          diagnosi: '',
          diagnosis: diagnosis.concat([{ data: diagnosi }])
        });
        // 使用mock时候才用这个

      })
    } else if (diagnosi) {
      message.warning('添加数据重复',3);
    }
  }

  deldiagnosis(id) {
    service.shouzhen.deldiagnosis(id).then(() => {

      message.info('删除诊断信息成功',3);
      // service.shouzhen.getdiagnosis().then(res => this.setState({
      //     diagnosis: res.list
      // }));

      // 使用mock时候才用这个
      const { diagnosis } = this.state;
      this.setState({
        diagnosis: diagnosis.filter(i => i.id !== id)
      });
      // 使用mock时候才用这个

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
    text==='更多'?this.setState({openTemplate:resolve}):this.addTreatment(e, text)
  }

  renderZD(){
    const {info} = this.props;
    const { diagnosi, diagnosis } = this.state;
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
        //高危
        item.highriskmark = !item.highriskmark;
        this.setState({ diagnosis: diagnosis });
      }

      const handleVisibleChange = fx => () => {
        diagnosis[i] = diagnosis[i + fx];
        diagnosis[i + fx] = item;
        this.setState({ diagnosis: diagnosis });
      }
      return (
        <div>
          <p className="pad-small"><a className="font-16" onClick={handleHighriskmark}>高危诊断</a></p>
          {i ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(-1)}>上 移</a></p> : null}
          {i + 1 < diagnosis.length ? <p className="pad-small"><a className="font-16" onClick={handleVisibleChange(1)}>下 移</a></p> : null}
        </div>
      );
    }
    let yunc = ''
    let chanc = ''
    let ycarray = info.tuseryunchan.split("/");
    if(ycarray.length>1){
      yunc = ycarray[0];
      chanc = ycarray[1];
    }
    return (
      <div className="fuzhen-left-zd">
        <div className="pad-LR-mid">
          <Row className="fuzhen-left-default margin-TB-mid">
            <Col span={8}>
              <span className="font-12">1、</span>
              <Input value={yunc}/>&nbsp;孕&nbsp;
              <Input value={chanc}/>&nbsp;胎
            </Col>
            <Col span={6}>
              宫内妊娠&nbsp;<Input value={info.tuserweek}/>&nbsp;周
            </Col>
            <Col span={6}>{info.doctor}</Col>
          </Row>
          {diagnosis.map((item, i) => (
            <Row key={`diagnos-${item.id}-${Date.now()}`}>
              <Col span={8}>
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                  <div title={item.data}>
                    <span className="font-12">{i + 2}、</span>
                    <span className={item.highriskmark ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
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
        <Row className="fuzhen-left-input font-16">
          <Col span={1} className="text-right" style={{width:'90px',paddingRight:'5px'}}>
            <span className="font-18">诊断:</span>
          </Col>
          <Col span={17}>
            <Select combobox showSearch size="large" style={{ width: '100%' }} placeholder="请输入诊断信息" value={diagnosi} onChange={e => this.setState({ diagnosi: e })}>
              {baseData.diagnosis.filter(d=>d.top || diagnosi).map(o => <Select.Option key={`diagnosi-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
            </Select>
          </Col>
          <Col span={5}>
            <Button className="fuzhen-left-button" style={{marginLeft: '0.5em'}} type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
          </Col>
        </Row>
        
      </div>
    )
  }

  openLisi(){
    modal({
      title: '历史首检记录',
      content: formTable(baseData0.lisiColumns,[{}],{editable:false,buttons:null, pagination: false,}),
      footer:''
    })
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

  render(){
    const { entity, onChange } = this.props;
    return (
      <div>
        {this.renderZD()}
        {formRender(entity, this.config(), onChange)}
        <Button onClick={() =>this.openLisi()}>首检信息历史修改记录</Button>
        {this.renderTreatment()}
      </div>
    )
  }
}
