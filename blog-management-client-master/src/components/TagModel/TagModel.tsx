import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  className?: string;
  isVisible: boolean;
  onCancel: () => void;
  onSave: () => void;
  mode: string;
  tagInfo: any;
}

class CategoryCreateModel extends React.Component<IProps, any> {

  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps:any) {
  }
  public render() {
    const { isVisible, onCancel, onSave, form, mode, tagInfo } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        className="category-list-component__modal"
        title={mode === 'add' ? '添加标签' : '修改标签'}
        visible={isVisible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" type="default" onClick={onCancel}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={onSave}>
            保存
          </Button>
        ]}
      >
        <Form>
          <FormItem label="标签名称">
            {getFieldDecorator('tagName', {
              rules: [{ required: true, message: '请输入标签名称' }, { max: 10, message: '标签名称长度不能大于10' }],
              initialValue: mode === 'add' ? '' : tagInfo.tagName
            })(<Input autoComplete="off" placeholder="输入标签名称" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const CategoryCreateM:any =  Form.create()(CategoryCreateModel);
