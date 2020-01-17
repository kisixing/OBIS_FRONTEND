import myAxios from '../utils/myAxios';

export default {

  /**
   * 获取pacs胎儿生长曲线数据
   */
  getPacsGrowth: function(){
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getPacsGrowth?mcno=${r.object.usermcno}`));
  },

  /**
   * 获取BMI孕期体重管理曲线数据
   */
  getbmi: function(){
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getbmi?id=${r.object.userid}`));
  },

  /**
   * 获取妊娠数据曲线数据
   */
  getPreg: function(){
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getPreg?userid=${r.object.userid}`));
  },

}