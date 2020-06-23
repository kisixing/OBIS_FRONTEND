import React, { Component } from "react";
import { Button, message, Icon } from 'antd';
import CHForm from './components/ch-form';
import CHSidebar from './components/ch-sidebar';
import './index.less';

export default class RegForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chanhou-fz label-6">
        <div className="bg-left"></div>
        <div className="bg-right"></div>
        <div className="ch-form">
          <CHForm />
        </div>
        <div className="ch-sidebar">
          <CHSidebar />
        </div>
      </div>
    )
  }
}