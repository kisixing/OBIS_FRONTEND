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
        //console.log(arr2) // [{"leftText":"2019-05","value":"9999"},{"leftText":"2019-06","value":"8888"}]
        data=JSON.parse(arr2) 
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid,...data}));
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