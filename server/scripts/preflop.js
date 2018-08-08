'use strict';

const { Pack, Hand } = require('tx-holdem');

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

const BEST_STARTING_HANDS = ['AA', 'KK', 'QQ', 'JJ', 'AK',
                             'TT', 'AQ', 'AJ', 'AK', 'KQ',
                             'AT', 'KJ', 'AQ', '99', 'QJ',
                             'KT', '88', 'QT', 'A9', 'AJ'];

const generateDecision = (handCards) => {
  let currentHand = new Hand(handCards); // create a true hand object(not an array)

  let firstCardRank = RANKS[currentHand['cards'][0]['rank']]; // rank is an index of card in sorted cards array
  let secondCardRank = RANKS[currentHand['cards'][1]['rank']];

  let rankDifference = Math.abs(RANKS.indexOf(firstCardRank)
                              - RANKS.indexOf(secondCardRank));

  // suit in Hand obj is a number which mean that 20 is clubs suit, 21 is diamonds suit etc
  let firstCardSuit = SUITS[currentHand['cards'][0]['suit'] % 10]; // for find index in suits array we use mod by 10
  let secondCardSuit = SUITS[currentHand['cards'][1]['suit'] % 10];

  // four decisions which we can do: raise, call, check and fold

  // block of making decisions for raise
  if (BEST_STARTING_HANDS.includes(firstCardRank + secondCardRank))
    return 'Preflop - recommend to raise the bet';

  //
  //
  //

  // block of making decisions for call
  if (currentHand.isPair() || (firstCardSuit === secondCardSuit)) // best situations for calling
    return 'Preflop - recommend to call the bet';

  //
  //
  //

  // block of making decisions for checking and fold
  if (rankDifference <= 2)
    return 'Preflop - try to check, if not - recommend to fold';

  if (rankDifference > 2)
    return 'Preflop - recommend to fold';

  //
  //
  //
}

module.exports = { generateDecision };
