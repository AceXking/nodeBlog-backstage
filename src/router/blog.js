const { 
    getList, 
    getDetail, 
    newBlog,
    updateBlog,
    delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}
const handleBlogRouter = (req, res) => {
    const method = req.method
    // const id = req.query.id || ''
    const id = req.body.id || ''
    //获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        const result = getList(author, keyword)
        return result.then((listData) => {
            return new SuccessModel(listData)
        })
    }
    //获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const listData = getDetail(id);
        // return new SuccessModel(listData)
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    //新增博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        // req.body.author = 'zhangsan' //假数据， 待开发登录时改成真数据
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then( data => {
            return new SuccessModel(data)
        })
    }
    //更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        const result = updateBlog(id, req.body)
        return result.then(val =>{
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新失败')
            }
        })
        
    }
    //删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        // const author = 'zhangsan'  //假数据
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel('删除成功')
            } else {
                return new ErrorModel('删除失败')
            }
        })
    }

}

module.exports = handleBlogRouter