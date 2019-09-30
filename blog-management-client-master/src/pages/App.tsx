import * as React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import * as Loadable from 'react-loadable';
import Sidebar from '../components/Sidebar/Sidebar';
import GlobalHeader from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Loading from '../components/Loading/Loading';
import routerConfig from '../config/router.config';
import notFound from '../pages/404/notFound'

import './App.less';
import '../assets/style/atom-one-light.min.css';

const Content = Layout.Content;

export default function App() {
  return (
    <Router>
      <Switch>
        {routerConfig.map((router: any) => {
          if (router.path === '/') {
            return (
              <Route key={router.path} path="/">
                <Layout className="page-container">
                  <Sidebar />
                  <Layout className="page-container__right">
                    <GlobalHeader />
                    <Scrollbars>
                      <Content className="page-container__content">
                        <Breadcrumb />
                        <Switch>
                          {router.children &&
                            router.children.map((d: any) => {
                              return (
                                <Route
                                  key={d.path}
                                  exact={d.exact}
                                  path={d.path}
                                  component={Loadable({
                                    loader: d.component,
                                    loading: Loading,
                                    timeout: 10000
                                  })}
                                />
                              );
                            })}
                          <Redirect exact from="/" to="/home" />
                          <Route component={notFound} />
                        </Switch>
                      </Content>
                    </Scrollbars>
                  </Layout>
                </Layout>
              </Route>
            );
          } else {
            return (
              <Route
                path={router.path}
                key={router.path}
                component={Loadable({
                  loader: router.component,
                  loading: Loading,
                  timeout: 10000
                })}
              />
            );
          }
        })}
        {location.pathname === '/' && <Redirect to="/home" />}
      </Switch>
    </Router>
  );
}
