'use strict';

const { Pack, Hand } = require('tx-holdem');

const generateDecision = (handCards) => {
  const bestStartingHands = ['AA', 'KK', 'QQ', 'JJ',
                             'AK', 'TT', 'AQ', 'AJ',
                             'AK', 'KQ', 'AT', 'KJ',
                             'AQ', '99', 'QJ', 'KT',
                             '88', 'QT', 'A9', 'AJ'];
  console.log(handCards[0]);
}


module.exports = { generateDecision };
