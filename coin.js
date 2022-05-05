/** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

function coinFlip() {
  const sides = ["heads", "tails"]
  return sides[Math.floor(Math.random()*sides.length)];
}

/** Multiple coin flips
 * 
 * Write a function that accepts one parameter (number of flips) and returns an array of 
 * resulting "heads" or "tails".
 * 
 * @param {number} flips 
 * @returns {string[]} results
 * 
 * example: coinFlips(10)
 * returns:
 *  [
      'heads', 'heads',
      'heads', 'tails',
      'heads', 'tails',
      'tails', 'heads',
      'tails', 'heads'
    ]
 */

function coinFlips(flips) {
  let answer = Array(flips); 
  for (let i=0; i < flips; i++) {
    answer[i] = coinFlip(); 
  }
  return answer; 
}

/** Count multiple flips
 * 
 * Write a function that accepts an array consisting of "heads" or "tails" 
 * (e.g. the results of your `coinFlips()` function) and counts each, returning 
 * an object containing the number of each.
 * 
 * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
 * { tails: 5, heads: 5 }
 * 
 * @param {string[]} array 
 * @returns {{ heads: number, tails: number }}
 */

function countFlips(array) {
  let h = 0; 
  let t = 0; 
  for (let i = 0; i< array.length; i++) {
    h+=array[i] == 'heads' ? 1:0; 
    t+=array[i] == 'heads' ? 0:1; 
  }
  if (t == 0) {
    return {"heads": h}; 
  }
  if (h == 0) {
    return {"tails": t}; 
  }

  return {"tails": t, "heads": h}; 
}

/** Flip a coin!
 * 
 * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
 * 
 * @param {string} call 
 * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
 * 
 * example: flipACoin('tails')
 * returns: { call: 'tails', flip: 'heads', result: 'lose' }
 */
 function flipACoin(call) {
  const flip = coinFlip();
  return { call, flip, result: flip == call ? 'win':'lose' }; 
}

// Helper Functions
function flipAgainstSide(side) {
  return flipACoin(side);
}

function flipOneCoin() {
  return {"flip" : coinFlip()}
}

function manyflips(flips) {
  const flipArray = coinFlips(flips); 
  return {"raw":flipArray, "summary":countFlips(flipArray)}
}

exports.flipAgainstSide = flipAgainstSide; 
exports.flipOneCoin = flipOneCoin; 
exports.manyflips = manyflips; 