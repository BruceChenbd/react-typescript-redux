import * as React from 'react';
import { Form, message, Upload, Avatar, Icon, Input, Button, AutoComplete } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import './InformationModify.less';

import baseUrl from '../../config/url.config';
import * as api from '../../api/fetchdata';

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;
const TextArea = Input.TextArea;

interface IProps extends FormComponentProps {
  updateUserInfo: (info: object) => void;
  prop:any
}

interface IState {
  userInfo: any;
  avatarImgUrl: string;
  autoCompleteResult: any[];
}

class InformationModify extends React.Component<IProps, IState> {
  public unMount: boolean = false;

  readonly state = {
    userInfo: {
      username: '',
      nickname: '',
      email: '',
      website: '',
      profile: ''
    },
    avatarImgUrl: '',
    autoCompleteResult: [],
  };

  public componentDidMount() {
  }

  public componentWillUnmount() {
    this.unMount = true;
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        values.avatar_image = this.props.prop.avatar_image;
        this.updateUserInfo(values);        
      }
    });
  };
  // 个人网站
  public handleWebsiteChange = (value: any) => {
    let autoCompleteResult: any[];
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };
  // 更新redux中用户信息
  public async updateUserInfo (values: any) {
    // 验证token合法性
    let status = await api.checkUser().then();
    if(status) {
      api
      .updateUserInfo(values)
      .then(res => {
        if (res.data.code === 0) {
          message.success(res.data.message);
          let opt: any = {
            nick_name: values.nickname,
            email: values.email,
            website: values.website,
            profile: values.profile,
            avatar_image: values.avatar_image,
          };
          let userInfoStr: string | null = localStorage.getItem('USER_INFO');
          let userInfo: object = userInfoStr ? JSON.parse(userInfoStr) : {};
          localStorage.setItem('USER_INFO', JSON.stringify(Object.assign({}, userInfo, opt)));
          this.props.updateUserInfo(opt);
        }
      })
      .catch(err => console.log(err));
    }
  };
  // 上传图片到服务器
  public uploadImg = (file: any) => {
    let fd: FormData = new FormData();
    fd.append('file', file.file);
    api
      .uploadImg(fd)
      .then(res => {
        if (res.data.data.status === 0) {
          this.props.updateUserInfo({ avatar_image: res.data.data.data });
          message.success(res.data.data.message);
        } else {
          message.warn(res.data.data.message)
        }
      })
      .catch(err => console.log(err));
  };
  public render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout: any = {
      labelCol: {},
      wrapperCol: {}
    };
    const websiteOptions: any[] = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    return (
      <div className="information-modify-component">
        <Form onSubmit={this.handleSubmit}>
          <FormItem className="ant-row  upload-avatar">
            {this.props.prop.avatar_image ? (
              <img className="upload-avatar__avatar" src={baseUrl + this.props.prop.avatar_image} alt="avatar" />
            ) : (
              <Avatar className="upload-avatar__avatar" src={this.state.avatarImgUrl} size={100} icon="user" />
            )}
            <Upload showUploadList={false} customRequest={this.uploadImg}>
              <Button className="upload-avatar__button" size="small">
                <Icon type="upload" /> 更换头像
              </Button>
            </Upload>
          </FormItem>

          <FormItem {...formItemLayout} label="账户名">
            {getFieldDecorator('username', {
            })(<Input disabled={true} placeholder="请输入用户名" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="昵称">
            {getFieldDecorator('nickname', {
              rules: [{ max: 10, message: '昵称长度不能大于10' }]
            })(<Input autoComplete="off" placeholder="请输入昵称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '输入的邮箱无效'
                }
              ]
            })(<Input autoComplete="off" placeholder="请输入邮箱" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="网站">
            {getFieldDecorator('website', {
            })(
              <AutoComplete dataSource={websiteOptions} onChange={this.handleWebsiteChange}>
                <Input autoComplete="off" placeholder="请输入网址" />
              </AutoComplete>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="个人简介">
            {getFieldDecorator('profile', {
            })(<TextArea placeholder="请输入个人简介" rows={4} />)}
          </FormItem>
          <FormItem className="mb-0">
            <Button type="primary" htmlType="submit">
              提 交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<actions.AppAction>) => {
  return {
    updateUserInfo: (info: object) => dispatch(actions.updateUserInfo(info))
  };
};
 const mapStateToProps = (state:any, ownProps:any) => {
  return {
    prop: state.userInfo
  }
}
const Wrap = Form.create({
  mapPropsToFields(props:any) {
      return {
          username: Form.createFormField({
              value:props.prop.username
          }),
          nickname: Form.createFormField({
            value:props.prop.nick_name
          }),
          website: Form.createFormField({
            value:props.prop.website
          }),
          profile: Form.createFormField({
            value: props.prop.profile
          }),
          email: Form.createFormField({
            value: props.prop.email
          })
      }
  }
})(InformationModify)

export default connect(mapStateToProps,mapDispatchToProps)(Wrap);
