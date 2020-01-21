
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
 * 入院登记表单初始数据
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

// 住院登记表
/**
 * 住院科室
 */
export const zyksOptions = toOptions('孕妇区,产区,爱婴区,产科VIP');
/**
 * 是否在我院住院
 */
export const sfzyOptions = toOptions([{k: '是(shouzhenyy-原住院号)', addspan: 2}, '否']);
/**
 * 出生地
 */
export const csd1Options = toOptions('广东,福建,北京');
export const csd2Options = toOptions('广州,深圳,上海');
/**
 * 婚姻
 */
export const hyOptions = toOptions('未婚,已婚,丧偶,离婚');
/**
 * 来源
 */
export const lyOptions = toOptions('本区,本市,本省,外省,港澳台,外国');
/**
 * 职业
 */
export const zyOptions = toOptions('国家公务员,专业技术人员,企业管理人员,自由职业者,工人,现役军人,个体经营者,职员,农民,学生,退（离）休人员,无业人员（婴儿或学龄的儿童）,其他');
/**
 * 联系人与患者关系
 */
export const gxOptions = toOptions('配偶,子,女,孙子、孙女或外孙子女,父母,祖父母或外祖父母,兄弟姐妹,家庭内其他关系,非家庭关系成员');
