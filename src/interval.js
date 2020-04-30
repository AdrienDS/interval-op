const { sortByStart, merge, split, removeElement, valid } = require('./utils')

/**
 * @param {[Interval]} iList
 * @return {[Interval]} Start-ordered union of all intervals of iList
 */
function union (iList) {
  if (iList.length <= 1) return iList
  sortByStart(iList)
  const ret = []
  for (const interval of iList) {
    if (!valid(interval)) continue
    try {
      ret[ret.length - 1] = merge(ret[ret.length - 1], interval)
    } catch (e) {
      ret.push(interval)
    }
  }
  return ret
}

/**
 * @param {[Interval]} iListA
 * @param {[Interval]} iListB
 * @return {[Interval]} Start-ordered union of all intervals of iListA - intervals of iListB
 */
function subtract (iListA, iListB) {
  const setA = union(iListA)
  const setB = union(iListB)

  let iB = 0
  for (let iA = 0; iA < setA.length; iA++) {
    const [startA, endA] = setA[iA]
    for (; iB < setB.length; iB++) {
      const [startB, endB] = setB[iB]
      if (startA >= endB) continue //       (B) [A]        : continue to next element of setB
      if (endB < endA) {
        if (startA > startB) {
          setA[iA][0] = endB //             (B [ ) A]      : startA <- endB
        } else {
          split(setA, iA, startB, endB) //  [ (B)  A]      : split [A(, )A']
          iA++
        }
      } else {
        if (startB < startA) {
          removeElement(setA, iA) //        (B [ A ] )     : remove A from setA
          iA--
        } else if (startB < endA) {
          setA[iA][1] = startB //           [A  (B ] )     : endA <- startB
        } //                          Else: [A] (B)        : Just ignore
        break
      }
    }
  }
  return setA
}

module.exports = {
  union,
  subtract
}
