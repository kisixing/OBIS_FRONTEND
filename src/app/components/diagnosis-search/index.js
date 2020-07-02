import React, { Component } from "react";
import { Tabs, Input, Modal, Tree, Icon, Button } from 'antd';
import service from '../../../service';
import './index.less';
import store from '../../store';
import { showDiagSearchAction, setDiagAction, setDiagTempAction } from "../../store/actionCreators.js";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  componentDidMount() {
    service.fuzhen.getDiagnosisInputTemplate().then(res => {
      const action = setDiagTempAction(res.object);
      store.dispatch(action);
    });
  }

  /**
   * 诊断搜索页
   */
  renderDiagSearch() {
    const { isShowDiagSearch, diagTempList, diagnosis } = this.state;
    const { addDiag } = this.props;

    const closeModal = () => {
      const action = showDiagSearchAction(false);
      store.dispatch(action);
    }

    const setDiagnosis = (diag, bool) => {  
      const action = setDiagAction(diag);
      store.dispatch(action);
      if (bool) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          service.fuzhen.getDiagnosisInputTemplate(diag).then(res => {
            const action = setDiagTempAction(res.object);
            store.dispatch(action);
          });
        }, 400)
      } else {
        const action = showDiagSearchAction(false);
        store.dispatch(action);
        setTimeout(() => {
          addDiag();
        }, 100);
      }
    }

    return (
      <Modal className="diag-search" title="" footer={null} visible={isShowDiagSearch} onCancel={() => closeModal()}>
        <Input.Group>
          <Input className="search-ipt" placeholder="请输入诊断信息" value={diagnosis} onChange={e => setDiagnosis(e.target.value, true)} />
          <Button className="search-btn" icon="plus" size="small" onClick={addDiag}>添加诊断</Button>
        </Input.Group>
        <p className="search-info">筛选条件</p>
        { diagTempList ?
          <div className="search-list">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab={<Button className="list-btn" icon="bars">全部</Button>} key="1">
                {diagTempList['all'].map((item, i) => <p className="list-item" key={i} onClick={() => setDiagnosis(item.name)}>{item.name}</p>)}
              </Tabs.TabPane>
              <Tabs.TabPane tab={<Button className="list-btn" icon="depart">科室</Button>} key="2">
                <Tree showLine onSelect={(K, e) => setDiagnosis(e.node.props.title)}>
                  {diagTempList['department'].map((item, index) => (
                    <Tree.TreeNode selectable={false} title={item.name} key={`0-${index}`}>
                      {item.nodes.map((subItem, subIndex) => (
                        <Tree.TreeNode title={subItem.name} key={`0-0-${subIndex}`}></Tree.TreeNode>
                      ))}
                    </Tree.TreeNode>
                  ))}
                </Tree>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<Button className="list-btn" icon="user">个人</Button>} key="3">
                {diagTempList['personal'].map((item, i) => <p className="list-item" key={i} onClick={() =>  setDiagnosis(item.name)}>{item.name}</p>)}
              </Tabs.TabPane>
            </Tabs>
          </div>  
        : null}
      </Modal>
    )
  }

  render() {
    return (
      <div>
        {this.renderDiagSearch()}
      </div>
    )
  }
}