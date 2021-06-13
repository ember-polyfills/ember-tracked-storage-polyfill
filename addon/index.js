import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

class TrackedStorage {
  @tracked _value;

  constructor(initialValue, isEqual) {
    this._value = this._lastValue = initialValue;
    this._isEqual = isEqual;
  }
}

function tripleEq(a, b) {
  return a === b;
}

export function createStorage(initialValue, isEqual = tripleEq) {
  assert(
    'the second parameter to `createStorage` must be an equality function or undefined',
    typeof isEqual === 'function'
  );

  return new TrackedStorage(initialValue, isEqual);
}

export function getValue(storage) {
  assert(
    'getValue must be passed a tracked store created with `createStorage`.',
    storage instanceof TrackedStorage
  );

  return storage._value;
}

export function setValue(storage, value) {
  assert(
    'setValue must be passed a tracked store created with `createStorage`.',
    storage instanceof TrackedStorage
  );

  let { _isEqual: isEqual, _lastValue: lastValue } = storage;

  if (!isEqual(value, lastValue)) {
    storage._value = storage._lastValue = value;
  }
}
