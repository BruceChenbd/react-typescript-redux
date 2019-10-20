import * as React from 'react';
// const  E  = require('wangeditor');
import { Form, Select, Button, Input, message, Icon, Upload, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import 'simplemde/dist/simplemde.min.css';
import './ArticleForm.less';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor';



import * as api from '../../api/fetchdata';
import { checkUserToken } from '../../utils/utils';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


interface IProps {
  articleInfo?: any;
  postArticle: (values: any) => void;
  goBack: () => void;
}

interface IState {
  categoryList: any[];
  tagList: any[];
  previewVisible: boolean;
  previewImage: string;
  // editorContent: string;
  isCreate:boolean,
  editorState: any,
  outputHTML: string
}

class ArticleFormEdit extends React.Component<IProps & FormComponentProps, IState> {
  public unMount: boolean = false;
  public isLivinig: boolean = true;
  readonly state = {
    categoryList: [],
    tagList: [],
    previewVisible: false,
    previewImage: '',
    // editorContent:'',
    isCreate:false,
    editorState: '', // 设置编辑器初始内容
    outputHTML: '<p></p>'
  };

  public componentDidMount() {
    this.isLivinig = true;
    //  // 异步设置编辑器内容
    //  setTimeout(() => {
    //   this.props.form.setFieldsValue({
    //     content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')
    //   })
    // }, 1000)
    this.getCategoryList();
    this.getTagList();
  }

  public componentWillUnmount() {
    this.unMount = true;
    this.isLivinig = false;
  }

  componentWillReceiveProps(nextProps: any) {

  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        values.content = values.content.toHTML();
        this.props.postArticle && this.props.postArticle(values);
      }
    });
  };

  public goBack = () => {
    this.props.goBack && this.props.goBack();
  };

  public uploadImg = (file: any) => {
    let fd: FormData = new FormData();
    fd.append('file', file.file);

    api
      .uploadCoverImg(fd)
      .then(res => {
        if (res.data.data.status === 0) {
          const setFieldsValue = this.props.form.setFieldsValue;

          if (this.unMount) return;
          setFieldsValue({
            cover_image: [
              {
                uid: Math.floor(Math.random() * 10e6),
                url: res.data.data.data
              }
            ]
          });
          message.success(res.data.data.message);
        }
      })
      .catch(err => console.log(err));
  };

  public handleImageRemove = (file: any) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    let filterFiles = getFieldValue('cover_image').filter((d: any) => d.uid !== file.uid);

    setFieldsValue({
      cover_image: filterFiles
    });
  };

  public handleCancel = () => this.setState({ previewVisible: false });

  public handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  
  public async getCategoryList (opt?: any) {
    if(!opt) opt = {pageSize:5,pageNum:1};
    // this.setState({ loading: true });
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
          this.setState({ categoryList: list });
        }
      })
      .catch(err => console.log(err));
    }
  };

  public getTagList = (opt?: any) => {
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
        });
      }
    })
    .catch(err => console.log(err));
  };

  public normImageFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  public normTagFile = (e: any) => {
    if (e.length >= 3) {
      return e.slice(0, 3);
    }
    return e;
  };

  public render() {
    const { previewVisible, previewImage } = this.state;
    const articleInfo = this.props.articleInfo || {};
    
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let initEditor;
    if(Object.keys(articleInfo).length == 0) {
        initEditor = '';
    } else {
      initEditor = BraftEditor.createEditorState(`${articleInfo.content}`)
    }

    return (
      <div className="article-form-edit-component">
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="类别">
            {getFieldDecorator('category_id', {
              initialValue: articleInfo.category_id,
              rules: [
                {
                  required: true,
                  message: '请选择类别'
                }
              ]
            })(
              <Select
                showSearch
                placeholder="请选择所属类别"
                optionFilterProp="children"
                filterOption={(input: string, option: any) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.categoryList.map((d: any) => {
                  return (
                    <Option key={d.key} value={d.categoryName}>
                      {d.categoryName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="标签">
            {getFieldDecorator('tag_ids', {
              initialValue: articleInfo.tag_ids ? articleInfo.tag_ids.map((d: any) => d) : [],
              rules: [
                {
                  required: true,
                  message: '请选择标签'
                }
              ],
              getValueFromEvent: this.normTagFile
            })(
              <Select
                mode="multiple"
                placeholder="请选择标签"
                filterOption={(input: string, option: any) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.tagList.map((d: any) => {
                  return (
                    <Option key={d.key} value={d.tagName}>
                      {d.tagName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="标题">
            {getFieldDecorator('title', {
              initialValue: articleInfo.title,
              rules: [
                {
                  required: true,
                  message: '请输入标题'
                },
                { max: 30, message: '标题长度不能大于30' }
              ]
            })(<Input autoComplete="off" placeholder="请输入标题" />)}
          </FormItem>
          <FormItem label="封面">
            {getFieldDecorator('cover_image', {
              initialValue: articleInfo.cover_image || [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normImageFile
            })(
              <Upload
                className="cover-image"
                listType="picture-card"
                customRequest={this.uploadImg}
                onRemove={this.handleImageRemove}
                onPreview={this.handlePreview}
              >
                {getFieldValue('cover_image').length >= 1 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
          <FormItem className="full" label="简介">
            {getFieldDecorator('desc', {
              initialValue: articleInfo.desc,
              rules: [
                {
                  required: true,
                  message: '请输入简介'
                },
                { max: 200, message: '简介长度不能大于200' }
              ]
            })(<TextArea rows={3} placeholder="请输入简介" />)}
          </FormItem>
          <FormItem className="full" label="正文">
          {getFieldDecorator('content', {
              validateTrigger: 'onSbmit',
              initialValue: initEditor,
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
            })(
              <BraftEditor
                className="my-editor"
                placeholder="请输入正文内容"
                
              />
            )}
          </FormItem>
          <FormItem className="mb-0">
            <Button onClick={this.goBack} style={{ marginRight: 20 }}>
              取 消
            </Button>
            <Button type="primary" htmlType="submit">
              提 交
            </Button>
          </FormItem>
        </Form>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export const ArticleFormEdi:any =  Form.create()(ArticleFormEdit);
