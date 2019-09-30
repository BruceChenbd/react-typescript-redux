export default [
  {
    path: '/login',
    exact: true,
    component: () => import('../pages/Login/Login')
  },
  {
    path: '/regist',
    exact: true,
    component: () => import('../pages/Regist/Regist')
  },
  {
    path: '/',
    exact: true,
    children: [
      {
        path: '/Home',
        exact: true,
        component: () => import('../pages/Home/Home')
      },
      {
        path: '/category-list',
        component: () => import('../pages/Category/Category')
      },
      {
        path: '/tag-list',
        component: () => import('../pages/Tag/Tag')
      },
      {
        path: '/article-list',
        exact: true,
        component: () => import('../pages/Article/ArticleList')
      },
      {
        path: '/article-list/add-new',
        component: () => import('../pages/Article/ArticleCreation')
      },
      {
        path: '/article-list/:id',
        exact: true,
        component: () => import('../pages/Article/ArticleDetail')
      },
      {
        path: '/article-list/:id/modify',
        component: () => import('../pages/Article/ArticleUpdate')
      },
      {
        path: '/person-center',
        component: () => import('../pages/PersonalCenter/PersonalCenter'),
        children: [
          {
            path: '/person-center/info-modify',
            component: () => import('../pages/PersonalCenter/InformationModify')
          },
          {
            path: '/person-center/pwd-modify',
            component: () => import('../pages/PersonalCenter/PasswordModify'),
          }
        ]
      },
    ]
  },
];
