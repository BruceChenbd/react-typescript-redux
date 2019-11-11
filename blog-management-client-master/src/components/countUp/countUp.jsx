import * as React from 'react'
import { ThousandBitSeprator } from '../../utils/thousand'
import './countUp.less'
let CountUp = require('countup.js/dist/countUp')


class Item extends React.Component<any, any> {
  state = {
    id: null,
    currentVal: null,
    countup: null
  }
  guid() {
      function S4() {
          return (((1+Math.random())*0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
  }
  Number(val) {
　　if (parseFloat(val).toString() == "NaN") {
　　　　
　　　　return false;
　　} else {
　　　　return true;
　　}
  }
 createCountup() {
      let { value, digits, animate, animateTime = 3 } = this.props;
      digits = this.Number(digits) ? digits : 2;
      let options = {
          useEasing: false,
          useGrouping: true,
          separator: ',',
          decimal: '.'
      }

      if(animate) {
          let countup = this.state.countup = new CountUp(this.state.id, 0, value, digits, animateTime, options);
          countup.start();
          // 设置下次执行的初始值
          this.state.currentVal = 0;
      }
  }

  componentDidMount () {
      this.createCountup();
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (this.props.value == nextProps.value) {
          return false
      }
      return true;
  }

  componentWillUpdate(nextProps, nextState) {
      let { value, animate } = nextProps;
      if(!animate) {
          return
      }
      let startNum = this.state.currentVal;
      let endNum = value;
      if(startNum === endNum) {
          return
      }

      let countup = this.state.countup;

      countup && countup.update(value);
      this.state.currentVal = value;
  }
  render() {
    if(!this.state.id) {
        this.state.id = `item-${this.guid()}`;
    }

    let id = this.state.id;
    let { name, value, unit, fontSize, valueFontSize, nameWidth, valueWidth, unitWidth, animate } = this.props;
    nameWidth = nameWidth || '40%';
    valueWidth = valueWidth || '50%';
    unitWidth = unitWidth || '10%';

    return (
      <div className='outer' style={{height: '100%'}}>
         <div className='leftText' style={{width: nameWidth,fontSize:fontSize}}>
           {name}
         </div>
         <div id={id} className='valueText' style={{width: valueWidth, fontSize: valueFontSize}}>
            {animate ? null : ThousandBitSeprator.transform(value)}
         </div>
         <div className = 'rightText' style={{width: unitWidth, fontSize: fontSize}}>
           {unit}
         </div>
      </div>
    );
  }
}



export default Item