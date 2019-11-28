import myAxios from '../utils/myAxios';

export default {
    /**
     * 保存表单数据
     */
    saveForm : function(type, entity){
        return this.userId().then(r => myAxios.post(`/fuzhen.json?id=${r.id}&type=${type}`, entity));
    }
};