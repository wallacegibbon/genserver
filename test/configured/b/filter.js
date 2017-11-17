var cnt = 0;


async function filter(ctx, next) {
  if (cnt++ % 2 === 0)
    await next();
}


module.exports = filter;
