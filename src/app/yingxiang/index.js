import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from '../../render/page';
import "./index.less";
import service from "../../service";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      tableData: [],
      pdfPath: ''
    }
  }

  componentDidMount() {
    service.yingxiang.getPacsData().then(res => {
      this.setState({tableData: res.object})
    })
  }

  renderTable() {
    const {tableData} = this.state;
    const title = () => '影像检查报告';
    const handleBtnClick = (text, record) => {
      this.setState({pdfPath: record.pdfPath}, () => {
        this.setState({isShowModal: true})
      })
    }

    const columns = [
      { title: '标题', dataIndex: 'title', key: 'title' },
      { title: '结果', dataIndex: 'result', key: 'result' },
      { title: '检查日期', dataIndex: 'sendDate', key: 'sendDate' },
      { title: '类型', dataIndex: 'type', key: 'type' },
      { title: '报告医生', dataIndex: 'reportDoctor', key: 'reportDoctor' },
      { title: '诊断', dataIndex: 'diagnosis', key: 'diagnosis', width: 350 },
      { title: '查看报告', key: 'operation', render: (text, record) => <Button type="primary" onClick={() => handleBtnClick(text, record)}>查看</Button> },
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
    const { isShowModal, pdfPath } = this.state;
    const handleClick = () => { this.setState({isShowModal: false})}
    return (
      <Modal width="60%" footer={null} visible={isShowModal} title="影像检查报告"
             onOk={() => handleClick(true)} onCancel={() => handleClick()}>
        <embed src={pdfPath} width="600" height="600" />
      </Modal>
    )
  }

  render() {
    return (
      <Page className='yingxiang font-16 ant-col'>
        <Row>
          <Col span={18}>
            {this.renderTable()}
            {this.renderModal()}
          </Col>
        </Row>
      </Page>
    )
  }
}