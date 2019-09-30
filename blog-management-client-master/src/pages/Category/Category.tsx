import * as React from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Divider, message, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import './Category.less';
import { CategoryM } from '../../components/CategoryModel/CategoryModel';
import * as api from '../../api/fetchdata';
import { checkUserToken } from '../../utils/utils';

const FormItem = Form.Item;
const confirm = Modal.confirm;

interface IQueryOpt {
  categoryName: string;
}

interface IState {
  queryOpt: IQueryOpt;
  isVisibleCreateModel: boolean;
  isVisibleModel: boolean;
  loading: boolean;
  currCategoryInfo: any;
  categoryList: any[];
  mode: string;
  total: number;
  pageNum: number;
}

class CategoryList extends React.Component<any, IState> {
  public formRef: any;
  public unMount: boolean = false;

  readonly state = {
    // query options
    queryOpt: {
      categoryName: ''
    },
    isVisibleCreateModel: false,
    isVisibleModel: false,
    loading: true,
    currCategoryInfo: {_id: '-1'},
    categoryList: [],
    mode: '',
    total: 1,
    pageNum:1
  };

  public columns: ColumnProps<any>[] = [
    { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
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
    { title: '文章数', dataIndex: 'article_count', key: 'article_count' },
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

  public componentWillMount() {
    this.getCategoryList();
  }

  public componentWillUnmount() {
    this.unMount = true;
  }
  // 分页
  public changePage(current: number,pageSize: number) {
    let {categoryName} = this.state.queryOpt
    let opt = {};
     if(categoryName) {
      opt = {
        pageSize,
        pageNum:current,
        name:categoryName
      }
     } else {
      opt = {
        pageSize,
        pageNum:current,
      }
     } 
     this.getCategoryList(opt);
     this.setState({
      pageNum: current
    })
  }
  // 
  public changePageSize(pageSize:number,current:number) {
    let {categoryName} = this.state.queryOpt
    let opt = {};
     if(categoryName) {
      opt = {
        pageSize,
        pageNum:current,
        name:categoryName
      }
     } else {
      opt = {
        pageSize,
        pageNum:current,
      }
     } 
     this.getCategoryList(opt);
     this.setState({
       pageNum: current
     })
  }
  public emptyQueryOptName = () => {
    this.setState({
      queryOpt: {
        categoryName: ''
      }
    });
  };
  // 查询
  public handleSearch = (e: any) => {
    e.preventDefault();
    let opt = {
      name: this.state.queryOpt.categoryName,
      pageSize:5,
      pageNum:this.state.pageNum,
    };
    this.getCategoryList(opt);
  };

  public handleQueryCategoryChange = (e: any) => {
    this.setState({
      queryOpt: { categoryName: e.target.value }
    });
  };
  // 删除
  public async handleDelete (id: string) {
    const token = await checkUserToken();
    if(token != undefined && token.data.code == 0) {
      api
      .deleteCategory(id)
      .then((res: any) => {
        if (res.data.code === 0) {
          message.success(res.data.message);

          if (this.unMount) return;
          this.getCategoryList({pageNum:this.state.pageNum,pageSize:5});
        }
      })
      .catch(err => console.log(err));
    }
  };
  // 确认删除？
  public showDeleteConfirm = (id: string) => {
    let _this: CategoryList = this;
    confirm({
      title: '确认删除该分类吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        _this.handleDelete(id);
      }
    });
  };
  // 展示model
  public showModel = (mode: string, recode?: any) => {
    if (mode === 'add') {
      this.setState({ isVisibleModel: true, mode: mode });
      return;
    }
    this.setState({
      isVisibleModel: true,
      mode: mode,
      currCategoryInfo: recode
    });
  };
  // 隐藏model
  public hideModel = () => {
    this.setState({ isVisibleModel: false });
    setTimeout(() => {
      this.formRef.props.form.resetFields();
    });
  };
  // 保存
  public handleSave = () => {
    if (this.state.mode === 'add') {
      this.createCategory();
      return;
    }
    this.updateCategory();
  };

  // 创建分类 
  public async createCategory () {
    const form = this.formRef.props.form;
    const token = await checkUserToken();
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      let opt = {
        name: values.categoryName,
        desc: values.categoryDesc
      };
      if(token != undefined && token.data.code == 0) {
        api
        .addCategory(opt)
        .then(res => {
          if (res.data.code === 0) {
            message.success(res.data.message);

            if (this.unMount) return;
            this.setState({ isVisibleModel: false });
            form.resetFields();

            this.getCategoryList();
          }
        })
        .catch(err => console.log(err));
      }
    });
  };
  // 修改分类
  public async updateCategory () {
    const form = this.formRef.props.form;
    const token = await checkUserToken();
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      // 参数
      let opt = {
        id: this.state.currCategoryInfo._id,
        name: values.categoryName,
        desc: values.categoryDesc
      };
      // token校验
      if(token != undefined && token.data.code == 0) {
        api
        .updateCategory(opt)
        .then(res => {
          if (res.data.code === 0) {
            message.success(res.data.message);

            if (this.unMount) return;
            this.setState({ isVisibleModel: false });
            form.resetFields();

            this.getCategoryList({pageNum:this.state.pageNum,pageSize:5});
          }
        })
        .catch(err => console.log(err));
      }
    });
  };
  // 获取分类列表
  public async getCategoryList (opt?: any) {
    if(!opt) opt = {pageSize:5,pageNum:1};
    this.setState({ loading: true });
    const token = await checkUserToken();
    // token校验
    if(token != undefined && token.data.code == 0) {
      api
      .getCategoryList(opt)
      .then(res => {

        if (res.data.code === 0) {
          let list = res.data.data.categoryArr.map((d: any) => {
            return { ...d, key: d._id, article_count:100,desc:d.categoryDesc};
          });

          if (this.unMount) return;
          this.setState({ categoryList: list, loading: false , total: res.data.data.total});
        }
      })
      .catch(err => console.log(err));
    }
  };

  public render() {
    const { queryOpt, mode,total } = this.state;
    // 分页配置
    const paginationProps = {
      showTotal: () => `共${total}条`,
      pageSize: 5,
      total: total,
      defaultPageSize:1,
      onShowSizeChange: (current:number,pageSize:number) => this.changePageSize(pageSize,current),
      onChange: (current:number,pageSize:number) => this.changePage(current,pageSize),
    };
    return (
      <div className="category-list-component">
        <Card className="search-form">
          <Form>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="分类名称" className="mb-0">
                  <Input
                    onChange={this.handleQueryCategoryChange}
                    value={queryOpt.categoryName}
                    placeholder="输入分类名称"
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
            </Row>
          </Form>
        </Card>

        <Card className="search-result">
          <Button type="dashed" size="small" onClick={() => this.showModel('add')} style={{ marginBottom: 20 }}>
            添加分类
          </Button>

          <Table
            loading={this.state.loading}
            size="small"
            columns={this.columns}
            dataSource={this.state.categoryList}
            pagination={paginationProps}
            expandedRowRender={(record: any) => <p style={{ margin: 0 }}>分类说明：{record.desc || '暂无分类'}</p>}
          />
        </Card>

        <CategoryM
          className="category-model"
          mode={mode}
          wrappedComponentRef={(ref: any) => (this.formRef = ref)}
          isVisible={this.state.isVisibleModel}
          categoryInfo={this.state.currCategoryInfo}
          onCancel={this.hideModel}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

export default Form.create()(CategoryList);
