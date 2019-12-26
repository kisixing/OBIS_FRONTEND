import React, { Component } from "react";
import { Input } from 'antd';

import tableRender from '../../render/table';

export function countWeek(date){
  var days = Math.ceil(((new Date(date) - new Date()) / (1000 * 3600)) / 24);
  return `${Math.floor(days / 7)}+${days % 7}`;
}

export function formateDate() {
  let date = new Date();
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export function getWeek(param1, param2) {
  let day1 = param1 * 7;
  let day2;
  if (param2.indexOf('+') !== -1) {
    day2 = param2.split('+');
    day2 = parseInt(day2[0] * 7) + parseInt(day2[1]);
  } else {
    day2 = parseInt(param2) * 7;
  }
  let days = day1 - day2;
  return `${Math.floor(days / 7)}+${days % 7}`;
}