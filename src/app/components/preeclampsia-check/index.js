import React, { Component } from 'react';
import { Modal, Row, Col, Tree } from 'antd';
import service from '../../../service';
import './index.less';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      riskTemplate: [],
      riskCheckKeys: [],
      adviceTemplate: [],
      adviceCheckKeys: [],
    };
  }

  async componentDidMount() {
    const { allFormData } = this.props;
    const risk = await service.shouzhen.findTemplateTree(3);
    const advice = await service.shouzhen.findTemplateTree(4);

    let riskKeys = [];
    let adviceKeys = [];
    const bmi = allFormData.checkUp.ckbmi;
    const age = allFormData.gravidaInfo.userage;
    const chanc = allFormData.diagnosis.chanc;
    const diagnosisList = allFormData.diagnosisList;

    const childData = risk.object.data[0].child;
    if (bmi > 30) riskKeys.push(this.getTreeKey(childData, '肥胖（BMI>30)'));
    if (age > 35) riskKeys.push(this.getTreeKey(childData, '妊娠年龄超过35岁'));
    if (chanc === 1) riskKeys.push(this.getTreeKey(childData, '初次妊娠'));
    diagnosisList &&
      diagnosisList.forEach((item) => {
        if (item.data.indexOf('多胎') !== -1) {
          riskKeys.push(this.getTreeKey(childData, '多胎妊娠'));
        }
        if (item.data.indexOf('慢性高血压') !== -1) {
          riskKeys.push(this.getTreeKey(childData, '慢性高血压'));
        }
        if (item.data.indexOf('1型糖尿病') !== -1 || item.data.indexOf('2型糖尿病') !== -1) {
          riskKeys.push(this.getTreeKey(childData, '1型或 2型糖尿病'));
        }
        if (item.data.indexOf('肾炎') !== -1 || item.data.indexOf('肾脏') !== -1 || item.data.indexOf('肾病') !== -1) {
          riskKeys.push(this.getTreeKey(childData, '肾病'));
        }
        if (
          item.data.indexOf('SLE') !== -1 ||
          item.data.indexOf('系统性红斑狼疮') !== -1 ||
          item.data.indexOf('抗磷脂综合征') !== -1
        ) {
          riskKeys.push(this.getTreeKey(childData, '自身免疫性疾病（系统性红斑狼疮, 抗磷脂综合征）'));
        }
      });

    childData.forEach((item) => {
      if (item.note == 'true') riskKeys.push(String(item.id));
    });

    advice.object.data[0].child.forEach((item) => {
      if (item.note == 'true') adviceKeys.push(String(item.id));
    });

    this.setState({
      riskTemplate: risk.object.data,
      adviceTemplate: advice.object.data,
      riskCheckKeys: riskKeys,
      adviceCheckKeys: adviceKeys,
    });
  }

  getTreeKey = (arr, val) => {
    let treeId = '';
    arr.forEach((item) => {
      if (item.name === val) treeId = item.id;
    });
    return treeId.toString();
  };

  handleCancel = () => {
    const { onClose } = this.props;
    onClose('isShowPreeclampsiaCheck');
  };

  handleOk = async () => {
    const { riskTemplate, adviceTemplate } = this.state;
    const { onClose } = this.props;

    await service.shouzhen.saveTemplateTreeUser(3, riskTemplate);
    await service.shouzhen.saveTemplateTreeUser(4, adviceTemplate);
    onClose('isShowPreeclampsiaCheck');
  };

  handleCheckLeft = (keys, { checked }) => {
    const { riskTemplate } = this.state;
    riskTemplate.forEach((tt) => {
      tt.child.forEach((item) => {
        if (keys.includes(String(item.id))) {
          item.note = true;
        } else {
          item.note = null;
        }
      });
    });
    this.setState({ riskCheckKeys: keys, riskTemplate });
  };

  handleCheckRight = (keys, { checked }) => {
    const { adviceTemplate } = this.state;
    adviceTemplate.forEach((tt) => {
      tt.child.forEach((item) => {
        if (keys.includes(String(item.id))) {
          item.note = true;
        } else {
          item.note = null;
        }
      });
    });
    this.setState({ adviceCheckKeys: keys, adviceTemplate });
  };

  initTree = (arr) =>
    arr.map((node) => (
      <Tree.TreeNode key={node.id} title={node.name} className="modal-title">
        {node && node.child.map((item) => <Tree.TreeNode key={item.id} title={item.name}></Tree.TreeNode>)}
      </Tree.TreeNode>
    ));

  render() {
    const { riskTemplate, riskCheckKeys, adviceTemplate, adviceCheckKeys } = this.state;
    const treeNodesLeft = this.initTree(riskTemplate);
    const treeNodesRight = this.initTree(adviceTemplate);

    return adviceTemplate.length > 0 ? (
      <Modal
        title="子痫前期风险评估表"
        visible={true}
        width={900}
        className="pree-modal"
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Row>
          <Col span={12}>
            <Tree
              className="pree-left"
              defaultExpandAll
              checkable
              checkedKeys={riskCheckKeys}
              onCheck={this.handleCheckLeft}
              style={{ maxHeight: '90%' }}
            >
              {treeNodesLeft}
            </Tree>
          </Col>
          <Col span={11} offset={1}>
            <Tree
              className="pree-right"
              defaultExpandAll
              checkable
              checkedKeys={adviceCheckKeys}
              onCheck={this.handleCheckRight}
              style={{ maxHeight: '90%' }}
            >
              {treeNodesRight}
            </Tree>
          </Col>
        </Row>
      </Modal>
    ) : null;
  }
}
