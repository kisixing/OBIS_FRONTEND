import myAxios from '../utils/myAxios';

export default {

    /**
     * 左侧诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getdiagnosis?userid=' + r.object.userid));
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
     * 科室列表
     */
    // getdiagnosislist: function(){
    //     return this.userId().then(r => myAxios.get('/Obcloud/diagnosis/getdiagnosislist?userid=' + r.object.userid));
    // },

    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        let data = {'data':text};
        return this.userId().then(r => myAxios.post('/outpatientRestful/adddiagnosis', data));
    },

    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        return myAxios.delete('/outpatientWriteRestful/deldiagnosis',{userid: "6", diagnosiss: [{
            id: id
        }]});
    },

    /**
     * 诊疗计划
     */
    getDiagnosisPlanData: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getDiagnosisPlanData?id=' + r.object.userid));
    },

    /**
     * 诊疗计划列表
     */
    getRecentRvisitList: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getRecentRvisitList?id=' + r.object.userid));
    },

    /**
     * 增加诊疗计划
     */
    addRecentRvisit: function(params){
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/addRecentRvisit', params));
    },

    /**
     * 删除诊疗计划
     */
    delRecentRvisit: function(){
        return this.userId().then(r => myAxios.delete('/outpatientWriteRestful/delRecentRvisit', params));
    },

    /**
     * 修改诊疗计划
     */
    editRecentRvisit: function(){
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/editRecentRvisit', params));
    },

    /**
     * 设置诊疗计划不再提醒
     */
    editPlanAlert: function(){
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/editPlanAlert', params));
    },

    /**
     * 右侧产检记录
     */
    getRecentRvisit: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getRvisit?dataType=1&pageCurrent=1&pageSize=10&userid=' + r.object.userid));
    },

    /**
     * 右侧更多产检记录
     */
    getRvisitPage: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getRvisitPage?pageSize=10&pageCurrent=1&id=' + r.object.userid));
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
        return this.userId().then(r => myAxios.get('outpatientRestful/getPacsGrowth?mcno=05781816'));
    },

    /**
     * 获取BMI孕期体重管理曲线数据
     */
    getbmi: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getbmi?id=' + r.object.userid));
    },

    /**
     * 保存本次产检记录
     */
    saveRvisitForm: function(entity){
        return this.userId().then(r => myAxios.put('/outpatientWriteRestful/saveRvisitForm', entity));
    },
}