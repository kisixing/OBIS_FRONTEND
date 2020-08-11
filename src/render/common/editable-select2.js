
import React, { Component } from 'react';
import { Select, Input } from 'antd';

class EditableSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      isShowOptions: false,
      showOPtions: null,
      fixedLeft: 0,
      fixedTop: 0,
      fixedWidth: 0,
    }
  }

  pageX(elem) {
    return elem.offsetParent ? elem.offsetLeft + this.pageX(elem.offsetParent) : elem.offsetLeft;
  }
  
  pageY(elem) {
    return elem.offsetParent ? elem.offsetTop + this.pageY(elem.offsetParent) : elem.offsetTop;
  }

  render() {
    const { isShowOptions, showOPtions, fixedLeft, fixedTop, fixedWidth } = this.state;
    const { name, options, value, onChange, onBlur, ...props } = this.props;

    const getValue = () => {
      if(value && Object.prototype.toString.call(value) === '[object Object]'){
        return value.value;
      }
      if(value && Object.prototype.toString.call(value) === '[object Array]'){
        return value.map(v => v.value);
      }
      return value;
    };

    const handleFocus = () => {
      this.setState({
        isShowOptions: true,
        showOPtions: options,
        fixedLeft: this.pageX(this.refs.editWapper) + 'px',
        fixedTop: this.pageY(this.refs.editWapper) + this.refs.editWapper.offsetHeight + 5 + 'px',
        fixedWidth: this.refs.editWapper.offsetWidth + 'px',
      })
    }

    const handleChange = e => {
      let filterOPtions = options.filter(i => i.value.indexOf(e.target.value) !== -1);
      this.setState({ 
        showOPtions: filterOPtions,
        isShowOptions: filterOPtions.length !== 0
      });
      let data = {"label": e.target.value, "value": e.target.value};
      onChange(e, data).then(() =>  {})  
    };

    const handleBlur = e => {
      this.setState({
        isShowOptions: false
      })
      onBlur({ checkedChange: true })
    };

    const handleClick = (e, item) => {
      onChange(e, item).then(() =>  {})  
    }

    return (
      <div ref="editWapper" className="editable-wrapper">
        <Input 
          className="editable-input"
          title={getValue()} 
          value={getValue()} 
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout((e) => handleBlur(e), 200)}
          {...props}
        />
        {
          isShowOptions ? 
            <ol style={{position: 'fixed', width: fixedWidth, left: fixedLeft, top: fixedTop}} className="editable-ol">
              {showOPtions && showOPtions.map(item => (
                <li className={value && value.value === item.value ? "editable-li active" : "editable-li"} onClick={(e) => handleClick(e, item)}>{item.value}</li>
              ))}
            </ol>
            : null
        }
      </div>
    )
  }
}

export function editableSelect({
  name,
  options,
  value,
  onChange,
  onBlur,
  ...props,
}) {
  return (
    <EditableSelect
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...props} 
    />
  )
}