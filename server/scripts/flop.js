'use strict';

const { Pack, Hand, HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const countSuits = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x == 0); // create array with four zeros

  [...[pocket, board]].forEach(hand => hand['cards']
                      .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++)); // count every suit using SUITS indexing

  return Math.max(...numberOfCurrentSuit);
}

const generateDecision = (pocket, board) => {
  const combination = HandsCollection.createCombinations(board, pocket); // createCombinations return an obj with information of combination

  console.log(countSuits(pocket, board));
};

module.exports = { generateDecision };
