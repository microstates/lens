import { type } from 'funcadelic';

export const Record = type(class {
  static get name() {
    return 'Record';
  }

  childAt(key, parent) {
    if (parent[Record.symbol]) {
      return this(parent).childAt(key, parent);
    } else {
      return parent[key];
    }
  }
});

export const { childAt } = Record.prototype;
