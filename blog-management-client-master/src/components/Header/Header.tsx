import * as React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Icon, Layout, Menu, Dropdown } from 'antd';
import { IStoreState } from '../../types';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as api from '../../api/fetchdata';
import './Header.less';

interface IUserInfo {
  nick_name: string;
  username: string;
  avatar_image: string;
}

interface IProps extends RouteComponentProps {
  userInfo: IUserInfo;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setSelectedKeys: (selectedKeys: string[]) => void;
  loginOut: () => void;
}

class GlobalHeader extends React.Component<IProps, any> {
  public toggle = () => {
    const { collapsed, setCollapsed } = this.props;
    setCollapsed(!collapsed);
  };

  public handleToModifyInfo = () => {
    this.props.setSelectedKeys(['/person-center']);
  };

  public handleToModifyPassword = () => {
    this.props.setSelectedKeys(['/person-center']);
  };

  public logout = () => {
    api.loginOut().then(res => {
      
    })
    this.props.loginOut()
    localStorage.removeItem('USER_INFO');
    this.props.history.push('/login');
  };

  public render() {
    const { collapsed, userInfo } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/person-center/info-modify" onClick={this.handleToModifyInfo}>
            <Icon type="form" /> 修改信息
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/person-center/pwd-modify" onClick={this.handleToModifyPassword}>
            <Icon type="edit" /> 修改密码
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={this.logout}>
          <Icon type="logout" /> 退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout.Header className="page-container__header">
        <Icon className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />

        <Dropdown overlay={menu}>
          <span className="dropdown-link">
            <span className="username">{userInfo.nick_name || userInfo.username}</span>
            {userInfo.avatar_image ? (
              <img className="avatar" alt="avatar" src={userInfo.avatar_image} />
            ) : (
              <Avatar icon="user" />
            )}
          </span>
        </Dropdown>
      </Layout.Header>
    );
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    collapsed: state.collapsed,
    userInfo: state.userInfo
  };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.AppAction>) => {
  return {
    setCollapsed: (collapsed: boolean) => dispatch(actions.setCollapsed(collapsed)),
    setSelectedKeys: (selectedKeys: string[]) => dispatch(actions.setSelectedKeys(selectedKeys)),
    loginOut: () => dispatch(actions.loginOut())
  };
};

const connectComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalHeader);

export default withRouter(connectComponent);
