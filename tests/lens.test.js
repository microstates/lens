/* global describe, it, beforeEach */
import expect from "expect";
import { compose, view, set, At, Path, over } from "../src/lens";

describe("At", function() {
  let lens;
  beforeEach(function() {
    lens = compose(
      At(0, []),
      At("hello")
    );
  });

  it("instantiates objects of the correct type at each path", function() {
    expect(set(lens, "world", undefined)).toEqual([{ hello: "world" }]);
  });

  it("set-get: view retrievs what set put in", function() {
    let cookie = {};
    let object = set(lens, cookie, undefined);
    expect(view(lens, object)).toBe(cookie);
  });

  it("get-set: If you set focus to the same value it has, the whole does not change", function() {
    let object = set(lens, "world", undefined);
    expect(set(lens, "world", object)).toBe(object);
  });
});

describe('creating arrays', () => {
  describe('when focusing on location 2', () => {
    let lens;
    let value;
    beforeEach(() => {
      lens = At(2);
      value = set(lens, 'hi', undefined);
    });
    it('creates an array with value at 2nd position', () => {
      expect(value).toEqual([undefined,undefined,'hi']);
    });
  });
});

describe("Path", () => {
  let userNameLens;
  let result;
  beforeEach(() => {
    userNameLens = Path(["user", "name"]);
  });
  describe("set", () => {
    describe("when value is an object", () => {
      let value = { user: { name: "Bob" } };
      beforeEach(() => {
        result = set(userNameLens, "Bobby", value);
      });
      it("creates a new context at root", () => {
        expect(result).not.toBe(value);
      });
      it("creates a new context in middle location", () => {
        expect(result.user).not.toBe(value.user);
      });
      it("applies the value at focus", () => {
        expect(result).toHaveProperty(["user", "name"], "Bobby");
      });
    });
    describe("when value is undefined", () => {
      beforeEach(() => {
        result = set(userNameLens, "John", undefined);
      });
      it("creates context", () => {
        expect(result).toMatchObject({
          user: {
            name: "John"
          }
        });
      });
    });
  });
  describe("view", () => {
    describe("when value is present", () => {
      beforeEach(() => {
        result = view(userNameLens, { user: { name: "Frank" } });
      });
      it("returns the value at focus", () => {
        expect(result).toBe("Frank");
      });
    });
    describe("when value is not present", () => {
      beforeEach(() => {
        result = view(userNameLens, undefined);
      });
      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });
  describe("over", () => {
    describe("when value is present", () => {
      let value = { user: { name: "George" } };
      beforeEach(() => {
        result = over(userNameLens, s => s.toUpperCase(), value);
      });
      it("applies the function to the focus", () => {
        expect(result).toHaveProperty(["user", "name"], "GEORGE");
      });
    });
    describe("when value is not present", () => {
      let value = undefined;
      beforeEach(() => {
        result = over(userNameLens, (s = "") => s.toUpperCase(), value);
      });
      it("creates context for the value", () => {
        expect(result).toMatchObject({
          user: {
            name: ""
          }
        });
      });
    });
  });
  describe("composition with At", () => {
    let lens;
    beforeEach(() => {
      lens = compose(
        At(0),
        userNameLens
      );
    });
    describe("set", () => {
      beforeEach(() => {
        result = set(lens, "Will");
      });
      it("creates composed context", () => {
        expect(result).toMatchObject([{ user: { name: "Will" } }]);
      });
    });
    describe("view", () => {
      beforeEach(() => {
        result = view(lens, [{ user: { name: "Rob" } }]);
      });
      it("returns value from focus", () => {
        expect(result).toBe("Rob");
      });
    });
    describe("over", () => {
      let value = [{ user: { name: "john" } }];
      beforeEach(() => {
        result = over(lens, s => s.toUpperCase(), value);
      });
      it("creates the context", () => {
        expect(result).toMatchObject([{ user: { name: "JOHN" } }]);
      });
    });
  });
});
