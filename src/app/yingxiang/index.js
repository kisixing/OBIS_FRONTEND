import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from '../../render/page';
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      tableData: [
				{
          "id": 1,
					"title": "1",
					"result": "GDM",
					"time": "8",
					"type": "B超",
          "doctor": "胎监（34周）",
          "zd": "B超",
				}, 
        {
          "id": 2,
					"title": "1",
					"result": "GDM",
					"time": "8",
					"type": "B超",
          "doctor": "胎监（34周）",
          "zd": "B超",
        }, 
        {
          "id": 3,
					"title": "1",
					"result": "GDM",
					"time": "8",
					"type": "B超",
          "doctor": "胎监（34周）",
          "zd": "B超",
        }, 
        {
          "id": 4,
					"title": "1",
					"result": "GDM",
					"time": "8",
					"type": "B超",
          "doctor": "胎监（34周）",
          "zd": "B超",
        }, 
			]
    }
  }

  renderTable() {
    const {tableData} = this.state;
    const title = () => '影像检查报告';
    const columns = [
      { title: '标题', dataIndex: 'title', key: 'title' },
      { title: '结果', dataIndex: 'result', key: 'result' },
      { title: '检查日期', dataIndex: 'time', key: 'time' },
      { title: '类型', dataIndex: 'type', key: 'type' },
      { title: '报告医生', dataIndex: 'doctor', key: 'doctor' },
      { title: '诊断', dataIndex: 'zd', key: 'zd' },
      { title: '查看报告', key: 'operation', render: () => <Button type="primary" onClick={() => this.setState({isShowModal: true})}>查看</Button> },
    ];

    return (
      <Table
        title={title}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      />
    )
  }

  renderModal() {
    const { isShowModal } = this.state;
    const handleClick = (item) => { this.setState({isShowModal: false})}
    return (
      <Modal width="60%" footer={null} visible={isShowModal} 
              onOk={() => handleClick(true)} onCancel={() => handleClick(false)}>
                影像报告
      </Modal>
    )
  }

  render() {
    return (
      <Page className='yingxiang font-16 ant-col'>
        <Row>
          <Col span={16}>
            {this.renderTable()}
            {this.renderModal()}
          </Col>
        </Row>
      </Page>
    )
  }
}