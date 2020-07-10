import myAxios from '../utils/myAxios';

export default {

  /**
   * 获取pacs胎儿生长曲线数据
   */
  getPacsGrowth: function() {
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getPacsGrowth?userid=${r.object.userid}`));
  },

  /**
   * 获取BMI孕期体重管理曲线数据
   */
  getbmi: function() {
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getbmi?id=${r.object.userid}`));
  },

  /**
   * 获取妊娠数据曲线数据
   */
  getPreg: function() {
    return this.userId().then(r => myAxios.get(`/outpatientRestful/getPreg?userid=${r.object.userid}`));
  },

  /**
   * 上传曲线图片
   */
  uploadBmiImg: function(pic) {
    return this.userId().then(r => myAxios.post('/common/uploadBmiImg', {id: r.object.userid, file: pic}));
  },

  /**
   * 获取pacs胎儿生长曲线数据(新)
   */
  getCurve: function() {
    return this.userId().then(r => myAxios.get(`/outpatientRestful/growthData/getCurve?userid=${r.object.userid}`));
  },

  /**
   * 手动录入曲线报告数据
   */
  saveCurve: function(data) {
    return this.userId().then(r => myAxios.post('/outpatientRestful/growthData/save', {userid: r.object.userid, ...data}));
  },

  /**
   * 删除曲线报告数据
   */
  removeCurve: function(data) {
    return this.userId().then(r => myAxios.post('/outpatientRestful/growthData/remove', data));
  },

}