import React from "react";
import {Spin} from "antd";

// 这里添加路由, 很多个
import SZ from "bundle-loader?lazy&name=home!../app/shouzhen";

// 必备工具：tool
import {bundle} from "../common-tools/Bundle";

const Empty = props => <div><Spin/>Loading</div>;
const NoAu = props => <div><Spin/>页面加载失败...</div>;

const PageBundle =(page)=> bundle(Empty, {page}, {type: "callback"});


const routes = [
    { type: "redirect", exact: true, strict: true, from: "/", to: "/sz" },
    // {type: "route", path: "/", exact: true, strict: true, component: HomePage},
    { type: "route", path: "/sz", component: PageBundle(SZ) },
    {type: "route", path: "/fz", component: PageBundle(SZ)},
    {type: "route", component: NoAu},
];

export default routes;