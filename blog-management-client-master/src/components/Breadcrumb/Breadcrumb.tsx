import * as React from 'react';
import { Breadcrumb } from 'antd';
import { IStoreState } from '../../types';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import sidebarMenus from '../../config/sidebar.config';

import './Breadcrumb.less';

interface IProps extends RouteComponentProps {
  setSelectedKeys: (keys: string[]) => void;
}

class GlobalBreadcrumb extends React.Component<IProps, any> {
  public getBreadcrumbs = () => {
    let breadcrumbs: any[] = [];
    let location: any = this.props.history.location;

    sidebarMenus.forEach((item: any) => {
      if (item.key === location.pathname) {
        breadcrumbs.push({ path: item.key, name: item.name });
      } else if (location.pathname.indexOf(item.key) > -1) {
        breadcrumbs.push({ path: item.key, name: item.name });

        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            let opt = item.children[i];
            if (opt.path === location.pathname || location.pathname.replace(/\d+/, ':id') === opt.path) {
              breadcrumbs.push({ path: opt.path, name: opt.name });
            }
          }
        }
      }
    });

    return breadcrumbs;
  };

  public handleClick = (path: string) => {
    this.props.setSelectedKeys([path]);
  };

  public render() {
    return (
      <Breadcrumb style={{ margin: '10px 0 10px' }}>
        {this.getBreadcrumbs().map((item, index, total) => {
          if (index === total.length - 1) {
            return <Breadcrumb.Item key={item.path}>{item.name}</Breadcrumb.Item>;
          }
          return (
            <Breadcrumb.Item key={item.path}>
              <Link onClick={() => this.handleClick(item.path)} to={item.path}>
                {item.name}
              </Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
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
)(GlobalBreadcrumb);

export default withRouter(connectComponent);
