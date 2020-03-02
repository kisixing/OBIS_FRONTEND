
import myAxios, * as method from '../utils/myAxios';

import { default as fuzhen } from './fuzhen';
import { default as shouzhen } from './shouzhen';
import { default as jianyan } from './jianyan';
import { default as yunqi } from './yunqi';
import { default as xuetang } from './xuetang';
import { default as yingxiang } from './yingxiang';

let userId = null;
let watchInfoList = [];

export default {
    ...method,
    watchInfo: function(fn){
        watchInfoList.push(fn);
        return () => watchInfoList = watchInfoList.filter(f=>f!==fn);
    },
    /**
     * 获取个人信息
     */
    getuserDoc: function(){
        userId = myAxios.get('/outpatientRestful/getuserDoc' + location.search);
        return userId;
    },
    /**
     * 高危数据
     */
    highrisk: function(){
        return myAxios.get('/outpatientRestful/findHighriskTree')
    },
    /**
     * 保存高危数据
     */
    savehighriskform: function(params){
        return myAxios.put('/outpatientWriteRestful/savehighriskform', params)
    },
    /**
     * 高危弹出提醒判断
     */
    checkHighriskAlert: function(id){
        return myAxios.post('/outpatientWriteRestful/checkHighriskAlert', {userid: id, inputType: '2', data: ''});
    },
    /**
     * 高危弹出提醒不再提示
     */
    closeHighriskAlert: function(id, params){
        return myAxios.post('/outpatientWriteRestful/closeHighriskAlert', {userid: id, mark: params});
    },
    /**
     * 添加高危标记
     */
    addHighrisk: function(userid, highrisk, level){
        return myAxios.post('/outpatientWriteRestful/addHighrisk', {userid, highrisk, level});
    },
    /**
     * 获取token
     */
    authorize: function(doctorId){
        return myAxios.post('/outpatientRestful/authorize', {doctorId: doctorId});
    },
    /**
     * 复诊所需API
     */
    fuzhen: Object.assign(fuzhen, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),

    /**
     * 首检所需API
     */
    shouzhen: Object.assign(shouzhen, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),

    /**
     * 检验所需API
     */
    jianyan: Object.assign(jianyan, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),
    
    /**
     * 孕期所需API
     */
    yunqi: Object.assign(yunqi, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),

    /**
     * 血糖所需API
     */
    xuetang: Object.assign(xuetang, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),

    /**
     * 血糖所需API
     */
    yingxiang: Object.assign(yingxiang, { userId: ()=>userId, fireWatch: (...args)=>watchInfoList.forEach(fn=>fn(...args)) }),
}
