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
			treeDate: ["梅毒", "甲亢", "甲减", "羊水过多/过少", "巨大儿"],
			planGroup: [
				{
					"id": "1",
					"item": "GDM",
					"time": "8",
					"event": "B超",
					"content": "胎监（34周）"
				},
				{
					"id": "2",
					"item": "GDM",
					"time": "12",
					"event": "体检",
					"content": "胎监（34周）"
				},
				{
					"id": "3",
					"item": "GDM",
					"time": "18",
					"event": "产前诊断",
					"content": "胎监（34周）"
				},
			]
    };
  }

  planConfig() {
    return {
      rows: [
        {
          columns: [
            { name: "gestation(周)[孕周]", type: "input", span: 6 },
            {
              name: "item[产检项目]",
              type: "select",
              span: 7,
              options: baseData.cjOptions
            },
            { name: "event[提醒事件]", type: "input", span: 8 },
            {
              type: "button",
              span: 3,
              text: "添加",
              color: "#1890ff",
							size: "small",
							onClick:this.addRecentRvisit.bind(this)
            }
          ]
        }
      ]
    };
	}
	
	newPlanConfig() {
    return {
      rows: [
        {
          columns: [
            { name: "name[诊疗计划组名字]", type: "input", span: 12 },
          ]
				},
				{
          columns: [
            { name: "gestation(周)[孕周]", type: "input", span: 6 },
            {
              name: "item[产检项目]",
              type: "select",
              span: 7,
              options: baseData.cjOptions
            },
            {
              type: "button",
              span: 3,
              text: "添加",
              color: "#1890ff",
              size: "small"
            }
          ]
        }
      ]
    };
  }
  componentDidMount() {

    service.fuzhen.getRecentRvisitList().then(res => this.setState({ planDataList: res.object }));

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
    
    const handelTableChange = (e, value) => {
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


    const initTable = data => tableRender(baseData.planKey(), data, { pagination: false, buttons: [{title: '删除', fn: handleDelete}], editable: true, onChange: handelTableChange});
    return <div>{newPlanDataList.length > 0 ? initTable(newPlanDataList) : ""}</div>;
  }

  renderRightTree() {
		const { treeDate } = this.state;
					
			/**
     * 管理诊疗计划组窗口
     */
    const renderMplanModal = () => {
      const { isShowMplanModal, planGroup } = this.state;
      const handleClick = (item) => { this.setState({isShowMplanModal: false})}
			const initTable = data => tableRender(baseData.managePlanKey(), data, { pagination: false, buttons: null, editable: true});
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
			const { isShowNewplanModal, planGroup, planEntity } = this.state;
			const handleClick = (item) => { this.setState({isShowNewplanModal: false})}
			const handleChange = () => {}
			const initTable = data => tableRender(baseData.newPlanKey(), data, { pagination: false, buttons: null, editable: true});
      return (
				<Modal width="60%" footer={null} title={<Button className="blue-btn" type="ghost" onClick={() => {this.onReturn(4)}}>返回</Button>} 
					visible={isShowNewplanModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
					{formRender(planEntity, this.newPlanConfig(), handleChange())}
          <div>{planGroup.length > 0 ? initTable(planGroup) : ""}</div>
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
      <div>
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
