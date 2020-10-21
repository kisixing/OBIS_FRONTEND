import React, { Component } from "react";
import { Checkbox, Button, Modal, Icon } from 'antd';
import service from '../../../service';

export default class Index extends Component{
  constructor(props) {
    super(props);
    this.state = {
      checkItems: this.props.checkHighriskSign
    }
  }

  componentDidMount() {
    const { checkHighriskSign } = this.props;
    const allItem = JSON.parse(JSON.stringify(checkHighriskSign));
    allItem.forEach(item => { item.check = true });
    this.setState({ checkItems: allItem })
  }
    
  handleCancelEver = () => {
    const { checkItems } = this.state;
    const { onClose, userDoc } = this.props;
    checkItems.forEach(item => {
      if (item.check) {
        service.closeHighriskAlert(userDoc.userid, item.highrisk, 4);
      } 
    })
    onClose('isShowSignModal');
  }

  handleCancel = () => {
    const { onClose } = this.props;
    onClose('isShowSignModal');
  }

  handleOk = () => {
    const { checkItems } = this.state;
    const { onClose, userDoc } = this.props;
    checkItems.forEach(async (item) => {
      if (item.check) {
        await service.addHighrisk(userDoc.userid, `\n${item.highrisk}`, item.level);
      } 
    })
    onClose('isShowSignModal');
  }

  buttons = () => {
    return (
      <div>
        <Button onClick={this.handleCancelEver}>关闭，不再提示</Button>
        <Button onClick={this.handleCancel}>关闭</Button>
        <Button type="primary" onClick={this.handleOk}>确定标记</Button>
      </div>
    )
  }

  onChange = (e, index) => {
    const { checkItems } = this.state;
    const cloneItem = JSON.parse(JSON.stringify(checkItems));
    cloneItem[index].check = e.target.checked;
    this.setState({ checkItems: cloneItem });
  }

  render(){
    const { checkHighriskSign, isShowSignModal } = this.props;
    return (
      <Modal 
        visible={isShowSignModal}
        onCancel={this.handleCancel}
        footer={this.buttons()}
        title={<span><Icon type="exclamation-circle" style={{color: "#FB9824"}} /> 请确定标记高危因素：</span>}
      >
      {
        checkHighriskSign.map((item, index) => (
          <div>
            <Checkbox defaultChecked={true} onChange={(e) => this.onChange(e, index)}>
              {item.highrisk}
            </Checkbox>
          </div>
        ))
      }
    </Modal>
    )
  }
}
