const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const static = require('koa-static')
const uploadFile = require('./util/upload')

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'


//使用第三方中间件 start
app.use(static(path.join(__dirname, staticPath))) //静态资源处理

app.use(views(path.join(__dirname, './views'), {//模板处理
    extension: 'ejs'
}))
//使用第三方中间件 end


app.use( async ( ctx ) => {
    if ( ctx.method === 'GET' ) {
        let title = 'upload pic async'
        await ctx.render('index', {
            title,
        })
    } else if ( ctx.url === '/api/picture/upload.json' && ctx.method === 'POST' ) {
        // 上传文件请求处理
        let result = { success: false }
        let serverFilePath = path.join( __dirname, 'static/upload' )
        // 上传文件事件
        result = await uploadFile( ctx, {
            fileType: 'album',
            path: serverFilePath,
            visitePath:'upload'
        })
        ctx.body = result
    } else {
        // 其他请求显示404
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }

})

app.listen(3006, () => {
    console.log('[demo] upload-pic-async is starting at port 3006')
})
