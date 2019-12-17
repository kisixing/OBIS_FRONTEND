import myAxios from '../utils/myAxios';


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
        let type = '';
        let data = {};
        if(tab === 'tab-0'){
            type='gravidaInfo'
        }
        data = entity
        console.log(entity)
        return this.userId().then(r => myAxios.post(`/outpatienttest/udpateDoc?id=${r.object.userid}&style=${type}`, data));
    },
    /**
     * 诊断处理的诊断列表
     */
    getdiagnosis: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getdiagnosis?userid=${r.object.userid}`));
    },
    /**
     * 添加诊断列表的数据
     */
    adddiagnosis: function(text){
        let data = {'data':text};
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/adddiagnosis?' + r.object.userid,data));
    },
    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        console.log(id);
        return myAxios.delete('/outpatientWriteRestful/deldiagnosis',{userid: "6",diagnosiss: [{
            id: id
        }]}
        );
    }
};