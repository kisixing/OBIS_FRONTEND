# OBIS_FRONTEND
react based obis frontend 

## dependencies
1.dependencies分支放的是依赖文件，本项目文件不能网上下载依赖文件

## develop 
开发版本代码

## 框架form说明
>表单组件

- { name: 'yjzhouq(fL)[MCV]',  type: 'input', span: 7, showSearch: true,  valid: 'required'}

|参数/属性|说明|备注|默认值|
| --- | --- | --- | ---| 
| name| 表单元素名称，即表单的组件key，默认与接口提交一致|  | 
|()|存放，后缀单位，默认单位字体变小|  | 
|[]|中放label显示名称，label与组件的比例默认写死，可通过页面样式特殊定义|为了表单label对齐可用@等做&nbsp;的占位符如ckrut[乳@@@房 ]|
|span|特指24格分割下，当前组建的占位空间（含label、unit、input几部分）|
|valid|同时需要多种校验支持&#124;分割几种校验方式 required&#124;number&#124;rang(18.5,24.9)  分别为是否必填&#124;数字类型&#124;值范围（不在该范围的值将显示异常颜色）||无
|showSearch|是select支持搜索的一个继承配置|
|options|是选择类组件如select、checkbox等的选项配置|
|radio|对于checkinput类组件控制单选|
|classsName|特殊样式|如className: 'input_width_4'|

- 支持组件类型

由于UI组件继承与[antdesign 1.x版本](https://1x.ant.design/components), 原则上支持该版本的基础组件，需在项目render/common中添加

目前支持input，select，checkinput,date(增加showtime属性，支持简易时间，checkinput默认勾选支持输入框备注此时-number表示输入框的长度)，table等

- group组合
 ``` javascript
{
          className: 'zhuanke-group', columns: [
            { name: 'fkjc[妇科检查]', type: 'checkinput', radio: true, options: baseData.wjjOptions, span: 8 }
          ]
        },
        {
          filter: entity => !entity.fkjc || isShow(entity.fkjc), columns: [
            { span: 1 },
            { name: 'ckwaiy[外阴]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckyind[阴道]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckgongj[宫颈]', type: 'input', span: 5 },
            { span: 1 },
            { name: 'ckgongt[子宫]', type: 'input', span: 5 }
          ]
        },
 ```
 
 通过filter过滤块是否显示
 
 column对象中可以继续嵌套row -> 嵌套column 以满足一下特殊的比例关系
>表格组件

|参数/属性|说明|备注|默认值|
| --- | --- | --- | ---| 
|name| 表单元素名称，即表格对象的key，默认与接口提交一致|  | 
|pagination|是否分页|  | 
|editable|是否可编辑|  |
|options| column配置|column支持 单checkbox选项
|column|title：header显示名称，key，width，type,children表头合并的子column|
|holdeditor|默认是否双击才可编辑为了让checkbox类组件可以直接编辑||false

表格默认支持新增、双击修改、删除操作。

>接口请求说明

接口采用axios封装，注意utils/myaxios.js的地址和config目录下反向代理的配置；默认如果请求无参数则直接使用mock数据
