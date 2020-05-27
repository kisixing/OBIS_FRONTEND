import myAxios from '../utils/myAxios';
import * as common from '../utils/common';

export default {
    /**
     * 保存表单数据 tab对应首诊下面的tab菜单，从tab-0开始
     */
    saveForm : function(tab, entity){
        let data = entity;
        let uri = 'udpateDoc';
        let str = JSON.stringify(data).replace(/add_/g, "ADD_");
        data=JSON.parse(str) 
        const clinicCode = common.getCookie('clinicCode');
        const deptNo = common.getCookie('deptNo');
        const deptName = common.getCookie('deptName');
        return this.userId().then(r => myAxios.put(`/outpatientWriteRestful/${uri}`, { id:r.object.userid, clinicCode, deptNo, deptName, ...data}));
    },
};