import React, { Component } from "react";
import { Button } from 'antd';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upDown: false
    }
  }

  
  componentDidUpdate(){
    const { upDown } = this.state;
    const scroll = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
    if(upDown !== scroll){
      this.setState({
        upDown: scroll
      })
    }
  }

  onClick(type) {
    // window.scrollBy(0,-30);
    const num = type ? 600 : -600;
    window.scrollBy(0,num);
  }

  render() {
    const { children, ...props} = this.props;
    const { upDown } = this.state;

    return (
      <div {...props}>
        {children}
        {upDown ? (<div style={{ position: 'fixed',width: '40px', right: '10px', bottom: '80px', zIndex: '2' }}>
          <Button className="blue-btn" size="large" type="dashed" shape="circle" icon="up" onClick={()=>this.onClick(0)}  style={{fontSize: '.68rem'}}></Button>
          <Button className="blue-btn" size="large" type="dashed" shape="circle" icon="down" onClick={()=>this.onClick(1)}></Button>
        </div>) : null }
      </div>
      
    );
  }
}


