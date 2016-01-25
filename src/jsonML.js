module.exports = JsonMLElement;

function JsonMLElement (tagName) {
  if (!(this instanceof JsonMLElement)) {
    return new JsonMLElement(tagName);
  }

  this._attributes = {};
  this._jsonML = [tagName, this._attributes];
};

JsonMLElement.prototype.createChild = function (tagName) {
  const el = new JsonMLElement(tagName);
  this._jsonML.push(el.toJsonML());
  return el;
};

JsonMLElement.prototype.addChild = function (child) {
  this._jsonML.push(child);
  return this;
};

JsonMLElement.prototype.createObjectTag = function (object) {
  const tag = this.createChild('object');
  tag.addAttribute('object', object);
  return this;
};

JsonMLElement.prototype.setStyle = function (style) {
  this._attributes.style = style;
  return this;
};

JsonMLElement.prototype.addAttribute = function (key, value) {
  this._attributes[key] = value;
  return this;
};

JsonMLElement.prototype.createTextChild = function (text) {
  this._jsonML.push(text + '');
  return this;
};

JsonMLElement.prototype.toJsonML = function() {
  return this._jsonML;
};
