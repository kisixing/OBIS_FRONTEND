import { editTypes, eventFns } from './extend';

import validFn from './valid';

import * as inputs from './input';
import * as selects from './select';
import * as dates from './date';
import * as buttons from './button';
import * as mixs from './mix';
import * as cascader from "./cascader";
import * as districtSelect from "./district-select";
import * as editableSelect from "./editable-select2";

/**
 * 所有编辑组件
 */
export const types = editTypes;
/**
 * 验证
 */
export const valid = validFn;

export const events = eventFns;

/**
 * 所有的编辑器
 */
export const editors = {
  ...inputs,
  ...selects,
  ...dates,
  ...buttons,
  ...mixs,
  ...cascader,
  ...districtSelect,
  ...editableSelect,
};

export default {
  types,
  valid,
  events,
  editors
}
