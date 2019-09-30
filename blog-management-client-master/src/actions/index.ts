import * as constants from '../constants';

export interface ISetCollapsed {
  type: constants.SET_COLLAPSED;
  collapsed: boolean;
}

export interface ISetSelectedKeys {
  type: constants.SET_SELECTED_KEYS;
  selectedKeys: string[];
}

export interface IUpdateUserInfo {
  type: constants.UPDATE_USER_INFO;
  userInfo: object;
}

export interface ILoginOut {
  type: constants.LOGIN_OUT;
  userInfo: object,
}

export type AppAction = ISetCollapsed | ISetSelectedKeys | IUpdateUserInfo | ILoginOut

// 折叠菜单
export function setCollapsed(collapsed: boolean): ISetCollapsed {
  return {
    type: constants.SET_COLLAPSED,
    collapsed: collapsed
  };
}
// 菜单选择
export function setSelectedKeys(selectedKeys: string[]): ISetSelectedKeys {
  return {
    type: constants.SET_SELECTED_KEYS,
    selectedKeys
  };
}
// 用户信息更新
export function updateUserInfo(info: object): IUpdateUserInfo {
  return {
    type: constants.UPDATE_USER_INFO,
    userInfo: info
  };
}
// 退出登录
export function loginOut() : ILoginOut {
  return {
    type: constants.LOGIN_OUT,
    userInfo: {} // user information
  }
}
