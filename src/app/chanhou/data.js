
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
 * 产后复诊记录表单初始数据
 */
export const fzFormEntity = {
	"followDate": "",
	"deliveryDate": "",
	"deliveryHostital": "本院",
	"chiefComplaint": "",
	"systolicPressure": "",
	"diastolicPressure": "",
	"bp": "",
	"weight": "",
	"bmi": "",
	"healthCondition": "",
	"psychologicalCondition": "",
	"epds": "13",
	"neonatalFeeding": "",
	"breast": "",
	"lochia": "",
	"perineum": "",
	"vagina": "",
	"uterus": "",
	"uterineAppendages": "",
	"pelvicScore": "",
	"pelvicRecover": "",
	"highRiskTurnover": "",
	"gwzw": "",
	"diagnosis": "",
	"guide": "",
	"treatment": "",
}

/**
 * 健康状况
 */
export const jkzkOptions = toOptions('健康,良好,一般,较差');
/**
 * 心里状况
 */
export const xlzkOptions = toOptions('平稳,焦虑,抑郁');
/**
 * 新生儿喂养
 */
export const xsewyOptions = toOptions('母乳,混合,人工');
/**
 * 乳房
 */
export const rfOptions = toOptions('未见异常,硬结,红肿');
/**
 * 恶露
 */
export const elOptions = toOptions('干净,未净');
/**
 * 会阴
 */
export const sfycOptions = toOptions('未见异常,异常');
/**
 * 盆底恢复
 */
export const pdhfOptions = toOptions('未见异常,压力性尿失禁,其它类型尿失禁,脱垂,尿频,粪失禁,盆腔疼痛');
/**
 * 高危转危
 */
export const gwzwOptions = toOptions('痊愈,好转，定期复查,转专科治疗');
/**
 * 诊断
 */
export const zdOptions = toOptions('常规产后随诊,子宫复旧不良,伤口愈合不良,盆地功能障碍');