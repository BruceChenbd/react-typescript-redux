import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card, message, Modal } from 'antd';
import {ArticleFormEdi} from '../../components/ArticleForm/ArticleForm';
import * as api from '../../api/fetchdata';

const confirm = Modal.confirm;

interface IProps extends RouteComponentProps {}

class ArticleCreation extends React.Component<IProps, any> {
  public unMount: boolean = false;

  public componentWillUnmount() {
    this.unMount = true;
  }

  public goBack = () => {
    let _this = this;
    confirm({
      title: '确认返回吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        _this.props.history.goBack();
      }
    });
  };

  public saveArticle = (values: any) => {
    values.cover_image = values.cover_image[0] ? values.cover_image[0].url : '';
    
    api
      .addArticle(values)
      .then(res => {
        if (res.data.code === 0) {
          message.success(res.data.message);

          if (this.unMount) return;
          setTimeout(() => {
            this.props.history.replace('/article-list');
          }, 500);
        }
      })
      .catch(err => console.log(err));
  };

  public render() {
    return (
      <Card className="blog-creation-component">
        <ArticleFormEdi postArticle={(values:any) => this.saveArticle(values)} goBack={this.goBack} />
      </Card>
    );
  }
}

export default withRouter(ArticleCreation);
