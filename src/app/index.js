import React from "react";
import {render} from "react-dom";
import Main from './app';

import router from "../utils/router";
import "./index.less";

const App = () => router([
    {path:'/', component:Main},
]);

render(<App/>, document.getElementById("app"));
