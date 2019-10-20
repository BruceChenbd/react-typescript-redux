import * as React from 'react';

import { Card, message, Modal } from 'antd';
import {ArticleFormEdi} from '../../components/ArticleForm/ArticleForm';

import * as api from '../../api/fetchdata';
import { withRouter, RouteComponentProps, match } from 'react-router-dom';

const confirm = Modal.confirm;

interface IParams {
  id: string;
}

interface IProps extends RouteComponentProps {
  match: match<IParams>;
}

interface IState {
  articleInfo: any;
}

class ArticleCreation extends React.Component<IProps, IState> {
  public unMount: boolean = false;

  readonly state = {
    articleInfo: {}
  };

  public componentDidMount() {
    this.getArticleInfo();
  }

  public componentWillUnmount() {
    this.unMount = true;
  }

  // update article
  public updateArticle = (values: any) => {
    let opt: any = {
      ...values,
      cover_image: values.cover_image[0] ? values.cover_image[0].url : '',
      id: this.props.match.params.id
    };

    api
      .updateArticle(opt)
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
  // 根据id获取要修改的文章详情
  public getArticleInfo = () => {
    let id = this.props.match.params.id;

    api
      .getArticleInfo(id)
      .then(res => {
        if (res.data.code === 0) {
          let articleInfo = res.data.data[0];
          let opt: any = res.data.data[0];
          if (opt.cover_image === '') {
            opt.cover_image = [];
          } else {
            opt.cover_image = [{ uid: '1', url: opt.cover_image }];
          }

          if (this.unMount) return;
          this.setState({
            articleInfo: articleInfo
          });
        }
      })
      .catch(err => console.log(err));
  };

  public render() {
    return (
      <Card className="blog-update-component">
        {
          Object.keys(this.state.articleInfo).length == 0? null: <ArticleFormEdi
          articleInfo={this.state.articleInfo}
          postArticle={(values:any) => this.updateArticle(values)}
          goBack={this.goBack}
        />
        }
        
      </Card>
    );
  }
}

export default withRouter(ArticleCreation);
