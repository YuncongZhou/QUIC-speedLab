const http = require('http');
const https = require('https');
const fs = require("fs")
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors')

const app = module.exports =  new Koa();
app.use(cors())

const { exec } = require('child_process');
const pwd = fs.readFileSync("./.env",'utf-8')

app.use(koaBody({
  jsonLimit: '1kb'
}));

// response
app.use(async function(ctx) {
  let cmd = ''
  let message = ''
  const body = ctx.request.body;
  if (!body.rate && !body.delay && !body.loss) ctx.throw(400, 'rate, delay and loss required');
  const rate = parseFloat(body.rate)
  const delay = parseFloat(body.delay)
  const loss = parseFloat(body.loss)
  if ( rate === -1 && delay === -1 && loss === -1 ) {
    message = `tc qdisc del dev enp4s0 root`
  } else {
    if (!isNaN(loss) && loss !== 0){
      message = `loss ${parseFloat(body.loss)}%`
    }

    if(!isNaN(delay) && delay !== 0){
      message = `delay ${parseFloat(body.delay)}ms ${message}`
    }

    if (!isNaN(rate) && rate !== 0){
      message = `rate ${parseFloat(body.rate)}mbit ${message}`
    }

    if (message!==''){
      message = `tc qdisc add dev enp4s0 root netem ${message}`
    }
  }

  // const message =`sudo tc qdisc add dev enp4s0 root delay ${parseFloat(body.delay)}ms loss ${parseFloat(body.loss)}%`
  if (message){
    cmd = `echo ${pwd} | sudo -S ${message}`
  } else {
    cmd = `echo 'invalid parameters'`
  }
  console.log(message)
  // `echo ${pwd} | sudo -S ${message}`
  exec(cmd , (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.error(`an error occur.\n${err.message}`)
      cmd = ''
      message = ''
      return;
    }
    // the *entire* and stderr (buffered)
    console.log(message)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`);
  });
  ctx.body = { message: message };
  cmd = ''
  message = ''
});

const options = {
  key: fs.readFileSync('./signed/serverkey.pem'),
  cert: fs.readFileSync('./signed/servercert.pem')
};

if (!module.parent) {
  // app.listen(54321);
  http.createServer(app.callback()).listen(54321);
  https.createServer(options,app.callback()).listen(54322);
}
