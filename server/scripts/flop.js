'use strict';

const { Pack, Hand, HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const isAnySuitMoreThanTwo = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing

  return Math.max(...numberOfCurrentSuit) > 2 // if true - return the suit, else return false
       ? SUITS[numberOfCurrentSuit.indexOf(Math.max(...numberOfCurrentSuit))]
       : false;
}

const findMinGoodSequence = (pocket, board) => { // use some sorting in linear time
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting

  for (let i = 1; i < ranksArray.length - 1; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1]) // if there are 3 rank in a row then return true
      return [RANKS[i - 1], RANKS[i], RANKS[i + 1]]; // return the sequence

  return false;
};

const findMinGoodSequenceForRaise = (pocket, board) => { // find sequence which includes 4 elements in row
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting

  for (let i = 1; i < ranksArray.length - 2; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1] && ranksArray[i + 2]) // if there are 4 rank in a row then return true
      return true; // return the sequence

  return false;
}

const isAnySuitMoreThanThree = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing
  
  return Math.max(...numberOfCurrentSuit) === 4 ? true : false;
}

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

    return 'Flop - recommend to raise, absolutely ' + combination.highestCombination.name;

  if (findMinGoodSequenceForRaise(pocket, board)) 
    return 'Flop - recommend to raise, probable straight';

  if (isAnySuitMoreThanThree(pocket, board))
    return 'Flop - recommend to raise, probable flush';
  
  //
  //
  //
  
  // block of making decisions for call
  if (combination.highestCombination.name === 'two pairs')
    return 'Flop - recommend to call, we have two pairs';
  
  if (findMinGoodSequence(pocket, board) && // if we have min good sequence(3 el) and hand includes one at least
     (findMinGoodSequence(pocket, board).includes(firstPocketCardRank)
   || findMinGoodSequence(pocket, board).includes(secondPocketCardRank)))

    return 'Flop - try to check, if not - raise the bet, probable straight'

  if (isAnySuitMoreThanTwo(pocket, board) && // if we have any suit more or equal than 3 and hand includes this suit 
     (isAnySuitMoreThanTwo(pocket, board) === firstPocketCardSuit
   || isAnySuitMoreThanTwo(pocket, board) === secondPocketCardSuit))

    return 'Flop - try to check, if not - raise the bet, probable flush';
  
  //
  //
  //
  
  // block of making decisions for absolutely fold
  if (!isAnySuitMoreThanTwo(pocket, board)
   && !findMinGoodSequence(pocket, board)
   && combination.highestCombination.name === 'kicker') // ???

    return 'Flop - recommend to fold';

  if (isAnySuitMoreThanTwo(pocket, board) // if isAnySuitMoreThanTwo and the pocket doesn't include this suit
   && isAnySuitMoreThanTwo(pocket, board) !== firstPocketCardSuit
   && isAnySuitMoreThanTwo(pocket, board) !== secondPocketCardSuit)

    return 'Flop - recommend to fold';

  if (findMinGoodSequence(pocket, board) && 
     !findMinGoodSequence(pocket, board).includes(firstPocketCardRank) &&
     !findMinGoodSequence(pocket, board).includes(secondPocketCardRank))

    return 'Flop - recommend to fold'; 
  
  //
  //
  //

};

module.exports = { generateDecision };
