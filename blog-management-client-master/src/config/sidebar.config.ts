export default [
  {
    key: '/',
    name: 'Dashboard',
    icon: 'home'
  },
  {
    key: '/category-list',
    name: '分类管理',
    icon: 'folder'
  },
  {
    key: '/tag-list',
    name: '标签管理',
    icon: 'tags'
  },
  {
    key: '/article-list',
    name: '文章管理',
    icon: 'file-text',
    children: [
      {
        name: '文章添加',
        path: '/article-list/add-new'
      },
      {
        name: '文章详情',
        path: '/article-list/:id'
      },
      {
        name: '文章修改',
        path: '/article-list/:id/modify'
      }
    ]
  },
  {
    key: '/comment-list',
    name: '评论管理',
    icon: 'message'
  },
  {
    key: '/message-list',
    name: '留言管理',
    icon: 'solution'
  },
  {
    key: '/person-center',
    name: '个人中心',
    icon: 'user',
    redirect: '/person-center/info-modify',
    children: [
      {
        name: '修改信息',
        key: '/person-center/info-modify',
        path: '/person-center/info-modify'
      },
      {
        name: '修改密码',
        key: '/person-center/pwd-modify',
        path: '/person-center/pwd-modify'
      }
    ]
  }
]