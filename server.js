require('dotenv').config()
const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')

const port = process.env.PORT || 3000
const app = new Koa()
const router = new Router()

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
});

app.use(serve('./public'))
app.use(views('./views', { map: { html: 'nunjucks' }}))
app.use(bodyParser())

router.get('/', (ctx, next) => {
  return ctx.render('./index')
})

router.post('/verify/', async (ctx, next) => {
  const payload = await ctx.request.body
  const phone = payload.phone

  const result = await verify(phone)
  const reqId = result.request_id 
  ctx.status = 200
  return ctx.render('./verify', { reqId: reqId })
})

router.post('/cancel/', async (ctx, next) => {
  const payload = await ctx.request.body
  const reqId = payload.reqId

  const result = await cancel(reqId)
  ctx.status = 200
  ctx.response.redirect('/')
})

router.post('/check/', async (ctx, next) => {
  const payload = await ctx.request.body
  const code = payload.pin
  const reqId = payload.reqId
  
  const result = await check(reqId, code)
  const status = result.status
  ctx.status = 200
  return ctx.render('./result', { status: status })
})

app.use(router.routes()).use(router.allowedMethods())

const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})

async function verify(number) {
  return new Promise(function(resolve, reject) {
    nexmo.verify.request({
      number: number,
      brand: process.env.NEXMO_BRAND_NAME
    }, (err, result) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

async function check(reqId, code) {
  return new Promise(function(resolve, reject) {
    nexmo.verify.check({
      request_id: reqId,
      code: code
    }, (err, result) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

async function cancel(reqId) {
  return new Promise(function(resolve, reject) {
    nexmo.verify.control({
      request_id: reqId,
      cmd: 'cancel'
    }, (err, result) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}