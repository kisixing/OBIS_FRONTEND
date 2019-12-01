
function toOptions(data, vfn =()=>({})){
	if(data instanceof Array){
		return data.map((v,i) => ({ label: v, value: v, ...vfn(v,i) }))
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
export const jiuOptions = toOptions('没有,白酒,啤酒,红酒,其他');

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
export const ybzzOptions = toOptions('头晕,头痛,呕吐,胸闷,浮肿,便秘,白带,增多,腰酸,肚痛,抽筋,流血,其他');

/**
 * 疾病
 */
export const jibOptions = toOptions('高血压,糖尿病,心脏病,肾脏疾病,甲亢,G6BP,地中海贫血,肺结核,贫血,肾炎,肝炎,风湿,癫痫,其他');

/**
 * 宫颈涂片
 */
export const gjtpOptions = toOptions('正常,异常,未有检查,不清楚');

/**
 * 血制品
 */
export const xzpOptions = toOptions('红细胞,血小板,血浆,全血,白蛋白,其他,不清楚');

/**
 * 初潮
 */
export const ccOptions = toOptions('8,9,10,11,12,13,14,15,16,17,18');

/**
 * 数量
 */
export const slOptions = toOptions('多,中,少');

/**
 * 不孕病史 shouzhenyy-x这个是当前模块的编辑组件
 */
export const bybsOptions = toOptions('输卵管因素,丈夫精弱精畸精,PCO（多囊卵巢）,原因不明]'.split(',').map(i=>`${i}(shouzhenyy-发现时间&date,治疗&input)`).concat(['其他(input)','不清楚(input)']));

/**
 * 频率
 */
export const plOptions = toOptions('偶尔,经常');

/**
 * 婚姻史
 */
export const hysOptions = toOptions('未婚,已婚,再婚');

/**
 * 是否
 */
export const yesOptions = toOptions('是,否');

/**
 *皮肤黏膜
*/
export const pfOptions = toOptions('正常,苍白,皮下出血(input),其他(input)');

/**
 *正常、异常
*/
export const neOptions = toOptions('正常,异常(input)');

/**
 *正常、畸形
*/
export const jxOptions = toOptions('正常,正常、畸形');

/**
 *无、有
*/
export const hnOptions = toOptions('无,有');

/**
 *乳头
*/
export const rtOptions = toOptions('凸起,凹陷');

/**
 *心率
*/
export const xlOptions = toOptions('齐,不齐(input)');

/**
 *触及
*/
export const cjOptions = toOptions('未触及,可触及');

/**
 *肾区叩痛
*/
export const sktOptions = toOptions('有（左）,有（右）');

/**
 *下肢浮肿
*/
export const xzfOptions = toOptions('+,+-,++,+++');

/**
 *双膝反射
*/
export const sxfOptions = toOptions('存在,亢起,消失,引不起');

/**
 *乙肝两对半
*/
export const ygOptions = toOptions('小三阳,大三阳,慢活肝,未查,其他(input)');

/**
 *阴阳未查
*/
export const yywOptions = toOptions('阴性,阳性,未查');

/**
 *阴阳未查、其他
*/
export const yyw2Options = toOptions('阴性,阳性,未查,其他');

/**
 *梅毒
*/
export const mdOptions = toOptions(['阴性','阳性(shouzhenyy-TPPA滴度,TRUST滴度)','未查(input)','其他']);

/**
 *OGTT
*/
export const ogttOptions = toOptions(['正常','GDM(shouzhenyy-空腹血糖,餐后1H血糖,餐后2H血糖)','未查']);

/**
 *地贫
*/
export const dpOptions = toOptions('正常,甲型(input),乙型(input),未查,其他(input)');

/**
 *尿蛋白
*/
export const dbnOptions = toOptions('阴性,弱阳性,阳性,未查,其他');

/**
 *药物或食物过敏史
*/
export const ywgmOptions = toOptions('青霉素,头孢,磺胺类,酒精,食物过敏(input),其他(input)');

/**
 *个人史
*/
export const grsOptions = toOptions('孕前或孕期服用叶酸,吸烟(input)[只/天],饮酒(input)[ml/天],接触有害物质(input),服用药物(input-4),接触射线,其他');

/**
 *家族史
*/
export const jzsOptions = toOptions('多胎,死胎,死产,先天畸形,精神病,痴呆,先天智力低下,糖尿病,高血压,肿瘤,其他(input)');

/**
 *遗传病
*/
export const ychOptions = toOptions('G6PD缺乏症,地贫,肿瘤,先天畸形,先天聋哑,先天智力低下,白化病,血友病,原发高血压,先天心脏病');

/**
 *尿蛋白
*/
export const xOptions = toOptions('阴性,弱阳性,阳性,未查,其他');

/**
 * 未做检查,拒绝检查
 */
export const wjjOptions = toOptions('未做检查,拒绝检查');

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

/**
 * 孕产史表头
 */
export const pregnanciesColumns = [
	{
		title: '孕次',
		key: 'checkdate',
		format: (v,{row})=>row+1
	},
	{
		title: '年',
    	key: 'ckweek',
    	type: 'date'
	},
	{
		title: '月',
    	key: 'kg',
    	type: 'input'
  	},
  	{
		title: '流产',
		children:[
			{
				title: '自然',
				key: 'ultrasound1_1',
				type: 'input'
			},
			{
				title: '清宫',
				key: 'ultrasound1_2',
				type: 'input'
			},
			{
				title: '人工',
				key: 'ultrasound1_3',
				type: 'input'
			}
		]
  	},
	{
		title: '引产',
		key: 'yc',
		type: 'input'
	},
	{
		title: '死胎',
		key: 'st',
		type: 'input'
	},
	{
		title: '早产',
		key: 'zc',
		type: 'input'
	},
	{
		title: '足月产',
		key: 'zyc',
		type: 'input'
	},
	{
		title: '分娩方式',
		children:[
			{
				title: '顺产',
				key: 'ydc',
			},
			{
				title: '手术产式',
				key: 'shshu',
			}
		]
	},
	{
		title: '产后情况',
		children:[
			{
				title: '出血',
				key: 'chux',
			},
			{
				title: '产褥热',
				key: 'char',
			}
		]
	},
	{
		title: '并发症',
		key: 'bfz',
		type: 'input'
	},
	{
		title: '小孩情况',
		children:[
			{
				title: '性别',
				key: 'xb',
			},
			{
				title: '生存',
				key: 'sc',
			},
			{
				title: '死亡时间',
				key: 'sw',
			},
			{
				title: '死亡原因',
				key: 'swr',
			},
			{
				title: '后遗症',
				key: 'hyz',
			},
			{
				title: '出生体重',
				key: 'cstz',
			}
		]
	},
	{
		title: '分娩医院',
		key: 'hos',
		type: 'input'
	},
	{
		title: '备注',
		key: 'remark',
		type: 'input'
	}
]


export const lisiColumns = [
	{
		title: '编号',
		key: 'no',
	},
	{
		title: '修改时间',
		key: 'date',
	},
	{
		title: '修改人',
		key: 'by',
	},
	{
		title: '修改字段',
		key: 'field',
	}
]
