import myAxios from '../utils/myAxios';


export default {
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    getForm : function(tab){
        // TODO:这是示例 所以这样写的
        if(/tab\-[38]/.test(tab)){
            return this.userId().then(r => myAxios.get(`/outpatientRestful/ivisitInfo?id=${r.object.userid}`));
        } else {
            return Promise.resolve({});
        }
    },
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    saveForm : function(tab, entity){
        return this.userId().then(r => myAxios.post(`/Obcloud/shouzhen/${tab}?id=${r.id}`, entity));
    },
    /**
     * 诊断处理的诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get('/outpatientRestful/getdiagnosis?type=ivisitDiag&userid' + r.object.id));
    },
    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        return this.userId().then(r => myAxios.get('/Obcloud/diagnosis/adddiagnosis?type=diag&useid=' + r.id + '&data=' + text));
    },
    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        return myAxios.get('/Obcloud/diagnosis/deldiagnosis?id=' + id);
    }
};