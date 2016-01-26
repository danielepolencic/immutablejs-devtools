const test = require('tape');
const Immutable = require('immutable');
const formatHeader = require('../src/formatter').formatHeader;
const formatBody = require('../src/formatter').formatBody;

test('should return a valid header for a List with less than 100 items', (t) => {
  const header = ['span', {class: 'object-value-array source-code'},
    'List',
    '[',
    ['object', {object: 1}],
    ',',
    ['object', {object: 2}],
    ',',
    ['object', {object: 3}],
    ']',
  ];
  t.deepEqual(formatHeader(Immutable.List.of(1, 2, 3)), header);
  t.end();
});

test('should return a valid header for a List with more than 100 items', (t) => {
  const header = ['span', {class: 'object-value-array source-code'},
    ['span', {}, 'List[109]']
  ];
  t.deepEqual(formatHeader(Immutable.Range(1, 110).toList()), header);
  t.end();
});

test('should return a valid header for an OrderedMap with less than 100 items', (t) => {
  const header = ['span', {class: 'object-value-object source-code'},
    ['span', {class: 'console-object-preview'},
      'OrderedMap',
      '{',
      ['span', {class: 'name'}, 'a'],
      ': ',
      ['object', {object: 1}],
      ', ',
      ['span', {class: 'name'}, 'b'],
      ': ',
      ['object', {object: 2}],
      '}'
    ]
  ];
  t.deepEqual(formatHeader(Immutable.OrderedMap({a: 1, b: 2})), header);
  t.end();
});

test('should return a valid header for an OrderedMap with more than 100 items', (t) => {
  const header = ['span', {class: 'object-value-object source-code'},
    ['span', {class: 'console-object-preview'},
      'OrderedMap',
      '{',
    ].concat(
        new Array(111).join(',').split(',').reduce((body, _, index) => {
          body.push(['span', {class: 'name'}, `${index}`])
          body.push(': ');
          body.push(['object', {object: index}]);
          body.push(', ');
          return body;
        }, [])
      )
      .slice(0, 4 + (100 * 4) - 1)
      .concat([['span', {}, '...'], '}'])
    ];

  t.deepEqual(formatHeader(Immutable.Range(0, 110).toOrderedMap()), header);
  t.end();
});

test('should return a valid body for List', (t) => {
  const body = ['ol', {class: 'tree-outline source-code object-properties-section'},
    ['li', {},
      ['span', {class: 'name'}, '0'],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: 1}]
    ],
    ['li', {},
      ['span', {class: 'name'}, '1'],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: 2}]
    ],
    ['li', {},
      ['span', {class: 'name'}, '2'],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: 3}]
    ]
  ];

  t.deepEqual(formatBody(Immutable.Range(1, 4).toList()), body);
  t.end();
});

test('should return a valid body for an OrderedMap', (t) => {
  const body = ['ol', {class: 'tree-outline source-code object-properties-section'},
    ['li', {},
      ['span', {class: 'name'}, 'a'],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: 1}]
    ],
    ['li', {},
      ['span', {class: 'name'}, 'b'],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: 2}]
    ]
  ];

  t.deepEqual(formatBody(Immutable.OrderedMap({a: 1, b: 2})), body);
  t.end();
});
