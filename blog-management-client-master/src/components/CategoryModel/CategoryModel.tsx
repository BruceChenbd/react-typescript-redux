import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
  className?: string;
  categoryInfo: any;
  isVisible: boolean;
  onCancel: () => void;
  onSave: () => void;
  mode: string;
}

class CategoryModel extends React.Component<IProps, any> {
  public render() {
    const { categoryInfo, isVisible, onCancel, onSave, form, mode } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        className="category-list-component__modal"
        title={mode === 'update' ? '修改分类' : '新增分类'}
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
          <FormItem label="分类名称">
            {getFieldDecorator('categoryName', {
              rules: [{ required: true, message: '请输入分类名称' }, { max: 10, message: '分类名称长度不能大于10' }],
              initialValue: mode === 'update' ? categoryInfo.categoryName : ''
            })(<Input autoComplete="off" placeholder="输入分类名称" />)}
          </FormItem>
          <FormItem label="分类描述" className="mb-0">
            {getFieldDecorator('categoryDesc', {
              initialValue: mode === 'update' ? categoryInfo.desc : '',
              rules: [{ max: 20, message: '分类描述长度不能大于20' }]
            })(<Input autoComplete="off" type="textarea" placeholder="输入分类描述" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const CategoryM:any = Form.create()(CategoryModel);
