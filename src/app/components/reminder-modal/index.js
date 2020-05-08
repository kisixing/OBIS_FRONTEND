import React, { Component } from "react";
import { Button, Icon, Modal, message } from 'antd';
import service from '../../../service';
import './index.less';
import store from '../../store';
import { closeReminderAction, szListAction, getUserDocAction, getAlertAction, fzListAction, showReminderAction } from "../../store/actionCreators.js";

export default class SYPmodal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState(),
    }
    store.subscribe(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(store.getState());
  };

  /**
   * 诊断提醒窗口
   */
  renderReminder() {
    const { allReminderModal, isOpenMedicalAdvice, relatedid, whichPage, szList, fzList } = this.state;
 
    const handelClose = (index, item, bool) => {
      const action = closeReminderAction(index);
      store.dispatch(action);

      if (!bool) {
        service.shouzhen.closeRemind(item.content).then(res => console.log(res))
      }
      if (bool && whichPage === 'sz') {
        szList.push({ 'data': item.diagnosis, 'highriskmark': ''});
        const action = szListAction(szList);
        store.dispatch(action);
        service.shouzhen.batchAdd(1, relatedid, szList).then(res => {
          message.info('诊断添加成功！');
          service.getuserDoc().then(res => {
            const action = getUserDocAction(res.object);
            store.dispatch(action);
          })
          service.shouzhen.uploadHisDiagnosis(1).then(res => { })
          service.shouzhen.getList(1).then(res => {
            const action = szListAction(res.object);
            store.dispatch(action);
          })
        })
        service.fuzhen.checkHighriskAlert(item.diagnosis).then(res => {
          let data = res.object;
          if(data.length > 0) {
            data.map(item => ( item.visible = true ))
          }
          const action = getAlertAction(data);
          store.dispatch(action);
        })
      } else if (bool && whichPage === 'fz') {
        fzList.push({ 'data': item.diagnosis, 'highriskmark': ''});
        const action = fzListAction(fzList);
        store.dispatch(action);
        service.shouzhen.batchAdd(2, relatedid, fzList).then(res => {
          message.info('诊断添加成功！');
          service.getuserDoc().then(res => {
            const action = getUserDocAction(res.object);
            store.dispatch(action);
          })
          service.shouzhen.uploadHisDiagnosis(2).then(res => { })
          service.shouzhen.getList(2).then(res => {
            const action = fzListAction(res.object);
            store.dispatch(action);
          })
        })
        service.fuzhen.checkHighriskAlert(item.diagnosis).then(res => {
          let data = res.object;
          if(data.length > 0) {
            data.map(item => ( item.visible = true ))
          }
          const action = getAlertAction(data);
          store.dispatch(action);
        })
      }

      if (index === 0) {
        const action2 = showReminderAction(false);
        store.dispatch(action2);
      }
      if (index === 0 && isOpenMedicalAdvice) {
        common.closeWindow();
      }

    };

    const goToOpen = () => {
      common.closeWindow();
    }

    const footer = (index, item) => {
      return (
        <div>
          {isOpenMedicalAdvice ? <Button onClick={() => goToOpen()}>取消, 开立医嘱</Button> : null}
          <Button onClick={() => handelClose(index, item, false)}>{isOpenMedicalAdvice ? '取消并返回' : '取消'}</Button>
          <Button type="primary" onClick={() => handelClose(index, item, true)}>确定</Button>
        </div>
      )
    }

    return allReminderModal && allReminderModal.length > 0  ?
    allReminderModal.map((item, index) => item.visible ? 
      (
        <Modal className="reminder-wrapper" title={<span><Icon type="exclamation-circle" style={{color: "#FCCD68"}} /> 请注意！</span>}
          visible={item.visible} maskClosable={false} footer={footer(index, item)} onCancel={() => handelClose(index)} >
          <div className="reminder-content"><span className="reminder-word">{item.content}</span>,是否添加诊断</div>
          <div className="reminder-item">{item.diagnosis}</div>
        </Modal>
      )
      : null
    )
    : null;
  }


  render() {
    return (
      <div className="reminder-modal">
        {this.renderReminder()}
      </div>
    )
  }
}