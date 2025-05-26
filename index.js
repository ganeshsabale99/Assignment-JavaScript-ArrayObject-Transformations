// Method 1: deepFlatten
function deepFlatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val), []);
}

// Method 2: groupBy
function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

// Method 3: deepClone
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

// Method 4: polyfillMap
function polyfillMap() {
  if (!Array.prototype.myMap) {
    Array.prototype.myMap = function (callback, thisArg) {
      const result = [];
      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          result.push(callback.call(thisArg, this[i], i, this));
        }
      }
      return result;
    };
  }
}

// Method 5 (Bonus): polyfillReduce
function polyfillReduce() {
  if (!Array.prototype.myReduce) {
    Array.prototype.myReduce = function (callback, initialValue) {
      let accumulator = initialValue;
      let startIndex = 0;

      if (accumulator === undefined) {
        if (this.length === 0) {
          throw new TypeError("Reduce of empty array with no initial value");
        }
        accumulator = this[0];
        startIndex = 1;
      }

      for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
          accumulator = callback(accumulator, this[i], i, this);
        }
      }
      return accumulator;
    };
  }
}

polyfillMap();
polyfillReduce();


// Unit Tests

console.assert(
  JSON.stringify(deepFlatten([1, [2, [3, [4, [5]]]]])) === JSON.stringify([1, 2, 3, 4, 5]),
  'deepFlatten failed'
);


const groupData = [
  { type: 'fruit', name: 'apple' },
  { type: 'veg', name: 'carrot' },
  { type: 'fruit', name: 'banana' }
];
const grouped = groupBy(groupData, 'type');
console.assert(
  grouped.fruit.length === 2 && grouped.veg.length === 1,
  'groupBy failed'
);


const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = deepClone(original);
cloned.b.d[0] = 99;
console.assert(original.b.d[0] === 3, 'deepClone failed');

const mapped = [1, 2, 3].myMap(x => x * 2);
console.assert(JSON.stringify(mapped) === JSON.stringify([2, 4, 6]), 'polyfillMap failed');


const reduced = [1, 2, 3, 4].myReduce((acc, val) => acc + val, 0);
console.assert(reduced === 10, 'polyfillReduce failed');


console.log("All tests passed!");
