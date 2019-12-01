import React, { Component } from "react";
import { Router } from "react-router-dom";
import { Spin } from 'antd';
import service from '../service'

import Header from "../app/header";
import { RouteList } from "../common-tools/Route";
import routes from "./routes";
import "./main.css";
import { arrayToTree } from "../utils/data-tools";


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        service.getuserDoc().then(res => this.setState({
            ...res, loading: false
        }));
    }

    componentWillMount() {
    }

    componentDidMount() {
        //在此请求用户数据，得到: userInfo
        service.getuserInfo().then(res => this.setState({
            ...res, loading: false
        }));
        //下面是对接接口，写法如上，记得修改 --karin
        const userMenus = [{
            "name": "梅毒",
            "className": "danger-btn",
        }, {
            "name": "HIV",
            "className": "view-btn",
        }, {
            "name": "乙肝",
            "className": "",
        }, {
            "name": "梅毒",
        }];
        //模拟菜单数据
        const userMenu = [{
            "id": 10,
            "name": "首检信息",
            "type": "INNER",
            "url": "sz"
        }, {
            "id": 10000,
            "name": "复诊记录",
            "type": "INNER",
            "url": "fz"
        }, {
            "id": 20000,
            "name": "孕期曲线",
            "type": "INNER",
            "url": "yq"
        }, {
            "id": 30000,
            "name": "血糖记录",
            "type": "INNER",
            "url": "xt"
        }, {
            "id": 40000,
            "name": "影像报告",
            "type": "INNER",
            "url": "yx"
        }, {
            "id": 50000,
            "name": "检验报告",
            "type": "INNER",
            "url": "jy"
        }, {
            "id": 60000,
            "name": "胎监记录",
            "type": "INNER",
            "url": "tj"
        }];
        window.menuData = arrayToTree(userMenu, 'id', 'parent_id', 'children');
        this.setState({ loading: false });
    }

    render() {
        return (
            <div className='main-body'>
                <Header history={this.props.history} userInfo userMenus />
                <Spin spinning={this.state.loading} size='large'>
                    {this.state.loading ? null : <RouteList routes={routes} />}
                </Spin>
            </div>
        )
    }
}

export default Main;