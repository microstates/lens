import { type } from 'funcadelic';

export const Context = type(class {
  static get name() {
    return 'Context';
  }

  childAt(key, parent) {
    if (parent[Context.symbol]) {
      return this(parent).childAt(key, parent);
    } else {
      return parent[key];
    }
  }
});

export const { childAt } = Context.prototype;
