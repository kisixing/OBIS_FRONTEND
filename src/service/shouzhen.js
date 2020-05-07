import myAxios from '../utils/myAxios';
import * as common from '../utils/common';

export default {
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    getForm : function(tab){
        // TODO:这是示例 所以这样写的
        if(tab){
            return this.userId().then(r => myAxios.get(`/outpatientRestful/ivisitMain?style=gravidaInfo&userid=${r.object.userid}`));
        } else {
            return Promise.resolve({});
        }
    },
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    saveForm : function(tab, entity){
        let data = {};
        let uri = 'udpateDoc';
        if(tab === 'tab-0' || tab === 'tab-5'|| tab === 'tab-4' || tab === 'tab-6' || tab === 'tab-7'){
            uri='saveivisit'
        }
        data = entity;
        var arr2 = JSON.stringify(data).replace(/add_/g, "ADD_");
        data=JSON.parse(arr2) 
        const clinicCode = common.getCookie('clinicCode');
        const opid = common.getCookie('opid');
        const regno = common.getCookie('regno');

        let doctorName = {};
        if (uri === 'udpateDoc') {
            doctorName = { 'ADD_FIELD_first_ivisit_doctor': common.getCookie('docName') };
        } else  {
            doctorName = { 'ADD_FIELD_ivisit_doctor': common.getCookie('docName') };
        }
        if (uri === 'udpateDoc') {
            return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid, clinicCode, ...doctorName, ...data}));
        }
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid, clinicCode, opid, regno, ...doctorName, ...data}));
    },
    /**
     * 保存孕产史
     */
    savePregnancies : function(tab, entity){
        let uri = 'writePreghis';
        //console.log(entity)
        // preghiss
        //data.preghisss = data.preghis;
        return this.userId().then(r => myAxios.post(`/outpatientWriteRestful/${uri}`, { userid:r.object.userid,...entity}));
    },
    /**
     * 保存手术史
     */
    saveOperations: function(tab, entity){
        let data = {};
        let uri = 'writeOperationHistory';
        data = []
        //console.log(entity)
        data.operationHistorys = entity.operationHistory;
        return this.userId().then(r => myAxios.post(`/outpatientWriteRestful/${uri}`, { userid:r.object.userid,...data}));
    },
    /**
     * 查询血栓高危因素模板 LVT_HIGH_RISK
     */
    findTemplateTree: function(params){
        return this.userId().then(r => myAxios.get(`/templatetree/findTemplateTree?userid=${r.object.userid}&type=${params}`));
    },
    /**
     * 保存血栓模板
     */
    saveTemplateTreeUser: function(num, params){
        let data = {"type": num, "templateTree": params};
        return this.userId().then(r => myAxios.put('/templatetree/saveTemplateTreeUser', {userid: r.object.userid, ...data}));
    },
    /**
     * 获取所有表单数据
     */
    getAllForm: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/ivisitMain?style=gravidaInfo&userid=${r.object.userid}`));
    },
    /**
     * 首诊页面打印
     */
    printPdfByFile: function(){
        // 参数：ivisit(A4) ivisitA5(A5)
        return this.userId().then(r => myAxios.get(`/print/printPdfByFileRestful?userid=${r.object.userid}&modelType=ivisitA5`));
    },
    /**
     * 获取医嘱接口
    */
    getAdviceTreeList: function() {
        const clinicCode = common.getCookie('clinicCode');
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getAdviceTreeList?userid=${r.object.userid}&clinicCode=${clinicCode}`));
    },
    /**
     * 预约接口
    */
    makeAppointment: function(type, time) {
        let data = {"type": type, "time": time};
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/makeAppointment', {userid: r.object.userid, ...data}));
    },

    /**
     * 首诊历史修改记录
    */
    getIvisitLog: function() {
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getIvisitLog?userid=${r.object.userid}`));
    },
    /**
     * 保存并开立医嘱调用接口
    */
    uploadHisDiagnosis: function(relatedtype) {
        const clinicCode = common.getCookie('clinicCode');
        const opid = common.getCookie('opid');
        const regno = common.getCookie('regno');
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/diagnosis/uploadHis', {userid: r.object.userid, relatedtype, clinicCode, opid, regno }));
    },
    /**
     * 查询诊断列表
     */
    getList: function(type) {
        return this.userId().then(r => myAxios.get(`/outpatientRestful/diagnosis/getList?userid=${r.object.userid}&relatedtype=${type}`));
    },
    /**
     * 批量插入诊断
     */
    batchAdd: function(relatedtype, relatedid, list, uploadFlag, redirectUrl) {
        const clinicCode = common.getCookie('clinicCode');
        const opid = common.getCookie('opid');
        const regno = common.getCookie('regno');
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/diagnosis/batchAdd', {userid: r.object.userid, relatedtype, relatedid, list, uploadFlag, clinicCode, opid, regno, redirectUrl }));
    },
    /**
     * 查询梅毒数据
     */
    searchSyp: function() {
        return this.userId().then(r => myAxios.get(`/api/syphilisMng/selectList?userid=${r.object.userid}`));
    },
    /**
     * 编辑或者新增梅毒数据
     */
    editSyp: function(data) {
        return this.userId().then(r => myAxios.post(`/api/syphilisMng/edit`, { ...data, userid: r.object.userid}));
    },
    /**
     * 更改末次月经获取孕产期数据
     */
    findCkzdataByUserid: function(time) {
        return this.userId().then(r => myAxios.get(`/outpatientRestful/findCkzdataByUserid?userid=${r.object.userid}&gesmoc=${time}`));
    },
};