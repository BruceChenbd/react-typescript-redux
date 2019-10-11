import * as React from 'react';
import { Card, Form, Row, Col, Input, Button, Table, Divider, message, Modal, Upload } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import './Category.less';
import { CategoryM } from '../../components/CategoryModel/CategoryModel';
import * as api from '../../api/fetchdata';
import { checkUserToken } from '../../utils/utils';
import * as XLSX from 'xlsx';

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
  data: any [];
  fileList: any [];
  columns: object
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
    pageNum:1,
    data:[],
    fileList: [],
    columns: [{title:"分类名称",dataIndex:"categoryName"},{title:"创建时间",dataIndex:"createTime"},{title:"更新时间",dataIndex:"updateTime"},{title:"文章数", dataIndex:"article_count"}],
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
  

  // 导入excl
  handleImpotedJson = (array: any, file:any) => {
       
    const header = array[0];
    const entozh = this.formatTitleOrFileld('title', 'dataIndex');
    const firstRow = header.map((item:any) => entozh[item]);

    const newArray = [...array];

    newArray.splice(0, 1);

    const json = newArray.map((item, index) => {
        const newitem = {};
        item.forEach((im:any, i:number) => {
            const newKey = firstRow[i] || i;
            newitem[newKey] = im
        })
        return newitem;
    });
    console.log(json,'json')
    const formatData = json.map((item:any) => ({
        categoryName: item.categoryName,
        createTime: item.createTime,
        updateTime: item.updateTime,
        article_count: item.article_count
    }))

    this.setState({ data: formatData, fileList: [file] });

    return formatData;
  }
// 格式化表格标题
formatTitleOrFileld = (a:any, b:any) => {
    const entozh = {};
    this.state.columns.forEach(item => {
        entozh[item[a]] = item[b]
    })
    return entozh;
}
// 生成excl
sheet2blob = (sheet:any, sheetName:any) => {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

  var wopts:any = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }); // 字符串转ArrayBuffer
  function s2ab(s:any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  return blob;
}
// 打开下载框
openDownloadDialog = (url:any, saveName:any) => {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

// 导出
handleExportAll = (e:any) => {
  const entozh = {
    "categoryName":"分类名称",
    "createTime":"创建时间",
    "updateTime":"更新时间",
    "article_count":"文章数"
  }

  const nowdata = this.state.categoryList;

  const json = nowdata.map((item) => {
    return Object.keys(item).reduce((newData, key) => {
      const newKey = entozh[key] || key
      newData[newKey] = item[key]
      return newData
    }, {})
  });


  const sheet = XLSX.utils.json_to_sheet(json);

  this.openDownloadDialog(this.sheet2blob(sheet,undefined), `分类列表.xlsx`);

}
// 导出标准格式文件
handleExportDocument = (e:any) => {
  const entozh = {
    "categoryName":"分类名称",
    "createTime":"创建时间",
    "updateTime":"更新时间",
    "article_count":"文章数"
  }

  let nowdata = this.state.categoryList

  const json = nowdata.map((item) => {
    return Object.keys(item).reduce((newData, key) => {
      const newKey = entozh[key] || key
      newData[newKey] = item[key]
      return newData
    }, {})
  });


  const sheet = XLSX.utils.json_to_sheet(json);

  this.openDownloadDialog(this.sheet2blob(sheet,undefined), `标准格式文件.xlsx`);

}
  public render() {
    const { queryOpt, mode,total ,columns,data,fileList} = this.state;
    // 分页配置
    const paginationProps = {
      showTotal: () => `共${total}条`,
      pageSize: 5,
      total: total,
      defaultPageSize:1,
      onShowSizeChange: (current:number,pageSize:number) => this.changePageSize(pageSize,current),
      onChange: (current:number,pageSize:number) => this.changePage(current,pageSize),
    };

    const uploadProps={
        onRemove: (file:any) => {
            this.setState(state => ({
                data:[],
                fileList:[]
            }));
        },
        accept: ".xls,.xlsx,application/vnd.ms-excel",
        beforeUpload: (file:any) => {
            const _this=this;
            const f = file;
            const reader = new FileReader();
            reader.onload = function (e:any) {

                const datas = e.target.result;

                const workbook = XLSX.read(datas, {
                    type: 'binary'
                });//尝试解析datas

                const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];//是工作簿中的工作表的有序列表

                const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });//将工作簿对象转换为JSON对象数组

                _this.handleImpotedJson(jsonArr, file);
            };
            reader.readAsBinaryString(f);
            return false;
        },
        fileList,
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
              <Col span={4}>
                <FormItem className="mb-0">
                  <Button type="primary" onClick={this.handleExportDocument}>
                    excl导出
                  </Button>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem className="mb-0">
                <Upload {...uploadProps}>
                  <Button type="primary">
                    excl导入
                  </Button>
                </Upload>
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
        {
          data.length?<Table size="small" columns={columns} dataSource={data}
          expandedRowRender={(record: any) => <p style={{ margin: 0 }}>分类说明：{record.desc || '暂无分类'}</p>}
          ></Table>:null
        }
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
