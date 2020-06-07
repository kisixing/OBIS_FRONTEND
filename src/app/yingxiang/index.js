import React, { Component } from "react";
import { Button, Table, Modal } from "antd";
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
      const pdfPath = service.getUrl(record.pdfPath);
      this.setState({pdfPath}, () => {
        this.setState({isShowModal: true})
      })
    }

    const columns = [
      { title: '标题', dataIndex: 'title', key: 'title', width: 331 },
      { title: '检查日期', dataIndex: 'sendDate', key: 'sendDate', width: 128, render: (text, record) => text && text.substr(0, 10)},
      { title: '报告医生', dataIndex: 'reportDoctor', key: 'reportDoctor', width: 117 },
      { title: '诊断', dataIndex: 'diagnosis', key: 'diagnosis', width: 308 },
      { title: '结论', dataIndex: 'result', key: 'result', width: 531 },
      { title: '查看报告', key: 'operation', width: 131, render: (text, record) => <Button icon="eye-o" className="eye-btn" onClick={() => handleBtnClick(text, record)}>查看</Button> },
    ];

    return (
      <Table title={title} columns={columns} dataSource={tableData} pagination={false}/>
    )
  }

  renderModal() {
    const { isShowModal, pdfPath } = this.state;
    const handleClick = () => { 
      this.setState({
        isShowModal: false,
        pdfPath: ''
      })
    }
    return (
      <Modal width="60%" footer={null} visible={isShowModal} title="影像检查报告"
             onOk={() => handleClick(true)} onCancel={() => handleClick()}>
        <embed src={pdfPath} width="100%" height="1200" />
        {/* <embed src={'../../assets/static-img/yx.pdf'} width="100%" height="1200" /> */}
      </Modal>
    )
  }

  render() {
    return (
      <Page className='yingxiang'>
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>
        {this.renderTable()}
        {this.renderModal()}
      </Page>
    )
  }
}