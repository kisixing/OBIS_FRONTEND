import myAxios from '../utils/myAxios';


export default {
    /**
     * 保存表单数据
     */
    saveForm : function(type, entity){
        return this.userId().then(r => myAxios.post(`/Obcloud/diagnosis/shouzhen.json?id=${r.id}&type=${type}`, entity));
    },
    /**
     * 诊断处理的诊断列表
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
    }
};