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

  for (const cardIndex in hand)
    handCards[cardIndex] = pack.createCard(...Object.values(hand[cardIndex]));

  for (const cardIndex in table)
    handCards[cardIndex] = pack.createCard(...Object.values(table[cardIndex]));

  const currentHandCards = new Hand(handCards)   // create a true hand object(not an array)
  const currentTableCards = new Hand(tableCards) // similar, create table cards obj using tableCards array

  if (!tableCards.length) // if no cards on table then it is a preflop
    console.log(preflop.generateDecision(currentHandCards)); // in preflop are not table cards

  /*
  else if (tableCards.length === 3)
    console.log(flop.generateDecision(handCards, tableCards));

  else if (tableCards.length === 4)
    console.log(turn.generateDecision(handCards, tableCards));

  else if (tableCards.length === 5)
    console.log(river.generateDecision(handCards, tableCards));

  else {
    throw new Error('Not enough table cards!');
  }
  */
}

createCards([{ suit: 'clubs', rank: 9 },       // hand cards
             { suit: 'diamonds', rank: 'A' }], //

            [{ suit: 'clubs', rank: 10 },      // table cards
             { suit: 'spades', rank: 'A' },    //
             { suit: 'hearts', rank: 'A' }]);  //
