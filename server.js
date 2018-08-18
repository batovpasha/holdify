const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      serveStatic = require('serve-static');

const app = express();
app.use(bodyParser.json());
app.use(serveStatic(__dirname + "/dist"));

app.listen(3000, () => {
  console.log('Server starts correctly');
});

app.get('/', (req, res) => {
 
});
