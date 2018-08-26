'use strict';

const { Pack, Hand } = require('tx-holdem');
const preflop = require('./preflop.js');
const flop = require('./flop.js');
const turn = require('./turn.js');
const river = require('./river.js');

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

const createCards = (pocket, board, bank) => { // hand and table are arrays of cards(objects)
  const pack = new Pack();
  
  const pocketCards = new Array(pocket.length);
  const boardCards = new Array(board.length);

  for (const cardIndex in pocket)
    pocketCards[cardIndex] = pack.createCard(...Object.values(pocket[cardIndex]));

  for (const cardIndex in board)
    boardCards[cardIndex] = pack.createCard(...Object.values(board[cardIndex]));

  const currentPocketCards = new Hand(pocketCards); // create a true hand object(not an array)
  const currentBoardCards = new Hand(boardCards); // similar, create table cards obj using boardCards array

  if (!boardCards.length) // if no cards on table then it is a preflop
    return preflop.generateDecision(currentPocketCards, bank); // in preflop are not table cards

  else if (boardCards.length === 3) // if there are 3 cards on the board - it is a flop
    return flop.generateDecision(currentPocketCards, currentBoardCards, bank);

  else if (boardCards.length === 4)
    return turn.generateDecision(currentPocketCards, currentBoardCards, bank);
  
  else if (boardCards.length === 5)
    return river.generateDecision(currentPocketCards, currentBoardCards, bank);
}

module.exports = { createCards };
