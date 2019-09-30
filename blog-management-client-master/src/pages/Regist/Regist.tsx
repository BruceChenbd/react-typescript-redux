import * as React from 'react';
import './Regist.less';
import { Form, Icon, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as api from '../../api/fetchdata';

const FormItem = Form.Item;

interface IProps extends RouteComponentProps, FormComponentProps {
  updateUserInfo: (info: object) => void;
}

interface IState {
  loading: boolean;
}

class Regist extends React.Component<IProps, IState> {
  readonly state = {
    loading: false
  };

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log(values)
        if(values.password !== values.passwordRe) {
           message.warn('两次输入的密码不一致!')
          return
        }
        this.regist(values);
      }
    });
  };

  public regist = (values: any) => {

    this.setState({ loading: true });

    let opt = {
      username: values.username,
      password: values.password,
      passwordRe: values.passwordRe
    };

    api
      .regist(opt)
      .then(res => {
        console.log(res,'res')
        if (res.data.code === 0) {
          message.success(res.data.message);
          setTimeout(() => {
            this.props.history.push('/login');
          }, 1000);
        } else {
          if(res.data.message == '此账号已经注册，请前往登录') {
            message.warning(res.data.message);
            setTimeout(() => {
              this.props.history.push('/login');
            }, 2000);
          }
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        message.error(err);
        this.setState({ loading: false });
      });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="regist-page">
        <Form onSubmit={this.handleSubmit} className="login-page__from">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }]
            })(
              <Input
                autoComplete="off"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password!' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                autoComplete="off"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('passwordRe', {
              rules: [{ required: true, message: 'Please confirm your password!' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                autoComplete="off"
                placeholder="确认密码"
              />
            )}
          </FormItem>
          <FormItem className="mb-0">
            <Button type="primary" loading={this.state.loading} htmlType="submit" className="form-button">
              注册
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

const connectComponent = connect(
  null,
  mapDispatchToProps
)(Regist);
const wrap:any = Form.create()(connectComponent)
export default withRouter(wrap);
