const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      serveStatic = require('serve-static');

const cards_parser = require('./server/scripts/cards_parser.js');
const app = express();
app.use(bodyParser.json());
app.use(serveStatic(__dirname + "/dist"));

app.listen(3000, () => {
  console.log('Server starts correctly');
});

app.get('/', (req, res) => {

});

app.post('/game', (req, res) => {
  let bank  = req.body.bank;
  let bet = req.body.bet;
  let hand_cards = req.body.hand_cards;
  let table_cards = req.body.table_cards;
  res.send(cards_parser.createCards(hand_cards, table_cards));
});
