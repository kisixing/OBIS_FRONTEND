/*
 * @Description: 行政区域选择组件
 * @Author: Zhong Jun
 * @Date: 2020-03-18 10:24:13
 */

import React from 'react';
import { Cascader } from "antd";
import styles from './'

import options, { getStreets } from '../../utils/cascader-address-options'

export function districtSelect({ value = [], onChange, onBlur = () => {}, ...props }) {
  const handleChangePCA = e => {
    let newValue = [];
    if (value && value.length) {
      const pca = value.slice(0, 3);
      const sv = value.slice(3);
      newValue =[...e, ...sv];
    }
    onChange("", newValue, onBlur({ checkedChange: true }));
  };

  const handleChangeSV = e => {
    const pca = value.slice(0, 3);
    const sv = value.slice(3);
    const newValue = [...pca, ...e];
    onChange("", newValue, onBlur({ checkedChange: true }));
  }

  let streetOption = [];
  if (value.length >= 3) {
    streetOption = getStreets(value[0], value[1], value[2]);
  }

  return (
    <div style={{ display: "flex" }}>
      <Cascader
        allowClear={false}
        options={options}
        value={value.slice(0, 3)}
        expandTrigger="hover"
        onChange={handleChangePCA}
        placeholder="请选择省市区"
        style={{ fontSize: "16px" }}
      />
      <Cascader
        allowClear={false}
        options={streetOption}
        value={value.slice(3)}
        expandTrigger="hover"
        onChange={handleChangeSV}
        placeholder="请选择街道社区"
        style={{ fontSize: "16px" }}
      />
    </div>
  );
}
