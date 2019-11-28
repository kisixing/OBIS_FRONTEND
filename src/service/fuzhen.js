import myAxios from '../utils/myAxios';

export default {

    /**
     * 右侧诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/diagnosis/getdiagnosis.json?id=' + r.id));
    },
    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        return this.userId().then(r => myAxios.get('/Obcloud/diagnosis/adddiagnosis.json?type=diag&useid=' + r.id + '&data=' + text));
    },
    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        return myAxios.get('/Obcloud/diagnosis/deldiagnosis.json?id=' + id);
    },

    /**
     * 左侧表格列表
     */
    getRvisitPage: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/outpatient/getRvisitPage.json?id=' + r.id));
    },
    /**
     * 左侧 诊断提醒列表
     */
    getPlanList: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/outpatient/getPlanList.json?id=' + r.id));
    },

    /**
     * 右侧表格数据
     */
    getRecentRvisit: function(){
        return this.userId().then(r => myAxios.get('/Obcloud/outpatient/getRecentRvisit.json?id=' + r.id));
    },

    /**
     * 模板
     */
    treatTemp: function(){
        return myAxios.get('/Obcloud/treatTemp/list.json' + location.search);
    },

    
    /**
     * 修改表格数据
     */
    recentRvisit: function(entity){
        return this.userId().then(r => myAxios.post('/Obcloud/outpatient/recentRvisit.json?id=' + r.id, entity));
    },
    /**
     * 提交数据
     */
    saveRvisitForm: function(entity){
        return this.userId().then(r => myAxios.post('/Obcloud/outpatient/saveRvisitForm.json?id=' + r.id, entity));
    }
}