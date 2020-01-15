import React, { Component } from "react";
import { Row, Col, Button, Table, Modal } from "antd";
import Page from '../../render/page';
import tableRender from "../../render/table";
import service from '../../service';
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableKey: [
        {
          title: '日期',
          key: 'date',
        },
        {
          title: '早餐前',
          key: 'beforeBreakfast',
        },
        {
          title: '备注',
          key: 'beforeBreakfastNote',
        },
        {
          title: '早餐后',
          key: 'afterBreakfast',
        },
        {
          title: '备注',
          key: 'afterBreakfastNote',
        },
        {
          title: '午餐前',
          key: 'beforeDinner',
        },
        {
          title: '备注',
          key: 'beforeDinnerNote',
        },
        {
          title: '午餐后',
          key: 'afterDinner',
        },
        {
          title: '备注',
          key: 'afterDinnerNote',
        },

        {
          title: '晚餐前',
          key: 'beforeLunch',
        },
        {
          title: '备注',
          key: 'beforeLunchNote',
        },
        {
          title: '晚餐后',
          key: 'afterLunch',
        },
        {
          title: '备注',
          key: 'afterLunchNote',
        },
        {
          title: '睡前',
          key: 'beforeSleep',
        },
        {
          title: '备注',
          key: 'beforeSleepNote',
        },
      ],
      tableData: []
    }
  }

  componentDidMount() {
    service.xuetang.getUserBloodGlucose().then(res => {
      this.setState({tableData: res.object})
    })
  }

  renderTable() {
    const {tableKey, tableData} = this.state;
    const initTable = data => tableRender(tableKey, data, { pagination: false, buttons: null, editable: true});

    return (
      <div>{initTable(tableData)}</div>
    )
  }

  handleBtnClick() {
    window.print();
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