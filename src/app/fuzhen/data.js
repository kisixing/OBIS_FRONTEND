
import * as util from './util';


function toOptions(data){
	if(data instanceof Array){
		return data.map(i => ({ label: i, value: i }))
	}
	if(data && typeof data === 'object'){
		return Object.keys(data).map(i => ({ label: data[i], value: i }))
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
		title: '体重 (kg)',
		key: 'kg',
	},
	{
		title: '血压  (mmHg)',
		key: 'mmhg',
		width: 150,
	},
	{
		title: '自觉症状',
		key: 'disease',
	},
	{
		title: '胎心 (BMP)',
		key: 'bmp',
		width: 130,
	},
	{
		title: '先露',
		key: 'ckxianl',
		type:'select',
		options: xlOptions
	},
	{
		title: '宫高 (cm)',
		key: 'ckgongg',
	},
	{
		title: '浮肿',
		key: 'ckfuzh',
		type:'select',
		options: ckfuzhOptions
	},
	{
		title: '其他',
		key: 'other',
	},
	{
		title: '超声1',
		children:[
			{
				title: '超声11',
				key: 'ultrasound1_1',
			},
			{
				title: '超声12',
				key: 'ultrasound1_2',
			},
			{
				title: '超声13',
				key: 'ultrasound1_3',
			}
		]
	},
	{
		title: '超声2',
		children:[
			{
				title: '超声21',
				key: 'ultrasound2_1',
			},
			{
				title: '超声22',
				key: 'ultrasound2_2',
			},
			{
				title: '超声23',
				key: 'ultrasound2_3',
			}
		]
	},
	{
		title: '心率',
		key: 'heart',
	},
	{
		title: '药物',
		children: [
			{
				title: '药物11',
				key: 'medicine1_1',
			},
			{
				title: '药物12',
				key: 'medicine1_2',
			},
			{
				title: '化验',
				key: 'assay',
			}
		]
	},
	{
		title: '尿蛋白',
		children: [
			{
				title: '尿蛋白11',
				key: 'pro1_1',
			},
			{
				title: '尿蛋白12',
				key: 'pro1_2',
			}
		]
	},
	{
		title: '胰岛素',
		children: [
			{
				title: '胰岛素11',
				key: 'insulin1_1',
			},
			{
				title: '胰岛素12',
				key: 'insulin1_2',
			},
			{
				title: '胰岛素13',
				key: 'insulin1_3',
			},
			{
				title: '胰岛素14',
				key: 'insulin1_4',
			}
		]
	},
	{
		title: '下次复诊',
		children: [
			{
				title: '下次复诊11',
				key: 'visit1_1',
				width: 120,
			},
			{
				title: '下次复诊12',
				key: 'visit1_2',
				width: 120,
			},
			{ 
				title: '下次复诊13', 
				key: 'visit1_3', 
				width: 120 
			}
		]
	},
	{ title: '处理措施', key: 'dispose', width: 150 }
].map(i=>({type:'input',...i}));

export const diagnosis = toOptions(['妊娠期糖尿病','高血压','冠心病','双胎妊娠','多胎妊娠','梅毒']);

/**
 * 先露
 */
export const xlOptions = [
	{ label: '头', value: '1' },
	{ label: '臀', value: '2' },
	{ label: '其他', value: '5' },
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
export const rvisitOsTypeOptions = toOptions(['产科普通门诊', '高危产科门诊', '教授门诊']);

/**
 * 上午/下午
 */
export const ckappointmentAreaOptions = [
	{ label: '上午', value: '1' },
	{ label: '下午', value: '2' },
];
