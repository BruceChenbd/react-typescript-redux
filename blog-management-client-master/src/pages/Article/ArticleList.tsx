import * as React from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Divider, Tag, message, DatePicker, Modal, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';

import './ArticleList.less';

import * as api from '../../api/fetchdata';

import { dateFmt } from '../../utils/utils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;
const Option = Select.Option;

interface IProps extends RouteComponentProps, FormComponentProps {}

interface IState {
  expand: boolean;
  loading: boolean;
  categoryList: any[];
  tagList: any[];
  articleList: any[];
  pageTotal: number;
  pageNum: number;
}

class UserList extends React.Component<IProps, IState> {
  public unMount: boolean = false;

  readonly state = {
    expand: false,
    loading: true,
    categoryList: [],
    tagList: [],
    articleList: [],
    pageTotal: 0,
    pageNum: 0
  };
  // 定义表格参数
  public columns: ColumnProps<any>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <span>
          <a href="javascript:void(0);" onClick={() => this.previewArticle(record._id)}>
            {text}
          </a>
        </span>
      )
    },
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
    {
      title: '所属分类',
      dataIndex: 'category_id',
      key: 'category_id'
    },
    {
      title: '标签',
      key: 'tag_ids',
      dataIndex: 'tag_ids',
      render: (tags: any) => (
        <span>
          {tags.map((tag: any, index: number) => (
            <Tag color="blue" key={index}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text: any, record: any) => (
        <span>
          <a href="javascript:void(0);" onClick={() => this.toModifyArticlePage(record._id)}>
            修改
          </a>
          <Divider type="vertical" />
          <a href="javascript:void(0);" onClick={() => this.showDeleteConfirm(record._id)}>
            删除
          </a>
        </span>
      )
    }
  ];
  // 定义全局查询条件
  public queryOpt: any = {
    page_size: 5
  };

  public componentDidMount() {
    this.getCategoryList();
    this.getTagList();
    this.getArticleList();
  }

  public componentWillUnmount() {
    this.unMount = true;
  }
  // 创建文章
  public toCreateArticlePage = () => {
    this.props.history.push('/article-list/add-new');
  };
  // 修改文章
  public toModifyArticlePage = (articleId: number) => {
    this.props.history.push('/article-list/' + articleId + '/modify');
  };
  // 预览文章
  public previewArticle = (articleId: number) => {
    this.props.history.push('/article-list/' + articleId);

  };
  // 删除前确认
  public showDeleteConfirm = (id: number) => {
    let _this = this;
    confirm({
      title: '确认删除该文章吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        _this.deleteTheArticle(String(id));
      }
    });
  };
  // 删除文章
  public deleteTheArticle = (articleId: string) => {
    api
      .deleteArticle(articleId)
      .then(res => {
        if (res.data.code === 0) {
          message.success(res.data.message);

          if (this.unMount) return;
          setTimeout(() => {
            this.getArticleList();
          }, 500);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  // 查询
  public handleSearch = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      const { created_at, updated_at, title, category_id, tag_id } = values;
      let createdStartAt = created_at[0] ? dateFmt('YYYY-MM-DD 00:00:00', created_at[0]._d) : '';
      let updatedStartAt = updated_at[0] ? dateFmt('YYYY-MM-DD 00:00:00', updated_at[0]._d) : '';

      this.queryOpt = {
        ...this.queryOpt,
        title: title,
        category_id: category_id,
        tag_ids: tag_id,
        created_start_at: createdStartAt,
        updated_start_at: updatedStartAt,
        pageNum: 1
      };

      this.getArticleList(this.queryOpt);
    });
  };

  public handleReset = () => {
    this.props.form.resetFields();
  };
  // 分页切换
  public handlePageChange = (page: number) => {
    this.queryOpt = {
      ...this.queryOpt,
      pageNum: page
    };
    this.setState({
      pageNum:page
    })
    this.getArticleList(this.queryOpt);
  };

  public toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  // 获取文章列表
  public getArticleList = (opt: any = {}) => {
    this.setState({ loading: true });
    api
      .getArticleList(opt)
      .then(res => {
        if (res.data.code === 0) {
          let list = res.data.data.articleArr.map((d: any) => {
            return {
              ...d,
              key: d._id
            };
          });

          if (this.unMount) return;
          this.setState({
            articleList: list,
            pageTotal: res.data.data.total,
            loading: false
          });

        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  // 获取分类列表
  public getCategoryList = () => {
    let opt: any = { name: '' };
    api
      .getCategoryList(opt)
      .then(res => {
        if (res.data.code === 0) {
          if (this.unMount) return;
          this.setState({ categoryList: res.data.data.categoryArr });
        }
      })
      .catch(err => console.log(err));
  };
  // 获取标签列表

  public getTagList = () => {
    let opt: any = { name: '' };
    api
      .getTagList(opt)
      .then(res => {
        if (res.data.code === 0) {
          if (this.unMount) return;
          this.setState({ tagList: res.data.data.tagArr });
        }
      })
      .catch(err => console.log(err));
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="blog-list-component">
        <Card className="search-form">
          <Form onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="文章标题">
                  {getFieldDecorator('title', {
                    initialValue: ''
                  })(<Input autoComplete="off" placeholder="请输入文章标题" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="所属分类">
                  {getFieldDecorator('category_id', {
                    initialValue: ''
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: string, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option key="-1" value="">
                        全部
                      </Option>
                      {this.state.categoryList.map((d: any) => {
                        return (
                          <Option key={d._id} value={d.categoryName}>
                            {d.categoryName}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="标签类型">
                  {getFieldDecorator('tag_id', {
                    initialValue: ''
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: string, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option key="-1" value="">
                        全部
                      </Option>
                      {this.state.tagList.map((d: any) => {
                        return (
                          <Option key={d._id} value={d.tagName}>
                            {d.tagName}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="创建时间">
                  {getFieldDecorator('created_at', {
                    initialValue: []
                  })(<RangePicker format="YYYY-MM-DD" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="更新时间">
                  {getFieldDecorator('updated_at', {
                    initialValue: []
                  })(<RangePicker format="YYYY-MM-DD" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="search-result">
          <Button type="dashed" size="small" onClick={this.toCreateArticlePage} style={{ marginBottom: 20 }}>
            添加文章
          </Button>

          <Table
            loading={this.state.loading}
            size="small"
            columns={this.columns}
            pagination={{
              pageSize: this.queryOpt.page_size,
              current: this.state.pageNum,
              total: this.state.pageTotal,
              size: 'default',
              onChange: num => this.handlePageChange(num)
            }}
            dataSource={this.state.articleList}
          />
        </Card>
      </div>
    );
  }
}
const wrap:any =  Form.create()(UserList)
export default withRouter(wrap);
