const Immutable = require('immutable');

module.exports = {
  formatHeaderInFull,
  formatHeaderAsSummary,
  formatHeaderAsTitle,
  formatBody
};

function formatHeaderInFull (obj) {
  const collection = collections.find((collection) => collection.validate(obj))
  return collection.renderInlineFull(collection.name(obj), obj);
}

function formatHeaderAsSummary (obj) {
  const collection = collections.find((collection) => collection.validate(obj))
  return collection.renderInlinePartial(collection.name(obj), obj);
}

function formatHeaderAsTitle (obj) {
  const collection = collections.find((collection) => collection.validate(obj))
  return collection.renderTitle(collection.name(obj), obj);
}

function formatBody (obj) {
  const collection = collections.find((collection) => collection.validate(obj));
  return collection.renderBody(obj);
}

const collections = [
  {
    name: () => 'List',
    validate: Immutable.List.isList,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderTitleList,
    renderTitle: renderTitleList
  },

  {
    name: (record) => record._name || record.constructor.name || 'Record',
    validate: (record) => record instanceof Immutable.Record,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullMap,
    renderInlinePartial: renderTitleMap,
    renderTitle: renderTitleMap
  },

  {
    name: () => 'OrderedMap',
    validate: Immutable.OrderedMap.isOrderedMap,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullMap,
    renderInlinePartial: renderInlinePartialMap,
    renderTitle: renderTitleMap
  },

  {
    name: () => 'Map',
    validate: (obj) => Immutable.Map.isMap(obj),
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullMap,
    renderInlinePartial: renderInlinePartialMap,
    renderTitle: renderTitleMap
  },

  {
    name: () => 'OrderedSet',
    validate: Immutable.OrderedSet.isOrderedSet,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderTitleList,
    renderTitle: renderTitleList
  },

  {
    name: () => 'Set',
    validate: Immutable.Set.isSet,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderTitleList,
    renderTitle: renderTitleList
  },

  {
    name: () => 'Seq',
    validate: Immutable.Seq.isSeq,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderTitleList,
    renderTitle: renderTitleList
  },

  {
    name: () => 'Stack',
    validate: Immutable.Stack.isStack,
    renderBody: renderFullBody,
    renderInlineFull: renderInlineFullList,
    renderInlinePartial: renderTitleList,
    renderTitle: renderTitleList
  }
];

function wrap (obj) {
  return {toJS: true, __IS_NESTED__: true, value: obj};
}

function isImmutableJS (obj) {
  return obj && obj.toJS;
}

function renderInlineFullList (name, list) {
  return ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    `${name} [`,
  ].concat(
    list.reduce((output, value, index) => {
      output.push(['object', {object: isImmutableJS(value) ? wrap(value) : value}]);
      output.push(', ');
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat(']');
}

function renderInlineFullMap (name, map) {
  return ['span', {style: 'font-style:italic;white-space:normal;word-wrap:break-word;'},
    `${name} {`,
  ].concat(
    map.reduce((output, value, key) => {
      output.push(['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, `${key}`])
      output.push(': ');
      output.push(['object', {object: isImmutableJS(value) ? wrap(value) : value}]);
      output.push(', ');
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat('}');
}

function renderTitleList (name, list) {
  return ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, `${name}[${list.size}]`]
  ];
}

function renderTitleMap (name) {
  return ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, `${name}`]
  ];
}

function renderInlinePartialMap (name, map) {
  return renderInlineFullMap(name, map)
    .slice(0, -1)
    .concat([['span', {}, '…'], '}']);
}

function renderFullBody (obj) {
  return obj.reduce((output, value, key) => {
    output.push(['li', {style: 'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-top:2px;position:relative;min-height:inherit;line-height:12px;-webkit-user-select:text;'},
      ['span', {style: 'color:rgb(136, 19, 145);flex-shrink:0;'}, `${key}`],
      ['span', {style: 'flex-shrink:0;'}, ': '],
      ['object', {object: value}]
    ]);
    return output;
  }, ['ol', {style: 'list-style-type:none;padding-left:12px;margin-top:2px;'}]);
}
