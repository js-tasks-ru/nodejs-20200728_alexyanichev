const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const subscriber_ids = Object.keys(subscribers);
  const subscriber_id = subscriber_ids.length > 0 ? subscriber_ids[subscriber_ids.length - 1] + 1 : 0;
  const message = await new Promise(resolve => {
    subscribers[subscriber_id] = message => resolve(message);
  })
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;
  if (message) {
    const subscriber_ids = Object.keys(subscribers);
    for (let id of subscriber_ids) {
      subscribers[id](message)
    }
    subscribers = {};
    ctx.body = "Successfully published";
  } else {
    ctx.body = "Message should not be empty";
  }
});

app.use(router.routes());

module.exports = app;
