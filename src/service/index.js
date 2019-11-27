
import myAxios from '../utils/myAxios';

import { default as fuzhen } from './fuzhen';

let userId = null;
let watchInfoList = [];

export default {
    /**
     * 获取个人信息
     */
    getuserDoc: function(){
        userId = myAxios.get('/Obcloud/doc/getuserDoc.json' + location.search);
        return userId;
    },
    watchInfo: function(fn){
        watchInfoList.push(fn);
        return () => watchInfoList = watchInfoList.filter(f=>f!==fn);
    },
    /**
     * 复诊所需API
     */
    fuzhen: Object.assign(fuzhen, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) })
}
