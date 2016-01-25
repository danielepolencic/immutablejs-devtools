const test = require('tape');
const Immutable = require('immutable');
const formatHeader = require('../src/formatter').formatHeader;
const formatBody = require('../src/formatter').formatBody;

test('should return a valid header for a List with less than 100 items', (t) => {
  const header = ['span', {}, 'List',
    ['span', {}, '['],
    ['object', {object: 1}],
    ['span', {}, ','],
    ['object', {object: 2}],
    ['span', {}, ','],
    ['object', {object: 3}],
    ['span', {}, ']'],
  ];
  t.deepEqual(formatHeader(Immutable.List.of(1, 2, 3)), header);
  t.end();
});

test('should return a valid header for a List with more than 100 items', (t) => {
  const header = ['span', {}, 'List', ['span', {}, '[109]']];
  t.deepEqual(formatHeader(Immutable.Range(1, 110).toList()), header);
  t.end();
});

test('should return a valid header for an OrderedMap with less than 100 items', (t) => {
  const header = ['span', {}, 'OrderedMap',
    ['span', {}, '{'],
    ['span', {},
      ['span', {}, 'a:'],
      ['object', {object: 1}]
    ],
    ['span', {}, ','],
    ['span', {},
      ['span', {}, 'b:'],
      ['object', {object: 2}]
    ],
    ['span', {}, '}']
  ];
  t.deepEqual(formatHeader(Immutable.OrderedMap({a: 1, b: 2})), header);
  t.end();
});

test('should return a valid header for an OrderedMap with more than 100 items', (t) => {
  const header = ['span', {}, 'OrderedMap', ['span', {}, '{']].concat(
    new Array(111).join(',').split(',').reduce((body, _, index) => {
      body.push(['span', {},
        ['span', {}, `${index}:`],
        ['object', {object: index}]
      ]);
      body.push(['span', {}, ',']);
      return body;
    }, []).slice(0, (99 * 2) - 1)
  ).concat([['span', {}, '...']]).concat([['span', {}, '}']]);

  t.deepEqual(formatHeader(Immutable.Range(0, 110).toOrderedMap()), header);
  t.end();
});

test('should return a valid body for List', (t) => {
  const body = ['ol', {},
    ['li', {}, ['span', {}, ['span', {}, '0:'], ['object', {object: 1}]]],
    ['li', {}, ['span', {}, ['span', {}, '1:'], ['object', {object: 2}]]],
    ['li', {}, ['span', {}, ['span', {}, '2:'], ['object', {object: 3}]]]
  ];

  t.deepEqual(formatBody(Immutable.Range(1, 4).toList()), body);
  t.end();
});

test('should return a valid body for an OrderedMap', (t) => {
  const body = ['ol', {},
    ['li', {}, ['span', {}, ['span', {}, 'a:'], ['object', {object: 1}]]],
    ['li', {}, ['span', {}, ['span', {}, 'b:'], ['object', {object: 2}]]]
  ];

  t.deepEqual(formatBody(Immutable.OrderedMap({a: 1, b: 2})), body);
  t.end();
});
