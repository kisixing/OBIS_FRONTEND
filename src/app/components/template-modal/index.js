import React, { Component } from "react";
import { Modal, Col, Row, message, Tree, Tabs } from 'antd';
import service from '../../../service';
import './index.less';

export default class extends Component{
  constructor(props) {
    super(props);
    this.state = {
      treatTemp: null,
      treatKey1: [],
      treatKey2: [],
    }
  }

  componentDidMount() {
    service.shouzhen.treatTemp().then(res => this.setState({ 
      treatTemp: res.object
    }));

    // service.shouzhen.getPersonal().then(res => {
    //   console.log(res, '345')
    // })

    // service.shouzhen.addPersonal('vusvbbsbvhhvbshb道具', service.getQueryString('doctorId')).then(res => {
    //   console.log(res, '345')
    // })
  }

  /**
   * 模板
   */
  renderTreatment() {
    const { treatTemp, treatKey1, treatKey2 } = this.state;
    const { openTemplate, closeTemplateModal } = this.props;
    const closeDialog = (e, items = []) => {
      this.setState({ openTemplate: false, treatKey1: [], treatKey2: [] });
      closeTemplateModal(e, items);
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

              {/* <Tabs defaultActiveKey="1"> */}
                {/* <Tabs.TabPane tab="科室模板" key="1"> */}
                  <Row>
                    <Col span={12}>
                      <Tree checkable defaultExpandAll checkedKeys={treatKey1} onCheck={handleCheck1} style={{ maxHeight: '90%' }}>
                        {treeNodes.slice(0,treeNodes.length/2)}
                      </Tree>
                    </Col>
                    <Col span={12}>
                      <Tree checkable defaultExpandAll checkedKeys={treatKey2} onCheck={handleCheck2} style={{ maxHeight: '90%' }}>
                        {treeNodes.slice(treeNodes.length/2)}
                      </Tree>
                    </Col>
                  </Row>
                {/* </Tabs.TabPane> */}
                {/* <Tabs.TabPane tab="个人模板" key="2"> */}

                {/* </Tabs.TabPane> */}
              {/* </Tabs> */}
      </Modal>
    )
  }

  render(){
    const { treatTemp } = this.state;
    return (
      <div>
        {treatTemp && this.renderTreatment()}
      </div>
    )
  }
}
