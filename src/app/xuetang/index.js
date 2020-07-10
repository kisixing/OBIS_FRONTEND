import React, { Component } from "react";
import { Button, Table } from "antd";
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

  async componentDidMount() {
    const res = await service.xuetang.getUserBloodGlucose();
    this.setState({tableData: res.object});
  }

  renderTable() {
    const  { tableData } = this.state;
    const title = () => (
      <div className="title-wrapper">
        <span>血糖记录</span>
        <Button icon="print-blue" className="print-btn" size="small" onClick={this.handleBtnClick}>导出</Button>
      </div>
    );
    const columns = [
      { title: '日期', dataIndex: 'date', key: 'date', width: 80 },
      { title: '早餐前', dataIndex: 'beforeBreakfast', key: 'beforeBreakfast', width: 80,
        render: (text, record) => setClassName(text, record, 1) },
      { title: '备注', dataIndex: 'beforeBreakfastNote', key: 'beforeBreakfastNote', width: 300 },
      { title: '早餐后', dataIndex: 'afterBreakfast', key: 'afterBreakfast',  width: 80,
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterBreakfastNote', key: 'afterBreakfastNote', width: 300 },
      { title: '午餐后', dataIndex: 'afterDinner', key: 'afterDinner',  width: 80,
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterDinnerNote', key: 'afterDinnerNote', width: 300 },
      { title: '晚餐后', dataIndex: 'afterLunch', key: 'afterLunch',  width: 80,
        render: (text, record) => setClassName(text, record, 2) },
      { title: '备注', dataIndex: 'afterLunchNote', key: 'afterLunchNote', width: 300 },
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
      <Table title={title} className="xt-table" columns={columns} dataSource={tableData} pagination={false}/> 
    )
  }

  handleBtnClick() {
    $(".xt-table").jqprint();
  }

  render() {
    return (
      <Page className='xuetang'>
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>
        {this.renderTable()}
      </Page>
    )
  }
}