
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
export const sfzOptions = [{ label: '身份证', value: '身份证' },
{ label: '护照', value: '护照' },
{ label: '回乡证', value: '回乡证' },
{ label: '台胞证', value: '台胞证' }];

/**
 * 证件类型
 */
export const zjlxOptions = toOptions('身份证,护照,回乡证,台胞证');

/**
 * 酒的类型
 */
export const jiuOptions = toOptions('没有,白酒,啤酒,红酒,其他');

/**
 * 受孕方式
 */
export const syfsOptions = toOptions('IVF{#FF3300}');

/**
 * 血型O,A,B,AB
 */
export const xuexingOptions = [{ label: 'O', value: 'O' },
{ label: 'A', value: 'A' },
{ label: 'B', value: 'B' },
{ label: 'AB', value: 'AB' }];
//toOptions('O,A,B,AB');

/**
 * 血型RH(+),RH(-)
 */
export const xuexing2Options = [{ label: 'RH(+)', value: 'RH(+)' },
{ label: 'RH(-)', value: 'RH(-)' }];
//toOptions('RH(+),RH(-)');

/**
 * 一般症状
 */
export const ybzzOptions = toOptions('头晕{#FF3300},头痛{#FF3300},呕吐{#FF3300},胸闷{#FF3300},肚痛{#FF3300},腰酸{#FF3300},流血{#FF3300},白带增多{#FF3300},便秘{#FF3300},抽筋{#FF3300},浮肿{#FF3300},其他{#FF3300}');

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
export const xzpOptions = toOptions([{k:'红细胞{#FF3300}(shouzhenyy-时间,医院,原因)',addspan:2},{k:'血小板{#FF3300}(shouzhenyy-时间,医院,原因)',addspan:2},{k:'血浆{#FF3300}(shouzhenyy-时间,医院,原因)',addspan:2},{k:'全血{#FF3300}(shouzhenyy2-时间,医院,原因)',addspan:2},{k:'白蛋白{#FF3300}(shouzhenyy2-时间,医院,原因)',addspan:2},{k:'免疫球蛋白{#FF3300}(shouzhenyy2-时间,医院,原因)',addspan:2},'其他{#FF3300}','不清楚']);
export const sxsOptions = toOptions([{k:'有{#FF3300}(shouzhenyy-时间,原因)',addspan:2}]);


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
export const bybsOptions = toOptions('输卵管因素{#FF3300},丈夫少精弱精畸精{#FF3300},PCO{#FF3300}（多囊卵巢）,原因不明{#FF3300}'.split(',').map(i=>`${i}(shouzhenyy-发现时间&date,治疗&input)`).concat(['其他{#FF3300}(input)','不清楚{#FF3300}(input)']));

/**
 * 频率
 */
export const plOptions = toOptions('无,偶尔,经常');

/**
 * 婚姻史
 */
export const hysOptions = toOptions('未婚,已婚,离异,再婚,丧偶');

/**
 * 是否
 */
export const yesOptions = toOptions('是,否');

/**
 * 近亲
 */
export const jinqOptions = toOptions('是{#FF3300},否');

/**
 *皮肤黏膜
*/
export const pfOptions = toOptions('正常,苍白{#FF3300},皮下出血{#FF3300}(input),其他{#FF3300}(input)');

/**
 *正常、异常
*/
export const neOptions = toOptions('正常,异常(input){#FF3300}');

/**
 *正常、其他
*/
export const noOptions = toOptions('正常,其他(input){#FF3300}');

/**
 *清、其他
*/
export const coOptions = toOptions('清,其他(input){#FF3300}');

/**
 *存在、其他
*/
export const slfsOptions = toOptions('存在,其他(input){#FF3300}');

/**
 *无、其他
*/
export const blfsOptions = toOptions('无,其他(input){#FF3300}');
/**
 *无、其他
*/
export const eoOptions = toOptions('无,其他(input){#FF3300}');

/**
 *正常、畸形
*/
export const jxOptions = toOptions('正常,畸形{#FF3300}');

/**
 *无、有
*/
export const hnOptions = toOptions('无,有');
/**
 *有、无
*/
export const nhOptions = toOptions('有(input){#FF3300},无');

export const wssOptions = toOptions([{k:'有{#FF3300}(input)',addspan:2}]);
/**
 *乳头
*/
export const rtOptions = toOptions('凸起,凹陷');

/**
 *心率
*/
export const xlOptions = toOptions('齐,不齐{#FF3300}(input)');

/**
 *触及
*/
export const cjOptions = toOptions('未触及,可触及');

/**
 *肾区叩痛
*/
export const sktOptions = toOptions('无,有（左）{#FF3300},有（右）{#FF3300}');

/**
 *下肢浮肿
*/
export const xzfOptions = toOptions('-,+,+-,++,+++');

/**
 *双膝反射
*/
export const sxfOptions = toOptions('存在,亢起{#FF3300},消失{#FF3300},引不起{#FF3300}');

/**
 *乙肝两对半
*/
export const ygOptions = toOptions('正常,小三阳{#FF3300},大三阳{#FF3300},慢活肝{#FF3300},未查{#FF3300},其他{#FF3300}(input)');

/**
 *阴阳未查
*/
export const yywOptions = toOptions('阴性,阳性{#FF3300}(input),未查{#FF3300}');

/**
 *阴阳未查、其他
*/
export const yyw2Options = toOptions('阴性,阳性{#FF3300},未查{#FF3300},其他{#FF3300}(input)');

/**
 *梅毒
*/
export const mdOptions = toOptions(['阴性',{k:'阳性{#FF3300}(shouzhenyy1-TPPA滴度,TRUST滴度)',addspan:4},'未查{#FF3300}','其他{#FF3300}(input)']);

/**
 *OGTT
*/
export const ogttOptions = toOptions(['正常',{k:'GDM{#FF3300}(shouzhenyy-空腹血糖,餐后1H血糖,餐后2H血糖)',addspan:4},'未查{#FF3300}']);

/**
 *地贫
*/
export const dpOptions = toOptions('正常,甲型{#FF3300}(input),乙型{#FF3300}(input),未查{#FF3300},其他{#FF3300}(input)');

/**
 *尿蛋白
*/
export const dbnOptions = toOptions('阴性,弱阳性{#FF3300},阳性{#FF3300}(input),未查{#FF3300},其他{#FF3300}(input)');

/**
 *药物或食物过敏史
*/
export const ywgmOptions = toOptions('药物{#FF3300}(input),食物{#FF3300}(input),其他{#FF3300}(input)');

/**
 *个人史
*/
export const grsOptions = toOptions(['吸烟{#FF3300}(input)[支/天]','饮酒{#FF3300}(input)[ml/天]','接触有害物质{#FF3300}(input)','接触放射线{#FF3300}(input)',{k:'服用药物{#FF3300}(input-诊断&用药&剂量&备注)',addspan:2},'其他{#FF3300}(input)']);

/**
 *叶酸
*/
export const ysOptions = toOptions('孕前服用,孕期服用');
/**
 *家族史
*/
export const jzsOptions = toOptions('多胎{#FF3300},死胎/死产{#FF3300},先天畸形{#FF3300},精神病{#FF3300},痴呆{#FF3300},先天智力低下{#FF3300},肿瘤{#FF3300},心脏病{#FF3300},高血压{#FF3300},糖尿病{#FF3300},其他{#FF3300}(input)');

/**
 *遗传病
*/
export const ychOptions = toOptions('先天畸形{#FF3300},先天性聋哑{#FF3300},先天智力低下{#FF3300},先天心脏病{#FF3300},G6PD缺乏症{#FF3300},地中海贫血{#FF3300},血友病{#FF3300},白化病{#FF3300},原发高血压{#FF3300},糖尿病{#FF3300},肿瘤{#FF3300},其他{#FF3300}(input)');

/**
 *尿蛋白
*/
export const xOptions = toOptions('阴性,弱阳性{#FF3300},阳性{#FF3300},未查{#FF3300},其他{#FF3300}(input)');

/**
 * 未做检查,拒绝检查
 */
export const wjjOptions = toOptions('已查,拒绝检查');

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
		key: 'name',
		type: 'input'
	},
	{
		title: '手术日期',
		key: 'date',
		type: 'date',
		mode:"ym"
	},
	{
		title: '手术医院',
		key: 'hospital',
		type: 'input'
  },
  {
		title: '术后病理',
		key: 'postoperativePathology',
		type: 'input'
	},
]

/**
 * 孕产史表头
 */
export const pregnanciesColumns = [
	{
		title: '孕次',
		key: 'index',	
		width: '50',
		format: (v,{row})=>row+1
	},
	{
		title: '   年-月    ',
		key: 'datagridYearMonth',
		type: 'date',
		width: '160',
		mode:"ym",
	},
	{
		title: '流产',
		children:[
			{
				title: '自然',
				key: 'zir',
				type: 'input'
			},
			{
				title: '清宫',
				key: 'removalUterus',
				type: 'checkbox',
				holdeditor: true
			},
			{
				title: '人工',
				key: 'reng',
				type: 'input'
			}
		]
    },
	{
		title: '引产',
		key: 'yinch',
		type: 'input'
	},
	{
		title: '死胎',
		key: 'sit',
		type: 'checkbox',
		holdeditor: true
	},
	{
		title: '早产',
		key: 'zaoch',
		type: 'input'
	},
	{
		title: '足月产',
		key: 'zuych',
		type: 'input'
	},
	{
		title: '分娩方式',
		children:[
			{
				title: '顺产',
				key: 'shunch',
				type: 'checkbox',
				holdeditor: true
			},
			{
				title: '手术产式',
				key: 'shouShuChanType',
				type: 'input'
			}
		]
	},
	{
		title: '产后情况',
		children:[
			{
				title: '出血',
				key: 'chuxue',
				type: 'checkbox',
				holdeditor: true
			},
			{
				title: '产褥热',
				key: 'chanrure',
				type: 'checkbox',
				holdeditor: true
			}
		]
	},
	{
		title: '并发症',
		key: 'bingfzh',
		type: 'input',
		width: '200',
	},
	{
		title: '小孩情况',
		children:[
			{
				title: '性别',
				key: 'xingb',
				type: 'select',
				showSearch:true, 
				options: [
					{ label: '男', value: '1' },
					{ label: '女', value: '2' },
					{ label: '未知', value: '3' },
				],		 
			},
			{
				title: '生存',
				key: 'child',
				type: 'select',
				showSearch:true, 
				options: [
					{ label: '健在', value: '1' },
					{ label: '死亡', value: '2' },
					{ label: '未知', value: '3' },
				],		 
			},
			{
				title: '死亡时间',
				key: 'siw',
				type: 'input'
			},
			{
				title: '死亡原因',
				key: 'deathCause',
				type: 'input'
			},
			{
				title: '后遗症',
				key: 'sequela',
				type: 'input'
			},
			{
				title: '出生体重(kg)',
				key: 'tizh',
				type: 'input'
			}
		]
	},
	{
		title: '分娩医院',
		key: 'hospital',
		type: 'input'
	},
	{
		title: '备注',
		key: 'hospital',
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
