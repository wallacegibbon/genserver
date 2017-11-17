var cnt = 0;


async function filter(ctx, next) {
  if (cnt++ % 2 === 1)
    ctx.body = { info: "You are odd" };
  else
    await next();
}


module.exports = filter;
