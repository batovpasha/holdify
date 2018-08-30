'use strict';

const { HandsCollection } = require('tx-holdem'); // HandsCollection need for createCombinations method

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const DECISIONS = {
  absolutelyRaise: 'Сейчас стоит повысить ставку, 100 % ',
  raiseForStraightFlush: 'Сейчас стоит повысить ставку, вероятный Стрит-Флеш',
  raiseForStraight: 'Рекомендуем повысить ставку, 31,5 % шанс для Стрита в Тёрне или Ривере',
  raiseForFlush: 'Рекомендуем повысить ставку, 35 % шанс для Флеша в Тёрне или Ривере',
  raiseForFullHouse: 'Сейчас стоит повысить ставку, имеем две пары, возможный Фулл-хаус',
  checkForStraight: 'Попробуйте сделать чек, если нет - уровняйте ставку, возможный Стрит',
  checkForFlush: 'Попробуйте сделать чек, если нет - уровняйте ставку, возможный Флеш',
  callForStraightFlush: 'Рекомендуем уравнять ставку, возможный Стрит-Флеш',
  callForThreeOfKind: 'Рекомендуем уравнять ставку, возможное Каре',
  fold: 'Рекомендуем скинуть карты'
};

const isAnySuitMoreThanTwo = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing

  return Math.max(...numberOfCurrentSuit) > 2 // if true - return the suit, else return false
       ? SUITS[numberOfCurrentSuit.indexOf(Math.max(...numberOfCurrentSuit))]
       : false;
};

const findMinGoodSequence = (pocket, board, forWhat) => { // use some sorting in linear time
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting

  for (let i = 1; i < ranksArray.length - 1; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1]) {// if there are 3 rank in a row then return true
      if (forWhat === 'forFindingSequence') return [RANKS[i - 1], RANKS[i], RANKS[i + 1]]; // return the sequence
      if (forWhat === 'forFindingStraightFlush') return [i - 1, i, i + 1];
    }
  return false;
};

const checkOnEqualSuits = (pocket, board, sequence) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0);

  [...pocket['cards'], ...board['cards']]
    .forEach(card => { 
      if (sequence.includes(card['rank'])) 
        numberOfCurrentSuit[card['suit'] % 10]++
    });
  
  for (let i = 0; i < numberOfCurrentSuit.length; i++) 
    if (numberOfCurrentSuit[i] === sequence.length) return true; 
  
  return false;
};

const findMinGoodSequenceForRaise = (pocket, board) => { // find sequence which includes 4 elements in row
  const ranksArray = Array.from(new Array(RANKS.length), x => x = 0);

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => ranksArray[card['rank']] = true); // linear sorting

  for (let i = 1; i < ranksArray.length - 2; i++)
    if (ranksArray[i - 1] && ranksArray[i] && ranksArray[i + 1] && ranksArray[i + 2]) // if there are 4 rank in a row then return true
      return [i - 1, i, i + 1, i + 2]; // return indexes

  return false;
};

const isAnySuitMoreThanThree = (pocket, board) => {
  const numberOfCurrentSuit = Array.from(new Array(SUITS.length), x => x = 0); // create array with four zeros

  [...pocket['cards'], ...board['cards']] // unpack all cards in one array
    .forEach(card => numberOfCurrentSuit[card['suit'] % 10]++); // count every suit using SUITS indexing
  
  return Math.max(...numberOfCurrentSuit) > 3 ? true : false;
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

const calculateBetForDecision = (decision, bank, combinationName) => {
  switch(decision) {
    case DECISIONS['absolutelyRaise']:
      return { decision: DECISIONS['absolutelyRaise'] + combinationName, bet: bank };
    
    case DECISIONS['raiseForStraightFlush']:
      return { decision: DECISIONS['raiseForStraightFlush'], bet: Math.round((bank * 2) / 3) }; 

    case DECISIONS['raiseForStraight']:
      return { decision: DECISIONS['raiseForStraight'], bet: Math.round((bank * 2) / 3) };
    
    case DECISIONS['raiseForFlush']:
      return { decision: DECISIONS['raiseForFlush'], bet: Math.round((bank * 2) / 3) };
    
    case DECISIONS['raiseForFullHouse']:
      return { decision: DECISIONS['raiseForFullHouse'], bet: Math.round((bank * 2) / 3) };

    case DECISIONS['checkForStraight']:
      return { decision: DECISIONS['checkForStraight'], bet: '-' };
    
    case DECISIONS['checkForFlush']:
      return { decision: DECISIONS['checkForFlush'], bet: '-' };
    
    case DECISIONS['callForStraightFlush']:
      return { decision: DECISIONS['callForStraightFlush'], bet: '-' };

    case DECISIONS['callForThreeOfKind']:
      return { decision: DECISIONS['callForThreeOfKind'], bet: '-' };
    
    case DECISIONS['fold']:
      return { decision: DECISIONS['fold'], bet: '-' };
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

  if (board.isThreeOfKind() && !pocket.isPair())
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

  if (findMinGoodSequenceForRaise(pocket, board) &&
      checkOnEqualSuits(pocket, board, findMinGoodSequenceForRaise(pocket, board)))
    return calculateBetForDecision(DECISIONS['raiseForStraightFlush'], bank);                                
  
  if (findMinGoodSequenceForRaise(pocket, board)) 
    return calculateBetForDecision(DECISIONS['raiseForStraight'], bank);

  if (isAnySuitMoreThanThree(pocket, board))
    return calculateBetForDecision(DECISIONS['raiseForFlush'], bank);
  
  if (combination.highestCombination.name === 'two pairs')
    return calculateBetForDecision(DECISIONS['raiseForFullHouse'], bank);

  //
  //
  //
  
  // block of making decisions for call
  if (findMinGoodSequence(pocket, board, 'forFindingSequence') &&
      checkOnEqualSuits(pocket, board, findMinGoodSequence(pocket, board, 'forFindingStraightFlush')))
    return calculateBetForDecision(DECISIONS['callForStraightFlush'], bank);

  if (findMinGoodSequence(pocket, board, 'forFindingSequence') && // if we have min good sequence(3 el) and hand includes one at least
     (findMinGoodSequence(pocket, board, 'forFindingSequence').includes(firstPocketCardRank)
   || findMinGoodSequence(pocket, board, 'forFindingSequence').includes(secondPocketCardRank)))

    return calculateBetForDecision(DECISIONS['checkForStraight'], bank);

  if (isAnySuitMoreThanTwo(pocket, board) && // if we have any suit more or equal than 3 and hand includes this suit 
     (isAnySuitMoreThanTwo(pocket, board) === firstPocketCardSuit
   || isAnySuitMoreThanTwo(pocket, board) === secondPocketCardSuit))

    return calculateBetForDecision(DECISIONS['checkForFlush'], bank);
  
  if (combination.highestCombination.name === 'three of a kind' && 
     !board.isThreeOfKind())
    
    return calculateBetForDecision(DECISIONS['callForThreeOfKind'], bank);
 
  //
  //
  //
  
  // block of making decisions for absolutely fold
  if (!isAnySuitMoreThanTwo(pocket, board)
   && !findMinGoodSequence(pocket, board, 'forFindingSequence')
   && combination.highestCombination.name === 'kicker') // ???

    return calculateBetForDecision(DECISIONS['fold'], bank);

  if (isAnySuitMoreThanTwo(pocket, board) // if isAnySuitMoreThanTwo and the pocket doesn't include this suit
   && isAnySuitMoreThanTwo(pocket, board) !== firstPocketCardSuit
   && isAnySuitMoreThanTwo(pocket, board) !== secondPocketCardSuit)

    return calculateBetForDecision(DECISIONS['fold'], bank);

  if (findMinGoodSequence(pocket, board, 'forFindingSequence') && 
     !findMinGoodSequence(pocket, board, 'forFindingSequence').includes(firstPocketCardRank) &&
     !findMinGoodSequence(pocket, board, 'forFindingSequence').includes(secondPocketCardRank))

    return calculateBetForDecision(DECISIONS['fold'], bank); 
  
  if (board.isThreeOfKind())
    return calculateBetForDecision(DECISIONS['fold'], bank);
  
  return calculateBetForDecision(DECISIONS['fold'], bank);
};

module.exports = { generateDecision };
