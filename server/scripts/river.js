'use strict';

const { HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const findStraight = (pocket, board) => {
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting
    
  for (let i = 1; i < ranksArray.length - 3; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1] && ranksArray[i + 2]) // if there are 4 rank in a row then return true
      return [RANKS[i - 1], RANKS[i], RANKS[i + 1], RANKS[i + 2], RANKS[i + 3]];
    
  return false;
}

const findFlush = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing
      
  return Math.max(...numberOfCurrentSuit) === 5 
       ? SUITS[numberOfCurrentSuit.indexOf(Math.max(...numberOfCurrentSuit))]
       : false;
}

const generateDecision = (pocket, board) => {
  const combination = HandsCollection.createCombinations(board, pocket); // createCombinations return an obj with information of combination
  // suit in Hand obj is a number which mean that 20 is clubs suit, 21 is diamonds suit etc
  const firstPocketCardSuit = SUITS[pocket['cards'][0]['suit'] % 10]; // for find index in suits array we use mod by 10
  const secondPocketCardSuit = SUITS[pocket['cards'][1]['suit'] % 10];
      
  const firstPocketCardRank = RANKS[pocket['cards'][0]['rank']];
  const secondPocketCardRank = RANKS[pocket['cards'][1]['rank']];

  // block of making decisions for raise
  if (findStraight(pocket, board) &&
      findStraight(pocket, board).includes(firstPocketCardRank) &&
      findStraight(pocket, board).includes(secondPocketCardRank))
    return 'River - recommend to raise';  
  
  if (findFlush(pocket, board) &&
      findFlush(pocket, board) === firstPocketCardSuit &&
      findFlush(pocket, board) === secondPocketCardSuit)
    return 'River - recommend to raise';

  if (pocket.isPair() && (board.isStraight() || board.isFlush() || 
                          board.isFullHouse() || board.isFourOfKind() || 
                          board.isStraightFlush() || board.isRoyalFlush()))
    return 'River - recommend to raise';

  // block for making decisions for call
  if (findStraight(pocket, board) &&
     (findStraight(pocket, board).includes(firstPocketCardRank) &&
     !findStraight(pocket, board).includes(secondPocketCardRank)) || 
     (findStraight(pocket, board).includes(secondPocketCardRank) && 
     !findStraight(pocket, board).includes(firstPocketCardRank)))
    return 'River - recommend to call';
    
  if (findFlush(pocket, board) &&
     (findFlush(pocket, board) === firstPocketCardSuit &&
      findFlush(pocket, board) !== secondPocketCardSuit) ||
     (findFlush(pocket, board) !== firstPocketCardSuit &&
      findFlush(pocket, board) === secondPocketCardSuit))
    return 'River - recommend to call';
    
  return 'River - recommend to fold';    
};

module.exports = { generateDecision };