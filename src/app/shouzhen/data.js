
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
export const ybzzOptions = toOptions('头晕,头痛,呕吐,胸闷,肚痛,腰酸,流血,白带增多,便秘,抽筋,浮肿,其他');

/**
 * 疾病
 */
export const jibOptions = toOptions('高血压{#FF3300},心脏病{#FF3300},癫痫{#FF3300},甲亢{#FF3300},甲减{#FF3300},糖尿病{#FF3300},肾脏疾病{#FF3300},风湿{#FF3300},肝脏疾病{#FF3300},肺结核{#FF3300},血栓疾病{#FF3300},地中海贫血{#FF3300},G6PD缺乏症{#FF3300},其他');

/**
 * 宫颈涂片
 */
export const gjtpOptions = toOptions('正常,异常,未有检查,不清楚');

/**
 * 血制品
 */
export const xzpOptions = toOptions([{k:'红细胞(shouzhenyy-时间,机构,原因)',addspan:2},{k:'血小板(shouzhenyy2-时间,机构,原因)',addspan:2},{k:'血浆(shouzhenyy2-时间,机构,原因)',addspan:2},{k:'全血(shouzhenyy2-时间,机构,原因)',addspan:2},{k:'白蛋白(shouzhenyy2-时间,机构,原因)',addspan:2},{k:'免疫球蛋白(shouzhenyy2-时间,机构,原因)',addspan:2},'其他','不清楚']);

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
export const bybsOptions = toOptions('输卵管因素,丈夫少精弱精畸精,PCO（多囊卵巢）,原因不明'.split(',').map(i=>`${i}(shouzhenyy-发现时间&date,治疗&input)`).concat(['其他(input)','不清楚(input)']));

/**
 * 频率
 */
export const plOptions = toOptions('无,偶尔,经常');

/**
 * 婚姻史
 */
export const hysOptions = toOptions('未婚,已婚,离异,再婚');

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
export const neOptions = toOptions('正常,异常(input){#999900}');

/**
 *正常、畸形
*/
export const jxOptions = toOptions('正常,畸形');

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
export const yywOptions = toOptions('阴性,阳性(input),未查');

/**
 *阴阳未查、其他
*/
export const yyw2Options = toOptions('阴性,阳性,未查,其他');

/**
 *梅毒
*/
export const mdOptions = toOptions(['阴性',{k:'阳性(shouzhenyy1-TPPA滴度,TRUST滴度)',addspan:4},'未查','其他(input)']);

/**
 *OGTT
*/
export const ogttOptions = toOptions(['正常',{k:'GDM(shouzhenyy-空腹血糖,餐后1H血糖,餐后2H血糖)',addspan:4},'未查']);

/**
 *地贫
*/
export const dpOptions = toOptions('正常,甲型(input),乙型(input),未查,其他(input)');

/**
 *尿蛋白
*/
export const dbnOptions = toOptions('阴性,弱阳性,阳性(input),未查,其他');

/**
 *药物或食物过敏史
*/
export const ywgmOptions = toOptions('青霉素,头孢,酒精,食物过敏(input),其他(input)');

/**
 *个人史
*/
export const grsOptions = toOptions('吸烟(input)[支/天],饮酒(input)[ml/天],接触有害物质(input),接触放射线(input),服用药物(input-4),其他');

/**
 *叶酸
*/
export const ysOptions = toOptions('孕前服用,孕期服用');
/**
 *家族史
*/
export const jzsOptions = toOptions('多胎,死胎/死产,先天畸形,精神病,痴呆,先天智力低下,肿瘤,心脏病,高血压,糖尿病,其他(input)');

/**
 *遗传病
*/
export const ychOptions = toOptions('先天畸形,先天性聋哑,先天智力低下,先天心脏病,G6PD缺乏症,地中海贫血,血友病,白化病,原发高血压,糖尿病,肿瘤,其他');

/**
 *尿蛋白
*/
export const xOptions = toOptions('阴性,弱阳性,阳性,未查,其他');

/**
 * 未做检查,拒绝检查
 */
export const wjjOptions = toOptions('未做检查,拒绝检查');

/**
 * 骨外盆未做检查
 */
export const gwwjjOptions = toOptions('未做检查');

/**
 * 手术史表头
 */
export const shoushushiColumns = [
  {
		title: '手术名称',
		key: 'checkdate',
		type: 'input',
		holdeditor: true
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
		type: 'date',
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
		type: 'checkbox'
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
