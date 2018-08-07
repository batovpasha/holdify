'use strict';

const { Pack, Hand } = require('tx-holdem');
const preflop = require('./preflop.js');

const pack = new Pack();

/*
  cards look like object with two fields: suit and rank

  {
    suit: 'clubs',
    rank: 'K'
  }

  {
    suit: 'diamonds',
    rank: 'A'
  }

  etc...
*/

const createCards = (hand, table) => { // hand and table are arrays of cards(objects)
  const handCards = new Array(hand.length);
  const tableCards = new Array(table.length);

  for (const cardIndex in hand) {
    handCards[cardIndex] = pack.createCard(hand[cardIndex]['suit'],
                                           hand[cardIndex]['rank']);
  }

  for (const cardIndex in table) {
    tableCards[cardIndex] = pack.createCard(table[cardIndex]['suit'],
                                            table[cardIndex]['rank']);
  }

  if (!tableCards.length) // if no cards on table then it is a preflop
    preflop.generateDecision(handCards);
}

createCards([{ suit: 'clubs', rank: 'K' }, { suit: 'diamonds', rank: 'A' }],
            []);
