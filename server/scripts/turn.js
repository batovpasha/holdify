'use strict';

const { HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const DECISIONS = {
  absolutelyRaise: 'Turn - recommend to raise, absolutely ',
  checkForStraight: 'Turn - recommend to check, if not - call the bet, 31,5 % for straight in River',
  checkForFlush: 'Turn - recommend to check, if not - call the bet, 35 % for flush in River',
  callForFullHouse: 'Turn - recommend to call, probable full-house',
  call: 'Turn - recommend to call',
  fold: 'Turn - recommend to fold'
};

const findMinGoodSequenceForCall = (pocket, board) => { // find sequence which includes 4 elements in row
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting
  
  for (let i = 1; i < ranksArray.length - 2; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1] && ranksArray[i + 2]) // if there are 4 rank in a row then return true
      return [RANKS[i - 1], RANKS[i], RANKS[i + 1], RANKS[i + 2]];
  
  return false;
};

const isAnySuitMoreThanThree = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing
    
  return Math.max(...numberOfCurrentSuit) > 3 
       ? SUITS[numberOfCurrentSuit.indexOf(Math.max(...numberOfCurrentSuit))]
       : false;
};

const generateDecision = (pocket, board) => {
  const combination = HandsCollection.createCombinations(board, pocket); // createCombinations return an obj with information of combination
  // suit in Hand obj is a number which mean that 20 is clubs suit, 21 is diamonds suit etc
  const firstPocketCardSuit = SUITS[pocket['cards'][0]['suit'] % 10]; // for find index in suits array we use mod by 10
  const secondPocketCardSuit = SUITS[pocket['cards'][1]['suit'] % 10];
    
  const firstPocketCardRank = RANKS[pocket['cards'][0]['rank']];
  const secondPocketCardRank = RANKS[pocket['cards'][1]['rank']];

  // block of making decisions for raise
  if (combination.highestCombination.name === 'straight'
   || combination.highestCombination.name === 'flush'
   || combination.highestCombination.name === 'full-house'
   || combination.highestCombination.name === 'four of a kind'
   || combination.highestCombination.name === 'straight flush')

    return DECISIONS['absolutelyRaise'] + combination.highestCombination.name;

  // block of making decisions for call and check
  if (findMinGoodSequenceForCall(pocket, board) &&
     (findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank)
   || findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank))) 
      
    return DECISIONS['checkForStraight'];
      

  if (isAnySuitMoreThanThree(pocket, board) &&
     (isAnySuitMoreThanThree(pocket, board) === firstPocketCardSuit
   || isAnySuitMoreThanThree(pocket, board) === secondPocketCardSuit))
      
    return DECISIONS['checkForFlush'];
 
  if (combination.highestCombination.name === 'two pairs' && !board.isTwoPairs()) // we have two pairs but not all on board
    return DECISIONS['callForFullHouse'];
  
  if (findMinGoodSequenceForCall(pocket, board) &&
     !findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank) &&
     !findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank) &&
     pocket.isPair())
    return DECISIONS['call'];
  
  if (isAnySuitMoreThanThree(pocket, board) &&
      isAnySuitMoreThanThree(pocket, board) !== firstPocketCardSuit &&
      isAnySuitMoreThanThree(pocket, board) !== secondPocketCardSuit &&
      pocket.isPair())
    return DECISIONS['call'];

  // block of making decisions for absolutely fold
  if (findMinGoodSequenceForCall(pocket, board) &&
     !findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank) &&
     !findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank))
    return DECISIONS['fold'];

  if (isAnySuitMoreThanThree(pocket, board) &&
      isAnySuitMoreThanThree(pocket, board) !== firstPocketCardSuit &&
      isAnySuitMoreThanThree(pocket, board) !== secondPocketCardSuit)  
    return DECISIONS['fold'];
  
  if (board.isThreeOfKind())
    return DECISIONS['fold'];  
    
  return DECISIONS['fold'];
} 

module.exports = { generateDecision };