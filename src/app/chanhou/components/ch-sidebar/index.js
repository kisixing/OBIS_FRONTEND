import React, { Component } from "react";
import { Collapse } from 'antd';
import { get } from 'lodash';
import service from '../../../../service';

export default class RegForm extends Component {
  state = {
    chargeRecord: null
  };

  async componentDidMount() {
    const res = await service.chanhou.getDischargeRecord();
    this.setState({ chargeRecord: get(res, 'object') });
  }

  render() {
    const { chargeRecord } = this.state;

    return (
      <div>
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Collapse.Panel header="出院诊断" key="1">
            {get(chargeRecord, 'dischargeDiagnosis')}
          </Collapse.Panel>
          <Collapse.Panel header="出院情况及治疗结果" key="2">
            {get(chargeRecord, 'dischargeState')}
          </Collapse.Panel>
          <Collapse.Panel header="出院医嘱" key="3">
            {get(chargeRecord, 'conclusion')}
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  }
}