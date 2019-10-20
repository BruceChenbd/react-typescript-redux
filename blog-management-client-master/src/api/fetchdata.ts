import axios from 'axios';
import ajax from './ajax';

// login
// logon satus does not require token.
export const login = (opt: any) => axios({ method: 'POST', url: '/api/users/login', data: opt });

// loginout
export const loginOut = () => axios({method: 'GET', url: '/api/users/logout'})

// regist
export const regist = (opt: any) => axios({method: 'POST', url: '/api/users/regist', data: opt});

// checkUserToken

export const checkUser = () => ajax({method: 'POST', url: '/api/users/checkUser'})

// check session
export const checkSession  = () => axios({method: 'GET', url: '/api/users/userInfo'})
// home data
export const getStatisticalData = () => ajax({ method: 'GET', url: '/api/main/getArticleNum'});

// add category
export const addCategory = (opt: any) => ajax({ method: 'POST', url: '/api/manage/addCategory', data: opt });

// get categories
export const getCategoryList = (opt: any) => ajax({ method: 'GET', url: '/api/manage/getCategories', params: opt });

// delete category
export const deleteCategory = (id: string) => ajax({ method: 'DELETE', url: `/api/manage/delCategory/${id}`});

// update category
export const updateCategory = (opt: any) => ajax({ method: 'PUT', url: '/api/manage/updateCategory', data: opt });

// add tag
export const addTag = (opt: any) => ajax({ method: 'POST', url: '/api/manage/addTag', data: opt });

// get category list
export const getTagList = (opt: any) => ajax({ method: 'GET', url: '/api/manage/getTag', params: opt });

// delete tag
export const deleteTag = (id: string) => ajax({ method: 'DELETE', url: `/api/manage/delTag/${id}` });

// get rand number
export const getRandNum = () => ajax({ method: 'get', url:'/api/manage/getRandNum'});

// update tag
export const updateTag = (opt: any) => ajax({ method: 'PUT', url: '/api/manage/updateTag', data: opt });

// upload cover img

export const uploadCoverImg = (opt: any) => ajax({ method: 'POST', url: '/api/manage/upload', data: opt});

// add article

export const addArticle = (opt: any) => ajax({ method: 'POST', url: '/api/manage/addArticle', data: opt});

// get article list
export const getArticleList = (opt: any) => ajax({ method: 'GET', url: '/api/manage/getArticleList', params: opt });

// update article
export const updateArticle = (opt: any) => ajax({ method: 'POST', url: '/api/manage/updateArticle', data: opt });

// get article information by article-id
export const getArticleInfo = (id: string) => ajax({ method: 'GET', url: `/api/manage/getArticleInfo/${id}` });

// delete article
export const deleteArticle = (id: string) => ajax({ method: 'DELETE', url: `/api/manage/deleteArticle/${id}` });

// get user information
export const getUserInfo = (id: string) => ajax({ method: 'GET', url: `/api/admin/user/${id}` });

// update user information
export const updateUserInfo = (opt: any) => ajax({ method: 'PUT', url: '/api/personal/updateInfo', data: opt });

// update user password
export const updateUserPwd = (opt: any) => ajax({ method: 'PUT', url: '/api/personal/updatePsw', data: opt });

// upload img
export const uploadImg = (opt: any) => ajax({ method: 'POST', url: '/api/personal/upload', data: opt });
