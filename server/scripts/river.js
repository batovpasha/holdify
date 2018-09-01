'use strict';

const { HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const DECISIONS = {
  absolutelyRaise: 'Сейчас стоит повысить ставку, 100 % ',
  raise: 'Рекомендуем повысить ставку',
  call: 'Сейчас стоит уравнять ставку',
  fold: 'Рекомендуем сбросить карты'
};

const findPairForFourOfKind = (arrayOfPocketRanks, board) => { // if board combination is four of a kind and we have a pair
  const arrayOfBoardRanks = [];

  board['cards'].forEach(card => arrayOfBoardRanks.push(RANKS[card['rank']]));

  if (arrayOfBoardRanks.includes(arrayOfPocketRanks[0]) || 
      arrayOfBoardRanks.includes(arrayOfPocketRanks[1]))
    return true;
  
  else return false;
};

const findStraight = (pocket, board) => {
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting
    
  for (let i = 1; i < ranksArray.length - 3; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1] && ranksArray[i + 2] && ranksArray[i + 3]) // if there are 5 rank in a row then return true
      return [RANKS[i - 1], RANKS[i], RANKS[i + 1], RANKS[i + 2], RANKS[i + 3]];
    
  return false;
};

const findFlush = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros
  
  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing
      
  return Math.max(...numberOfCurrentSuit) === 5 
       ? SUITS[numberOfCurrentSuit.indexOf(Math.max(...numberOfCurrentSuit))]
       : false;
};

const calculateBetForDecision = (decision, bank, combinationName) => {
  switch(decision) {
    case DECISIONS['absolutelyRaise']:
      return { 
                decision: DECISIONS['absolutelyRaise'] + combinationName, 
                bet: bank 
              };
    
    case DECISIONS['raise']:
      return { 
                decision: DECISIONS['raise'], 
                bet : Math.round((bank * 2) / 3) 
              };

    case DECISIONS['call']:
      return { 
                decision: DECISIONS['call'], 
                bet : '-' 
              };
    
    case DECISIONS['fold']:
      return { 
                decision: DECISIONS['fold'], 
                bet : '-' 
              };
  }
};

const translateCombinationName = (name) => {
  switch(name) {
    case 'straight':
      return 'Стрит';
    
    case 'flush':
      return 'Флеш';

    case 'full-house':
      return 'Фулл-хаус';

    case 'four of a kind':
      return 'Каре';
      
    case 'straight flush':
      return 'Стрит-Флеш';  
  }
};

const generateDecision = (pocket, board, bank) => {
  const combination = HandsCollection.createCombinations(board, pocket); // createCombinations return an obj with information of combination
  const highestCombination = combination.highestCombination.name;
  // suit in Hand obj is a number which mean that 20 is clubs suit, 21 is diamonds suit etc
  const firstPocketCardSuit = SUITS[pocket['cards'][0]['suit'] % 10]; // for find index in suits array we use mod by 10
  const secondPocketCardSuit = SUITS[pocket['cards'][1]['suit'] % 10];
      
  const firstPocketCardRank = RANKS[pocket['cards'][0]['rank']];
  const secondPocketCardRank = RANKS[pocket['cards'][1]['rank']];
  findPairForFourOfKind([firstPocketCardRank, secondPocketCardRank], board);
  // block of making decisions for raise
  if ((combination.highestCombination.name === 'straight' && !board.isStraight())
   || (combination.highestCombination.name === 'flush' && !board.isFlush())
   || (combination.highestCombination.name === 'full-house' && !board.isFullHouse())
   || (combination.highestCombination.name === 'four of a kind' && !board.isFourOfKind())
   || (combination.highestCombination.name === 'straight flush' && !board.isStraightFlush()))

    return calculateBetForDecision(DECISIONS['absolutelyRaise'], 
                                   bank, 
                                   translateCombinationName(highestCombination));
  
  if (board.isFourOfKind() && 
      findPairForFourOfKind([firstPocketCardRank, secondPocketCardRank], board))
    return calculateBetForDecision(DECISIONS['raise'], bank);

  if (findStraight(pocket, board) &&
      findStraight(pocket, board).includes(firstPocketCardRank) &&
      findStraight(pocket, board).includes(secondPocketCardRank))
    return calculateBetForDecision(DECISIONS['raise'], bank);
  
  if (findFlush(pocket, board) &&
      findFlush(pocket, board) === firstPocketCardSuit &&
      findFlush(pocket, board) === secondPocketCardSuit)
    return calculateBetForDecision(DECISIONS['raise'], bank);

  if (pocket.isPair() && (board.isStraight() || board.isFlush() || 
                          board.isFullHouse() || board.isFourOfKind() || 
                          board.isStraightFlush() || board.isRoyalFlush()))
    return calculateBetForDecision(DECISIONS['raise'], bank);

  // block for making decisions for call
  if (findStraight(pocket, board) &&
    ((findStraight(pocket, board).includes(firstPocketCardRank) &&
     !findStraight(pocket, board).includes(secondPocketCardRank)) || 
     (findStraight(pocket, board).includes(secondPocketCardRank) && 
     !findStraight(pocket, board).includes(firstPocketCardRank))))
    return calculateBetForDecision(DECISIONS['call'], bank);
    
  if (findFlush(pocket, board) &&
     (findFlush(pocket, board) === firstPocketCardSuit &&
      findFlush(pocket, board) !== secondPocketCardSuit) ||
     (findFlush(pocket, board) !== firstPocketCardSuit &&
      findFlush(pocket, board) === secondPocketCardSuit))
    return calculateBetForDecision(DECISIONS['call'], bank);
    
  return calculateBetForDecision(DECISIONS['fold'], bank);   
};

module.exports = { generateDecision };