fs = require('fs')
fs.readFile('./.env', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});
