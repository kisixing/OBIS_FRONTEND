import React, { Component } from "react";
import { Modal, Col, Row, message, Tree, Tabs, Icon, Tooltip, Input } from 'antd';
import service from '../../../service';
import './index.less';
import shouzhen from "../../../service/shouzhen";

export default class extends Component{
  constructor(props) {
    super(props);
    this.state = {
      treatTemp: null,
      treatKey1: [],
      treatKey2: [],

      operation: '',
      nodeTreeItem: null, 
      visible: false,
      currentId: null,
      currentTitle: null,  // 当前编辑模板名称
      addTitle: null, // 新增模板名称 
    }
  }

  componentDidMount() {
    service.shouzhen.treatTemp().then(res => this.setState({ 
      treatTemp: res.object
    }));

    service.shouzhen.findTree(1, 0).then(res => {
      console.log(res, '314245');
    })

    // service.shouzhen.getPersonal().then(res => {
    //   console.log(res, '345')
    // })

    // service.shouzhen.addPersonal('vusvbbsbvhhvbshb道具', service.getQueryString('doctorId')).then(res => {
    //   console.log(res, '345')
    // })
  }

  handleAddSub = () => {
    this.setState({ 
      visible: true,
      operation: 'add'
    })
  }
  
  handleEditSub = () => {
    this.setState({ 
      visible: true,
      operation: 'edit'
    })
  }

  handleDeleteSub = () => {
    this.setState({ 
      visible: true,
      operation: 'del'
    })
  }

  getNodeTreeMenu() {
    const {pageX, pageY} = {...this.state.nodeTreeItem};
    const tmpStyle = {
      position: 'absolute',
      maxHeight: 40,
      textAlign: 'center',
      left: `${pageX + 10}px`,
      top: `${pageY}px`,
      display: 'flex',
      flexDirection: 'row',
    };
    const menu = (
      <div style={tmpStyle}>
        <div style={{alignSelf: 'center', marginLeft: 10}} onClick={this.handleAddSub}>
          <Tooltip placement="bottom" title="添加子组织">
            <Icon type='plus-circle-o' />
          </Tooltip>
        </div>
        <div style={{alignSelf: 'center', marginLeft: 10}} onClick={this.handleEditSub}>
          <Tooltip placement="bottom" title="修改">
            <Icon type='edit' />
          </Tooltip>
        </div>
        <div style={{alignSelf: 'center', marginLeft: 10}} onClick={this.handleDeleteSub}>
          <Tooltip placement="bottom" title="删除">
            <Icon type='minus-circle-o' />
          </Tooltip>
        </div>
      </div>
    );
    return (this.state.nodeTreeItem == null) ? '' : menu;
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

    const onRightClick = ({ event,node }) => {
      console.log(node, 111)
      var x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      var y = event.currentTarget.offsetTop ;
      this.setState({
        nodeTreeItem: {
          pageX: x,
          pageY: y,
        },
        currentId: node.props.eventKey,
        currentTitle: node.props.title,
      });
    }

    const treeNodes = initTree(0);

    return (
      <Modal title="处理模板" closable visible={openTemplate} width={900} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, treatTemp.filter(i => i.checked && i.pid!==0))}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="科室模板" key="1">
            <Row>
              <Col span={12}>
                <Tree checkable defaultExpandAll checkedKeys={treatKey1} onCheck={handleCheck1} onRightClick={onRightClick} style={{ maxHeight: '90%' }}>
                  {treeNodes.slice(0,treeNodes.length/2)}
                </Tree>
                {this.state.nodeTreeItem != null ? this.getNodeTreeMenu() : ""}
              </Col>
              <Col span={12}>
                <Tree checkable defaultExpandAll checkedKeys={treatKey2} onCheck={handleCheck2} style={{ maxHeight: '90%' }}>
                  {treeNodes.slice(treeNodes.length/2)}
                </Tree>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="个人模板" key="2">

          </Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }

  renderHandleModal() {
    const { treatTemp, visible, currentId, currentTitle, addTitle, operation } = this.state;
    const title = operation === 'add' ? '新增模板' : operation === 'edit' ? '编辑模板' : '请注意!';

    const closeHandle = (bool) => {
      this.setState({ visible: false });
      if (bool) {
        console.log(currentId, '31313');
        if (operation === 'add') {
          const addItem = { "pid": Number(currentId), id: parseInt(1000*Math.random()), "content": addTitle };
          treatTemp.push(addItem);
          console.log(treatTemp, '32424')
          this.setState({ treatTemp });
        }

        if (operation === 'del') {
          console.log(currentId)
          service.shouzhen.remove(currentId);
        }
      }
    }

    const handleAddIpt = (e) => {
      this.setState({ 
        addTitle: e.target.value
      })
    }

    const handleEditIpt = (e) => {
      this.setState({ 
        currentTitle: e.target.value
      })
    }

    return (
      <Modal title={title} closable visible={visible} onCancel={e => closeHandle()} onOk={e => closeHandle(true)}>
        {
           operation === 'add'
           ? <div>新增模板名称：<Input value={addTitle} onChange={handleAddIpt} style={{ width: '50%' }} /></div>
           : operation === 'edit'
           ? <div>编辑模板名称：<Input value={currentTitle} onChange={handleEditIpt} style={{ width: '50%' }} /></div>
          : <div>是否删除模板：{currentTitle}</div>
        }
      </Modal>
    )
  }

  render(){
    const { treatTemp } = this.state;
    return (
      <div>
        {treatTemp && this.renderTreatment()}
        { this.renderHandleModal() }
      </div>
    )
  }
}
