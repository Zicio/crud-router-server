const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true, urlencoded: true }));

const author = faker.name.findName();
const photo = faker.image.avatar();
let posts = [
  {
    id: uuidv4(),
    author: author,
    photo: photo,
    created: Date.now(),
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. In, impedit.",
  },
  {
    id: uuidv4(),
    author: author,
    photo: photo,
    created: Date.now(),
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est vitae numquam expedita maiores. Nulla, odio?",
  },
];

const router = new Router();

router.get("/posts", async (ctx, next) => {
  const postId = ctx.request.query.id;
  if (postId) {
    const post = posts.find((o) => o.id === postId);
    if (post) {
      ctx.response.body = post;
    }
  } else {
    ctx.response.body = posts;
  }
});

router.post("/posts", async (ctx, next) => {
  const data = JSON.parse(ctx.request.body);
  const { id, content } = data;
  if (id !== 0) {
    posts = posts.map((o) => (o.id !== id ? o : { ...o, content: content }));
    ctx.response.status = 204;
    return;
  }

  posts.push({
    ...data,
    id: uuidv4(),
    author: author,
    photo: photo,
    created: Date.now(),
  });
  ctx.response.status = 204;
});

router.delete("/posts", async (ctx, next) => {
  const postId = ctx.request.query.id;
  const index = posts.findIndex((o) => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
