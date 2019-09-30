import axios, { AxiosInstance } from 'axios';
import { message } from 'antd';
import baseUrl from '../config/url.config';

let ajax: AxiosInstance = axios.create({
  timeout: 10000,
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json'
  },
  withCredentials: true
});

ajax.interceptors.request.use(
  (config: any) => {
    let userInfoStr: string | null = localStorage.getItem('USER_INFO');
    if (userInfoStr) {
      let userInfo: any = JSON.parse(userInfoStr);
      config.headers['X-Auth-Token'] = userInfo.userId +'&&'+ userInfo.token;
    } else {
      message.warn('用户信息丢失，请重新登录！');
      setTimeout(() => {
        window.location.href = '#/login';
      }, 1000);
    }

    return config;
  },
  (error: never) => {
    return Promise.reject(error);
  }
);

ajax.interceptors.response.use(
  (config: any) => {
    if (config.data.code === 1) {
      message.warn(config.data.message);
    } else if (config.data.code === 2) {
      // token is expired
      message.warn(config.data.message);

      setTimeout(() => {
        localStorage.removeItem('USER_INFO');
        window.location.href = '#/login';
      }, 1000);
      return Promise.reject()
    }
    return config;
  },
  (error: never) => {
    // message.warn(error.message);
    return Promise.reject(error);
  }
);

export default ajax;
