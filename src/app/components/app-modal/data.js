
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
export const sypFormEntity = {
  "transfer": [{
    "label": "",
    "value": ""
  }],
  "agree": [{
  "label": "",
  "value": ""
  }],
  "tppa": "",
  "trust": "",
  "treatment1_time1": '',
  "treatment1_transfer1": '',
  "treatment1_time2": '',
  "treatment1_transfer2": '',
  "treatment1_time3": '',
  "treatment1_transfer3": '',
  "treatment2_time1": '',
  "treatment2_transfer1": '',
  "treatment2_time2": '',
  "treatment2_transfer2": '',
  "treatment2_time3": '',
  "treatment2_transfer3": '',
  "follow_time1": '',
  "follow_trust1": '',
  "follow_time2": '',
  "follow_trust2": '',
  "follow_time3": '',
  "follow_trust3": '',
  "follow_time4": '',
  "follow_trust4": '',
  "follow_time5": '',
  "follow_trust5": '',
  "follow_time6": '',
  "follow_trust6": '',
  "treatment1_yunz1": '',
  "treatment1_yunz2": '',
  "treatment1_yunz3": '',
  "treatment2_yunz1": '',
  "treatment2_yunz2": '',
  "treatment2_yunz3": '',
};

/**
 * 是否
 */
export const sfOptions = toOptions('是,否');

 