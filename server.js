const Koa = require('koa');
const app = new Koa();


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


// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
