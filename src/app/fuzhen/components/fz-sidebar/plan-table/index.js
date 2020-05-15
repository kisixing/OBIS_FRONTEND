import React, { Component } from "react";
import { Row, Col, Input, message, Button, Tree, Modal } from "antd";

import tableRender from "../../../../../render/table";
import formRender, { fireForm } from "../../../../../render/form";
import * as baseData from "../../../data";
import service from '../../../../../service';
import * as util from '../../../util';
import './index.less';

export default class FuzhenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
			isShowMplanModal: false,
      isShowNewplanModal: false,
      planDataList: [],
      initPlanEntity: {	time: "", gestation: "", item: "", event: ""},
      planEntity: {	time: "", gestation: "", item: "", event: ""},
      treeData: [],
      checkTreeKeys: [],
      planGroup: [],
      allPlanEntity: {},
      initPlanDataList: {"backup": "1", "del": 0, "diagnosisPlans": [], "groupName": "", "status": "1",},
      allPlanDataList: {"backup": "1", "del": 0, "diagnosisPlans": [], "groupName": "", "status": "1",},
    };
  }

  planConfig() {
    return {
      rows: [
        {
          columns: [
            { name: "gestation(周)[孕周]", type: "input", span: 6, valid: (value) => {
              if (value && !/^\d+?\+?\d+$/.test(value)) {
                return '*输入格式不正确';
              } 
            } },
            { name: "item[产检项目]", type: "select", span: 7, options: baseData.cjOptions },
            { name: "event[提醒事件]", type: "input", span: 8 },
            { type: "button", span: 3, text: "添加", color: "#1890ff", size: "small",	onClick: this.addRecentPlan.bind(this) }
          ]
        }
      ]
    };
	}
	
	allPlanConfig() {
    return {
      rows: [
        {
          columns: [
            { name: "groupName[诊疗计划组名字]", className: "long-label", type: "input", span: 22 },
          ]
				},
				{
          columns: [
            { span: 1 },
            { name: "gestation(周)[孕周]", type: "input", span: 6, valid: 'symbol(+)' },
            { name: "event[提醒事件]", type: "input", span: 7 },
            { span: 1 },
            { type: "button", span: 3, text: "添加", color: "#1890ff", size: "small",	onClick: this.writePlanGroup.bind(this) }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));
    this.getAllGroup();
  }

  getAllGroup() {
    let Data = [];
    service.fuzhen.findDiagnosisPlanAndGroupVO().then(res => {
      res.object && res.object.forEach(item => {
        let obj = {};
        obj.name = item.groupName;
        obj.key = item.groupName;
        Data.push(obj);
        item.content = '';
        item.diagnosisPlans && item.diagnosisPlans.forEach(subItem => {
          item.content += `${subItem.event}(${subItem.gestation}周)；`;
        })
        this.setState({ planGroup: res.object })
      })
    })
    this.setState({ treeData: Data })
  }

  editGroupPlan(list, entity) {
    service.fuzhen.editGroupAndDiagnosisPlan(list).then(res => {
      service.fuzhen.selectListByGroupName(entity.groupName).then(res => {
        let newEntity = {};
        newEntity.groupName = entity.groupName;
        this.getAllGroup();
        this.setState({ allPlanDataList: res.object, allPlanEntity: newEntity });
      })
    })
  }

	addRecentPlan() {
    const { planEntity, initPlanEntity } = this.state;
    const { info } = this.props;
    fireForm(document.querySelector('.left-form'), 'valid').then((valid) => {
      if (valid && !!planEntity.gestation) {
        planEntity.time = util.getWeek(planEntity.gestation, info.tuserweek);
        this.setState({planEntity}, () => {
          service.fuzhen.addRecentRvisit(planEntity).then(res => {
            service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object, planEntity: initPlanEntity }));  
            this.props.changeRecentRvisit();
          })
        })
      } else {
        message.error('请输入正确的孕周格式！');
      }
    })
  }
  
  writePlanGroup() {
    const { allPlanEntity, allPlanDataList } = this.state;
    const { info } = this.props;
    if (allPlanEntity.gestation && allPlanEntity.event) {
      allPlanEntity.time = util.getWeek(allPlanEntity.gestation, info.tuserweek);
      allPlanDataList.diagnosisPlans.push(allPlanEntity);
    }

    allPlanDataList.groupName = allPlanEntity.groupName;
    this.editGroupPlan(allPlanDataList, allPlanEntity);
  }

	onReturn(param) {
		if (param === 1) {
			this.setState({isShowMplanModal: true});
			this.props.onReturn(false);
		} else if (param === 2) {
			this.setState({isShowMplanModal: false});
			this.props.onReturn(true);
		} else if (param === 3) {
			this.setState({isShowMplanModal: false, isShowNewplanModal: true});
		} else if (param === 4) {
			this.setState({isShowMplanModal: true, isShowNewplanModal: false});
		}
	}

  renderLeftForm() {
		const { planEntity } = this.state;
		const handleChange = (e, { name, value, valid }) => {
			const data = { [name]: value };
			if (name == 'item') data.item = value.label;
			this.setState({ planEntity: {...planEntity, ...data}})
		}
    return (
      <div className="left-form">
        {formRender(planEntity, this.planConfig(), handleChange)}
      </div>
    )
  }

  renderLeftTable() {
    const { planDataList } = this.state;
    
    const handleTableChange = (e, value) => {
      const { info } = this.props;
      value.item.time = util.getWeek(value.item.gestation, info.tuserweek);
      service.fuzhen.editRecentRvisit(value.item).then(res => {
        service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));  
        this.props.changeRecentRvisit();
      })
    }

    const handleDelete = (select) => {
      service.fuzhen.delRecentRvisit(select).then(res => {
        service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));  
        this.props.changeRecentRvisit();
      })
    }

    function compare(property){
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
      }
    }
   
   let newPlanDataList = planDataList;
   if (newPlanDataList.length>0) newPlanDataList.sort(compare('gestation'));

    const initTable = data => tableRender(baseData.planKey(), data, 
          { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true, onChange: handleTableChange});
    return <div>{newPlanDataList.length > 0 ? initTable(newPlanDataList) : ""}</div>;
  }

  renderRightTree() {
    const { treeData, checkTreeKeys } = this.state;
    // 管理诊疗计划组窗口
    const renderMplanModal = () => {
      const { isShowMplanModal, planGroup, allPlanEntity, initPlanDataList } = this.state;
      const handleClick = () => { this.setState({isShowMplanModal: false})}
      const handleDBClick = (row) => {
        // allPlanEntity.groupName = row.groupName;
        this.setState({ allPlanDataList: row }, () => {
          this.onReturn(3);
        });
      }

      const handleDelete = (select) => {
        select.del = 1;
        service.fuzhen.editGroupAndDiagnosisPlan(select).then(res => {
          this.getAllGroup();
        })
      }

      const addNewPlan = () => {
        this.setState({ allPlanDataList: initPlanDataList, allPlanEntity: {} }, () => {
          this.onReturn(3);
        })
      }

      const initTable = data => tableRender(baseData.managePlanKey(), data,
            { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true, onDBClick: handleDBClick});

      return (
				<Modal width="80%" footer={null} title={<Button className="blue-btn" type="ghost" onClick={() => this.onReturn(2)}>返回</Button>} 
					visible={isShowMplanModal} maskClosable={false} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <div>{planGroup.length > 0 ? initTable(planGroup) : ""}</div>
					<Button className="blue-btn margin-TB-mid" type="ghost" onClick={() => addNewPlan()}>新增诊疗计划组</Button>
        </Modal>
      )
    }
    
    // 新增诊疗计划组窗口
    const renderNewplanModal = () => {
			const { isShowNewplanModal, allPlanDataList, allPlanEntity } = this.state;
			const handleClick = () => { this.setState({isShowNewplanModal: false})};
      const handleChange = (e, { name, value, valid }) => {
        const data = { [name]: value };
        data.item = '';
        this.setState({ allPlanEntity: {...allPlanEntity, ...data}})
      }
      const handleDelete = (row, index) => {
        if (index > 0) {
          allPlanDataList.diagnosisPlans[index-1].del = 1;
          this.editGroupPlan(allPlanDataList, allPlanEntity);
        }
      }
      const handleTableChange = (e, value) => {
        const { info } = this.props;
        value.item.time = util.getWeek(value.item.gestation, info.tuserweek);
        allPlanDataList.diagnosisPlans[value.row] = value.item;
  
        this.editGroupPlan(allPlanDataList, allPlanEntity);
      }

      const initTable = data => tableRender(baseData.newPlanKey(), data, 
            { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true, onChange: handleTableChange});
      
      return (
				<Modal width="80%" footer={null} title={<Button className="blue-btn" type="ghost" onClick={() => this.onReturn(4)}>返回</Button>} 
					visible={isShowNewplanModal} maskClosable={false} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
					{formRender(allPlanEntity, this.allPlanConfig(), handleChange)}
          <div>{allPlanDataList.diagnosisPlans.length > 0 ? initTable(allPlanDataList.diagnosisPlans) : ""}</div>
        </Modal>
      )
    }
    const handleCheck = (keys) => {
      this.setState({ checkTreeKeys: keys })
    }

    const addPlanGroup = () => {
      console.log(checkTreeKeys);
      checkTreeKeys.length > 0 && checkTreeKeys.forEach(item => {
        service.fuzhen.selectListByGroupName(item).then(res => {
          const plans = res.object.diagnosisPlans;
          plans && plans.length > 0 && plans.forEach(item => {
            service.fuzhen.addRecentRvisit(item).then(() => {
              service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));  
            })
          })
        })
      })
    }
		
    return (
			<div className="tree-content">
				<p className="tree-title">诊疗计划组
					<Button className="blue-btn" type="ghost" onClick={() => this.onReturn(1)}>管理</Button>
				</p>
				<Tree checkable onCheck={handleCheck}>
					{treeData.map((item, index) => (
						<Tree.TreeNode title={item.name} key={item.key}></Tree.TreeNode>
					))}
				</Tree>
				<Button className="pull-left blue-btn" type="ghost" onClick={addPlanGroup}>添加</Button>
				{renderMplanModal()}
				{renderNewplanModal()}
			</div>
    );
  }

  render() {
    return (
      <div className="plan-table">
        <Row>
          <Col span={16}>
            <Row>{this.renderLeftForm()}</Row>
            <Row>{this.renderLeftTable()}</Row>
          </Col>
          <Col span={8}>{this.renderRightTree()}</Col>
        </Row>
      </div>
    );
  }
}
