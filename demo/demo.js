'use strict';

const Immutable = require('immutable');
require('../index.js').install();

document.querySelector('body').innerHTML = '<button>Add Random Item to shopping cart</button>';

let shoppingCart = Immutable.List();

document.querySelector('button').addEventListener('click', (e) => {
  shoppingCart = shoppingCart.push(new Immutable.OrderedMap({price: Math.random() * 10}));
});
