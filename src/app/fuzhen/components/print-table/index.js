import React, { Component } from "react";

export default class extends Component{
  constructor(props) {
    super(props);
  }

  getheades(columns, level = 0) {
    const nextColumns = Array.prototype.concat.apply([], columns.map(k => k.children || [k]));
    const childrenCount = column => {
      if(column.children){
        return column.children.map(cl => childrenCount(cl)).reduce((p,c) => p + c);
      }
      return 1;
    }
    columns.forEach(column => {
      column.level = column.level !== undefined ? column.level : level;
      column.span = childrenCount(column);
    });
    if (columns.filter(i => i.children && i.children.length).length) {
      return [columns, ...this.getheades(nextColumns, level + 1)]
    }
    return [columns];
  }


  render(){
    const { printKeys, printData, userDoc, selectRowKeys, hasPrint } = this.props;
    const rows = this.getheades(printKeys);
    const keysArr = [];
    printKeys.forEach(item => {
      if (item.title === '早') item.title = '胰岛素-早';
      if (item.title === '中') item.title = '胰岛素-中';
      if (item.title === '晚') item.title = '胰岛素-晚';
      if (item.title === '睡前') item.title = '胰岛素-睡前';

      if (item.title === '定性') item.title = '尿蛋白定性';
      if (item.title === '定量') item.title = '尿蛋白定量';
    })
    printKeys.forEach(item => {
      !item.className ? keysArr.push(item.key) : null;
    })
    // console.log(printKeys, printData, keysArr, selectRowKeys, '321')

    return (
      <div key={printData} className="print-table-wrapper">
        <div style={hasPrint ? {visibility: "hidden"} : {visibility: "visible"}}>
          <p className="print-info">
            <span className="info-item">姓名：{userDoc.username}</span>
            <span className="info-item">年龄：{userDoc.userage}</span>
            <span className="info-item">门诊号：{userDoc.usermcno}</span>
            <span>建档号：{userDoc.chanjno}</span>
          </p>
          {userDoc.highriskFactor && <p className="print-highrisk">高危诊断：{userDoc.highriskFactor}</p>}
        </div>
        <table style={{width: "100%"}} className="print-table">
          <tbody>
            {rows.map((item, index) => (
              <tr style={hasPrint ? {visibility: "hidden"} : null}>
                {item.map(subItem => (    
                  <td className={subItem.className}
                      rowSpan={subItem.level !== index ? 0 : (subItem.children ? 1 : rows.length-index) } 
                      colSpan={subItem.level !== index ? 0 : subItem.span}
                      style={subItem.level !== index ? {display: "none"} : null}>
                    {subItem.title}
                  </td>
                ))}
              </tr>
            ))}

            {printData.map((item, index) => (
              // hasPrint && !selectRowKeys.includes(index+2)  续打时打印对应的勾选行
              <div>
                <tr style={(hasPrint && !selectRowKeys.includes(index+2)) ? {visibility: "hidden"} : null}>
                  {keysArr.map(subItem => (
                    <td style={{width: 'auto'}}>
                      {
                        (!!item[subItem] && subItem === "checkdate") ? item[subItem].substring(5) 
                        : (!!item["ckappointment"] && subItem === "nextRvisitText") ? item["ckappointment"].substring(5) : item[subItem]
                      }
                    </td>
                  ))}
                </tr>
                {/* {
                  !!item.allMedicationPlan ?
                  <tr style={(hasPrint && !selectRowKeys.includes(index+2)) ? {visibility: "hidden"} : null}>
                    <td>用药方案</td>
                    <td colSpan={keysArr.length-1} style={{textAlign: "left"}}>{item.allMedicationPlan}</td>
                  </tr>
                  : null
                }
               {
                  !!item.examination ?
                  <tr style={(hasPrint && !selectRowKeys.includes(index+2)) ? {visibility: "hidden"} : null}>
                    <td>检验检查</td>
                    <td colSpan={keysArr.length-1} style={{textAlign: "left"}}>{item.examination}</td>
                  </tr>
                  : null
                }
                {
                  !!item.treatment ?
                  <tr style={(hasPrint && !selectRowKeys.includes(index+2)) ? {visibility: "hidden"} : null}>
                    <td>处理</td>
                    <td colSpan={keysArr.length-1} style={{textAlign: "left"}}>{item.treatment}</td>
                  </tr>
                  : null
                } */}
              </div>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
