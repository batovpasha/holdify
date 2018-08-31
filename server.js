const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      serveStatic = require('serve-static');

const cards_parser = require('./server/scripts/cards_parser.js');
const app = express();

app.use(bodyParser.json());
app.use(serveStatic(__dirname + "/dist"));

const port = 8000;

app.listen(process.env.PORT || port, () => {
  console.log('Server starts correctly');
});

app.post('/game', (req, res) => {
  let bank  = req.body.bank;
  let pocket_cards = req.body.hand_cards;
  let board_cards = req.body.table_cards;

  res.send(cards_parser.createCards(pocket_cards, board_cards, bank));
});
