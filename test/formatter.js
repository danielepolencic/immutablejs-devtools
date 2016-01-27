const test = require('tape');
const Immutable = require('immutable');
const formatHeader = require('../src/formatter').formatHeader;
const formatBody = require('../src/formatter').formatBody;

test('should return a valid header for a List with less than 100 items', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    'List [',
    ['object', {object: 1}],
    ', ',
    ['object', {object: 2}],
    ', ',
    ['object', {object: 3}],
    ']',
  ];
  t.deepEqual(formatHeader(Immutable.List.of(1, 2, 3)), header);
  t.end();
});

test('should return a valid header for a List with more than 100 items', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, 'List[109]']
  ];
  t.deepEqual(formatHeader(Immutable.Range(1, 110).toList()), header);
  t.end();
});

test('should return a valid header for an OrderedMap with less than 100 items', (t) => {
  const header = ['span', {style: 'font-style:italic;white-space:normal;word-wrap:break-word;'},
    'OrderedMap {',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'a'],
    ': ',
    ['object', {object: 1}],
    ', ',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'b'],
    ': ',
    ['object', {object: 2}],
    '}'
  ];
  t.deepEqual(formatHeader(Immutable.OrderedMap({a: 1, b: 2})), header);
  t.end();
});

test('should return a valid header for an OrderedMap with more than 100 items', (t) => {
  const header = ['span', {style:'font-style:italic;white-space:normal;word-wrap:break-word;'},
      'OrderedMap {',
    ].concat(
        new Array(111).join(',').split(',').reduce((body, _, index) => {
          body.push(['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, `${index}`])
          body.push(': ');
          body.push(['object', {object: index}]);
          body.push(', ');
          return body;
        }, [])
      )
      .slice(0, 4 + (100 * 4) - 2)
      .concat([['span', {}, '…'], '}']);

  t.deepEqual(formatHeader(Immutable.Range(0, 110).toOrderedMap()), header);
  t.end();
});

test('should return a valid body for List', (t) => {
  const body = ['ol', {style: 'list-style-type:none;padding-left:12px;margin-top:2px;'},
    ['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, '0'],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: 1}]
    ],
    ['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, '1'],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: 2}]
    ],
    ['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, '2'],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: 3}]
    ],
  ];

  t.deepEqual(formatBody(Immutable.Range(1, 4).toList()), body);
  t.end();
});

test('should return a valid body for an OrderedMap', (t) => {
  const body = ['ol', {style: 'list-style-type:none;padding-left:12px;margin-top:2px;'},
    ['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'a'],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: 1}]
    ],
    ['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'b'],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: 2}]
    ]
  ];

  t.deepEqual(formatBody(Immutable.OrderedMap({a: 1, b: 2})), body);
  t.end();
});
