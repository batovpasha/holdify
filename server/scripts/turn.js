'use strict';

const { HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const DECISIONS = {
  absolutelyRaise: 'Сейчас стоит повысить ставку, 100 % ',
  checkForStraight: 'Рекомендуем уравнять ставку, 31,5 % шанс для Стрита в Ривере',
  checkForFlush: 'Рекомендуем уравнять ставку, 35 % шанс для Флеша в Ривере',
  callForFullHouse: 'Сейчас стоит уравнять ставку, возможный Фулл-хаус',
  call: 'Сейчас стоит уравнять ставку',
  fold: 'Рекомендуем сбросить карты',
  callForThreeOfKind: 'Рекомендуем уравнять ставку, возможное Каре'
};

const calculateBetForDecision = (decision, bank, combinationName) => {
  switch(decision) {
    case DECISIONS['absolutelyRaise']:
      return { decision: DECISIONS['absolutelyRaise'] + combinationName, bet: bank };
    
    case DECISIONS['checkForStraight']:
      return { decision: DECISIONS['checkForStraight'], bet: Math.round(bank / 2) };
    
    case DECISIONS['checkForFlush']:
      return { decision: DECISIONS['checkForFlush'], bet: Math.round(bank / 2) };

    case DECISIONS['callForFullHouse']:
      return { decision: DECISIONS['callForFullHouse'], bet: null };

    case DECISIONS['call']:
      return { decision: DECISIONS['call'], bet: null };
    
    case DECISIONS['fold']:
      return { decision: DECISIONS['fold'], bet: null };
    
    case DECISIONS['callForThreeOfKind']:
      return { decision: DECISIONS['callForFullHouse'], bet: null };
  }
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

  // block of making decisions for absolutely fold
  if ((board.isTwoPairs() || board.isFourOfKind()) && !pocket.isPair())
    return calculateBetForDecision(DECISIONS['fold'], bank);

  // block of making decisions for raise
  if (combination.highestCombination.name === 'straight'
   || combination.highestCombination.name === 'flush'
   || combination.highestCombination.name === 'full-house'
   || combination.highestCombination.name === 'four of a kind'
   || combination.highestCombination.name === 'straight flush')

    return calculateBetForDecision(DECISIONS['absolutelyRaise'], 
                                   bank, 
                                   translateCombinationName(highestCombination));

  // block of making decisions for call and check
  if (findMinGoodSequenceForCall(pocket, board) &&
     (findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank)
   || findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank))) 
      
    return calculateBetForDecision(DECISIONS['checkForStraight'], bank);
      

  if (isAnySuitMoreThanThree(pocket, board) &&
     (isAnySuitMoreThanThree(pocket, board) === firstPocketCardSuit
   || isAnySuitMoreThanThree(pocket, board) === secondPocketCardSuit))
      
    return calculateBetForDecision(DECISIONS['checkForFlush'], bank);
 
  if (combination.highestCombination.name === 'two pairs' && !board.isTwoPairs()) // we have two pairs but not all on board
    return calculateBetForDecision(DECISIONS['callForFullHouse'], bank);
  
  if (findMinGoodSequenceForCall(pocket, board) &&
     !findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank) &&
     !findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank) &&
     pocket.isPair())
    return calculateBetForDecision(DECISIONS['call'], bank);
  
  if (isAnySuitMoreThanThree(pocket, board) &&
      isAnySuitMoreThanThree(pocket, board) !== firstPocketCardSuit &&
      isAnySuitMoreThanThree(pocket, board) !== secondPocketCardSuit &&
      pocket.isPair())
    return calculateBetForDecision(DECISIONS['call'], bank);

  if (combination.highestCombination.name === 'three of kind' && 
     !board.isThreeOfKind())
   
    return calculateBetForDecision(DECISIONS['callForThreeOfKind'], bank);
  // block of making decisions for absolutely fold
  if (findMinGoodSequenceForCall(pocket, board) &&
     !findMinGoodSequenceForCall(pocket, board).includes(firstPocketCardRank) &&
     !findMinGoodSequenceForCall(pocket, board).includes(secondPocketCardRank))
    return calculateBetForDecision(DECISIONS['fold'], bank);

  if (isAnySuitMoreThanThree(pocket, board) &&
      isAnySuitMoreThanThree(pocket, board) !== firstPocketCardSuit &&
      isAnySuitMoreThanThree(pocket, board) !== secondPocketCardSuit)  
    return calculateBetForDecision(DECISIONS['fold'], bank);

  if (board.isThreeOfKind())
    return calculateBetForDecision(DECISIONS['fold'], bank); 
    
  return calculateBetForDecision(DECISIONS['fold'], bank);
} 

module.exports = { generateDecision };