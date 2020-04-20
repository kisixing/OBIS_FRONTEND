import myAxios from '../utils/myAxios';
import * as common from '../utils/common';

export default {
    /**
     * 左侧诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getdiagnosis?userid=${r.object.userid}`));
    },

    /**
     * 标记高危
     */
    updateHighriskmark: function(i, params) {
        let data = {'id': i, "highriskmark": params};
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/diagnosis/markHighrisk', data));
    },

    /**
     * 更改排序
     */
    updateSort: function(i, params) {
        let data = {'id': i, "sortType": params};
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/diagnosis/updateSort', data));
    },

    /**
     * 关联表单
     */
    relatedformtype: function(params) {
        let data = {"relatedformtype": params};
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/diagnosis/relatedformtype', data));
    },

    /**
     * 获取诊断下拉模板(联想输入)
     */
    getDiagnosisInputTemplate: function(params){
        let data = {"content": params};
        return this.userId().then(r => myAxios.post('/outpatientRestful/getDiagnosisInputTemplate', {userid: r.object.userid, ...data}));
    },

    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        let data = {'data':text};
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/adddiagnosis', {userid: r.object.userid, ...data}));
    },

    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        return this.userId().then(r => myAxios.delete('/outpatientWriteRestful/deldiagnosis', {data:{userid: r.object.userid, diagnosiss: [{
            id: id
        }]}}));
    },

    /**
     * 高危弹出提醒判断
     */
    checkHighriskAlert: function(params){
        let data = {"data": params};
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/checkHighriskAlert', {userid: r.object.userid, inputType: '1', ...data}));
    },

    /**
     * 诊疗计划（最近两条记录）
     */
    getDiagnosisPlanData: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getDiagnosisPlanData?userid=${r.object.userid}`));
    },

    /**
     * 诊疗计划列表
     */
    getRecentRvisitList: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getRecentRvisitList?id=${r.object.userid}`));
    },

    /**
     * 增加诊疗计划
     */
    addRecentRvisit: function(params){
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/addRecentRvisit', Object.assign(params, {userid: r.object.userid})));
    },

    /**
     * 删除诊疗计划
     */
    delRecentRvisit: function(params){
        return this.userId().then(r => myAxios.delete('/outpatientWriteRestful/delRecentRvisit', {data:{userid: r.object.userid, diagnosisPlans: [params]}}));
    },

    /**
     * 修改诊疗计划
     */
    editRecentRvisit: function(params){
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/editRecentRvisit', {userid: r.object.userid, diagnosisPlans: [params]}));
    },

    /**
     * 设置诊疗计划不再提醒
     */
    editPlanAlert: function(){
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/editPlanAlert', params));
    },

    /**
     * 查询产检记录列表（最近两条记录）
     */
    getRecentRvisit: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getRecentRvisit?id=${r.object.userid}`));
    },

    /**
     * 查询更多产检记录
     */
    getRvisitPage: function(page, params){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getRvisitPage?pageSize=${page}&pageCurrent=${params}&id=${r.object.userid}`));
    },

    /**
     * 模板
     */
    treatTemp: function(){
        return myAxios.get('/outpatientRestful/list' + location.search);
    },
    
    /**
     * 修改表格数据
     */
    recentRvisit: function(entity){
        return this.userId().then(r => myAxios.post('/outpatient/recentRvisit?id=' + r.object.userid, entity));
    },

    /**
     * 获取pacs胎儿生长曲线数据
     */
    getPacsGrowth: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getPacsGrowth?mcno=05781816'));
    },

    /**
     * 获取BMI孕期体重管理曲线数据
     */
    getbmi: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getbmi?id=${r.object.userid}`));
    },

    /**
     * 保存本次产检记录
     */
    saveRvisitForm: function(params){
        const clinicCode = common.getCookie('clinicCode');
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/saveRvisitForm', Object.assign(params, {userid: r.object.userid, clinicCode})));
    },

    /**
     * 获取入院登记表
     */
    getRecordList: function(){
        return this.userId().then(r => myAxios.get(`/hospitalization/registerRecord?docid=${r.object.userid}`));
    },

    /**
     * 更新入院登记表
     */
    postRecordList: function(entity){
        return this.userId().then(r => myAxios.post('/hospitalization/registerRecord', entity));
    },

    /**
     * 修改预产期-超声
     */
    updateDocGesexpectrv: function(params){
        return this.userId().then(r => myAxios.post('/outpatient/updateDocGesexpectrv', {userid: r.object.userid, gesexpectrv: params}));
    },

    /**
     * 缺少检验报告
     */
    getLackLis: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getLackLis?userid=${r.object.userid}`));
    },

    /**
     * 缺少检验报告-其他(获取)
     */
    getLisResult: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getLisResult?userid=${r.object.userid}`));
    },

    /**
     * 缺少检验报告-其他(保存)
     */
    saveLisResult: function(params){
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/saveLisResult', params));
    },

    /**
     * 缺少检验报告-其他(打印)
     */
    printLisResultPdfPath: function(){
        return this.userId().then(r => myAxios.get(`/print/printLisResultPdfPath?userid=${r.object.userid}`));
    },

    /**
     * 查询诊疗计划组所有数据
     */
    findDiagnosisPlanAndGroupVO: function(){
        return this.userId().then(r => myAxios.get('/diagnosisPlanGroup/findDiagnosisPlanAndGroupVO'));
    },

    /**
     * 诊疗计划组增删改
     */
    editGroupAndDiagnosisPlan: function(params){
        return this.userId().then(r => myAxios.post('/diagnosisPlanGroup/editGroupAndDiagnosisPlan', {userid: r.object.userid, ...params}));
    },

     /**
     * 根据诊疗计划组的名字查询诊疗计划组数据列表
     */
    selectListByGroupName: function(params){
        return this.userId().then(r => myAxios.get(`/diagnosisPlanGroup/selectListByGroupName?groupName=${params}`));
    },

    /**
     * 获取体检数据
     */
    getRvisitPhysicalExam: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getRvisitPhysicalExam?userid=${r.object.userid}`));
    },

    /**
     * 获取孕周弹出表单信息
     */
    getGesweekForm: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getGesweekForm?userid=${r.object.userid}`));
    },

    /**
     * 更新孕周弹出表单信息
     */
    saveGesweekForm: function(params){
        return this.userId().then(r => myAxios.post(`/outpatientWriteRestful/saveGesweekForm`, {userid: r.object.userid, ...params}));
    },

    /**
     * 查询诊断历史
     */
    getHistory: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/diagnosis/getHistory?userid=${r.object.userid}`));
    },

    /**
     * 查询高危门诊数据
     */
    checkIsAddNum: function(date, noon){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/checkIsAddNum?userid=${r.object.userid}&date=${date}&noon=${noon}`));
    },

    /**
     * 下次复诊日期延后选择
     */
    checkImpact: function(date, noon, type){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/checkImpact?userid=${r.object.userid}&date=${date}&noon=${noon}&type=${type}`));
    },
}