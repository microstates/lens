import { type } from 'funcadelic';

export const Context = type(class {
  static get name() {
    return 'Context';
  }

  at(key, parent) {
    if (parent[Context.symbol]) {
      return this(parent).at(key, parent);
    } else {
      return parent[key];
    }
  }
});

export const { at } = Context.prototype;