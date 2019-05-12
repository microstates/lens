# @microstates/lens

Lenses are a mechanism for getting and setting values of a property in an object. The object can be an array, a POJO or an instance of a class. Microstates' lenses are analogous to [Ramda Lens](https://ramdajs.com/docs/#lens) with the added ability to specify lens implementation based for all instances of a class.

- [@microstates/lens](#microstateslens)
  - [Constructors](#constructors)
    - [At(propertyName: string | number, container: any): Lens](#atpropertyname-string--number-container-any-lens)
    - [Path(propertyNames: Array<string | number>): Lens](#pathpropertynames-arraystring--number-lens)
    - [Lens(get: (context: any) => any, set: (value: any, context: any) => any): Lens](#lensget-context-any--any-set-value-any-context-any--any-lens)
    - [compose(lensA, lensB): Lens](#composelensa-lensb-lens)
    - [transparent(): Lens](#transparent-lens)
  - [Operations](#operations)
    - [view(lens: Lens, data: any): any](#viewlens-lens-data-any-any)
    - [set(lens: Lens, value: any, data: any): any](#setlens-lens-value-any-data-any-any)
    - [over(lens: Lens, updateFn: (value: any) => any, data: any): any](#overlens-lens-updatefn-value-any--any-data-any-any)

Lenses decompose ordinary `get/set` operations into two seperate parts: a lens constructor and a lens operation. A lens constructor describes the part of the object that you want your lens to operate on. A lens operation describes what actually happens to the value at the focused location in the object. Decomposing `get/set` into constructor and operation makes it possible to compose lenses.

## Constructors

This package provides several functions for creating lenses.

### At(propertyName: string | number, container: any): Lens

`At` function takes a property name and returns a lens that'll focus on that property in an object.

```js
import { At, view } from '@microstates/lens';

let lens = At('message');

view(lens, { message: 'hello world' });
// 'hello world'
```

This lens can be used to create objects or arrays. For this lens to create an array, you can pass an array as a second argument to the `At` function.

```js
import { At, set } from '@microstates/lens';

let lens = At(1, []);

set(lens, 'hello world', undefined);
// [undefined, 'hello world']
```

### Path(propertyNames: Array<string | number>): Lens

`Path` function takes an array of property names and returns a lens that'll focus on the property in the object. This is useful when working
with deeply nested objects.

```js
import { Path, view } from '@microstates/lens';

let lens = Path(['a', 'b', 'c']);

view(lens, { a: { b: { c: 'hello world' } } });
// hello world
```

### Lens(get: (context: any) => any, set: (value: any, context: any) => any): Lens

`Lens` constructor takes a getter function and a setter function. It returns a lens.

### compose(lensA, lensB): Lens

`compose` function allows to combine two lenses to produce a new lens.

```js
import { compose, Path, At, set } from '@microstates/lens';

let lens = compose(
  At(1, []),
  Path(['a', 'b', 'c'])
);

set(lens, 'hello world', undefined);
// [undefined, { a: { b: { c: 'hello world' }}}]
```

### transparent(): Lens

`transparent` lens doesn't change the value, it just returns what it has.

```js
import { transparent, set } from '@micorstates/lens';

let lens = transparent();

let data = { message: 'hello world' }

set(lens, 'will be ignored', data)
// { message: 'hello world' }
```

## Operations

This package provides three operations that you can use with a lense.

### view(lens: Lens, data: any): any

`view` will retrieve a value at the location in the data that the lens is focused on.

```js
import { At, view } from '@microstates/lens';

let lens = At('message');

view(lens, { message: 'hello world' });
// 'hello world'
```

### set(lens: Lens, value: any, data: any): any

`set` will apply the value into the location that the lens focuses on.

```js
import { Path, set } from '@microstates/lens';

let lens = Path(['a', 'b', 'c']);

set(lens, 'hello world', {});
// { a: { b: { c: 'hello world' }}}
```

### over(lens: Lens, updateFn: (value: any) => any, data: any): any

`over` allows to apply a function to a location that the lens focuses on.

You might find it useful to think about it as three operations in one:

1. view value at focused location
2. pass the viewed value to the update function
3. set the return value from the update function into the focused location

```js
import { At, over } from '@microstates/lens';

let lens = At('message');
let data = { message: 'hello world' };

view(lens, text => text.toUpperCase(), data);
// { message: 'HELLO WORLD' }
```

