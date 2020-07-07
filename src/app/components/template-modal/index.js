import React, { Component } from "react";
import { Modal, Col, Row, message, Tree, Tabs, Icon, Tooltip, Input, Button } from 'antd';
import service from '../../../service';
import './index.less';

export default class extends Component{
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: "1",
      treatTemp: null,
      treatKey1: [],
      treatKey2: [],
      personalTemp: null,
      personalKey1: [],
      personalKey2: [],
      currentArea: null,

      operation: null,
      nodeTreeItem: null, 
      operateVisible: false,
      newTitle: null, // 新增主模板名称
      addTitle: null, // 新增子模板名称 
    }
  }

  componentDidMount() {
    this.getTempData(1);
    this.getTempData(2);
  }

  getTempData = async (type) => {
    const res = await service.shouzhen.treatTemp(type);
    type == 1 ? this.setState({ treatTemp: res.object }) : this.setState({ personalTemp: res.object });
    this.setState({ 
      nodeTreeItem: null,
      operation: null,
      newTitle: null,
      addTitle: null,
    });
  }

  updateData = () => {
    const { activeTabKey } = this.state;
    if (activeTabKey === "1") {
      this.getTempData(1);
    } else {
      this.getTempData(2);
    }
  }

  getNodeTreeMenu() {
    const { activeTabKey, nodeTreeItem } = this.state;
    const { pageX, pageY, pid } = {...nodeTreeItem};
    const tmpStyle = {
      position: 'absolute',
      maxHeight: 40,
      textAlign: 'center',
      left: `${pageX + 10}px`,
      top: `${pageY}px`,
      display: 'flex',
      flexDirection: 'row',
    };

    const handleItem = (operate) => {
      this.setState({ 
        operateVisible: true,
        operation: operate
      })
    }

    const handleSort= async (sort) => {
      const temp = { ...nodeTreeItem, type: activeTabKey };
      await service.shouzhen.sortTemp(temp, sort);
      this.updateData();
    }

    const menu = (
      <div style={tmpStyle}>
        {
          pid === 0 && activeTabKey !== "2"
          ? <div className="handle-icon" onClick={() => handleItem("add")}>
              <Tooltip placement="bottom" title="添加子模板">
                <Icon type='plus-circle-o' />
              </Tooltip>
            </div>
          : null
        }
        <div className="handle-icon" onClick={() => handleItem("edit")}>
          <Tooltip placement="bottom" title="修改">
            <Icon type='edit' />
          </Tooltip>
        </div>
        <div className="handle-icon" onClick={() => handleItem("del")}>
          <Tooltip placement="bottom" title="删除">
            <Icon type='delete' />
          </Tooltip>
        </div>
        <div className="handle-icon" onClick={() => handleSort("DOWN")}>
          <Tooltip placement="bottom" title="上移">
            <Icon type='arrow-up' />
          </Tooltip>
        </div>
        <div className="handle-icon" onClick={() => handleSort("UP")}>
          <Tooltip placement="bottom" title="下移">
            <Icon type='arrow-down' />
          </Tooltip>
        </div>
      </div>
    );
    return (nodeTreeItem == null) ? '' : menu;
  }

  renderHandleModal() {
    const { activeTabKey, operateVisible, nodeTreeItem, addTitle, operation, newTitle } = this.state;
    const title = operation === 'new' ? '新增模板' : operation === 'add' ? '新增子模板' : operation === 'edit' ? '编辑模板' : '请注意!';

    const closeHandle = async (bool) => {
      if (bool) {
        if (operation === 'new') {
          const addItem = { "pid": 0, "content": addTitle, type: activeTabKey };
          await service.shouzhen.saveTemp(addItem);
          this.updateData();
        }

        if (operation === 'add') {
          const addItem = { "pid": Number(nodeTreeItem.id), "content": addTitle, type: activeTabKey };
          await service.shouzhen.saveTemp(addItem);
          this.updateData();
        }

        if (operation === 'edit') {
          const editItem = { "pid": Number(nodeTreeItem.pid), "content": nodeTreeItem.title, type: activeTabKey, id: nodeTreeItem.id };
          await service.shouzhen.saveTemp(editItem);
          this.updateData();
        }

        if (operation === 'del') {
          await service.shouzhen.removeTemp(nodeTreeItem.id);
          this.updateData();
        }
      }
      this.setState({ 
        operateVisible: false, 
        nodeTreeItem: null,
        operation: null,
      });
    }

    const handleIptChange = (e, operation) => {
      if (operation = "new") {
        this.setState({ 
          newTitle: e.target.value
        })
      }
      
      if (operation = "add") {
        this.setState({ 
          addTitle: e.target.value
        })
      }

      if (operation = "edit") {
        const data = { "title":  e.target.value };
        this.setState({ 
          nodeTreeItem: { ...nodeTreeItem, ...data }
        })
      }
    }

    return (
      <Modal title={title} closable visible={operateVisible} onCancel={e => closeHandle()} onOk={e => closeHandle(true)}>
        {
          operation === 'new'
          ? <div>新增模板名称：<Input value={newTitle} onChange={e => handleIptChange(e, "new")} style={{ width: '50%' }} /></div>
          : operation === 'add'
          ? <div>新增子模板名称：<Input value={addTitle} onChange={e => handleIptChange(e, "add")} style={{ width: '50%' }} /></div>
          : operation === 'edit'
          ? <div>编辑模板名称：<Input value={nodeTreeItem.title} onChange={e => handleIptChange(e, "edit")} style={{ width: '50%' }} /></div>
          : operation === 'del'
          ? <div>是否删除模板：{nodeTreeItem.title}</div>
          : null
        }
      </Modal>
    )
  }

  /**
   * 模板
   */
  renderTreatment() {
    const { activeTabKey, treatTemp, personalTemp, treatKey1, treatKey2, personalKey1, personalKey2, currentArea } = this.state;
    const { openTemplate, closeTemplateModal } = this.props;

    const closeDialog = (e, bool) => {
      let items = [];
      this.setState({ 
        openTemplate: false, 
        treatKey1: [], 
        treatKey2: [] 
      });
      if (bool) {
        if (activeTabKey === "1") {
          items = treatTemp.filter(i => i.checked && i.pid !== 0);
        } else {
          items = personalTemp.filter(i => i.checked);
        }
      }
      closeTemplateModal(e, items);
    }

    const initTree = (pid, list, param) => list && list.filter(i => i.pid === pid).map(node => (
      <Tree.TreeNode pid={node.pid} sort={node.sort} key={node.id} title={node.content}>
        {(pid === 0 && !param) ? initTree(node.id, list) : null}
      </Tree.TreeNode>
    ));

    const handleTabChange = (key) => {
      this.setState({ activeTabKey: key })
    }

    const handleCheck1 = (keys) => {
      this.setState({ treatKey1: keys });
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

    const handlePersonalCheck1 = (keys) => {
      this.setState({personalKey1: keys});
      personalTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || personalKey2.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const handlePersonalCheck2 = (keys) => {
      this.setState({personalKey2: keys});
      personalTemp.forEach(tt => {
        if (keys.indexOf(`${tt.id}`) !== -1 || personalKey1.indexOf(`${tt.id}`) !== -1) {
          tt.checked = true;
        } else {
          tt.checked = false;
        }
      })
    };

    const onRightClick = ({event, node}, area) => {
      var x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth;
      var y = event.currentTarget.offsetTop ;
      this.setState({
        nodeTreeItem: {
          pageX: x,
          pageY: y,
          pid: node.props.pid,
          id: Number(node.props.eventKey),
          title: node.props.title,
          sort: node.props.sort,
        },
        currentArea: area
      });
    }

    const handleBtnClick = () => {
      if (activeTabKey === "2" && personalTemp.length === 30) {
        message.warn("个人模板最多30条数据！");
      } else {
        this.setState({ 
          operation: "new",
          operateVisible: true
        })
      }
    }

    const treeNodes = initTree(0, treatTemp);
    const personalNodes = initTree(0, personalTemp, "personal");
    const operationBtn = <Button size="small" onClick={handleBtnClick}>添加模板</Button>;

    return (
      <Modal className="temp-modal" title="处理模板" closable visible={openTemplate} width={1000} onCancel={e => closeDialog(e)} onOk={e => closeDialog(e, true)}>
        <Tabs defaultActiveKey={activeTabKey} tabBarExtraContent={operationBtn} onChange={handleTabChange}>
          <Tabs.TabPane tab={<Button className="list-btn" icon="appstore-o">科室模板</Button>} key="1">
            <Row>
              <Col span={12}>
                <Tree checkable defaultExpandAll checkedKeys={treatKey1.length === 0 ? [] : treatKey1} onCheck={handleCheck1} onRightClick={(e) => onRightClick(e, 'department1')} style={{ maxHeight: '90%' }}>
                  {treeNodes.slice(0, treeNodes.length/2)}
                </Tree>
                {(this.state.nodeTreeItem != null && currentArea === "department1") ? this.getNodeTreeMenu() : null}
              </Col>
              <Col span={12}>
                <Tree checkable defaultExpandAll checkedKeys={treatKey2.length === 0 ? [] : treatKey2} onCheck={handleCheck2} onRightClick={(e) => onRightClick(e, 'department2')} style={{ maxHeight: '90%' }}>
                  {treeNodes.slice(treeNodes.length/2)}
                </Tree>
                {(this.state.nodeTreeItem != null && currentArea === "department2")? this.getNodeTreeMenu() : null}
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button className="list-btn" icon="user">个人模板</Button>} key="2">
            <Col span={12}>
              <Tree checkable defaultExpandAll checkedKeys={personalKey1.length === 0 ? [] : personalKey1} onCheck={handlePersonalCheck1} onRightClick={(e) => onRightClick(e, 'personal1')} style={{ maxHeight: '90%' }}>
                {personalNodes.slice(0, 15)}
              </Tree>
              {(this.state.nodeTreeItem != null && currentArea === "personal1") ? this.getNodeTreeMenu() : null}
            </Col>
            <Col span={12}>
              <Tree checkable defaultExpandAll checkedKeys={personalKey2.length === 0 ? [] : personalKey2} onCheck={handlePersonalCheck2} onRightClick={(e) => onRightClick(e, 'personal2')} style={{ maxHeight: '90%' }}>
                {personalNodes.slice(15)}
              </Tree>
              {(this.state.nodeTreeItem != null && currentArea === "personal2") ? this.getNodeTreeMenu() : null}
            </Col>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }

  render(){
    const { treatTemp, personalTemp } = this.state;
    return (
      <div>
        { treatTemp && personalTemp && this.renderTreatment() }
        { this.renderHandleModal() }
      </div>
    )
  }
}
