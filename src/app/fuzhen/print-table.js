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
    const { printKeys, printData, highriskFactor } = this.props;
    const rows = this.getheades(printKeys);
    const keysArr = [];

    printKeys.splice(printKeys.length - 3, 3);
    printKeys.forEach(item => {
      !item.className ? keysArr.push(item.key) : null;
    })
    // console.log(printKeys, printData, '124')
    // console.log(rows, '222')
    // console.log(keysArr, '3221')

    return (
      <div>
        <p className="print-highrisk">高危因素：{highriskFactor}</p>
        <table style={{width: "100%"}} className="print-table">
          <tbody>
            {rows.map((item, index) => (
              <tr>
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
              <div>
                <tr style={index === printData.length - 1 ? {visibility: "inherit"} : null}>
                  {keysArr.map(subItem => (
                    <td>{!!item[subItem] && subItem === "checkdate" ? item[subItem].substring(5) : item[subItem]}</td>
                  ))}
                </tr>
                {
                  !!item.allMedicationPlan ?
                  <tr style={index === printData.length - 1 ? {visibility: "inherit"} : null}>
                    <td>用药方案</td>
                    <td colSpan={keysArr.length-1}>{item.allMedicationPlan}</td>
                  </tr>
                  : null
                }
                {
                  !!item.treatment ?
                  <tr style={index === printData.length - 1 ? {visibility: "inherit"} : null}>
                    <td>处理措施</td>
                    <td colSpan={keysArr.length-1}>{item.treatment}</td>
                  </tr>
                  : null
                }
              </div>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
