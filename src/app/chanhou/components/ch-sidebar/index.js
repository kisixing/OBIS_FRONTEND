import React, { Component } from "react";
import { Collapse, Button } from 'antd';
import service from '../../../../service';
import store from '../../../store';

export default class RegForm extends Component {
  constructor(props) {
    super(props);
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  render() {
    return (
      <div>
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Collapse.Panel header="出院诊断" key="1">
            111
          </Collapse.Panel>
          <Collapse.Panel header="出院情况及治疗结果" key="2">
            222
          </Collapse.Panel>
          
          <Collapse.Panel header="出院医嘱" key="3">
            333
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  }
}