const Koa = require('koa');
const koaBody = require('koa-body');

const app = module.exports =  new Koa();


const { exec } = require('child_process');
let cmd = 'abc'

// exec(`echo ${cmd}`, (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });

app.use(koaBody({
  jsonLimit: '1kb'
}));

// response
// app.use(ctx => {
//   ctx.body = 'Hello Koa';
// });

app.use(async function(ctx) {
  const body = ctx.request.body;
  if (!body.rate || !body.delay || !body.loss) ctx.throw(400, 'rate, delay and loss required');
  let message = ''
  const loss = parseFloat(body.loss)
  if (loss !== NaN && loss !== 0){
    message = `loss ${parseFloat(body.loss)}%`
  }
  const delay = parseFloat(body.delay)
  if(delay!== NaN && delay !== 0){
    message = `delay ${parseFloat(body.delay)}ms ${message}`
  }
  if (message!==''){
    message = `sudo tc qdisc add dev enp4s0 root netem ${message}`
  }
  // const message =`sudo tc qdisc add dev enp4s0 root delay ${parseFloat(body.delay)}ms loss ${parseFloat(body.loss)}%`
  console.log(message)
  exec(`${message}`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(`an error occur.${err.message}`)
      return;
    }
    // the *entire* and stderr (buffered)
    console.log(message)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`);
  });
  ctx.body = { message: message };
});

if (!module.parent) app.listen(54321);
