import myAxios from '../utils/myAxios';

export default {

  /**
   * 影像报告
   */
  getPacsData: function(){
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getPacsData?userid=${r.object.userid}`));
  },

}