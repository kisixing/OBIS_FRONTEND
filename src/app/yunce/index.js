import React, { Component } from "react";
import { Table } from "antd";
import Page from '../../render/page';
import service from "../../service";
import store from "../store";
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  async componentDidMount() {
    const { allFormData } = this.state;
    const resPreg = await service.shouzhen.findPregnancyDoc(allFormData.gravidaInfo.useridno);
    this.setState({ tableData: resPreg.object.docs });
  }

  renderTable() {
    const { tableData, userDoc } = this.state;
    const title = () => '孕册列表';
    const getState = text => {
      let state = '';
      switch (text) {
        case '0':
          state = '待确认';
          break;
        case '1':
          state = '怀孕中';
          break;
        case '2':
          state = '转院';
          break;
        case '3':
          state = '终止妊娠';
          break;
        case '4':
          state = '已分娩';
          break;
        case '5':
          state = '失访';
          break;     
        default:
          break;
      }
      return state;
    }

    const changeUrlArg = (url, arg, val) => {
      const pattern = arg+'=([^&]*)';
      const replaceText = arg+'='+val;
      return url.match(pattern) 
              ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) 
              : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
    }

    const getRowClassName = (record) => {
      if (record.chanjno === userDoc.chanjno) return 'active-row';
      return '';
    }

    const handleRowClick = (record) => {
      if (record.chanjno === userDoc.chanjno) return;
      let url = window.location.href;   
      window.open(changeUrlArg(url, 'usermcno', record.usermcno), '_self');
    }

    const columns = [
      { title: 'NO', dataIndex: 'index', key: 'index', width: 50, render: (text, record, index) => index + 1 },
      { title: '末次月经', dataIndex: 'gesmoc', key: 'gesmoc', width: 100 },
      { title: '预产期', dataIndex: 'gesexpectrv', key: 'gesexpectrv', width: 100 },
      { title: '建档号', dataIndex: 'chanjno', key: 'chanjno', width: 100 },
      { title: '状态', dataIndex: 'currstate', key: 'currstate', width: 50, render: text => getState(text) },
    ];

    return (
      <Table 
        title={title} 
        onRowClick={handleRowClick} 
        rowClassName={getRowClassName} 
        columns={columns} 
        dataSource={tableData} 
        pagination={false}
      />
    )
  }

  render() {
    return (
      <Page className='yunce'>
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>
        {this.renderTable()}
      </Page>
    )
  }
}