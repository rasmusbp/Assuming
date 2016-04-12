# Assuming

* Author: Rasmus Bangsted Pedersen (c) 2016
* License: ISC

## About
A small, simple, but powerful ~0.5K utility method for chaining if and switch statements

I've always seen the following as a bit of a syntactical anti-pattern:
```js
var myValue;

if ( somethingIsTrue ) {
   myValue = 'it was true';
} else {
   myValue = 'it was false';
}

doSomething(myValue);

// or

if ( somethingIsTrue ) {
   doSomething('it was true');
} else {
   doSomething('it was false');
}
```
The specific examples above could of course be boiled down to a few line using the ternary operator, but imagine more elaborate if/else
blocks. Things can quickly become error prone. Even if the blocks has test coverage, I still find it a syntactical anti-pattern due
to repetitions and bad readability (in more complex blocks obviously). Same goes for switch/case blocks.

I've found my self trying to abstract this away on every single project I've worked on, so I decided to write a simple module that solve this *(for me)*,
once for all - and perhaps others will find it useful as well.

The idea is that if/else/switch/case block gets *(where ever it makes sense)* replaced by method chains.
The chain abstracts the condition checks away.
Invoking `value()` at the end of the chain will return the resolved value of the chain.

Consider the below example:
```js
const myValue = asumming( somethingIsTrue )
                .then('it was true')
                .otherwise('it was false')
                .value();

doSomething(myValue);
```

This example will have the exact same output as the one with the if/else blocks. Only difference being that we do not create
a "placeholder" variable and we keep the amounts of repetitions to zero.
The `assuming`, `then` and `otherwise` methods can also take a function as an argument.

**Disclaimer:** Assuming is written as an ES6 module and is expected to be processed as a module.

```js
// CommonJS (Node)
var assuming = require('assuming');

// ES6 (i.e. via a module loader)
import assuming from 'assuming';
```

## Examples

####Simple if statements
Simple example of a chain replacing a simple if statement:
```js
const value = 1;
const result = asumming( value === 1 ).then('is one').value();

console.log(result); // -> 'is one'
```

All methods supports functions as arguments.
The return value of each function is either evaluated as the condition or the return value.
```js
const value = 1;
const result = asumming(() => value === 1).then(() => 'return value from method').value();

console.log(result); // -> 'return value from method'
```

If chained to a `then` method the `otherwise` method will act like the "else" block:
```js
const value = 1;
const result = asumming(value !== 1)
        .then('is one')
        .otherwise('is NOT one').value();

console.log(result); // -> 'is NOT one'
```

####And / or operators
Instead of using the `&&` or `||` operators inline in the `assuming` method, you can chain `and` and `or` methods instead:
```js
const value = 1;
const anotherValue = 2;
const result = asumming(value === 1)
        .and(anotherValue === 2)
        .then('both are ok')
        .otherwise('nope')
        .value();

console.log(result); // -> 'both are ok'

// .. or

const value = 1;
const anotherValue = 2;
const result = asumming(value === 42)
        .or(anotherValue === 2)
        .then('either is ok')
        .otherwise('nope')
        .value();

console.log(result); // -> 'either is ok'
```

The `and` and `or` methods can of course be chained as pleased:
```js
const value = 1;
const anotherValue = 2;
const allIsOk = true;
const result = asumming(value === 42)
        .and(anotherValue === 2)
        .or(allIsOk)
        .then('it is ok')
        .otherwise('nope')
        .value();

console.log(result); // -> 'it is ok'
```
####Else / if
Chaining another `assuming` method acts like the "else if" block:
```js
const value = 3;
const result = asumming(value === 1)
        .then('is one')
        .assuming(value === 2)
        .then('is two')
        .assuming(value === 3)
        .then('is three')
        .otherwise('is none of the above').value();

console.log(result); // -> 'is three'
```
####Switch statements
An alternative approach to the above is to use the `matches` method. The idea of the method
is to replace a switch/case block. By using this approach you get rid of all the `assuming(x === y).then(z)` chains,
and keep the condition checks and assignments in one method.
In these chains the `otherwise` method acts like the "default" block.

Note that the `assuming` method only gets passed `value` and not a condition:
```js
const value = 2;
const result = assuming(value)
        .matches(0, 'is zero')
        .matches(1, 'is one')
        .matches(2, 'is two')
        .matches(3, 'is three')
        .otherwise('is none of the above').value();

console.log(result); // -> 'is two'
```
####Functional patterns
Simple example of how Assuming can be leveraged in a functional design pattern:
```js
const value = 1;
const onlyIfTrue = _.curry((fn, condition) => assuming(condition).then(fn) );
const logIfTrue = onlyIfTrue(() => console.log('it was true!'));

logIfTrue(value === 1); // -> 'is was true'

// .. in a checkout flow
const ifTrue = _.curry((condition, fn) => assuming(condition).then(fn) );
const ifCreditCardIsValid = ifTrue(isCreditCardValid.bind(null, creditCardInfo));

ifCreditCardIsValid(processOrder).otherwise(denyOrder);

```
Below is an example of how utilizing the `and` method to can create a permission layer to any function in an application:
```js
// in an abstracted authentication module
const ifAuthenticatedAnd = _.curry((condition, fn) => assuming(condition).and(isAuthenticated).then(fn));
const ifAuthenticatedAndAdmin = ifAuthenticatedAndAdmin(isAdmin);

// in "Orders" model
const getAllOrders = () => ifAuthenticatedAndAdmin(/* impl. of `getAllOrders` */).otherwise(denyAccess).value();

// in app logic
const orders = getAllOrders();

```

## Contribute
Contributions are welcome. 
Here's what you need to know to get started:

**Run tests:** `npm run test`

**Run tests with a watcher:** `npm run testDev`

**Build:** `npm run build`
