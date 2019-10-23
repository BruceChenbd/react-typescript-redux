import * as React from 'react';

import { Row, Col, Card, Skeleton } from 'antd';
import * as CountUp from 'react-countup';
import * as api from '../../api/fetchdata';
import {connect} from 'react-redux';
// import * as actions from '../../actions';
import { checkUserToken } from '../../utils/utils';
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts') ;
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Lottie from 'react-lottie';
import * as animationData from '../../assets/10456-kissing-emoji.json';


import './Home.less';
// @ts-ignore
const ReactCountUp = CountUp.default;



interface IState {
  isLoading: boolean;
  dashData: object;
  second: number,
  minute: number,
  hour: number,
  userName: string
}

 class Home extends React.Component<any, IState> {
  public unMount: boolean = false;

  readonly state = {
    isLoading: false,
    dashData: {
      article_total: 0,
      category_total: 0,
      tag_total: 0,
      comment_total: 0,
    },
    second: 0,
    minute: 0,
    hour: 0,
    userName: ''
  };

  public async componentDidMount() {
    // 默认打开网站 进入 首页 检查是否有session
    let session =  await this.checkSessionStatus();
    if(session.data.code == 0)  {
        // localStorage.setItem('USER_INFO', JSON.stringify(session.data.data));
        // this.props.dispatch(actions.updateUserInfo(session.data.data));
    } else {
        window.location.href = '#/login';        
    }
    // 在线时间统计
    let second = 0;
    let minute = 0;
    let hour = 0;
    let _this = this;
    function timeInter () {

      second+=1; 
      if(second==60){ 
        second=0;
        minute+=1; 
      } 
      if(minute==60){ 
        minute=0;
        hour+=1; 
      } 
      _this.setState({ 
        second,
        minute,
        hour
      })
    }
    setInterval(() => {
      timeInter()
    }, 1000);
    
    // 获取当前登陆用户
    let userInfoStr: string | null = localStorage.getItem('USER_INFO');
    if (userInfoStr) {
      let userInfo: any = JSON.parse(userInfoStr);
      this.setState({
        userName: userInfo.username
      })
    }
    this.getStatisticalData();
    const myEcharts = echarts.init(document.getElementById('userChart'));
    const myEcharts1 = echarts.init(document.getElementById('articleChart'));
    let option1 = {
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params: any) {
              var tar;
              if (params[1].value != '-') {
                  tar = params[1];
              }
              else {
                  tar = params[0];
              }
              return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
      },
      legend: {
          data:['人数','总人数']
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          name:'月份',
          type : 'category',
          splitLine: {show:false},
          axisLine: {
            show:false,
          },
          axisLabel: {        
            show: true,
            textStyle: {
                color: '#1890ff',
                fontSize:'14'
            }
          },
          axisTick: {
            show: false
          },
          data :  function (){
              var list = [];
              for (var i = 3; i < 10; i++) {
                  list.push(i+'月');
              }
              return list;
          }()
      },
      yAxis: {
         name: '人',
         nameTextStyle:{
          color:"#1890ff", 
          fontSize:13,  
         },
         axisLine: {
          show:false,
         },
          splitLine: {
            lineStyle:{
              color:'lightgray',
              width: 1
              }
          },
          type : 'value',
          axisLabel: {        
            show: true,
            textStyle: {
                color: '#1890ff',
                fontSize:'14'
            }
          },
          axisTick: {
            show: false
          },
      },
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总人数',
          barWidth: 10,
          label: {
            normal: {
                show: false,
                position: 'top'
            }
          },
          itemStyle: {
              normal: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
              },
              emphasis: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
              }
          },
          data: [0, 900, 1245, 1658, 1773, 1951, 2237]
        },
          {
              name: '人数',
              type: 'bar',
              stack: '总人数',
              barWidth:10,
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              },
              data: [900, 345, 393, 135, 178, 286,300]
          },
          {
              name: '总人数',
              type: 'line',
              itemStyle: {
                normal: {
                  color: "#f6bb4d",//折线点的颜色
                  lineStyle: {
                    color: "#f6bb4d"//折线的颜色
                  }
                }
              },
              label: {
                  normal: {
                      show: false,
                      position: 'bottom',
                  }
              },
              data: [900, 1245, 1658, 1773, 1951, 2237,2537]
          }
      ]
  };
  myEcharts.setOption(option1);
  let option2 = {
    tooltip: {},
    series: [{
        type: 'pie',
        radius: ['90%', '70%'],
        center: ['50%', '50%'],
        label: {
            normal: {
                position: 'center',
                color: '#148FEE',
            }
        },
        itemStyle: {
            normal: {
                color: '#148FEE'
            }
        },
        hoverAnimation: false,//注释 鼠标移动不可改变
        data: [{
            value: 8888,
            name: '',
            label: {
                normal: {
                    formatter: '{c}',
                    textStyle: {
                        fontSize: 50
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "粉丝总量 : {c}"
            }
        }, {
            value: 3000,
            label: {
                normal: {
                    formatter: '',
                    textStyle: {
                        color: '#555',
                        fontSize: 13
                    }
                }
            },
            tooltip: {
                show: false
            },
            itemStyle: {
                normal: {
                    color: '#E6E6E6'
                },
                emphasis: {
                    color: '#E6E6E6'
                }
            },
        }]
    }]
  }
  myEcharts1.setOption(option2)
  }
  
  
  public componentWillUnmount() {
    this.unMount = true;
  }
  
  public checkSessionStatus () {
   return api.checkSession().then(res => {
     return res;
    })
  }
  public async getStatisticalData() {
      // 验证用户token的有效性
      let token:any = await checkUserToken();
      if(token != undefined && token.data.code == 0) {
        api
        .getStatisticalData()
        .then(res => {
          if (res.data.code === 0) {
            if(this.unMount) return;
            this.setState({ isLoading: false, dashData: res.data.message });
          }
        })
        .catch(err => console.log(err));
      }
  }

  public render() {
    const { isLoading, dashData, userName } = this.state;
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
    return (
      <div className="home-page">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Card>
              <Skeleton loading={isLoading} active paragraph={{ rows: 2 }}>
                <h4>文章总数</h4>
                <p className="num">
                  <ReactCountUp end={dashData.article_total} />
                </p>
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card>
              <Skeleton loading={isLoading} active paragraph={{ rows: 2 }}>
                <h4>分类总数</h4>
                <p className="num">
                  <ReactCountUp end={dashData.category_total} />
                </p>
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card>
              <Skeleton loading={isLoading} active paragraph={{ rows: 2 }}>
                <h4>标签总数</h4>
                <p className="num">
                  <ReactCountUp end={dashData.tag_total} />
                </p>
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card>
              <Skeleton loading={isLoading} active paragraph={{ rows: 2 }}>
                <h4>留言总数</h4>
                <p className="num">
                  <ReactCountUp end={dashData.comment_total} />
                </p>
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{margin: '20px 0'}}>
          <Col span={12} style={{paddingLeft:0}}>
             <Card>
               <h4>用户活跃量 (近7个月)</h4>
               <div id="userChart" style={{width:'100%',height:'300px'}}></div>
             </Card>
          </Col>
          <Col span={12} style={{paddingRight:0}}>
             <Card>
               <h4>粉丝数量</h4>
               <div id="articleChart" style={{width:'100%',height:'300px'}}></div>
             </Card>
          </Col>
        </Row>
        <Row style={{margin: '20px 0'}}>
          <Card>
            {
             this.state.userName == '小玉玉'? <h4>寄语</h4>:<h4>在线信息</h4>
            }
            {
              this.state.userName == '小玉玉'? 
              <div className="yuyu" style={{padding:'20px 30px',boxSizing:'border-box',textAlign:'center',fontSize:30,color:'orange'}}>
               <Lottie options={defaultOptions}
              height={50}
              width={100}
              />
              亲爱的玉玉，今天也要元气满满哦，<span style={{color:'red'}}>love you!</span>
              </div>:
              <div style={{padding:'20px 30px',boxSizing:'border-box',textAlign:'center'}}>Hello! {userName},欢迎您登陆博客管理系统，您已在线<span style={{fontWeight:'bold',color:'red'}}> {this.state.hour}</span>时 <span  style={{fontWeight:'bold',color:'red'}}> {this.state.minute}</span>分 <span  style={{fontWeight:'bold',color:'red'}}> {this.state.second}</span>秒</div>
            }
          </Card>
        </Row>
      </div>
    );
  }
}

export default connect()(Home)
