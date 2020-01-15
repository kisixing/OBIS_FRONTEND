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
      tableData: [
        {
          'afterBreakfast': "5.7",
          'afterBreakfastNote': "早餐一杯即食燕麦，一个鸡蛋，1.5个葱花卷",
          'afterDinner': "7.2",
          'afterDinnerNote': "晚餐白米饭半碗，鱼一份，瘦肉一份，豆腐一份，青菜一份，火龙果加桃子100g。",
          'afterLunch': "6.9",
          'afterLunchNote': "白米饭半碗，青菜一份，排骨焖冬菇一份，豆腐汤两口，炸鱼腩一小块",
          'beforeBreakfast': "5.3",
          'beforeBreakfastNote': "",
          'beforeDinner': "4.9",
          'beforeDinnerNote': "",
          'beforeLunch': "4.3",
          'beforeLunchNote': "",
          'beforeSleep': "6.7",
          'beforeSleepNote': "晚餐后加餐2/3块全麦面包",
          'date': "2019-06-25",
        }
      ]
    }
  }

  renderTable() {
    const {tableKey, tableData} = this.state;
    const initTable = data => tableRender(tableKey, data, { pagination: false, buttons: null, editable: true});

    return (
      <div>{initTable(tableData)}</div>
    )
  }

  render() {
    return (
      <Page className='xuetang font-16 ant-col'>
        <Row>
          <Col span={24}>
            {this.renderTable()}
          </Col>
        </Row>
      </Page>
    )
  }
}