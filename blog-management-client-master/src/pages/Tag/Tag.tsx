import * as React from 'react';

import * as api from '../../api/fetchdata';
import { Card, Form, Row, Col, Input, Button, Table, Divider, message, Modal, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import './Tag.less';
import {CategoryCreateM} from '../../components/TagModel/TagModel';
import Item from '../../components/countUp/countUp'
import AnimateTable from '../../components/table/table'


const FormItem = Form.Item;
const confirm = Modal.confirm;

interface IState {
  searchName: string;
  isVisibleModel: boolean;
  isVisibleUpdateModel: boolean;
  loading: boolean;
  currTagInfo: any;
  tagList: any[];
  mode: string;
  total: number;
  pageNum: number;
  num: number,
  n:number,
  scrollData: any[],
  activeClass: string
}

class TagList extends React.Component<any, IState> {
  public formRef: any;
  public unMount: boolean = false;

  readonly state = {
    searchName: '',
    isVisibleModel: false,
    isVisibleUpdateModel: false,
    loading: true,
    currTagInfo: { _id: -1 },
    tagList: [],
    mode: '',
    total: 0,
    pageNum: 0,
    num: 0,
    n:0,
    scrollData: [
      {name:'告警类型1-first'},
      {name:'告警类型1-second'},
      {name:'告警类型1-third'},
      {name:'告警类型1-fourth'},
      {name:'告警类型1-fifth'},
      {name:'告警类型1-sixth'},
      {name:'告警类型1-seventh'},
    ],
    activeClass: 'first'
  };

  public columns: ColumnProps<any>[] = [
    { title: '标签名称', dataIndex: 'tagName', key: 'tagName' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime'
    },
    { title: '文章数', dataIndex: 'articleCount', key: 'articleCount' },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={() => this.showModel('update', record)}>
              修改
            </a>
            <Divider type="vertical" />
            <a href="javascript:void(0);" onClick={() => this.showDeleteConfirm(record._id)}>
              删除
            </a>
          </span>
        );
      }
    }
  ];

  // query options
  public queryOpt: any = {
    tagName: '',
    pageSize: 5
  };

  public componentDidMount() {
    let opt = {
      isArticle: false
    }
    this.getTagList(opt);
    this.initNum()
  }

  public componentWillUnmount() {
    this.unMount = true;
  }
  
  public initNum = () => {
    // 定义原始数据
    let originData:any = [],showData:any;
    // 初始化调用数据
    api.getRandNum().then(res => {
      let { message } = res.data;
      originData.push(message);
      this.renderNum(originData)
    });
    
    // 每秒刷新num
    setInterval(() => {
      this.renderNum(showData? showData: originData)
    },10000)
    
    // 5秒调用一次接口
    setInterval(() => {
      api.getRandNum().then(res => {
        let { message } = res.data;
        originData.push(message);
        // 大于两个 删除前一个
        if(originData.length > 2) {
          originData.shift()
        };
        // 深度拷贝 作为要展示的数据
        showData = JSON.parse(JSON.stringify(originData));
        // console.log(showData,'showData1')
        let oldNum = showData[0].num;
        let newNum = showData[1].num;

        // 5秒前和5秒后 无变化
        if(oldNum === newNum) {
          showData['changenum'] = 0;
        } else {
          // 若有变化，则找出5秒内 每秒变化幅度
          showData['changenum'] = Math.round((newNum - oldNum)/5);
        }

      })
    },5000)
  }
  // 页面渲染num
  public renderNum = (message:any) => {
       //  每秒变化幅度
       let changeNum = message['changenum']? message['changenum']*this.state.n:0
       this.setState({
         num: message[0].num + changeNum,
         n: this.state.n+1
       })
       //  n变量表示每秒的秒数
       if(this.state.n >5) {
         this.setState({
           n: 1
         })
       }
  }

  public emptySearchName = () => {
    this.setState({ searchName: '' });
  };
  // 查询
  public handleSearch = (e: any) => {
    e.preventDefault();

    this.queryOpt = {
      ...this.queryOpt,
      tagName: this.state.searchName,
      pageNum: this.state.pageNum,
      isArticle: false
    };

    this.getTagList(this.queryOpt);
  };
  // 分页
  public handlePageChange = (page: number) => {
    this.queryOpt = {
      ...this.queryOpt,
      pageNum: page,
      isArticle: false
    };

    this.getTagList(this.queryOpt);

    this.setState({
      pageNum:page
    })
  };

  public handleQueryTagChange = (e: any) => {
    this.setState({ searchName: e.target.value });
  };
  // 删除
  public handleDelete = (id: string) => {
    api
      .deleteTag(id)
      .then(res => {
        if (res.data.code === 0) {
          message.success(res.data.message);

          if (this.unMount) return;
          let opt =  {
            ...this.queryOpt,
            pageNum:this.state.pageNum,
            isArticle: false
          }
          this.getTagList(opt);
        }
      })
      .catch(err => console.log(err));
  };
  // 确认删除
  public showDeleteConfirm = (id: string) => {
    let _this = this;
    confirm({
      title: '确认删除该标签吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        _this.handleDelete(id);
      }
    });
  };

  public showModel = (mode: string, record?: any) => {
    if (mode === 'add') {
      this.setState({ isVisibleModel: true, mode });
      return;
    }
    this.setState({ isVisibleModel: true, mode, currTagInfo: record });
  };

  public hideModel = () => {
    this.setState({ isVisibleModel: false });
    setTimeout(() => {
      this.formRef.props.form.resetFields();
    });
  };
  // 保存
  public handleSave = () => {
    if (this.state.mode === 'add') {
      this.createTag();
      return;
    }
    this.updateTag();
  };
  // 创建标签

  public createTag = () => {
    const form = this.formRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      let opt: any = {
        tagName: values.tagName
      };
      api
        .addTag(opt)
        .then(res => {
          if (res.data.code === 0) {
            message.success(res.data.message);

            if (this.unMount) return;
            this.setState({ isVisibleModel: false });
            form.resetFields();

            this.getTagList({isArticle: false});
          }
        })
        .catch(err => console.log(err));
    });
  };
  // 修改
  public updateTag = () => {
    const form = this.formRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      let opt = {
        id: this.state.currTagInfo._id,
        tagName: values.tagName
      };
      api
        .updateTag(opt)
        .then(res => {
          if (res.data.code === 0) {
            message.success(res.data.message);

            if (this.unMount) return;
            this.setState({ isVisibleModel: false });
            form.resetFields();
            let opt = {
              ...this.queryOpt,
              pageNum:this.state.pageNum,
              isArticle: false,
            }
            this.getTagList(opt);
          }
        })
        .catch(err => console.log(err));
    });
  };
  // 获取标签列表
  public getTagList = (opt?: any) => {

    this.setState({ loading: true });

    api
      .getTagList(opt)
      .then(res => {
        if (res.data.code === 0) {
          let list = res.data.data.tagArr.map((d: any) => {
            return { ...d, key: d._id ,articleCount:50};
          });

          if (this.unMount) return;
          this.setState({
            tagList: list,
            total: res.data.data.total,
            loading: false
          });
        }
      })
      .catch(err => console.log(err));
  };
  
  public changeScroll = (e: any) => {
    const data1 = [
      {name:'告警类型1-first'},
      {name:'告警类型1-second'},
      {name:'告警类型1-third'},
      {name:'告警类型1-fourth'},
      {name:'告警类型1-fifth'},
      {name:'告警类型1-sixth'},
      {name:'告警类型1-seventh'},
    ]
    const data2 = [
      {name:'告警类型2-first'},
      {name:'告警类型2-second'},
      {name:'告警类型2-third'},
      {name:'告警类型2-fourth'},
      {name:'告警类型2-fifth'},
      {name:'告警类型2-sixth'},
      {name:'告警类型2-seventh'},
    ]
    const data3 = [
      {name:'告警类型3-first'},
      {name:'告警类型3-second'},
      {name:'告警类型3-third'},
      {name:'告警类型3-fourth'},
      {name:'告警类型3-fifth'},
      {name:'告警类型3-sixth'},
      {name:'告警类型3-seventh'},
    ]
     if (e.target.dataset.index == 1) {
       this.setState({
         scrollData: data1,
         activeClass: 'first'
       })
     } else if (e.target.dataset.index == 2) {
       this.setState({
         scrollData: data2,
         activeClass: 'second'
       })
     } else {
        this.setState({
          scrollData: data3,
          activeClass: 'third'
        })
     }
  }
  public render() {
    // countUp动画

    let amiateCount = {
      name: '金额',
      value: this.state.num,
      unit: '亿',
      digits: 2,
      nameWidth: '45%',
      valueWidth: '45%',
      unitWidth: '10%'
    }

    
    return (
      <div className="tag-list-component">
        <Card className="search-form">
          <Form>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="标签名称" className="mb-0">
                  <Input
                    onChange={this.handleQueryTagChange}
                    value={this.state.searchName}
                    placeholder="输入标签名称"
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem className="mb-0">
                  <Button type="primary" onClick={this.handleSearch}>
                    查询
                  </Button>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="数据切片" className="mb-0">
                   <Tag color="blue">{this.state.num}</Tag>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="search-result">
          <Button type="dashed" size="small" onClick={() => this.showModel('add')} style={{ marginBottom: 20 }}>
            添加标签
          </Button>

          <Table
            loading={this.state.loading}
            pagination={{
              pageSize: this.queryOpt.pageSize,
              current: this.state.pageNum,
              total: this.state.total,
              size: 'default',
              onChange: num => this.handlePageChange(num)
            }}
            size="small"
            columns={this.columns}
            dataSource={this.state.tagList}
          />
        </Card>

        <CategoryCreateM
          className="tag-model"
          mode={this.state.mode}
          wrappedComponentRef={(ref: any) => (this.formRef = ref)}
          isVisible={this.state.isVisibleModel}
          tagInfo={this.state.currTagInfo}
          onCancel={this.hideModel}
          onSave={this.handleSave}
        />
        <Item animate {...amiateCount} />
        <ul className="warn-btn">
          <li className={this.state.activeClass == 'first'? 'active':''} onClick={this.changeScroll} data-index="1">告警类型1</li>
          <li className={this.state.activeClass == 'second'? 'active':''} onClick={this.changeScroll} data-index="2">告警类型2</li>
          <li className={this.state.activeClass == 'third'? 'active':''} onClick={this.changeScroll} data-index="3">告警类型3</li>
        </ul>
        <AnimateTable data={this.state.scrollData}/>
      </div>
    );
  }
}

export default Form.create()(TagList);
