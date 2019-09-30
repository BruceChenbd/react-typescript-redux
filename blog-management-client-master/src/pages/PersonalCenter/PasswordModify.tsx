import * as React from 'react';
import { Form, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import './PasswordModify.less';
import * as api from '../../api/fetchdata';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {}

class InformationModify extends React.Component<IProps, any> {
  public unMount: boolean = false;

  public componentWillUnmount() {
    this.unMount = true;
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(values.new_password !== values.re_password) {
          message.warn('两次输入的密码不一致,请再次确认!')
          return;
        }      
        this.updatePassword(values);
      }
    });
  };

  public updatePassword = (values: object) => {
    api
      .updateUserPwd(values)
      .then(res => {
        if (res.data.code === 0) {
          message.success(res.data.message);

          if (this.unMount) return;
          this.props.form.resetFields();
        }
      })
      .catch(err => console.log(err));
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout: object = {
      labelCol: {},
      wrapperCol: {}
    };

    return (
      <div className="password-modify-component">
        <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username', {
             initialValue:'陈宝东'
            })(<Input disabled={true} type="text" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="原密码">
            {getFieldDecorator('old_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your old password!'
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('new_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your new password!'
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="确认">
            {getFieldDecorator('re_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your new password!'
                }
              ]
            })(<Input type="password" />)}
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

export default Form.create()(InformationModify);
