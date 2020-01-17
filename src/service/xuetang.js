import myAxios from '../utils/myAxios';

export default {

  /**
   * 血糖记录
   */
  getUserBloodGlucose: function(){
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getUserBloodGlucose?userid=${r.object.userid}`));
  },

}