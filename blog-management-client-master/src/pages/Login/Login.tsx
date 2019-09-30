import * as React from 'react';
import './Login.less';
import { Form, Icon, Input, Button, message, Checkbox } from 'antd';
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

class Login extends React.Component<IProps, IState> {
  readonly state = {
    loading: false
  };

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.login(values);
      }
    });
  };
  public goRegist = () => {
    this.props.history.push('/regist');
  }
  public login = (values: any) => {
    this.setState({ loading: true });
    let opt = {
      username: values.username,
      password: values.password
    };

    api
      .login(opt)
      .then(res => {
        if (res.data.code === 0) {
          localStorage.setItem('USER_INFO', JSON.stringify(res.data.data));
          if (values.remember) {
            localStorage.setItem('USER_PWD', JSON.stringify(values));
          } else {
            localStorage.removeItem('USER_PWD');
          }
          this.props.updateUserInfo(res.data.data);
          message.success(res.data.message);

          setTimeout(() => {
            this.props.history.push('/');
          }, 1000);
        } else {
          message.warning(res.data.message);
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    let userPwdStr: any = localStorage.getItem('USER_PWD');
    let userPwdObj: any = { username: '', password: '', remember: false };
    if (userPwdStr) userPwdObj = JSON.parse(userPwdStr);

    return (
      <div className="login-page">
        <Form onSubmit={this.handleSubmit} className="login-page__from">
          <FormItem>
            {getFieldDecorator('username', {
              initialValue: userPwdObj.username || '',
              rules: [{ required: true, message: 'Please input your username!' }]
            })(
              <Input
                autoComplete="off"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              initialValue: userPwdObj.password || '',
              rules: [{ required: true, message: 'Please input your password!' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                autoComplete="off"
                placeholder="密码"
              />
            )}
          </FormItem>
          <FormItem className="mb-0">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: userPwdObj.remember
            })(
               <Checkbox style={{color:'#fff'}}>记住密码</Checkbox>
            )}
            <span onClick={this.goRegist} className="regist" style={{float:'right',cursor:'pointer'}}>立即注册</span>
            <span style={{color:'#fff',float:'right'}}>没有账号？</span>
            <Button type="primary" loading={this.state.loading} htmlType="submit" className="form-button">
             登录
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
)(Login);
const wrap:any = Form.create()(connectComponent)
export default withRouter(wrap);
