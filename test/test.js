const assert = require('assert')
const { union, subtract } = require('..')
const ComplexWithRelation = require('./ComplexWithRelation')

function arraysEqual (a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (Array.isArray(a[i])) {
      if (!Array.isArray(b[i]) || !arraysEqual(a[i], b[i])) {
        return false
      }
    } else if (a[i] instanceof Date) {
      if (!(b[i] instanceof Date) || a[i].getTime() !== b[i].getTime()) {
        return false
      }
    } else if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

function assertArrayEql (a, b, msg) {
  try {
    assert(arraysEqual(a, b))
  } catch (e) {
    console.error(`${msg}: ${a} != ${b}`)
    throw e
  }
}

function stringifyComplexIntervalSet (s) {
  return s.map(i => `[${i.join(' .. ')}]`).join(' ')
}

function testUnionOfComplexes () {
  const a = [new ComplexWithRelation(2, 1), new ComplexWithRelation(3, 4)]
  const b = [new ComplexWithRelation(3, 3), new ComplexWithRelation(4, 4)]

  const u = union([a, b])
  const expected = [[a[0], b[1]]]

  const sRes = stringifyComplexIntervalSet(u)
  const sExp = stringifyComplexIntervalSet(expected)
  try {
    assert(sRes === sExp, 'Union of complex objects ordered by modulus')
  } catch (e) {
    console.error(`Failed on complex objects ${sRes} !== ${sExp}`)
    throw e
  }
}

function testUnion () {
  assertArrayEql(union([[9, 12], [12, 17]]), [[9, 17]], 'Basic union on integers')
  assertArrayEql(union([[9.1, 12.2], [12.2, 17.3]]), [[9.1, 17.3]], 'Basic union on float')
  assertArrayEql(
    union([
      [new Date('2042-04-02T09:00:00.000Z'), new Date('2042-04-02T12:00:00.000Z')],
      [new Date('2042-04-02T12:00:00.000Z'), new Date('2042-04-02T17:00:00.000Z')]
    ]),
    [[new Date('2042-04-02T09:00:00.000Z'), new Date('2042-04-02T17:00:00.000Z')]],
    'Basic union on dates'
  )
  testUnionOfComplexes()

  assertArrayEql(union([[9, 11], [11, 13], [13, 17]]), [[9, 17]], 'Basic union on 3 intervals')

  assertArrayEql(union([[9, 12], [13, 17]]), [[9, 12], [13, 17]], 'Union of disjoint intervals')

  assertArrayEql(union([[9, 12], [11, 17]]), [[9, 17]], 'Union of overlapping intervals')

  assertArrayEql(union([[9, 17], [11, 13]]), [[9, 17]], 'Union of fully included intervals')
  assertArrayEql(union([[9, 17], [9, 13]]), [[9, 17]], 'Union of included intervals sharing the start')
  assertArrayEql(union([[9, 17], [11, 17]]), [[9, 17]], 'Union of included intervals sharing the end')
}

function testSubtract () {
  assertArrayEql(subtract([[9, 17]], []), [[9, 17]], 'Subtract empty set')

  assertArrayEql(subtract([[9, 17]], [[15, 17]]), [[9, 15]], 'Basic subtraction sharing end')
  assertArrayEql(subtract([[9, 17]], [[9, 11]]), [[11, 17]], 'Basic subtraction sharing start')

  assertArrayEql(subtract([[9, 17]], [[11, 13]]), [[9, 11], [13, 17]], 'Splitting subtraction')
  assertArrayEql(subtract([[9, 12]], [[13, 17]]), [[9, 12]], 'Subtraction of disjoint intervals')

  assertArrayEql(subtract([[9, 13]], [[12, 17]]), [[9, 12]], 'Subtraction of overlapping intervals (over the end)')
  assertArrayEql(subtract([[12, 17]], [[9, 13]]), [[13, 17]], 'Subtraction of overlapping intervals (over the start)')

  assertArrayEql(subtract([[9, 12], [13, 17]], [[11, 14]]), [[9, 11], [14, 17]], 'Subtraction overlapping 2 intervals')
  assertArrayEql(subtract([[9, 11], [12, 13], [14, 17]], [[10, 15]]), [[9, 10], [15, 17]], 'Subtraction overlapping 3 intervals')
}

testUnion()
testSubtract()
