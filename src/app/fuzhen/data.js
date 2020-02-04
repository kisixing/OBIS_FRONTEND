
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
		options: ckzijzhzOptions
	},
	{
		title: '胎心率',
		key: 'cktaix',
		children:[
			{
				title: '(bpm)',
				key: 'cktaix',
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
				type: 'input'
			},
		]
	},
	{
		title: '先露',
		key: 'ckxianl',
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
	// 	title: '其他',
	// 	key: 'ckzijzhzqt',
	// 	type: 'input'
	// },
	{
		title: '处理措施',
		key: 'treatment',
		type: 'input',
		width: 150,
	},
	{
		title: '下次复诊',
		key: 'nextRvisitText',
		width: 80,
		// children:[
		// 	{
		// 		title: '预约日期',
		// 		key: 'ckappointment',
		// 	type: 'date'
		// 	}
		// ]
	},
];

/**
 * 诊疗计划表头
 */
export const planKey = () => [
	{
		title: 'No',
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
	},
	{
		title: '产检项目',
		key: 'item',
	},
	{
		title: '提醒事项',
		key: 'event',
	}
].map(i=>({type:'input',...i}));

/**
 * 管理诊疗组表头
 */
export const managePlanKey = () => [
	{
		title: '编号',
		key: 'id',
	},
	{
		title: '诊疗计划组',
		key: 'item',
	},
	{
		title: '内容',
		key: 'content',
	}
].map(i=>({type:'input',...i}));

/**
 * 新建诊疗组表头
 */
export const newPlanKey = () => [
	{
		title: '编号',
		key: 'id',
	},
	{
		title: '孕周',
		key: 'time',
	},
	{
		title: '提醒事件',
		key: 'event',
	}
].map(i=>({type:'input',...i}));

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
	{ label: '左', value: '1' },
	{ label: '上', value: '2' },
	{ label: '右下', value: '3' },
	{ label: '左下', value: '4' },
];

/**
 * 浮肿
 */
export const ckfuzhOptions = [
	{ label: '-', value: '1' },
	{ label: '+', value: '2' },
	{ label: '++', value: '3' },
	{ label: '+++', value: '4' },
	{ label: '++++', value: '5' },
];

/**
 * 浮肿
 */
export const yyfaOptions = [
	{ label: '一天一次', value: '1' },
	{ label: '一天两次', value: '2' },
	{ label: '一天三次', value: '3' },
	{ label: '一天四次', value: '4' },
	{ label: '每四小时一次', value: '5' },
	{ label: '每六小时一次', value: '6' },
	{ label: '每八小时一次', value: '7' },
	{ label: '每晚一次', value: '8' },
];

/**
 * 胎动好,无腹痛,无阴道流血
 */
export const ckzijzhzOptions = toOptions(['无不适', '胎动好', '无不适，胎动好']);

/**
 * 下次复诊 几周后
 */
export const nextRvisitWeekOptions = [
	{ label: '', value: '' },
	{ label: '1周后', value: '1' },
	{ label: '2周后', value: '2' },
	{ label: '4周后', value: '4' },
];

/**
 * 门诊
 */
export const rvisitOsTypeOptions = toOptions(['', '普通门诊', '高危门诊', '入院'], (v,i)=>({value:i+1,describe:v.slice(0,1)}));

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
	{ label: '胎监', value: '1' },
	{ label: '尿蛋白', value: '2' },
];
/**
 * 胎监选项
 */
export const tjOptions = [
	{ label: '有反应', value: '1' },
	{ label: '可疑，复查', value: '2' },
	{ label: '异常，入院治疗', value: '3' },
];
