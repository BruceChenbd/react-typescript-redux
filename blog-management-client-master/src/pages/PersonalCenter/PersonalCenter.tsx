import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import * as Loadable from 'react-loadable';
import Loading from '../../components/Loading/Loading';

import baseRoutes from '../../config/router.config';
import sidebarMenus from '../../config/sidebar.config';

const { Content, Sider } = Layout;

const personCenterRoutes: any = baseRoutes
  .filter(d => d.path === '/')
  .map((v: any) => {
    let opt: any = v.children.find((d: any) => d.path === '/person-center');
    return opt && opt.children;
  });

let opt: any = sidebarMenus.find((d: any) => d.key === '/person-center');
const personCenterMenus: any[] = opt.children;

interface IProps extends RouteComponentProps {}

interface IState {
  selectedKeys: string[];
}

class PersonalCenter extends React.Component<IProps, IState> {
  readonly state = {
    selectedKeys: ['/person-center/info-modify']
  };

  public componentDidMount() {
    const history = this.props.history;
    this.setState({ selectedKeys: [history.location.pathname] });

    history.listen(() => {
      this.setState({ selectedKeys: [history.location.pathname] });
    });
  }

  public handleSelect = (item: any) => {
    this.setState({ selectedKeys: item.selectedKeys });
  };

  public render() {
    return (
      <div className="person-center-component">
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              selectedKeys={this.state.selectedKeys}
              onSelect={this.handleSelect}
              style={{ height: '100%' }}
            >
              {personCenterMenus.map(m => (
                <Menu.Item key={m.key}>
                  <Link to={m.path}>{m.name}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px' }}>
            {personCenterRoutes[0].map((r: any) => (
              <Route
                key={r.path}
                path={r.path}
                component={Loadable({
                  loader: r.component,
                  loading: Loading,
                  timeout: 10000
                })}
              />
            ))}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default PersonalCenter;
