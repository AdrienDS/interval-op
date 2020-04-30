# interval-op

0-dependencies library implemeting basic operations on discrete intervals where boundary conditions
 reflect the intuitive expectations when dealing with availabilities.

```
// Union behaves like with closed intervals
[9 .. 12] U [12 .. 17] = [9 .. 17]

// Substraction behaves like with open intervals
[9 .. 17] - [15 .. 17] = [9 .. 15]
```
### Install

`npm install interval-op`

### Usage
- **Intervals** are represented as arrays of length 2 
   - `[start, end]`
- The functions manipulate **sets of intervals** which are represented as arrays of intervals:
   - `[ [start1, end1], [start2, end2], ... ]`
   
Examples:
```js
const { union, subtract } = require('interval-op')
console.log( union([ [9, 12], [12, 17] ]) )          // => [[9, 17]]
console.log( subtract([ [9, 17] ], [ [15, 17] ]) )   // => [[9, 15]]
```

More examples can be found in [test/test.js](./test/test.js)


### Assumptions

The library assumes that the elements used as interval boundaries 
 all have an order relation and can be compared with the relational 
 operators  `>`, `<`, `>=` and `<=`.
 
For example, it can be used with **numbers** or **dates**.

To use it with a more complex object, you can read about
 [Abstract Relational Comparison](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-abstract-relational-comparison)
 and [Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

See [test/ComplexWithRelation.js](./test/ComplexWithRelation.js) for an example of 
  custom class implementing `Symbol.toPrimitive`
 

### Development

- Install dev dependencies with `npm install` 
    *the library has no production dependencies, but uses [standardJS](https://standardjs.com/) 
    for linting/formatting*
- Run the test suite `npm run test`
- Run the linter with `npx standard --fix`
