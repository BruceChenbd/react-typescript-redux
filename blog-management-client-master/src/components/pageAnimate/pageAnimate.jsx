import * as React from 'react'

import FlipClock from 'flipclock/dist/flipclock'
import 'flipclock/dist/flipclock.css'

// import './pageAnimate.less'
import _ from 'lodash'
const  $ = require('jquery') 


class FlipCom extends React.Component<any, any> {
  state = {
    flips: []
  }

  rAFFlip (index, oValue, tValue) {
    //   3000ms间隔
    const interval = 3000;
    let flips = this.state.flips;
    oValue = parseInt(oValue);
    tValue = parseInt(tValue);

    let distance = tValue - oValue;
    // 小于0的值滚动次数重置
    distance = distance < 0 ? distance + 10 : distance;
    if(distance == 0) {
        return;
    }

    let temp = 1;
    // 计算事件间隔
    let realInterval = _.ceil( 3000 / distance );

    let timer = setInterval(() => {
        if(temp > distance) {
            clearInterval(timer);
            return;
        }
        flips[index].setValue((oValue + temp) % 10)
        temp ++
    }, realInterval)
  }

  createFlips () {
      let outerDiv = document.querySelector('#flip');

      let { digitsNumber, seperateNumber, seperator, value } = this.props;
      digitsNumber = digitsNumber || 6;
      seperateNumber = seperateNumber || 3;
      let startSeperatorIndex = digitsNumber % seperateNumber;
      startSeperatorIndex === 0? startSeperatorIndex = seperateNumber : startSeperatorIndex = startSeperatorIndex;
      let flipDivs = $(outerDiv).children().filter((index) => {
          if(index % (seperateNumber+1) === startSeperatorIndex) {
              return false
          }
          return true;
      });
      _.each(flipDivs, (flipDiv) => {
          let flip = new FlipClock(flipDiv, 0 , {
            clockFace: 'Counter'
          });
          $(flipDiv).find('ul:nth-child(1)').remove();
          this.state.flips.push(flip);
      })
  }

  componentDidMount() {
      this.createFlips();
  }

  shouldComponentUpdate(nextProps, nextState) {
      if(_.isEqual(this.props.value, nextProps.value)) {
          return false;
      }
      return true;
  }

  componentWillUpdate(nextProps,nextState) {
    let preValue = this.props.value,
    nextValue = nextProps.value,
    digitsNumber = nextProps.digitsNumber;
    digitsNumber = digitsNumber || 6;
    preValue = preValue || 0;
    nextValue = nextValue || 0;

    let strPreValue = `${preValue}`,
    strPreValueLen = strPreValue.length,
    zeroPreNeedLen = digitsNumber - strPreValueLen;

    //   位数不足前面补0
    let zeroPreNeed = `0`.repeat(zeroPreNeedLen),
    strOriginValue = `${zeroPreNeed}${strPreValue}`;

    let strNextValue = `${nextValue}`,
    strNextValueLen = strNextValue.length,
    zeroNextNeedLen = digitsNumber - strNextValueLen;

    // 位数不足，前面补0
    let zeroNextNeed = `0`.repeat(zeroNextNeedLen),
    strTargetValue = `${zeroNextNeed}${strNextValue}`;
    // 给每一位赋值
    _.each(strTargetValue, (value, index) => {
        this.state.flips[index] && this.rAFFlip(index, strOriginValue[index], value);
    })
  }
  
  render() {
    console.log(this.props)

    let { digitsNumber, seperateNumber, seperator, value } = this.props;

    digitsNumber = digitsNumber || 6;
    seperateNumber = seperateNumber || 3;
    seperator = seperator || ',';
    value = value || 0;

    let numbers = _.ceil(digitsNumber / seperateNumber - 1) + digitsNumber;
    let startSeperatorIndex = digitsNumber % seperateNumber;

    startSeperatorIndex === 0? startSeperatorIndex = seperateNumber : startSeperatorIndex = startSeperatorIndex;
    let innerJsx = [];
    for(let i=0,len = numbers; i< len; i++) {
        if(i%(seperateNumber + 1) === startSeperatorIndex) {
            innerJsx.push(<div key={`flip-sub-${i}`} className="seperator">{seperator}</div>)
        } else {
            innerJsx.push(<div key={`flip-sub-${i}`}></div>)
        }
    }
    return (
      <div className="outer" id='flip'>
         {innerJsx}
      </div>
    );
  }
}



export default FlipCom