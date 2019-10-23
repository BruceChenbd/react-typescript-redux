import * as React from 'react';
// import * as ReactMarkdown from 'react-markdown';
import { Card, Button, Tag } from 'antd';
import { withRouter, RouteComponentProps, match } from 'react-router-dom';
// import CodeBlock from '../../components/CodeBlock/CodeBlock';
// import Lottie from 'react-lottie';
// import * as animationData from '../../assets/10456-kissing-emoji.json';
import * as api from '../../api/fetchdata';

import './ArticleDetail.less';

interface IParams {
  id: string;
}

interface IProps extends RouteComponentProps {
  match: match<IParams>;
}

interface IState {
  articleInfo: any;
  previewVisible: boolean;
  previewImage: string;
  userName: string;
  userImg: string;
}

class ArticleDetail extends React.Component<IProps, IState> {
  public unMount: boolean = false;

  readonly state = {
    articleInfo: {
      title: '',
      desc: '',
      cover_image: '',
      category_id: '',
      content: '',
      tag_ids: [],
      updateTime:''
    },
    previewVisible: false,
    previewImage: '',
    userName:'',
    userImg:''
  };

  public componentDidMount() {
    let userInfoStr: string | null = localStorage.getItem('USER_INFO');
    if (userInfoStr) {
      let userInfo: any = JSON.parse(userInfoStr);
      this.setState({
        userName: userInfo.username,
        userImg: userInfo.avatar_image
      })
    }
  
    this.getArticleInfo();
  }

  public componentWillUnmount() {
    this.unMount = true;
  }

  public getArticleInfo = () => {
    let id: string = this.props.match.params.id;

    api
      .getArticleInfo(id)
      .then(res => {
        if (res.data.code === 0) {
          if (this.unMount) return;
          this.setState({ articleInfo: res.data.data[0] });
        }
      })
      .catch(err => console.log(err));
  };

  public handleCancel = () => this.setState({ previewVisible: false });

  public handlePreview = () => {
    this.setState({
      previewImage: this.state.articleInfo.cover_image,
      previewVisible: true
    });
  };

  public goBack = () => {
    this.props.history.goBack();
  };

  public renderTags = (tags: any[]) => {
    return (
      <span>
        {tags.map((tag: any) => (
          <Tag color="blue" key={tag}>
            {tag}
          </Tag>
        ))}
      </span>
    );
  };

  public render() {
    const {  articleInfo: info } = this.state;
    // const defaultOptions = {
    //   loop: true,
    //   autoplay: true, 
    //   animationData: animationData,
    //   rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid slice'
    //   }
    // };
    return (
      <Card className="blog-detail-component">
        <div className="ant-row ant-form-item">
          <div className="userinfo">
            <img className="userImg" src={this.state.userImg}></img>
            <div>
              <h1 style={{margin:0}}>
                {this.state.userName}
              </h1>
              <div>
                 {info.updateTime}
              </div>
            </div>
          </div>
        </div>
        <div className="ant-row ant-form-item">
         <h1 style={{textAlign:'center',margin:'20px 0',fontSize:'30px'}}>{info.title}</h1>
         <div>
           <img src={info.cover_image} style={{width:'100%',height:'400px',margin:'0 0 40px 0'}}></img>
         </div>
         <div>
           <span>标签：</span>{this.renderTags(info.tag_ids)}  <span>分类：</span>{info.category_id}
         </div>
         <div className="html-body" style={{margin:'20px 0'}} dangerouslySetInnerHTML={{__html:info.content}}>

         </div>
        </div>
        <div className="ant-row ant-form-item">
        {/* <Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/> */}
        </div>
       
        <Button  onClick={this.goBack}>
          返 回
        </Button>
      </Card>
    );
  }
}

export default withRouter(ArticleDetail);
