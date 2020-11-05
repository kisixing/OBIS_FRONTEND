import React, { Component } from "react";
import { Modal } from 'antd';
import formRender from '../../../../render/form';

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      changeData: null
    }
  }

  render() {
    const { changeData } = this.state;
    const { isShowBloodPressure, initData, closeModal } = this.props;

    const handelCancel = () => {
      closeModal('isShowBloodPressure');
    }

    const handelOk = () => {
      closeModal('isShowBloodPressure', changeData);
    }

    const handleChange = (e, { name, value }) => {
      let cloneData = JSON.parse(JSON.stringify(initData));
      let data = {[name]: value};
      if (changeData) {
        this.setState({ changeData: { ...changeData, ...data } });
      } else {
        this.setState({ changeData: { ...cloneData, ...data } });
      }
    }

    const config = () => {
      return {
        rows: [
          {
            columns: [
              { name: "ckshrinkpressure(/)[首测]", type: "input", valid: 'rang(90,130)', span: 9 },
              { name: "ckdiastolicpressure(mmHg)", type: "input", valid: 'rang(60,90)', span: 7 },
            ]
          },
          {
            columns: [
              { name: "secondBpSystolic(/)[二测]", type: "input", valid: 'rang(90,130)', span: 9 },
              { name: "secondBpDiastolic(mmHg)", type: "input", valid: 'rang(60,90)', span: 7 },
            ]
          },
          {
            columns: [
              { name: "threeBpSystolic(/)[三测]", type: "input", valid: 'rang(90,130)', span: 9 },
              { name: "threeBpDiastolic(mmHg)", type: "input", valid: 'rang(60,90)', span: 7 },
            ]
          },
        ]
      }
    }

    return (
      <Modal 
        className="pressure-modal" 
        title='编辑血压' 
        width={400} 
        visible={isShowBloodPressure}
        onCancel={handelCancel} 
        onOk={e => handelOk(e)}
      >
        {formRender(initData, config(), handleChange)}
      </Modal>
    );
  }
}