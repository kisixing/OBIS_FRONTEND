import React, { Component } from "react";
import { Row, Col, Input, Select, Button, Tree, Modal } from "antd";

import tableRender from "../../render/table";
import formRender, { fireForm } from "../../render/form";
import * as baseData from "./data";
import service from '../../service';
import * as util from './util';
import './table.less';

export default class FuzhenForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
			isShowMplanModal: false,
      isShowNewplanModal: false,
      planDataList: [],
      planEntity: {
				time: "",
        gestation: "",
        item: "",
        event: ""
      },
			treeDate: [],
      planGroup: [],

      allPlanEntity: {},
      allPlanDataList: {
        "backup": "1",
        "del": 0,
        "diagnosisPlans": [],
        "groupName": "",
        "status": "1",
      },
    };
  }

  planConfig() {
    return {
      rows: [
        {
          columns: [
            { name: "gestation(周)[孕周]", type: "input", span: 6, valid: 'number' },
            { name: "item[产检项目]", type: "select", span: 7, options: baseData.cjOptions },
            { name: "event[提醒事件]", type: "input", span: 8 },
            { type: "button", span: 3, text: "添加", color: "#1890ff", size: "small",	onClick: this.addRecentRvisit.bind(this) }
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
            { name: "gestation(周)[孕周]", type: "input", span: 6 },
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
    let treeData = [];
    service.fuzhen.findDiagnosisPlanAndGroupVO().then(res => {
      res.object && res.object.forEach(item => {
        treeData.push(item.groupName);
        item.content = '';
        item.diagnosisPlans && item.diagnosisPlans.forEach(subItem => {
          item.content += `${subItem.event}(${subItem.gestation}周)；`;
        })
        this.setState({ treeDate: treeData, planGroup: res.object })
      })
    })
  }

	addRecentRvisit() {
    const { planEntity } = this.state;
    const { info } = this.props;
    let param = {time: util.getWeek(planEntity.gestation, info.tuserweek)};
    let newplanEntity = Object.assign(planEntity, param);

    this.setState({planEntity: newplanEntity}, () => {
      service.fuzhen.addRecentRvisit(planEntity).then(res => {
        service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));  
        this.props.changeRecentRvisit();
      })
    })
  }
  
  writePlanGroup() {
    const { allPlanEntity, allPlanDataList } = this.state;
    const { info } = this.props;
    let param = {time: util.getWeek(allPlanEntity.gestation, info.tuserweek)};
    let newplanEntity = Object.assign(allPlanEntity, param);

    allPlanDataList.diagnosisPlans.push(newplanEntity);
    allPlanDataList.groupName = newplanEntity.groupName;

    console.log(newplanEntity, 112)
    console.log(allPlanDataList, 113)

    service.fuzhen.editGroupAndDiagnosisPlan(allPlanDataList).then(res => {
      service.fuzhen.selectListByGroupName(newplanEntity.groupName).then(res => {
        this.setState({ allPlanDataList: res.object })
      })
    })
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
    return formRender(planEntity, this.planConfig(), handleChange);
  }

  renderLeftTable() {
    const { planDataList } = this.state;
    
    const handleTableChange = (e, value) => {
      const { info } = this.props;
      let param = {time: util.getWeek(value.item.gestation, info.tuserweek)};
      value.item = Object.assign(value.item, param);

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
		const { treeDate } = this.state;
					
		/**
     * 管理诊疗计划组窗口
     */
    const renderMplanModal = () => {
      const { isShowMplanModal, planGroup, allPlanEntity } = this.state;
      const handleClick = () => { this.setState({isShowMplanModal: false})}
      const handleDBClick = (row) => {
        allPlanEntity.groupName = row.groupName;
        this.setState({ allPlanDataList: row, allPlanEntity });
        this.onReturn(3);
      }

      const handleDelete = (select) => {
        select.del = 1;
        service.fuzhen.editGroupAndDiagnosisPlan(select).then(res => {
          this.getAllGroup();
        })
      }

      const initTable = data => tableRender(baseData.managePlanKey(), data,
            { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true, onDBClick: handleDBClick});

      return (
				<Modal width="60%" footer={null} title={<Button className="blue-btn" type="ghost" onClick={() => {this.onReturn(2)}}>返回</Button>} 
					visible={isShowMplanModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          <div>{planGroup.length > 0 ? initTable(planGroup) : ""}</div>
					<Button className="blue-btn margin-TB-mid" type="ghost" onClick={() => {this.onReturn(3)}}>新增诊疗计划组</Button>
        </Modal>
      )
		}

			/**
     * 新增诊疗计划组窗口
     */
    const renderNewplanModal = () => {
			const { isShowNewplanModal, allPlanDataList, allPlanEntity } = this.state;
			const handleClick = () => { this.setState({isShowNewplanModal: false})};
      const handleChange = (e, { name, value, valid }) => {
        // console.log(name, value, '23')
        const data = { [name]: value };
        data.item = '';
        this.setState({ allPlanEntity: {...allPlanEntity, ...data}})
      }
      const handleDelete = (row, index) => {
        console.log(allPlanEntity, '11')
        console.log(row, index,allPlanDataList, '456')
        allPlanDataList.diagnosisPlans[index-1].del = 1;

        service.fuzhen.editGroupAndDiagnosisPlan(allPlanDataList).then(res => {
          service.fuzhen.selectListByGroupName(allPlanEntity.groupName).then(res => {
            this.setState({ allPlanDataList: res.object })
          })
        })

      }

			const initTable = data => tableRender(baseData.newPlanKey(), data, { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true});
      return (
				<Modal width="60%" footer={null} title={<Button className="blue-btn" type="ghost" onClick={() => {this.onReturn(4)}}>返回</Button>} 
					visible={isShowNewplanModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
					{formRender(allPlanEntity, this.allPlanConfig(), handleChange)}
          <div>{allPlanDataList.diagnosisPlans.length > 0 ? initTable(allPlanDataList.diagnosisPlans) : ""}</div>
        </Modal>
      )
		}
		
    return (
			<div className="tree-content">
				<p className="tree-title">诊疗计划组
					<Button className="blue-btn" type="ghost" onClick={() => {this.onReturn(1)}}>管理</Button>
				</p>
				<Tree checkable>
					{treeDate.map((item, index) => (
						<Tree.TreeNode title={item} key={`0-${index}`}></Tree.TreeNode>
					))}
				</Tree>
				<Button className="pull-left blue-btn" type="ghost">添加</Button>
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
