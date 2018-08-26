'use strict';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const BEST_STARTING_HANDS = ['AA', 'KK', 'QQ', 'JJ', 'AK',
                             '1010', 'AQ', 'AJ', 'AK', 'KQ',
                             'A10', 'KJ', 'AQ', '99', 'QJ',
                             'K10', '88', 'Q10', 'A9', 'AJ'];

const DECISIONS = {
  raise: 'Сейчас стоит повысить ставку',
  call: 'Рекомендуем уравнять ставку',
  check: 'Сейчас стоит сделать чек, если же не получится - лучше скинуть карты',
  fold: 'Рекомендуем скинуть карты'
};

const calculateBet = {
  
};

const generateDecision = (currentPocket, bank) => {
  const firstCardRank = RANKS[currentPocket['cards'][0]['rank']]; // rank is an index of card in sorted cards array
  const secondCardRank = RANKS[currentPocket['cards'][1]['rank']];

  const rankDifference = Math.abs(RANKS.indexOf(firstCardRank) // order of distance between ranks of cards
                                - RANKS.indexOf(secondCardRank));

  // suit in Hand obj is a number which mean that 20 is clubs suit, 21 is diamonds suit etc
  const firstCardSuit = SUITS[currentPocket['cards'][0]['suit'] % 10]; // for find index in suits array we use mod by 10
  const secondCardSuit = SUITS[currentPocket['cards'][1]['suit'] % 10];

  // four decisions which we can do: raise, call, check and fold

  // block of making decisions for raise
  if (BEST_STARTING_HANDS.includes(firstCardRank + secondCardRank)
   || BEST_STARTING_HANDS.includes(secondCardRank + firstCardRank))
    return DECISIONS['raise'];

  //
  //
  //

  // block of making decisions for call
  if (currentPocket.isPair() || (firstCardSuit === secondCardSuit)) // best situations for calling
    return DECISIONS['call'];

  if (rankDifference > 2 && 
     (RANKS.indexOf(firstCardRank) > 8 ||
      RANKS.indexOf(secondCardRank) > 8))
    return DECISIONS['call'];
  
  //
  //
  //

  // block of making decisions for checking and fold
  if (rankDifference <= 2)
    return DECISIONS['check'];

  if (rankDifference > 2)
    return DECISIONS['fold'];

  //
  //
  //
};

module.exports = { generateDecision };
