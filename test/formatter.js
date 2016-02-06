const test = require('tape');
const Immutable = require('immutable');
const formatHeaderInFull = require('../src/formatter').formatHeaderInFull;
const formatHeaderAsSummary = require('../src/formatter').formatHeaderAsSummary;
const formatHeaderAsTitle = require('../src/formatter').formatHeaderAsTitle;
const formatBody = require('../src/formatter').formatBody;

//
// is structured nested within another structure?
// - YES
//    --> it's MAP-like
//      --> render minimal header `Map`
//      --> render normal body
//    --> it's LIST-like
//      --> render minimal header `List[101]`
//      --> render normal body

// - NO
//   is structure less than 100 items?
//   - YES
//      --> it's MAP-like
//        --> render header as body inlined `Map {a:1}`
//        --> render no body
//      --> it's LIST-like
//        --> render header as body inlined `List [1, 2, 3]`
//        --> render no body
//   - NO
//      --> it's MAP-like
//        --> render header as full body inlined and truncated `Map {a:1, ...}`
//        --> render full body
//      --> it's LIST-like
//        --> render only minimal header `List[100]`
//        --> render full body

test('should wrap a nested structure in a summary within a map', (t) => {
  const map = Immutable.Map({a: 1});
  const header = ['span', {style: 'font-style:italic;white-space:normal;word-wrap:break-word;'},
    'OrderedMap {',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'a'],
    ': ',
    ['object', {object: 1}],
    ', ',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'b'],
    ': ',
    ['object', {object: {toJS: true, __IS_NESTED__: true, value: map}}],
    ['span', {}, '…'],
    '}'
  ];
  t.deepEqual(formatHeaderAsSummary(Immutable.OrderedMap({a: 1, b: map})), header);
  t.end();
});

test('should wrap a nested structure within a map', (t) => {
  const map = Immutable.Map({a: 1});
  const header = ['span', {style: 'font-style:italic;white-space:normal;word-wrap:break-word;'},
    'OrderedMap {',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'a'],
    ': ',
    ['object', {object: 1}],
    ', ',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'b'],
    ': ',
    ['object', {object: {toJS: true, __IS_NESTED__: true, value: map}}],
    '}'
  ];
  t.deepEqual(formatHeaderInFull(Immutable.OrderedMap({a: 1, b: map})), header);
  t.end();
});

test('should wrap a nested structure within a List', (t) => {
  const map = Immutable.Map({a: 1});
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    'List [',
    ['object', {object: {toJS: true, __IS_NESTED__: true, value: map}}],
    ', ',
    ['object', {object: 2}],
    ', ',
    ['object', {object: 3}],
    ']',
  ];
  t.deepEqual(formatHeaderInFull(Immutable.List.of(map, 2, 3)), header);
  t.end();
});

test('should return a full header for a List', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    'List [',
    ['object', {object: 1}],
    ', ',
    ['object', {object: 2}],
    ', ',
    ['object', {object: 3}],
    ']',
  ];
  t.deepEqual(formatHeaderInFull(Immutable.List.of(1, 2, 3)), header);
  t.end();
});

test('should return a summary header for a List', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, 'List[109]']
  ];
  t.deepEqual(formatHeaderAsSummary(Immutable.Range(1, 110).toList()), header);
  t.end();
});

test('should return a full header for an OrderedMap', (t) => {
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
  t.deepEqual(formatHeaderInFull(Immutable.OrderedMap({a: 1, b: 2})), header);
  t.end();
});

test('should return a summary header for an OrderedMap', (t) => {
    const header = ['span', {style: 'font-style:italic;white-space:normal;word-wrap:break-word;'},
    'OrderedMap {',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'a'],
    ': ',
    ['object', {object: 1}],
    ', ',
    ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, 'b'],
    ': ',
    ['object', {object: 2}],
    ['span', {}, '…'],
    '}'
  ];
  t.deepEqual(formatHeaderAsSummary(Immutable.OrderedMap({a: 1, b: 2})), header);
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

test('should render a title for a List', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, 'List[109]']
  ];
  t.deepEqual(formatHeaderAsTitle(Immutable.Range(1, 110).toList()), header);
  t.end();
});

test('should render a title for an OrderedMap', (t) => {
  const header = ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, 'OrderedMap']
  ];
  t.deepEqual(formatHeaderAsTitle(Immutable.Range(1, 110).toOrderedMap()), header);
  t.end();
});
