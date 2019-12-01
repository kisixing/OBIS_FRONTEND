//antd-demos页
import {bundle} from "../common-tools/Bundle";
const Empty = props => <div><Spin/>Loading</div>;
const NoAu = props => <div><Spin/>页面加载失败...</div>;

import DemoSelect from "../components/business-components/antd-demos/components/DemoSelect";
const DemoSelectBundle = bundle(Empty, DemoSelect, {type: "callback"});

export const shouZhenAAA_routes = [
    {type: "redirect", exact: true, strict: true, from: "/antd-demos", to: "/antd-demos/com-select"},
    {type: "route", path: "/antd-demos/com-select", component: DemoSelectBundle},
    {type: "route", component: NoAu},
];