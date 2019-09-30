import axios from 'axios';
import ajax from './ajax';

// login
// logon satus does not require token.
export const login = (opt: any) => axios({ method: 'POST', url: '/users/login', data: opt });

// loginout
export const loginOut = () => axios({method: 'GET', url: '/users/logout'})

// regist
export const regist = (opt: any) => axios({method: 'POST', url: '/users/regist', data: opt});

// checkUserToken

export const checkUser = () => ajax({method: 'POST', url: '/users/checkUser'})

// check session
export const checkSession  = () => axios({method: 'GET', url: '/users/userInfo'})
// home data
export const getStatisticalData = () => ajax({ method: 'GET', url: '/main/getArticleNum'});

// add category
export const addCategory = (opt: any) => ajax({ method: 'POST', url: '/manage/addCategory', data: opt });

// get categories
export const getCategoryList = (opt: any) => ajax({ method: 'GET', url: '/manage/getCategories', params: opt });

// delete category
export const deleteCategory = (id: string) => ajax({ method: 'DELETE', url: `/manage/delCategory/${id}`});

// update category
export const updateCategory = (opt: any) => ajax({ method: 'PUT', url: '/manage/updateCategory', data: opt });

// add tag
export const addTag = (opt: any) => ajax({ method: 'POST', url: '/manage/addTag', data: opt });

// get category list
export const getTagList = (opt: any) => ajax({ method: 'GET', url: '/manage/getTag', params: opt });

// delete tag
export const deleteTag = (id: string) => ajax({ method: 'DELETE', url: `/manage/delTag/${id}` });

// update tag
export const updateTag = (opt: any) => ajax({ method: 'PUT', url: '/manage/updateTag', data: opt });

// upload cover img

export const uploadCoverImg = (opt: any) => ajax({ method: 'POST', url: '/manage/upload', data: opt});

// add article

export const addArticle = (opt: any) => ajax({ method: 'POST', url: '/manage/addArticle', data: opt});

// get article list
export const getArticleList = (opt: any) => ajax({ method: 'GET', url: '/manage/getArticleList', params: opt });

// update article
export const updateArticle = (opt: any) => ajax({ method: 'PUT', url: '/manage/updateArticle', data: opt });

// get article information by article-id
export const getArticleInfo = (id: string) => ajax({ method: 'GET', url: `/manage/getArticleInfo/${id}` });

// delete article
export const deleteArticle = (id: string) => ajax({ method: 'DELETE', url: `/manage/deleteArticle/${id}` });

// get user information
export const getUserInfo = (id: string) => ajax({ method: 'GET', url: `/api/admin/user/${id}` });

// update user information
export const updateUserInfo = (opt: any) => ajax({ method: 'PUT', url: '/personal/updateInfo', data: opt });

// update user password
export const updateUserPwd = (opt: any) => ajax({ method: 'PUT', url: '/personal/updatePsw', data: opt });

// upload img
export const uploadImg = (opt: any) => ajax({ method: 'POST', url: '/personal/upload', data: opt });

// add areas
export const addAeras = (opt: any) => ajax({ method: 'POST', url: '/common/api/chinese_area', data: opt });

export const getAllCounties = () => ajax({ method: 'GET', url: '/common/api/chinese_area/counties' })

// get all provinces
export const getAllProvinces = () => ajax({ method: 'GET', url: '/common/api/chinese_area/provinces' });

// get all cities by province name
export const getAllCitiesByProvince = (opt: { province: string }) => ajax({ method: 'GET', url: '/common/api/chinese_area/province/cities', params: opt });

// get all counties by city name
export const getAllCountiesByCity = (opt: { city: string }) => ajax({ method: 'GET', url: '/common/api/chinese_area/province/city/counties', params: opt });
