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
  return ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    `${name} [`,
  ].concat(
    list.reduce((output, value, index) => {
      output.push(['object', {object: value}]);
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
      output.push(['object', {object: value}]);
      output.push(', ');
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat('}');
}

function renderInlinePartialList (name, list) {
  return ['span', {style: 'white-space:normal;word-wrap:break-word;'},
    ['span', {}, `${name}[${list.size}]`]
  ];
}

function renderInlinePartialMap (name, map) {
  return renderInlineFullMap(name, map)
    .slice(0, 4 + (MAX_SIZE * 4 - 2))
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
