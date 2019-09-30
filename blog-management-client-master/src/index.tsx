import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { LocaleProvider } from 'antd';
import App from './pages/App';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import registerServiceWorker from './registerServiceWorker';

import './assets/style/base.css';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
