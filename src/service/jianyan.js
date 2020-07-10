import myAxios from '../utils/myAxios';

export default {

    /**
     * 报告列表查询
     */
    getLisReport: function(){
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getLisReport?userid=${r.object.userid}`));
    },

    /**
     * 报告详情接口
     */
    getLisDetail: function(idArr, isAmy){
      let str = '';
      idArr.forEach(id => { str += `&sampleno=${id}` });
      if(isAmy) {
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getLisDetail?userid=${r.object.userid}&isAmy=1&amyId=${idArr[0]}`));
      } else {
        return this.userId().then(r => myAxios.get(`/outpatientRestful/getLisDetail?userid=${r.object.userid}${str}`));
      }
    },

    /**
     * 报告审阅（标记已读、正常、异常）
     */
    checkReport: function(repResult, repRemarks, repSign, repId, repAmy){
      if(repAmy) {
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/checkReport', 
        {checkState: repResult, checkRemark: repRemarks, checkRemarker: repSign, amyId: repId, isAmy: '1'}));
      } else {
        return this.userId().then(r => myAxios.post('/outpatientWriteRestful/checkReport', 
        {checkState: repResult, checkRemark: repRemarks, checkRemarker: repSign, sampleno: repId}));
      }
    },

    /**
     * 报告列表查询
     */
    getLisReport: function(){
      return this.userId().then(r => myAxios.get(`/outpatientRestful/getLisReport?userid=${r.object.userid}`));
    },

}