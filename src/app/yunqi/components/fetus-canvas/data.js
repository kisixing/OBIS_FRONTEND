/**
 * 胎儿生长曲线数据编辑表表头
 */
export const fetusKey = () => [
	{
		title: '日期',
		key: 'date',
		type: 'date',
	},
  {
		title: '孕周',
		key: 'gesweek',
		type: 'input',
		valid: 'symbol(+)',
	},
	{
		title: 'BPD(mm)',
		key: 'bpd',
		type: 'input',
		valid: 'number',
	},
	{
		title: 'FL(mm)',
		key: 'fl',
		type: 'input',
		valid: 'number',
  },
  {
		title: 'AC(mm)',
		key: 'ac',
		type: 'input',
		valid: 'number',
  },
  {
		title: '胎儿标记',
		key: 'fetusNo',
		type: "select",
		options: teOptions,
	},
];

/**
 * 胎儿标记
 */
export const teOptions = [
	{ label: '胎1', value: '1' },
	{ label: '胎2', value: '2' },
	{ label: '胎3', value: '3' },
	{ label: '胎4', value: '4' },
	{ label: '胎5', value: '5' },
	{ label: '胎6', value: '6' },
];