import React, { Component } from "react";
import { Input } from 'antd';

import tableRender from '../../render/table';

export function countWeek(date){
  var days = Math.floor(((new Date() - new Date(date)) / (1000 * 3600) + 8) / 24);
  return `${Math.floor(days / 7)}+${days % 7}`;
}
