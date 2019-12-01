import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Button } from 'antd';

const ButtonGroup = Button.Group;


class HeaderMenuWrap extends Component {
  constructor(props) {
    super(props);
    const current = this.props.location.pathname === '/' ? '/home' : this.props.location.pathname;
    this.state = {
      current: current.split('/').slice(0, 2).join('/'),
      theme: 'dark',//dark
    };
  };

  handleClick = (e) =>
    this.setState({
      current: e.key,
    });

  render() {
    console.log('header menu render');
    let menuItems;
    const menuData = window.menuData;
    // const menuData = Cookies.get('__menuData');
    if (menuData) {
      menuItems = menuData.map(item => (
        <Menu.Item key={'/' + item.url} disabled={item.url ? false : true}>
          <Link to={'/' + item.url}>{item.name}</Link>
        </Menu.Item>
      ))
    }
    return (
      <p className="patient-Info_tab">
        <Menu className='header-menu' onClick={()=>this.handleClick()}
          selectedKeys={[this.state.current]}
          mode="horizontal" theme={this.state.theme}
        >
          {menuItems}
        </Menu>
      </p>
    );
  }
}
const HeaderMenu = withRouter(HeaderMenuWrap);


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      userMenus: []
    };
  }

  componentDidMount() {
    this.componentWillUnmount = service.watchInfo((info) => this.setState(info));
  }

  onClick(item) {
    this.props.history.push(item.url);
  }

  render() {
    const { userInfo, userMenus } = this.state;
    const { username, userhage, gesweek, gesnum, gesmoc, usermcno } = userInfo;
    return (
      <div className="main-header">
        <div className="patient-Info_title font-16">
          <div><strong>姓名:</strong>{username}</div>
          <div><strong>年龄:</strong>{userhage}</div>
          <div><strong>孕周:</strong>{gesweek}</div>
          <div><strong>孕产:</strong>{gesnum}</div>
          <div><strong>预产期:</strong>{gesmoc}</div>
          <div><strong>就诊卡:</strong>{usermcno}</div>
          <div><strong>产检编号:</strong>{usermcno}</div>
        </div>
        <HeaderMenu />
        <div className="patient-Info_btnList">
          <ButtonGroup>
            {userMenus.map((item, i) => <Button key={"useSeps" + i} className={item.className || ''}>{item.name}</Button>)}
          </ButtonGroup>
        </div>
      </div>
    );
  }

}


export default Header;