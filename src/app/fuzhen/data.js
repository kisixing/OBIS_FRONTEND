
import * as util from './util';


// function toOptions(data, vfn = ()=>({})){
// 	if(data instanceof Array){
// 		return data.map((v,i) => ({ label: v, value: v, ...vfn(v,i) }))
// 	}
// 	if(data && typeof data === 'object'){
// 		return Object.keys(data).map(i => ({ label: data[i], value: i, ...vfn(v,i) }))
// 	}
// 	return [];
// }

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
 * 表单初始数据
 */
// export const formEntity = {
// 	"id": "",
// 	"userid": "6",
// 	"doctor": "",
// 	"checkdate": new Date().toLocaleDateString().replace(/\//g,'-'),
// 	"ckweek": '',
// 	"cktizh": "",
// 	"ckshrinkpressure": "",
// 	"ckdiastolicpressure": "",
// 	"ckzijzhz": "",
// 	"ckgongg": "",
// 	"tx1": "",
// 	"xl1": "1",
// 	"tx2": "",
// 	"xl2": "1",
// 	"tx3": "",
// 	"xl3": "1",
// 	"cktaix": "",
// 	"ckxianl": "1",
// 	"ckfuzh": "1",
// 	"fpg": "",
// 	"pbg2h": "",
// 	"hbAlc": "",
// 	"riMoMedicine": "",
// 	"riMoDosage": "",
// 	"riNoMedicine": "",
// 	"riNoDosage": "",
// 	"riEvMedicine": "",
// 	"riEvDosage": "",
// 	"riSlMedicine": "",
// 	"riSlDosage": "",
// 	"upState": "",
// 	"upDosage24h": "",
// 	"": "4,周",
// 	"heartRate": "",
// 	"examination": "",
// 	"tetz1": "",
// 	"teafv1": "",
// 	"teqxl1": "",
// 	"tetz2": "",
// 	"teafv2": "",
// 	"teqxl2": "",
// 	"tetz3": "",
// 	"teafv3": "",
// 	"teqxl3": "",
// 	"ckzijzhzqt": "",
// 	"treatment": "",
// 	"ckappointment": "2019-12-15",
// 	"rvisitOsType": "产科普通门诊",
// 	"ckappointmentArea": "1"
// };

/**
 * 本次产检记录表单初始数据
 */
export const formEntity = {
	"parseAddFieldLocations": null,
	"saveInitialData": false,
	"checkdate": new Date().toLocaleDateString().replace(/\//g,'-'),
	"ckdia": "",
	"ckappointment": "",
	"ckappointmentArea": "",
	"ckappointmentWeek": "",
	"ckweek": "",
	"ckmove": "",
	"cksheng": "",
	"cktizh": "",
	"ckshrinkpressure": "",
	"ckdiastolicpressure": "",
	"ckmaibo": "",
	"ckgongg": "",
	"ckfuw": "",
	"cktaix": "",
	"cktaiw": "",
	"ckxianl": "",
	"ckxianj": "",
	"ckfuzh": "",
	"ckxuess": "",
	"ckniaodb": "",
	"ckxuet": "",
	"ckzijzhz": "",
	"ckzijzhzqt": "",
	"ckchul": "",
	"ckjianchyy": "",
	"sign": "",
	"ckresult": "",
	"doctor": "",
	"rvisitOsType": "",
	"treatment": "",
	"fpg": "",
	"pbg2h": "",
	"riMoMedicine": "",
	"riMoDosage": "",
	"riNoMedicine": "",
	"riNoDosage": "",
	"riEvMedicine": "",
	"riEvDosage": "",
	"riSlMedicine": "",
	"riSlDosage": "",
	"hbAlc": "",
	"upState": "",
	"upDosage24h": "",
	"heartRate": "",
	"examination": "",
	"ckpressure": "",
	"medicationPlan": [{}],
	"fetalCondition": [{}, {}],
	"fetalUltrasound": [{}, {}],
	"nextRvisit": {},
	"nextRvisitText": "",
	"riMo": [],
	"riNo": [],
	"riEv": [],
	"riSl": [],
	"fetal": "",
	"tx1": "",
	"xl1": "",
	"tetz1": "",
	"teafv1": "",
	"teqxl1": "",
	"location1": "",
	"tx2": "",
	"xl2": "",
	"tetz2": "",
	"teafv2": "",
	"teqxl2": "",
	"location2": "",
	"tetz3": "",
	"teafv3": "",
	"teqxl3": "",
	"txlt": "",
	"xllt": "",
	"txrt": "",
	"xlrt": "",
	"txlb": "",
	"xllb": "",
	"txrb": "",
	"xlrb": "",
	"arrear": "",
	"addField": ""
};

/**
 * 产后复诊记录表单初始数据
 */
export const fzFormEntity = {
	"sfri": "",
	"fmri": "",
	"fmyy": "本院",
	"zs": "",
	"ckpressure": "",
	"tz": "",
	"bmi": "",
	"jkzk": "",
	"xlzk": "",
	"xsewy": "",
	"rf": "",
	"el": "",
	"hy": "",
	"yd": "",
	"zg": "",
	"fj": "",
	"pdpf": "",
	"pdhf": "",
	"qt": "",
	"gwzw": "",
	"zd": "",
	"zhd": "",
	"cl": "",
}
/**
 * 表格当表头
 */
export const tableKey = () => [
	{
		title: '日期',
		key: 'checkdate',
		type: 'date',
		width: 50,
		format:i=>(`${i||''}`).replace(/\d{4}-/,'')
	},
	{
		title: '孕周',
		key: 'ckweek',
		type: 'input',
		width: 50,
	},
	{
		title: '体重',
		key: 'cktizh',
		children:[
			{
				title: '(kg)',
				key: 'cktizh',
				type: 'input',
				width: 50,
			},
		]
	},
	{
		title: '血压',
		key: 'ckpressure',
		children:[
			{
				title: '(mmHg)',
				key: 'ckpressure',
				type: 'input',
				width: 60,
			},
		]
	},
	{
		title: '自觉症状',
		key: 'ckzijzhz',
		type: 'select',
		width: 80,
		showSearch: true,
		autoInsert: true,
		options: ckzijzhzOptions
	},
	{
		title: '胎心率',
		key: 'allTaix',
		children:[
			{
				title: '(bpm)',
				key: 'allTaix',
				width: 30,
				type: 'input'
			},
		]
	},
	{
		title: '宫高',
		key: 'ckgongg',
		children:[
			{
				title: '(cm)',
				key: 'ckgongg',
				width: 50,
				type: 'input',
				valid: 'number'
			},
		]
	},
	{
		title: '先露',
		key: 'allXianl',
		type:'select',
		width: 30,
		showSearch: true,
		options: xlOptions
	},
	{
		title: '下肢水肿',
		key: 'ckfuzh',
		type:'select',
		width: 50,
		options: ckfuzhOptions
	},
	// {
	// 	title: '胎儿超声',
	// 	key: 'allTetz',
	// 	children:[
	// 		{
	// 			title: '胎儿体重',
	// 			key: 'allTetz',
	// 		},
	// 		{
	// 			title: 'AVF',
	// 			key: 'allTeafv',
	// 		},
	// 		{
	// 			title: '脐血流',
	// 			key: 'allTeqxl',
	// 		},
	// 	]
	// },
			{
				title: '胎儿体重',
				key: 'allTetz',
			},
			{
				title: 'AVF',
				key: 'allTeafv',
			},
			{
				title: '脐血流',
				key: 'allTeqxl',
			},
	{
		title: '空腹血糖',
		key: 'fpg',
	},
	{
		title: '餐后2H',
		key: 'pbg2h',
	},
	{
		title: 'HbAlc',
		key: 'hbAlc',
	},
	// {
	// 	title: '胰岛素(U)方案',
	// 	key: 'allRiMo',
	// 	children:[
	// 		{
	// 			title: '早',
	// 			key: 'allRiMo',
	// 		},
	// 		{
	// 			title: '中',
	// 			key: 'allRiNo',
	// 		},
	// 		{
	// 			title: '晚',
	// 			key: 'allRiEv',
	// 		},
	// 		{
	// 			title: '睡前',
	// 			key: 'allRiSl',
	// 		},
	// 	]
	// },
			{
				title: '早',
				key: 'allRiMo',
			},
			{
				title: '中',
				key: 'allRiNo',
			},
			{
				title: '晚',
				key: 'allRiEv',
			},
			{
				title: '睡前',
				key: 'allRiSl',
			},
	// {
	// 	title: '尿蛋白',
	// 	key: 'upState',
	// 	children:[
	// 		{
	// 			title: '定性',
	// 			key: 'upState',
	// 		},
	// 		{
	// 			title: '定量',
	// 			key: 'upDosage24h',
	// 		},
	// 	]
	// },
			{
				title: '定性',
				key: 'upState',
			},
			{
				title: '定量',
				key: 'upDosage24h',
			},
	{
		title: '心率',
		key: 'heartRate',
	},
	{
		title: '用药方案',
		key: 'allMedicationPlan',
	},
	{
		title: '化验',
		key: 'examination',
	},
	{
		title: '处理措施',
		key: 'treatment',
		className: 'treatment',
		// type: 'input',
		width: 200,
	},
	{
		title: '下次复诊',
		key: 'nextRvisitText',
		width: 80,
	},
	// {
	// 	title: '医生',
	// 	key: 'sign',
	// },
];

/**
 * 诊疗计划表头
 */
export const planKey = () => [
	{
		title: '编号',
		key: 'index',
		format: (v,{row})=>row+1
	},
	{
		title: '时间',
		key: 'time',
	},
	{
		title: '孕周',
		key: 'gestation',
		type: 'input'
	},
	{
		title: '产检项目',
		key: 'item',
		type: 'input'
	},
	{
		title: '提醒事项',
		key: 'event',
		type: 'input'
	}
];

/**
 * 管理诊疗组表头
 */
export const managePlanKey = () => [
	{
		title: '编号',
		key: 'id',
		width: 30,
		format: (v,{row})=>row+1
	},
	{
		title: '诊疗计划组',
		key: 'groupName',
		width: 50,
	},
	{
		title: '内容',
		key: 'content',
	}
];

/**
 * 新建诊疗组表头
 */
export const newPlanKey = () => [
	{
		title: '编号',
		key: 'id',
		width: 30,
		format: (v,{row})=>row+1
	},
	{
		title: '孕周',
		key: 'time',
		type: 'input',
		width: 50,
	},
	{
		title: '提醒事件',
		key: 'event',
		type: 'input'
	}
];

/**
 * 诊断输入框的联想数据，当没有输入的时候显示top为true的数据
 */
export const diagnosis = toOptions('瘢痕子宫,妊娠期糖尿病,妊娠高血压,双胎妊娠,子宫平滑肌瘤'.split(','),v=>({top:true})).concat(toOptions(['高血压','冠心病','多胎妊娠','梅毒']));

/**
 * 先露
 */
export const xlOptions = [
	{ label: "头", value: "头" },
	{ label: "臀", value: "臀" },
	{ label: "肩", value: "肩" },
	{ label: "/", value: "/" }
];

/**
 * 位置
 */
export const wzOptions = [
	{ label: '左', value: '左' },
	{ label: '右', value: '右' },
	{ label: '左上', value: '左上' },
	{ label: '右上', value: '右上' },
	{ label: '左下', value: '左下' },
	{ label: '右下', value: '右下' },
];

/**
 * 浮肿
 */
export const ckfuzhOptions = [
	{ label: '-', value: '-' },
	{ label: '+', value: '+' },
	{ label: '++', value: '++' },
	{ label: '+++', value: '+++' },
	{ label: '++++', value: '++++' },
];

/**
 * 浮肿
 */
export const yyfaOptions = [
	{ label: '一天一次', value: '一天一次' },
	{ label: '一天两次', value: '一天两次' },
	{ label: '一天三次', value: '一天三次' },
	{ label: '一天四次', value: '一天四次' },
	{ label: '每四小时一次', value: '每四小时一次' },
	{ label: '每六小时一次', value: '每六小时一次' },
	{ label: '每八小时一次', value: '每八小时一次' },
	{ label: '每晚一次', value: '每晚一次' },
];

/**
 * 胎动好,无腹痛,无阴道流血
 */
export const ckzijzhzOptions = toOptions(['无不适', '胎动好', '无不适，胎动好']);

/**
 * 下次复诊 几周后
 */
export const nextRvisitWeekOptions = [
	{ label: '', value: '0' },
	{ label: '1周后', value: '7' },
	{ label: '2周后', value: '14' },
	{ label: '3周后', value: '21' },
	{ label: '4周后', value: '28' },
	{ label: '5周后', value: '35' },
	{ label: '1天后', value: '1' },
	{ label: '2天后', value: '2' },
	{ label: '3天后', value: '3' },
	{ label: '4天后', value: '4' },
	{ label: '5天后', value: '5' },
	{ label: '6天后', value: '6' },
];

/**
 * 门诊
 */
export const rvisitOsTypeOptions = toOptions(['', '普通门诊', '高危门诊', '入院'], (v,i)=>({value:i-1,describe:v.slice(0,1)}));

/**
 * 上午/下午
 */
export const ckappointmentAreaOptions = toOptions(['上午', '下午'], (v,i)=>({value:i+1,describe:v.slice(0,1)}));;

// export const ckappointmentAreaOptions = [
// 	{ label: '上午', describe:'上', value: '1' },
// 	{ label: '下午', describe:'下', value: '2' },
// ];
/**
 * 产检项目
 */
export const cjOptions = [
	{ label: '胎监', value: '胎监' },
	{ label: '尿蛋白', value: '尿蛋白' },
];
/**
 * 胎监选项
 */
export const tjOptions = [
	{ label: '有反应', value: '有反应' },
	{ label: '可疑，复查', value: '可疑，复查' },
	{ label: '异常，入院治疗', value: '异常，入院治疗' },
];

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