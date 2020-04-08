import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from '../../render/page';
import service from '../../service';
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    }
  }

  componentDidMount() {
    service.xuetang.getUserBloodGlucose().then(res => {
      this.setState({tableData: res.object})
    })
  }

  renderTable() {
    const  { tableData } = this.state;
    const columns = [
      { title: '日期', dataIndex: 'date', key: 'date' },
      { title: '早餐前', dataIndex: 'beforeBreakfast', key: 'beforeBreakfast',
        render: (text, record) => setClassName(text, record, 1) },
      { title: '备注', dataIndex: 'beforeBreakfastNote', key: 'beforeBreakfastNote', width: 380 },
      { title: '早餐后', dataIndex: 'afterBreakfast', key: 'afterBreakfast', 
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterBreakfastNote', key: 'afterBreakfastNote', width: 380 },
      { title: '午餐后', dataIndex: 'afterDinner', key: 'afterDinner', 
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterDinnerNote', key: 'afterDinnerNote', width: 380 },
      { title: '晚餐后', dataIndex: 'afterLunch', key: 'afterLunch', 
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterLunchNote', key: 'afterLunchNote', width: 380 },
    ];

    const setClassName = (text, record, index) => {
      if (index === 1 && text > 5.3) {
        return (<span style={{color: 'red'}}>{text}</span>);
      }
      if (index === 2 && text > 6.7) {
        return (<span style={{color: 'red'}}>{text}</span>);
      }
      return text;
    }

    return (
      <div>
        <Table className="xt-table" columns={columns} dataSource={tableData} pagination={false}/> 
      </div>
    )
  }

  handleBtnClick() {
    $(".xt-table").jqprint();
  }

  render() {
    return (
      <Page className='xuetang font-16 ant-col'>
        <Row>
          <Col span={24}>
            <Button type="primary" onClick={this.handleBtnClick}>导出</Button>
            {this.renderTable()}
          </Col>
        </Row>
      </Page>
    )
  }
}