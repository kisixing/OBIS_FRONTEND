import axios from 'axios';
import Qs from 'qs';
import {Modal} from 'antd';
import modal from './modal';

const getUrl = function (url){
    if(location.search){
        return 'http://127.0.0.1:8899/Obcloud' + url;
        //return 'http://120.77.46.176:8899/rapi' + url;
    }else{
        return 'assets/mock/' + url.split('?').map((v,i)=>v+(!i?'.json':'')).join('?');
    }
};

/**
 * 移除所有以$开头或者值为undefined的属性,用来模拟
 */
export const remove$Property = function (obj){
    if(obj && typeof obj === 'object'){
        for(var p in obj){
            if(/^\$/.test(p) || obj[p] === undefined){
                try{
                    delete obj[p];
                }catch(e){
                    obj[p] = undefined;
                }
            }else{
                remove$Property(obj[p]);
            }
        }
    }
    return obj;
}

/**
 * 把所有的json数据转换为对象
 */
export const praseJSON = function(data){
    for(var p in data){
        if(typeof data[p] === 'string'){
            try{
                data[p] = JSON.parse(data[p]);
            }catch(e){

            }
        }
        if(data[p] && (typeof data[p] === 'object')){
            praseJSON(data[p]);
        }else{
            data[p] = `${data[p]}`;
        }
    }
    return data;
}

const myAxios = axios.create({
    //若地址带有子路径，需要配置此项，否则网址后面加/，以便寻找正确的相对目录'./'，如sdafs.cn/qqaa/
    // baseURL:'/peas',
    timeout: 10000,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    // headers: {'Content-Type': 'application/x-www-form-urlencode;charset=utf-8'},
});

myAxios.interceptors.request.use(config => {
    if(config.data){
        config.data = remove$Property(config.data);
    }
    if (config.method === 'post' || config.method === 'put') {
        //后台接受的参数Content-Type
        // 默认application/x-www-form-urlencode;charset=utf-8,对应spring注解：@RequestParam,又字段__isFormType标明
        // application/json;对应spring注解：@RequestBody
        if (config.data['__isFormType']) {
            config.data = Qs.stringify({...config.data});
        } else{
            config.data = JSON.stringify(config.data);
            config.headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    config.url = getUrl(config.url);
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

myAxios.interceptors.response.use(response => {
    const status = response.status;
    if ((status >= 200 && status < 300) || status === 304) {
        // 如果启用转换，请修改下面这行代码，且请去掉其他地方的praseJSON调用，避免重复调用praseJSON浪费性能
        // return praseJSON(response.data);
        return response.data;
    }
}, error => {
    error.response = error.response || {};
    const status = error.response.status;
    const message = error.response.data ? error.response.data : '网络错误，请刷新重试';
    if (status && (status > 400  &&  status < 500)) {
        if(status === 404){
            modal(message);
        }else{
            Modal.warning({title: '提示', content: message})
        }
    }
    return Promise.reject(error.response.data);
});

export default myAxios;