import { IStoreState } from '../types'
import { AppAction } from '../actions'
import * as constants from '../constants'

const initialState: IStoreState = {
  collapsed: false,
  selectedKeys: [],
  userInfo: JSON.parse(localStorage.getItem('USER_INFO') || '{}') // user information
}

export default function(state: IStoreState = initialState, action: AppAction): IStoreState  {
  switch (action.type) {
    case constants.SET_COLLAPSED:
      return {
        ...state,
        collapsed: action.collapsed
      }
      break;
    case constants.SET_SELECTED_KEYS:
      return {
        ...state,
        selectedKeys: action.selectedKeys
      }
      break;
    case constants.UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.userInfo
        }
      }
      break;
    case constants.LOGIN_OUT:
      console.log({...state,userInfo:action.userInfo})
      return Object.assign({},{...state,userInfo:action.userInfo})
      break;
    default:
      return state
  }
}