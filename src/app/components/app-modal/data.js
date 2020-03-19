
/**
 * 如果不想在value里面使用label的数据，可以换成用index作为value
 */
function toOptions(data, vfn =()=>({})){
	if(data instanceof Array){
		return data.map((v,i) => {
			const { k, ...rest } = v;
			return { ...rest, label: k || v, value: k || v, ...vfn(k || v,i) }
		})
	}
	if(data && typeof data === 'object'){
		return Object.keys(data).map((v,i) => ({ label: data[v], value: v, ...vfn(data[v],v,i) }))
  }
  if(typeof data === 'string'){
    return data.split(/[,;]/).map((v,i) => ({ label: v, value: v, ...vfn(v,i) }))
  }
	return [];
}

/**
 * 梅毒登记表单初始数据
 */
export const regFormEntity = {
  "address": "",
  "birthAddrCity": "",
  "birthAddrProvince": "",
  "birthday": "",
  "corAddr": "",
  "corPostno": "",
  "corTele": "",
  "dateHos": "",
  "dept": "",
  "docid": null,
  "ecAddr": "",
  "ecName": "",
  "ecRelative": "",
  "ecTele": "",
  "ethnicity": "",
  "hospitalized": "",
  "id": null,
  "idcardAddr": "",
  "idcardNo": "",
  "idcardPostno": "",
  "idcardSource": "",
  "inpatientNo": "",
  "marriage": "",
  "name": "",
  "note": "",
  "notionality": "",
  "occupation": "",
  "postno": "",
  "regtime": "",
  "root": "",
  "sex": "",
  "telephone": ""
};

 