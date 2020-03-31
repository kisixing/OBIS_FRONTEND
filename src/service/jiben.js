import myAxios from '../utils/myAxios';
import * as common from '../utils/common';

export default {
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    saveForm : function(tab, entity){
        let data = {};
        let uri = 'udpateDoc';
        data = entity
        var arr2 = JSON.stringify(data).replace(/add_/g, "ADD_");
        data=JSON.parse(arr2) 
        const clinicCode = common.getCookie('clinicCode');
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid, clinicCode, ...data}));
    },
};