'use strict';

const { Pack, Hand } = require('tx-holdem');
const preflop = require('./preflop.js');
const flop = require('./flop.js');

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

const createCards = (pocket, board) => { // hand and table are arrays of cards(objects)
  const pocketCards = new Array(pocket.length);
  const boardCards = new Array(board.length);

  for (const cardIndex in pocket)
    pocketCards[cardIndex] = pack.createCard(...Object.values(pocket[cardIndex]));

  for (const cardIndex in board)
    boardCards[cardIndex] = pack.createCard(...Object.values(board[cardIndex]));

  const currentPocketCards = new Hand(pocketCards); // create a true hand object(not an array)
  const currentBoardCards = new Hand(boardCards); // similar, create table cards obj using boardCards array

  if (!boardCards.length) // if no cards on table then it is a preflop
    console.log(preflop.generateDecision(currentPocketCards)); // in preflop are not table cards

  else if (boardCards.length === 3) // if there are 3 cards on the board - it is a flop
    console.log(flop.generateDecision(currentPocketCards, currentBoardCards));

  /*
  else if (boardCards.length === 4)
    console.log(turn.generateDecision(currentPocketCards, currentBoardCards));

  else if (boardCards.length === 5)
    console.log(river.generateDecision(currentPocketCards, currentBoardCards));

  else {
    throw new Error('Not enough table cards!');
  }
  */
}

createCards([{ suit: 'spades', rank: 10 },    // hand cards
             { suit: 'diamonds', rank: 9 }],    //

            [{ suit: 'clubs', rank: 10 },      // table cards
             { suit: 'clubs', rank: 9 },      //
             { suit: 'clubs', rank: 7 }]);    //
