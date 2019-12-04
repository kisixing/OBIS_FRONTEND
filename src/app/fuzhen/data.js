
import * as util from './util';


function toOptions(data, vfn = ()=>({})){
	if(data instanceof Array){
		return data.map((v,i) => ({ label: v, value: v, ...vfn(v,i) }))
	}
	if(data && typeof data === 'object'){
		return Object.keys(data).map(i => ({ label: data[i], value: i, ...vfn(v,i) }))
	}
	return [];
}

/**
 * 表单初始数据
 */
export const formEntity = {
	"id": "",
	"userid": "6",
	"doctor": "",
	"checkdate": new Date().toLocaleDateString().replace(/\//g,'-'),
	"ckweek": util.countWeek('2019-10-01'),
	"cktizh": "",
	"ckshrinkpressure": "",
	"ckdiastolicpressure": "",
	"ckzijzhz": "",
	"ckgongg": "",
	"tx1": "",
	"xl1": "1",
	"tx2": "",
	"xl2": "1",
	"tx3": "",
	"xl3": "1",
	"cktaix": "",
	"ckxianl": "1",
	"ckfuzh": "1",
	"fpg": "",
	"pbg2h": "",
	"hbAlc": "",
	"riMoMedicine": "",
	"riMoDosage": "",
	"riNoMedicine": "",
	"riNoDosage": "",
	"riEvMedicine": "",
	"riEvDosage": "",
	"riSlMedicine": "",
	"riSlDosage": "",
	"upState": "",
	"upDosage24h": "",
	"": "4,周",
	"heartRate": "",
	"examination": "",
	"tetz1": "",
	"teafv1": "",
	"teqxl1": "",
	"tetz2": "",
	"teafv2": "",
	"teqxl2": "",
	"tetz3": "",
	"teafv3": "",
	"teqxl3": "",
	"ckzijzhzqt": "",
	"treatment": "",
	"ckappointment": "2019-12-15",
	"rvisitOsType": "产科普通门诊",
	"ckappointmentArea": "1"
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
	},
	{
		title: '体重',
		key: 'kg',	
		children:[
			{
				title: '(kg)',
				key: 'kg',
			},
		]
	},
	{
		title: '血压',
		key: 'mmhg',
		width: 160,	
		children:[
			{
				title: '(mmHg)',
				key: 'mmhg',
			},
		]
	},
	{
		title: '自觉症状',
		key: 'disease',
	},
	{
		title: '胎心',
		key: 'bmp',
		width: 130,
		children:[
			{
				title: '(bpm)',
				key: 'bpm',
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
		key: 'other',
	},
	{
        title: '下次复诊',
        children:[
            {
                title: '预约日期',
                key: 'ultrasound1_1',
            },
            {
                title: '上午/下午',
                key: 'ultrasound1_2',
            },
            {
                title: '门诊类型',
                key: 'ultrasound1_3',
            }
        ]
    },
	{ title: '处理措施', key: 'dispose', width: 150 }
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
	{ label: '其他', value: '5' },
	{ label: '不清', value: '6' },
];

/**
 * 浮肿
 */
export const ckfuzhOptions = [
	{ label: '-', value: '1' },
	{ label: '+', value: '3' },
	{ label: '++', value: '4' },
	{ label: '+++', value: '5' },
	{ label: '++++', value: '6' },
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
export const rvisitOsTypeOptions = toOptions(['产科普通门诊', '高危产科门诊', '教授门诊'], (v,i)=>({value:i,describe:v.slice(0,1)}));

/**
 * 上午/下午
 */
export const ckappointmentAreaOptions = [
	{ label: '上午', describe:'上', value: '1' },
	{ label: '下午', describe:'下', value: '2' },
];
