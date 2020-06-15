import React, { Component } from "react";
import { Select, Button, DatePicker, Modal, Icon } from 'antd';
import * as util from '../../fuzhen/util';
import service from '../../../service';

export default class Index extends Component{
  constructor(props) {
    super(props);
    this.state = {
      menzhenDate: new Date(),
      orderData: null,
      selectList: ["本周五", "下周五", "下下周五"],
      hasAppointment: false
    }
  }

  async componentDidMount() {
    const { selectList } = this.state;
    const res = await service.shouzhen.findOutpatientAppointment();
    if (res.object && res.object[0]) {
      this.setState({
        orderData: res.object[0]
      });
      selectList.forEach(item => {
        if (res.object[0].appointmentDate === util.getOrderTime(item)) {
          this.setState({
            hasAppointment: true,
            menzhenDate: res.object[0].appointmentDate
          })
        }
      })
    }
  }

  /**
   *预约窗口
   */
  renderMenZhen() {
    const { openMenzhen, closeMenzhen } = this.props;
    const { menzhenDate, selectList, orderData, hasAppointment } = this.state;

    const panelChange = (date, dateString) => {
      this.setState({ 
        menzhenDate: dateString 
      })
    }

    const timeSelect = v => {
      this.setState({
        menzhenDate: util.getOrderTime(v)
      })
    }

    const onCancel = () => {
      closeMenzhen();
    }

    const onOk = () => {
      closeMenzhen();
      service.shouzhen.makeOutpatientAppointment(menzhenDate);
    }

    const buttons = [
      <Button onClick={onCancel}>取消</Button>,
      <Button type="primary" onClick={onOk}>{ hasAppointment ? '改期' : '确定'}</Button>
    ];

    return (
      <Modal 
        visible={openMenzhen}
        onCancel={onCancel}
        footer={buttons}
        title={<span><Icon type="exclamation-circle" style={{color: "#FB9824"}} /> 请注意！</span>}
      >
        <span>糖尿病门诊预约</span>
          <Select onSelect={(value) => timeSelect(value)} style={{ width: 120 }}>
            {
              selectList.map(item => (
                <Select.Option 
                  value={item}
                  disabled={ orderData && orderData.appointmentDate === util.getOrderTime(item) ? true : false } 
                >
                  {item}
                </Select.Option>
              ))
            }
          </Select>
          <DatePicker value={menzhenDate} onChange={(date, dateString) => panelChange(date, dateString)}/>
      </Modal>
    )
  }

  render(){
    return (
      <div>
        {this.renderMenZhen()}
      </div>
    )
  }
}
