
function toOptions(data){
	if(data instanceof Array){
		return data.map(i => ({ label: i, value: i }))
	}
	if(data && typeof data === 'object'){
		return Object.keys(data).map(i => ({ label: data[i], value: i }))
  }
  if(typeof data === 'string'){
    return data.split(/[,;]/).map(i => ({ label: i, value: i }))
  }
	return [];
}
/**
 * 身份证：证件类型
 */
export const sfzOptions = toOptions('身份证,护照,回乡证,台胞证');

/**
 * 证件类型
 */
export const zjlxOptions = toOptions('身份证,护照,驾驶证');

/**
 * 酒的类型
 */
export const jiuOptions = toOptions('白酒,啤酒,红酒,其他');

/**
 * 血型O,A,B,AB
 */
export const xuexingOptions = toOptions('O,A,B,AB');

/**
 * 血型RH(+),RH(-)
 */
export const xuexing2Options = toOptions('RH(+),RH(-)');

/**
 * 一般症状
 */
export const ybzzOptions = toOptions('无,头晕,头痛,呕吐,胸闷,浮肿,便秘,白带,增多,腰酸,肚痛,抽筋,流血,其他');

/**
 * 疾病
 */
export const jibOptions = toOptions('无,高血压,糖尿病,心脏病,肾脏疾病,甲亢,G6BP,地中海贫血,肺结核,贫血,肾炎,肝炎,风湿,癫痫,其他');

/**
 * 宫颈涂片
 */
export const gjtpOptions = toOptions('正常,异常,未有检查,不清楚');

/**
 * 血制品
 */
export const xzpOptions = toOptions('无,红细胞,血小板,血浆,全血,白蛋白,其他,不清楚');

/**
 * 初潮
 */
export const ccOptions = toOptions('8,9,10,11,12,13,14,15,16,17,18');

/**
 * 数量
 */
export const slOptions = toOptions('多,中,少');

/**
 * 不孕病史
 */
export const bybsOptions = toOptions('无,输卵管因素,丈夫精弱精畸精,PCO（多囊卵巢）,原因不明,其他,不清楚');

/**
 * 频率
 */
export const plOptions = toOptions('偶尔,经常,无');

/**
 * 婚姻史
 */
export const hysOptions = toOptions('未婚,已婚,再婚');

/**
 * 是否
 */
export const yesOptions = toOptions('是,否');



/**
 * 手术史表头
 */
export const shoushushiColumns = [
  {
		title: '手术名称',
		key: 'checkdate',
		type: 'input'
	},
	{
		title: '手术日期',
    key: 'ckweek',
    type: 'date'
	},
	{
		title: '手术医院',
    key: 'kg',
    type: 'input'
  },
  {
		title: '术后病理',
		key: 'shbl',
		type: 'input'
	},
]