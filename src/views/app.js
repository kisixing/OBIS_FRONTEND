import React from "react";
import {Router,Switch,Route} from "react-router-dom";

import history from "../utils/history";
import Main from "./main";

console.log('app');

const App = () =>
    <Router history={history}>
        <Switch>
            <Route path='/' component={Main}></Route>
        </Switch>
    </Router>;

export default App;