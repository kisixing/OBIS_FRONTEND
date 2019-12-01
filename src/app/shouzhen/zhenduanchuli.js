import React, { Component } from "react";
import { Select, Button, Popover, Modal, Col, Row, message, Tree } from 'antd';

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
      treatTemp: res
    }));
    service.shouzhen.getdiagnosis().then(res => this.setState({
      diagnosis: res.list
    }))

  }

  config(){
    return {
      step: 1,
      rows: [
        {
          columns:[
            { name: 'treatment[处理措施]', type: 'textarea', span: 8 },
            { name:'treatment[模板]', type: 'buttons',span: 16, text: '(green)[产检一套],(green)[B 超],(green)[早唐],(green)[胎监],(#1890ff)[更多]',onClick: this.handleTreatmentClick.bind(this)}
          ]
        },
        {
          columns:[
            { 
              name: 'nextRvisit[下次复诊]',span: 15, type: [
                'date',
                {type:'select', showSearch:true, options: baseData.nextRvisitWeekOptions},
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
        style: { left: '-300px', fontSize: '18px' },
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

    return (
      <div className="fuzhen-left-zd">
        <div>
          {diagnosis.map((item, i) => (
            <Row key={`diagnos-${item.id}-${Date.now()}`}>
              <Col span={8}>
                <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                  <div title={item.data}>
                    <span className="font-12">{i + 1}、</span>
                    <span className={item.highriskmark ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                  </div>
                </Popover>
              </Col>
              <Col span={6}>{item.createdate}</Col>
              <Col span={6}>{item.doctor||info.doctor}</Col>
              <Col span={4}>
                {diagnosis.length>1?<Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => delConfirm(item)} />:null}
              </Col>
            </Row>
          ))}
        </div>
        <br/>
        <Row className="fuzhen-left-input font-16">
          <Col span={1}><span className="font-12">{diagnosis.length + 1}、</span></Col>
          <Col span={18}>
            <Select combobox showSearch size="large" style={{ width: '100%' }} placeholder="请输入诊断信息" value={diagnosi} onChange={e => this.setState({ diagnosi: e })}>
              {baseData.diagnosis.filter(d=>d.top || diagnosi).map(o => <Select.Option key={`diagnosi-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
            </Select>
          </Col>
          <Col span={4}>
            <Button className="fuzhen-left-button margin-TB-mid" type="dashed" onClick={() => this.adddiagnosis()}>+ 添加诊断</Button>
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
