/**
 * 返回的message里面带*的标识error级别，否则就是warning级别
 */

const validationFns = {
  required: function(value){
    if(!/\S/.test(value) || (typeof value === 'object' && !Object.keys(value||{}).filter(i=>!/^$/.test(i)).length)){
      return '*这个值不可为空';
    }
  },
  number: function (value){
      if(value && !/^\d+(\.\d+)?$/.test(value)){
          return '*只能输入数字';
      }
  },
  rang: function(min, max, value){
      if(value && min && value<+min){
          return '不能小于' + min;
      }
      if(value && max && value>+max){
          return '不能大于' + max;
      }
  },
};

/**
* 验证输入的数据
* @param {*输入的数据} validator, value
*/
export default function(validator, value){
  const validatorFn = function(valid, ...args){
      if(typeof valid === 'function'){
          return valid(...args, value);
      } else if(valid && typeof valid.test === 'function'){
          return !valid.test(value) && (valid.message || '*格式错误');
      }
  }
  
  if(typeof validator === 'string'){
      const validators = validator.split('|');
      for(let i=0; i<validators.length; i++){
          const name = validators[i].replace(/\(.*\)/,'');
          const args = /\((.*)\)/.test(validators[i])&&/\((.*)\)/.exec(validators[i])[1];
          let message = validatorFn(validationFns[name],...(args?args.split(','):[]));
          if(message){
              return message;
          }
      }
  } else if(validator instanceof Array) {
      for(let i=0; i<validator.length; i++){
          let message = validatorFn(validator[i]);
          if(message){
              return message;
          }
      }
  } else if(typeof validator === 'function'){
      return validatorFn(validator);
  }
}