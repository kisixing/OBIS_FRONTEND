import myAxios from '../utils/myAxios';

export default {

    /**
     * 右侧诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getdiagnosis?userid=' + r.object.userid));
    },
    /**
     * 科室列表
     */
    getdiagnosislist: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/diagnosis/getdiagnosislist?userid=' + r.object.userid));
    },
    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        let data = {'data':text};
        return this.userId().then(r => myAxios.post('/outpatientRestful/adddiagnosis?' + r.object.userid,data));
    },
    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        return myAxios.get('/outpatientRestful/deldiagnosis?id=' + id);
    },

    /**
     * 左侧表格列表
     */
    getRvisitPage: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/outpatient/getRvisitPage?id=' + r.id));
    },
    /**
     * 左侧 诊断提醒列表
     */
    getPlanList: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/outpatient/getPlanList?id=' + r.id));
    },

    /**
     * 右侧表格数据
     */
    getRecentRvisit: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getRvisit?dataType=1&pageCurrent=1&pageSize=10&userid=' + r.object.userid));
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
        return this.userId().then(r => myAxios.post('/Obcloud/outpatient/recentRvisit?id=' + r.id, entity));
    },
    /**
     * 提交数据
     */
    saveRvisitForm: function(entity){
        return this.userId().then(r => myAxios.post('/Obcloud/outpatient/saveRvisitForm?id=' + r.id, entity));
    }
}