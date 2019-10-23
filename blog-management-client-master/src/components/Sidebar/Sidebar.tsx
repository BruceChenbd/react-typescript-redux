import * as React from 'react';
import { Link, withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import sidebarMenus from '../../config/sidebar.config';
import { IStoreState } from '../../types';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as animationData from '../../assets/8307-love-icon-animation.json';
import Lottie from 'react-lottie';

import './Sidebar.less';

const Sider = Layout.Sider;
const { Item } = Menu;

interface IProps extends RouteComponentProps {
  collapsed: boolean;
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
}

class Sidebar extends React.Component<IProps, any> {
  readonly state = {
    userName:''
  }
  public componentDidMount() {
    let userInfoStr: string | null = localStorage.getItem('USER_INFO');
    if (userInfoStr) {
      let userInfo: any = JSON.parse(userInfoStr);
      this.setState({
        userName: userInfo.username,
      })
      this.setSidebarStatus();
    }
  }
  // set active status of sidebar
  public setSidebarStatus = () => {
    sidebarMenus.forEach(item => {
      if (this.props.location.pathname.indexOf(item.key) > -1) {
        this.props.setSelectedKeys([item.key]);
      }
    });
  };

  public handleSelect = (item: { selectedKeys: string[] }) => {
    this.props.setSelectedKeys(item.selectedKeys);
  };

  public render() {
    const { collapsed, selectedKeys, location } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <Sider className="sidebar-component" trigger={null} collapsible collapsed={collapsed}>
        <Scrollbars>
          <div className="logo">
            {this.state.userName == '小玉玉'?<Lottie options={defaultOptions}
              height={'100%'}
              width={'100%'} />:<img src={require('../../assets/images/xigua1.png')}></img>}
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} onSelect={this.handleSelect}>
            {sidebarMenus.map(item => {
              return (
                <Item key={item.key} disabled={item.key === '/comment-list' || item.key === '/message-list'}>
                  <Link to={item.key}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Link>
                </Item>
              );
            })}
            {location.pathname === '/person-center' && <Redirect to="/person-center/info-modify" />}
          </Menu>
        </Scrollbars>
      </Sider>
    );
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    collapsed: state.collapsed,
    selectedKeys: state.selectedKeys
  };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.AppAction>) => {
  return {
    setSelectedKeys: (selectedKeys: string[]) => dispatch(actions.setSelectedKeys(selectedKeys))
  };
};

const connectComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);

export default withRouter(connectComponent);
