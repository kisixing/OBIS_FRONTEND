import myAxios from '../utils/myAxios';

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
    getRvisitPage: function(params){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getRvisitPage?pageSize=10&pageCurrent=${params}&id=${r.object.userid}`));
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
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/saveRvisitForm', Object.assign(params, {userid: r.object.userid})));
    },
}