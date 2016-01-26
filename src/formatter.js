const Immutable = require('immutable');
const MAX_SIZE = 100;

module.exports = {formatHeader, formatBody};

function formatHeader (obj) {
  const collection = collections.find((collection) => collection.validate(obj));
  return (obj.size > MAX_SIZE) ?
    collection.renderInlinePartial(collection.name, obj) :
    collection.renderInlineFull(collection.name, obj);
}

function formatBody (obj) {
  const collection = collections.find((collection) => collection.validate(obj));
  return collection.renderBody(obj);
}

const collections = [
  {
    name: 'List',
    validate: Immutable.List.isList,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderInlinePartialList
  },

  {
    name: 'Record',
    validate: (record) => false,
    renderBody: () => {},
    renderInlineFull: () => {},
    renderInlinePartial: () => {}
  },

  {
    name: 'OrderedMap',
    validate: Immutable.OrderedMap.isOrderedMap,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullMap,
    renderInlinePartial: renderInlinePartialMap
  },

  {
    name: 'Map',
    validate: (obj) => Immutable.Map.isMap(obj),
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullMap,
    renderInlinePartial: renderInlinePartialMap
  },

  {
    name: 'OrderedSet',
    validate: Immutable.OrderedSet.isOrderedSet,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderInlinePartialList
  },

  {
    name: 'Set',
    validate: Immutable.Set.isSet,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderInlinePartialList
  },

  {
    name: 'Seq',
    validate: Immutable.Seq.isSeq,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderInlinePartialList
  },

  {
    name: 'Stack',
    validate: Immutable.Stack.isStack,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderInlinePartialList
  }
];

function renderInlineFullList (name, list) {
  return ['span', {class: 'object-value-array source-code'},
    `${name}`,
    '['
  ].concat(
    list.reduce((output, value, index) => {
      output.push(['object', {object: value}]);
      output.push(',');
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat(']');
}

function renderInlineFullMap (name, map) {
  return ['span', {class: 'object-value-object source-code'},
    ['span', {class: 'console-object-preview'},
      `${name}`,
      '{',
    ].concat(
      map.reduce((output, value, key) => {
        output.push(['span', {class: 'name'}, `${key}`])
        output.push(': ');
        output.push(['object', {object: value}]);
        output.push(', ');
        return output;
      }, [])
      .slice(0, -1)
    )
    .concat('}')
  ];
}

function renderInlinePartialList (name, list) {
  return ['span', {class: 'object-value-array source-code'},
    ['span', {}, `${name}[${list.size}]`]
  ];
}

function renderInlinePartialMap (name, map) {
  return ['span', {class: 'object-value-object source-code'},
    renderInlineFullMap(name, map)[2]
      .slice(0, 4 + (MAX_SIZE * 4 - 1))
      .concat([['span', {}, '...'], '}'])
  ]
}

function renderFullBody (obj) {
  return obj.reduce((output, value, key) => {
    output.push(['li', {},
      ['span', {class: 'name'}, `${key}`],
      ['span', {class: 'object-properties-section-separator'}, ':'],
      ['object', {object: value}]
    ]);
    return output;
  }, ['ol', {class: 'tree-outline source-code object-properties-section'}]);
}
