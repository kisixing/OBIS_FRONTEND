import React, { Component } from "react";
import { Row, Col, Button, Table, Collapse, Modal } from "antd";
import Page from '../../render/page';
import tableRender from "../../render/table";
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      leftList: [
				{
          "id": '1',
          "title": "24+4周 2019-09-2",
          "child": [
            {"name": "NT(报告)", "status": "正常"},
          ],
					"wy": "外院",
        },
        {
          "id": '2',
          "title": "24+4周 2019-09-2",
          "child": [
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "待审阅"},
            {"name": "NT(报告)", "status": "待审阅"},
            {"name": "NT(报告)", "status": "待审阅"},
          ],
					"wy": "",
        },
        {
          "id": '3',
          "title": "24+4周 2019-09-2",
          "child": [
            {"name": "NT(报告)", "status": "待审阅"},
            {"name": "NT(报告)", "status": "待审阅"},
            {"name": "NT(报告)", "status": "待审阅"},
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
          ],
					"wy": "外院",
        },
        {
          "id": '4',
          "title": "24+4周 2019-09-2",
          "child": [
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
            {"name": "NT(报告)", "status": "正常"},
          ],
					"wy": "外院",
				},
      ],
      
    tableKey: [
        {
          title: '检验项目',
          key: 'item',
        },
        {
          title: '结果',
          key: 'result',
        },
        {
          title: '单位',
          key: 'dw',
        },
        {
          title: '参考值',
          key: 'val',
        },
        {
          title: '状态',
          key: 'status',
        }
      ],

      tableData: [
        {"item": "霉菌", "result": "未见", "dw": "22", "val": '1', "status": ""},
        {"item": "清洁度", "result": "未见", "dw": "22", "val": '1', "status": ""},
        {"item": "霉菌", "result": "未见", "dw": "22", "val": '1', "status": ""},
      ]
    }
  }

  renderLeft() {
    const {leftList} = this.state;
    return (
      <div className="jianyan-left ant-col-5">
        <Collapse defaultActiveKey={["1", "2"]}>
          {
            leftList&&leftList.map(item => (
              <Collapse.Panel header={item.title} key={item.id}>
                {
                  item.child.map(subItem => (
                    <div className="left-item">                   
                      <p>{subItem.name}</p>
                      <Button className={subItem.status=="正常" ? "left-btn normal" : "left-btn"} size="small">{subItem.status}</Button>
                    </div>
                  ))
                }
              <span className="left-lable">{item.wy}</span>
              </Collapse.Panel>
            ))
          }
        </Collapse>
      </div>
    )
  }

  renderRight() {
    const {tableKey, tableData, isShowModal} = this.state;
    const initTable = data => tableRender(tableKey, data, { pagination: false, buttons: null, editable: true});

    const renderTable = () => {
      return (
        <div className="right-wrapper">
          <div className="right-title">
            <p><span className="right-words">NT报告 </span>检验报告单</p>
            <Button className="right-btn" type="primary" size="small" onClick={() => this.setState({isShowModal: true})}>审阅</Button>
          </div>
          <ul className="right-msg">
            <li className="msg-item">检验单号 8346833</li>
            <li className="msg-item">送检</li>
            <li className="msg-item">姓名</li>
            <li className="msg-item">性别</li>
            <li className="msg-item">年龄</li>
            <li className="msg-item">标本部位</li>
          </ul>
          <div>{initTable(tableData)}</div>
        </div>
      )
    }

    const renderModal = () => {
      const handleClick = (item) => { this.setState({isShowModal: false})}
      return (
        <Modal width="60%" visible={isShowModal} onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
          {renderTable()}
        </Modal>
      )
    }
    
    return (
      <div className="jianyan-right ant-col-18">
        {renderTable()}
        {renderModal()}
      </div>
    )
  }

  render() {
    return (
      <Page className='jianyan font-16 ant-col'>
        {this.renderLeft()}
        {this.renderRight()}
      </Page>
    )
  }
}