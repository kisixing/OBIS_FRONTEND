
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
	"medicationPlan": [{}],
	"fetalCondition": [{}, {}],
	"fetalUltrasound": [{}, {}],
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
 * 入院登记表单初始数据
 */
export const regFormEntity = {
	"hzxm": '007',
	"xb": '男',
	"csrq": '1947-07-07',
	"lxdh": "10086",
	"zyks": '',
	"rysq": '',
	"tsbz": "",
	"sfzwyzy": "",
	"gj": "",
	"jg": "",
	"mz": "",
	"csd1": "",
	"csd2": "",
	"hy": "",
	"xzz": "",
	"yb1": "",
	"sfzdz": "",
	"yb2": "",
	"sfzhm": "",
	"ly": "",
	"zy": "",
	"gzdwjdz": "",
	"dwyb": "",
	"dwlxdh": "",
	"lxrxm": "",
	"lxrdh": "",
	"lxrdz": "",
	"gx": "",
};

/**
 * 表格当表头
 */
export const tableKey = () => [
	{
		title: '日期',
		key: 'checkdate',
		type: 'date',
		width: '180',
		format:i=>(`${i||''}`).replace(/\d{4}-/,'')
	},
	{
		title: '孕周',
		key: 'ckweek',
		type: 'input'
	},
	{
		title: '体重',
		key: 'cktizh',	
		children:[
			{
				title: '(kg)',
				key: 'cktizh',
				type: 'input'
			},
		]
	},
	{
		title: '血压',
		key: 'ckdiastolicpressure',
		width: 160,	
		children:[
			{
				title: '(mmHg)',
				key: 'ckdiastolicpressure',
				type: 'input'
			},
		]
	},
	{
		title: '自觉症状',
		key: 'ckzijzhz',
		type: 'input'
	},
	{
		title: '胎心',
		key: 'cktaix',
		width: 130,
		children:[
			{
				title: '(bpm)',
				key: 'cktaix',
				type: 'input'
			},
		]
	},
	{
		title: '先露',
		key: 'ckxianl',
		type:'select',
		options: xlOptions
	},
	{
		title: '宫高',
		key: 'ckgongg',
		children:[
			{
				title: '(cm)',
				key: 'ckgongg',
				type: 'input'
			},
		]
	},
	{
		title: '下肢水肿',
		key: 'ckfuzh',
		type:'select',
		options: ckfuzhOptions
	},
	{
		title: '其他',
		key: 'ckzijzhzqt',
		type: 'input'
	},
	{
        title: '下次复诊',
		key: 'ckappointment',
        children:[
            {
                title: '预约日期',
				key: 'ckappointment',
				type: 'date'
            }
        ]
    },
	{ 
		title: '处理措施',
		key: 'treatment',
		type: 'input',
		width: 150
	}
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
	{ label: '头', value: '1' },
	{ label: '臀', value: '2' },
	{ label: '肩', value: '3' },
	{ label: '/', value: '4' },
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
export const ckzijzhzOptions = toOptions(['胎动好', '无腹痛', '无阴道流血']);

/**
 * 下次复诊 几周后
 */
export const nextRvisitWeekOptions = [
	{ label: '', value: '' },
	{ label: '1周后', value: '1,周' },
	{ label: '2周后', value: '2,周' },
	{ label: '4周后', value: '4,周' },
];

/**
 * 门诊
 */
export const rvisitOsTypeOptions = toOptions(['', '普通门诊', '高危门诊', '入院'], (v,i)=>({value:i,describe:v.slice(0,1)}));

/**
 * 上午/下午
 */
export const ckappointmentAreaOptions = [
	{ label: '上午', describe:'上', value: '1' },
	{ label: '下午', describe:'下', value: '2' },
];
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

// 住院登记表
/**
 * 住院科室
 */
export const zyksOptions = toOptions(['孕妇区', '产区', '爱婴区', '产科VIP']);
/**
 * 是否在我院住院
 */
export const sfzyOptions = toOptions([{k: '是(shouzhenyy-原住院号)', addspan: 2}, '否']);
/**
 * 出生地
 */
export const csd1Options = toOptions(['广东', '福建', '北京']);
export const csd2Options = toOptions(['广州', '深圳', '上海']);
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
export const zyOptions = toOptions('国家公务员,专业技术人员,企业管理人员,自由职业者,工人,现役军人,个体经营者,职员,农民,学生,退(离)休人员,无业人员(婴儿或学龄的儿童),其他');
/**
 * 联系人与患者关系
 */
export const gxOptions = toOptions('配偶,子,女,孙子、孙女或外孙子女,父母,祖父母或外祖父母,兄弟姐妹,家庭内其他关系,非家庭关系成员');
