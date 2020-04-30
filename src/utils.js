/**
 * @typedef {number|Date|*} Value
 * @typedef {[Value, Value]} Interval
 */

/**
 * @param {Interval} interval
 * @return {Value}
 */
function start (interval) {
  return interval[0]
}

/**
 * @param {Interval} interval
 * @return {Value}
 */
function end (interval) {
  return interval[1]
}

/**
 * @param {Interval} interval
 * @return {boolean}
 */
function valid (interval) {
  return interval.length === 2 && start(interval) < end(interval)
}

/**
 * Sort iList in place using start element of each interval
 * @param {[Interval]} iList
 */
function sortByStart (iList) {
  iList.sort((a, b) => start(a) > start(b) ? 1 : -1)
}

function copyInterval (interval) {
  return [start(interval), end(interval)]
}

/**
 * Merge overlapping intervals
 * @param {Interval} a
 * @param {Interval} b
 * @return {Interval}
 */
function merge (a, b) {
  if (start(a) > start(b)) { // invert if not in start orders
    [a, b] = [b, a]
  }
  if (end(a) > end(b)) {
    return a
  }
  if (end(a) < start(b)) {
    throw new Error(`Can not merge distinct intervals [${a}] & [${b}]`)
  }
  return [start(a), end(b)]
}

/**
 * Split iList at given position, replacing the end and start values around the split by the given startVal & endVal
 * @param {[Interval]} iList
 * @param {Number} index
 * @param {Value} startVal
 * @param {Value|null} endVal
 */
function split (iList, index, startVal, endVal = null) {
  if (endVal == null) endVal = startVal

  /* Checks */
  checkIndexInRange(iList, index)
  const element = iList[index]
  if (start(element) > startVal || end(element) < endVal) {
    throw new Error(`Can not split [${element}] with [${startVal}, ${endVal}]`)
  }

  /* Split */
  iList.splice(index, 0, copyInterval(iList[index]))
  iList[index][1] = startVal
  iList[index + 1][0] = endVal
}

/**
 * Remove element from list
 * @param {[Interval]} iList
 * @param {Number} index
 */
function removeElement (iList, index) {
  checkIndexInRange(iList, index)
  iList.splice(index, 1)
}

/**
 * Throw an error if the index is not in the boundaries of the list iList
 * @param {[Interval]} iList
 * @param {Number} index
 */
function checkIndexInRange (iList, index) {
  if (index < 0 || index >= iList.length) {
    throw new Error(`Can not operate on element ${index} of set of length ${iList.length}`)
  }
}

module.exports = {
  sortByStart,
  merge,
  split,
  removeElement,
  valid
}
