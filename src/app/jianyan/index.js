import React, { Component } from "react";
import { Table, Collapse, Icon } from "antd";
import Page from '../../render/page';
import service from '../../service';
import "./index.less";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      reportList: [],
      detailData: {}, 
      repResult: '2',
      repRemarks: '',
      repSign: '',
      repId: '',
      repAmy: true,
    }
  }

  componentDidMount() {
    service.jianyan.getLisReport().then(res => this.setState({ reportList: res.object }));
  }

  renderLeft() {
    const {reportList} = this.state;

    const getDetail = (id, bool) => {
      service.jianyan.getLisDetail(id, bool).then(res => this.setState({ detailData: res.object }));

      service.jianyan.checkReport("已看", "", "", id, bool).then(res => {
        service.jianyan.getLisReport().then(res => this.setState({ reportList: res.object }));
      });

      if(bool) {
        this.setState({ repAmy: true, repId: id })
      } else {
        this.setState({ repAmy: false, repId: id })
      }
    }

    return (
      <div className="jianyan-left ant-col-5">
        <Collapse defaultActiveKey={["0", "1", "2"]}>
          {
            reportList&&reportList.map(item => (
              <Collapse.Panel header={<p><Icon type="calendar" />{item.groupTitle}</p>} key={item.id}>
                {
                  item.data.map(subItem => (
                    <div className="left-item" onClick={() => {subItem.isAmy ? getDetail(subItem.amyId, true) : getDetail(subItem.sampleno)}}>    
                      {!subItem.state ? <span className="left-state">新</span> : null}       
                      <p className="left-title">{subItem.title}</p>
                      {/* <Button className={subItem.state==="2" ? "left-btn normal" : "left-btn"} size="small">
                        {subItem.state===null ? '待审阅' : (subItem.state==='1' ? '已看' : (subItem.state==='2' ? '正常' : '异常'))}
                      </Button> */}
                      {subItem.isAmy ? <span className="left-lable">外院</span> : null}
                    </div>
                  ))
                }
              </Collapse.Panel>
            ))
          }
        </Collapse>
      </div>
    )
  }

  renderRight() {
    const { isShowModal, detailData, repAmy} = this.state;

    const renderTable = () => {
      const columns = [
        { title: '检验项目', dataIndex: 'item', key: 'item', width: 331 },
        { title: '结果', dataIndex: 'result', key: 'result', width: 128 },
        { title: '单位', dataIndex: 'unit', key: 'unit', width: 117 },
        { title: '参考值', dataIndex: 'reference', key: 'reference', width: 332 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 200 },
      ];

      const setClassName = (record, index) => {
          if(record.status=="↑" || record.status=="异常" || record.status=="↓") {
            return 'redClass';
          }
          return '';
        }

      return (
        <div className="right-wrapper">
          <div className="right-top">
            <p className="right-title"><span className="right-words">{detailData.title} 检验报告单</span></p>
            {/* {
              !isShowModal ?
              <Button className="right-btn" type="primary" size="small" onClick={() => this.setState({isShowModal: true})}>审阅</Button>
              : null
            } */}
            <div className="right-doctor">首阅医生：{detailData.firstChecker}</div>
          </div>
          <ul className="right-msg">
            <li className="msg-item">检验单号: {detailData.sampleno}</li>
            <li className="msg-item">送检: {detailData.sender}</li>
            <li className="msg-item">姓名: {detailData.name}</li>
            <li className="msg-item">性别: {detailData.sex}</li>
            <li className="msg-item">年龄: {detailData.age}</li>
            <li className="msg-item">标本部位: {detailData.specimen}</li>
          </ul>
          <div>
            { !repAmy 
                ? <Table columns={columns} dataSource={detailData.lisDetails} pagination={false} rowClassName={(record, index) => setClassName(record, index)} /> 
                : null
            }
          </div>
        </div>
      )
    }

    // const renderModal = () => {
    //   const {repResult, repRemarks, repSign, repId, repAmy} = this.state;
    //   const handleClick = (bool) => { 
    //     this.setState({isShowModal: false})
    //     if(bool) {
    //       service.jianyan.checkReport(repResult, repRemarks, repSign, repId, repAmy).then(res => {
    //         service.jianyan.getLisReport().then(res => this.setState({ reportList: res.object }));
    //       });
    //       console.log(repResult, repRemarks, repSign, repId, repAmy)
    //     }
    //   };

    //   const stateChange = (value) => {
    //     this.setState({repResult: value})
    //   }

    //   const remarksChange = (e) => {
    //     this.setState({repRemarks: e.target.value})
    //   }

    //   const signChange = (e) => {
    //     this.setState({repSign: e.target.value})
    //   }

    //   const footer = [
    //     <div>
    //       <div className="right-modal">
    //         <span className="modal-item">报告结果：   
    //           <Select defaultValue="正常" style={{ width: 60 }} onChange={stateChange}>
    //             <Select.Option value="2">正常</Select.Option>
    //             <Select.Option value="3">异常</Select.Option>
    //           </Select>
    //         </span>
    //         <span className="modal-item">报告备注： <Input style={{ width: 120 }} value={repRemarks} onChange={e => remarksChange(e)}/></span>
    //         <span className="modal-item">医生签名： <Input style={{ width: 120 }} value={repSign} onChange={e => signChange(e)}/></span>
    //       </div>
    //       <Button onClick={() => handleClick()}>关闭</Button>
    //       <Button type="primary" onClick={() => handleClick(true)}>保存</Button>
    //     </div>
    //   ];

    //   return (
    //     <Modal width="70%" visible={isShowModal} footer={footer} onCancel={() => handleClick()}>
    //       {renderTable()}
    //     </Modal>
    //   )
    // }
    
    return (
      <div className="jianyan-right ant-col-18">
        {renderTable()}
        {/* {renderModal()} */}
      </div>
    )
  }

  render() {
    return (
      <Page className='jianyan'>
        <div className="bgWhite" style={{ position: "fixed", top: "104px", left: "0", right: "0", bottom: "0"}}></div>  
        {this.renderLeft()}
        {this.renderRight()}
      </Page>
    )
  }
}