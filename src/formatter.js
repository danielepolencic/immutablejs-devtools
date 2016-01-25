const Immutable = require('immutable');
const MAX_SIZE = 100;

module.exports = {formatHeader, formatBody};

function formatHeader (obj) {
  const collection = collections.find((collection) => collection.validate(obj));
  return ['span', {}, collection.name].concat(
    (obj.size > MAX_SIZE) ?
      collection.renderInlinePartial(obj) : collection.renderInlineFull(obj)
  );
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

function renderInlineFullList (list) {
  return [['span', {}, '[']].concat(
    list.reduce((output, value, index) => {
      output.push(['object', {object: value}]);
      output.push(['span', {}, ',']);
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat([['span', {}, ']']]);
}

function renderInlineFullMap (map) {
  return [['span', {}, '{']].concat(
    map.reduce((output, value, key) => {
      output.push(['span', {},
        ['span', {}, `${key}:`],
        ['object', {object: value}]
      ]);
      output.push(['span', {}, ',']);
      return output;
    }, [])
    .slice(0, -1)
  )
  .concat([['span', {}, '}']]);
}

function renderInlinePartialList (list) {
  return [['span', {}, `[${list.size}]`]];
}

function renderInlinePartialMap (map) {
  return renderInlineFullMap(map)
    .slice(0, (MAX_SIZE - 1) * 2)
    .concat([['span', {}, '...'], ['span', {}, '}']]);
}

function renderFullBody (obj) {
  return obj.reduce((output, value, key) => {
    output.push(['li', {},
      ['span', {},
        ['span', {}, `${key}:`],
        ['object', {object: value}]
      ]
    ]);
    return output;
  }, ['ol', {}]);
}
