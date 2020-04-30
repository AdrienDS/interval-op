class ComplexWithRelation {
  constructor (r, i) {
    this.r = r
    this.i = i
  }

  modulus () {
    return Math.sqrt(this.r * this.r + this.i * this.i)
  }

  // showModulus () {
  //   return `|${this}| = ${this.modulus()}`
  // }

  [Symbol.toPrimitive] (hint) {
    if (hint === 'number') {
      return this.modulus()
    } else if (hint === 'string') {
      return this.toString()
    }
    return null
  }

  toString () {
    return `${this.r} + ${this.i}i`
  }
}

module.exports = ComplexWithRelation
