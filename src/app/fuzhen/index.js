import React, { Component } from "react";
import { Select, Button, Popover, Input, Tabs, Tree, Modal, Icon, Spin, Timeline, Collapse, message } from 'antd';

import tableRender from '../../render/table';
import FuzhenForm from './form';
import Page from '../../render/page';
import service from '../../service';
import * as baseData from './data';

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
      recentRvisit: null,
      recentRvisitAll: null,
      recentRvisitShow: false,
      isShowZhenduan: false,
      isMouseIn: false,
      isShowSetModal: false,
      isShowResultModal: false,
      isShowPlanModal: false,
      treatTemp: [],
      templateShow: false,
      collapseActiveKey: ['1', '2', '3'],
      jianyanReport: '血常规、尿常规、肝功、生化、甲功、乙肝、梅毒、艾滋、地贫',
      zhenliaoPlan: [
        {
          "date": "2周后",
          "week": "32孕周",
          "main": "B超"
        },
        {
          "date": "4周后",
          "week": "32孕周",
          "main": "超声"
        }
      ],
      keshi: [
        {
          "title": "并发",
          "data": ["妊娠期糖尿病1","妊娠期高血压","先兆早产","头大儿"]
        },
        {
          "title": "合并内分泌系统",
          "data": ["妊娠期糖尿病2","妊娠期高血压","先兆早产","头大儿"]
        },
        {
          "title": "合并心血管系统",
          "data": ["妊娠期糖尿病3","妊娠期高血压","先兆早产","头大儿"]
        },
        {
          "title": "合并呼吸系统",
          "data": ["妊娠期糖尿病4","妊娠期高血压","先兆早产","头大儿"]
        },
        {
          "title": "合并消化系统",
          "data": ["妊娠期糖尿病5","妊娠期高血压","先兆早产","头大儿"]
        }
      ],
      geren: ["妊娠期糖尿病","妊娠期高血压","先兆早产","头大儿"],
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
      ]
    };
  }

  componentDidMount() {
    Promise.all([
    service.getuserDoc().then(res => this.setState({
      info: res
    })),
    service.fuzhen.getdiagnosis().then(res => this.setState({
      diagnosis: res.list
    })),
   service.fuzhen.getRecentRvisit().then(res => this.setState({
      recentRvisit: res.object
    }))]).then(() => this.setState({ loading: false }));
    /* 
    service.fuzhen.getRvisitPage().then(res => this.setState({
      recentRvisitAll: res.list
    })).then(() => this.setState({ loadingTable: false }));

    service.fuzhen.getPlanList().then(res => this.setState({
        zhenliaoPlan: res
    }));
     */
  }

  adddiagnosis() {
    const { diagnosis, diagnosi } = this.state;
    if (diagnosi && !diagnosis.filter(i => i.data === diagnosi).length) {
      service.fuzhen.adddiagnosis(diagnosi).then(() => {
        modal('success', '添加诊断信息成功');
        // service.fuzhen.getdiagnosis().then(res => this.setState({
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
      modal('warning', '添加数据重复');
    }
  }

  deldiagnosis(id) {
    service.fuzhen.deldiagnosis(id).then(() => {

      modal('info', '删除诊断信息成功');
      // service.fuzhen.getdiagnosis().then(res => this.setState({
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

  handelTableChange(type, row) {
    service.fuzhen.recentRvisit(row).then(() => {
      // service.fuzhen.getRecentRvisit().then(res => this.setState({
      //   recentRvisit: res.list
      // }));

      // service.fuzhen.getRvisitPage().then(res => this.setState({
      //   recentRvisitAll: res.list
      // }));
    });
  }

  onChangeInfo(info) {
    this.setState({ info: info }, () => service.fuzhen.fireWatch(info));
  }

  saveForm(entity) {
    this.setState({ loading: true });
    return new Promise(resolve => {
      service.fuzhen.saveRvisitForm(entity).then(() => {
        modal('success', '诊断信息保存成功');
        // service.fuzhen.getRecentRvisit().then(res => this.setState({
        //   loading: false,
        //   recentRvisit: res.list
        // }));

        // 使用mock时候才用这个
        const { recentRvisit, recentRvisitAll } = this.state;
        this.setState({
          loading: false,
          recentRvisit: [entity].concat(recentRvisit),
          recentRvisitAll: recentRvisitAll.concat([entity]),
        })
        //使用mock时候才用这个

        resolve();
      }, () => this.setState({ loading: false }));
    })

  }

  /**
   * 诊断列表
   */
  renderZD() {
    const { diagnosi, diagnosis, keshi, geren, isShowZhenduan, isMouseIn } = this.state;
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
    const setIptVal = (item) => {
      this.setState({
        isMouseIn: false,
        diagnosi: item
      })
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
          {diagnosis.map((item, i) => (
            <li key={`diagnos-${item.id}-${Date.now()}`}>
              <Popover placement="bottomLeft" trigger="click" content={content(item, i)}>
                <div title={title(item)}>
                  <span className="font-12">{i + 1}、</span>
                  <span className={item.highriskmark ? 'colorDarkRed character7 font-18' : 'character7'}>{item.data}</span>
                </div>
              </Popover>
              <Button className="delBTN colorRed" type="dashed" shape="circle" icon="cross" onClick={() => delConfirm(item)} />
            </li>
          ))}
        </ol>
        <div className="fuzhen-left-input font-16">
          {/* <Select combobox showSearch size="large" style={{ width: '100%' }} placeholder="请输入诊断信息" value={diagnosi} onChange={e => this.setState({ diagnosi: e })}>
            {baseData.diagnosis.filter(d=>d.top || diagnosi).map(o => <Select.Option key={`diagnosi-${o.value}`} value={o.value}>{o.label}</Select.Option>)}
          </Select> */}

          <Input placeholder="请输入诊断信息" value={diagnosi} onChange={e => setIptVal(e.target.value)} 
                 onFocus={() => this.setState({isShowZhenduan: true})} />
          { isShowZhenduan || isMouseIn ?
            <div onMouseEnter={() => this.setState({isMouseIn: true})} onMouseLeave={() => this.setState({isMouseIn: false})}> 
              <Tabs defaultActiveKey="1" tabBarExtraContent={<Icon type="setting" onClick={() => this.setState({isShowSetModal: true})}></Icon>}>
                <Tabs.TabPane tab="全部" key="1">
                  {diagnosis.map((item, i) => <p className="fuzhen-left-item" key={i} onClick={() => setIptVal(item.data)}>{item.data}</p>)}
                </Tabs.TabPane>
                <Tabs.TabPane tab="科室" key="2">
                  <Tree showLine onSelect={(K, e) => setIptVal(e.node.props.title)}>
                    {keshi.map((item, index) => (
                      <Tree.TreeNode selectable={false} title={item.title} key={`0-${index}`}>
                        {item.data.map((subItem, subIndex) => (
                          <Tree.TreeNode title={subItem} key={`0-0-${subIndex}`}></Tree.TreeNode>
                        ))}
                      </Tree.TreeNode>
                    ))}
                  </Tree>
                </Tabs.TabPane>
                <Tabs.TabPane tab="个人" key="3">
                  {geren.map((item, i) => <p className="fuzhen-left-item" key={i} onClick={() =>  setIptVal(item)}>{item}</p>)}
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
    const { loading, jianyanReport, zhenliaoPlan = [], collapseActiveKey } = this.state;

    /**
   * 检验报告结果
   */
    const renderReaultModal = () => {
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
      const { isShowPlanModal } = this.state;
      const handleClick = (item) => {
        this.setState({isShowPlanModal: false})
      }
      return (
        <Modal title="Title" visible={isShowPlanModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <p>诊疗计划</p>
        </Modal>
      )
    }

    return (
      <div className="fuzhen-left ant-col-5">
        <Collapse defaultActiveKey={collapseActiveKey}>
          <Panel header="诊 断" key="1">
            {loading ?
              <div style={{ height: '2em' }}><Spin />&nbsp;...</div> : this.renderZD()
            }
          </Panel>
          <Panel header={<span>缺 少 检 验 报 告<Button type="ghost" size="small" onClick={() => this.setState({isShowResultModal: true})}>结果</Button></span>} key="2">
            <p className="pad-small">{jianyanReport || '无'}</p>
          </Panel>
          <Panel header="诊 疗 计 划" key="3">
            <Timeline className="pad-small" pending={<Button type="ghost" size="small" onClick={() => this.setState({isShowPlanModal: true})}>管理</Button>}>
              {zhenliaoPlan.length ? zhenliaoPlan.map((item, index) => (
                <Timeline.Item key={`zhenliaoPlan-${item.id || index}-${Date.now()}`}>
                  <p className="font-16">{item.date} - {item.week}</p>
                  <p className="font-16">{item.main}</p>
                </Timeline.Item>
              ))
                : '无'}
            </Timeline>
          </Panel>
        </Collapse>
        {renderReaultModal()}
        {renderPlanModal()}
      </div>
    );
  }

  renderTable() {
    const { recentRvisit=[], recentRvisitAll=[], recentRvisitShow } = this.state;

    const initTable = (data, props) => tableRender(baseData.tableKey(), data, { buttons: null, editable: true, onRowChange: this.handelTableChange.bind(this), ...props });
    return (
      <div className="fuzhen-table">
        {initTable(recentRvisit && recentRvisit.slice(0, 2), { width: 1100, size: "small", pagination: false, className: "fuzhenTable", scroll: { x: 1100, y: 220 }, iseditable:({row})=>!!row })}
        {!recentRvisit ? <div style={{ height: '4em' }}><Spin />&nbsp;...</div> : null}
        <Modal title="产检记录" visible={recentRvisitShow} width="100%" footer='' maskClosable={true} onCancel={() => this.setState({ recentRvisitShow: false })}>
          {initTable(recentRvisitAll, { className: "fuzhenTable", scroll: { x: 1100 } })}
          {/* <Button type="primary" className="bottom-savePDF-btn" size="small" onClick={() => alert('另存为PDF')}>另存为PDF</Button> */}
        </Modal>
        <div className="clearfix">
          {recentRvisitAll && recentRvisitAll.length > 2 ? <Button size="small" type="dashed" className="margin-TB-mid pull-right" onClick={() => this.setState({ recentRvisitShow: true })}>更多产检记录</Button> : <br />}
        </div>
      </div>
    );
  }

  render() {
    const { loading, diagnosis, info, modalState } = this.state;

    return (
      <Page className='fuzhen font-16 ant-col'>
        <div className="bgDOM"></div>
        {this.renderLeft()}
        <div className="fuzhen-right ant-col-19 main-pad-small">
          {this.renderTable()}
          <FuzhenForm info={info} diagnosis={diagnosis} modalState={modalState} onSave={data => this.saveForm(data)} onChangeInfo={this.onChangeInfo.bind(this)} />
          <p className="pad_ie">&nbsp;<span className="hide">ie8下拉框只能向下，这里是占位</span></p>
        </div>
      </Page>
    )
  }
}