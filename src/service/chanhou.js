import myAxios from '../utils/myAxios';

export default {

  /**
   * 获取产后复诊记录
   */
  getPartumRvisit: function(){
      return this.userId().then(r => myAxios.get(`/outpatientRestful/postpartumRvisit?userid=${r.object.userid}`));
  },

  /**
   * 更新产后复诊记录
   */
  postPartumRvisit: function(params){
      return this.userId().then(r => myAxios.post(`/outpatientWriteRestful/postpartumRvisit`, {userid: r.object.userid, ...params}));
  },

}