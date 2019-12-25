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
        let data = {};
        let uri = 'udpateDoc';
        if(tab === 'tab-2'||tab === 'tab-7'||tab === 'tab-8'||tab === 'tab-9'){
            uri='saveivisit'
        }
        data = entity
        //console.log(entity)
        var arr2 = JSON.stringify(data).replace(/add_/g, "ADD_");
        data=JSON.parse(arr2) 
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid,...data}));
    },
    /**
     * 保存孕产史
     */
    savePregnancies : function(tab, entity){
        let data = {};
        let uri = 'savepreghis';
        data = entity
        //console.log(entity)
        data.preghiss = data.preghis;
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { userid:r.object.userid,...data}));
    },
    /**
     * 保存手术史
     */
    saveOperations: function(tab, entity){
        let data = {};
        let uri = 'writeOperationHistory';
        data = entity
        //console.log(entity)
        data.operationHistorys = data.operationHistory;
        return this.userId().then(r => myAxios.post(`/outpatientWriteRestful/${uri}`, { userid:r.object.userid,...data}));
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
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/adddiagnosis',{userid:r.object.userid,...data}));
    },
    /**
     * 删除诊断列表的数据
     */
    deldiagnosis: function(id){
        console.log(id);
        return myAxios.delete('/outpatientWriteRestful/deldiagnosis',{data:{userid: "6",diagnosiss: [{
            id: id
        }]}}
        );
    }
};