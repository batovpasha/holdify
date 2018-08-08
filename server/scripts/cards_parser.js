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
    console.log(preflop.generateDecision(handCards));

  /*
  else if (tableCards.length === 3)
    console.log(flop.generateDecision(handCards, tableCards));

  else if (tableCards.length === 4)
    console.log(turn.generateDecision(handCards, tableCards));

  else if (tableCards.length === 3)
    console.log(river.generateDecision(handCards, tableCards));
  */
}

createCards([{ suit: 'clubs', rank: 9 }, { suit: 'diamonds', rank: 'A' }],
            []);
