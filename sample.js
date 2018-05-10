const Koa = require('koa');
const koaBody = require('koa-body');

const app = module.exports =  new Koa();


const { exec } = require('child_process');
let cmd = 'abc'

exec(`echo ${cmd}`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

app.use(koaBody({
  jsonLimit: '1kb'
}));

// response
// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });


app.use(async function(ctx) {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, '.name required');
  exec(`echo ${body.name}`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  ctx.body = { name: body.name.toUpperCase() };
});

if (!module.parent) app.listen(54321);
