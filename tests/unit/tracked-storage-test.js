import {
  createCache,
  getValue as getCacheValue,
} from '@glimmer/tracking/primitives/cache';

import { module, test } from 'qunit';
import {
  createStorage,
  getValue,
  setValue,
} from 'ember-tracked-storage-polyfill';

module('Unit | Utils | Tracked Storage', () => {
  test('it works', function (assert) {
    let count = 0;

    let storage = createStorage();

    let cache = createCache(() => {
      getValue(storage);
      return ++count;
    });

    assert.equal(
      getValue(storage),
      undefined,
      'does not have a value initially'
    );
    assert.equal(getCacheValue(cache), 1, 'cache runs the first time');
    assert.equal(getCacheValue(cache), 1, 'cache does not the second time');

    setValue(storage, 123);

    assert.equal(getValue(storage), 123, 'value is set correctly');
    assert.equal(getCacheValue(cache), 2, 'cache ran after storage was set');

    setValue(storage, 123);

    assert.equal(getValue(storage), 123, 'value remains the same');
    assert.equal(
      getCacheValue(cache),
      2,
      'cache not ran after storage was set to same value'
    );
  });

  test('it can set an initial value', function (assert) {
    let count = 0;

    let storage = createStorage(123);

    let cache = createCache(() => {
      getValue(storage);
      return ++count;
    });

    assert.equal(getValue(storage), 123, 'has a initial value');
    assert.equal(getCacheValue(cache), 1, 'cache runs the first time');
    assert.equal(getCacheValue(cache), 1, 'cache does not the second time');

    setValue(storage, 123);

    assert.equal(getValue(storage), 123, 'value is not updated');
    assert.equal(
      getCacheValue(cache),
      1,
      'cache not ran after storage was set to same value'
    );

    setValue(storage, 456);

    assert.equal(getValue(storage), 456, 'value updated');
    assert.equal(
      getCacheValue(cache),
      2,
      'cache ran after storage was set to different value'
    );
  });

  test('it can set an equality function', function (assert) {
    let count = 0;

    let storage = createStorage(123, () => false);

    let cache = createCache(() => {
      getValue(storage);
      return ++count;
    });

    assert.equal(getValue(storage), 123, 'has a initial value');
    assert.equal(getCacheValue(cache), 1, 'cache runs the first time');
    assert.equal(getCacheValue(cache), 1, 'cache does not the second time');

    setValue(storage, 123);

    assert.equal(getValue(storage), 123, 'value is not updated');
    assert.equal(getCacheValue(cache), 2, 'cache runs again');

    setValue(storage, 456);

    assert.equal(getValue(storage), 456, 'value updated');
    assert.equal(
      getCacheValue(cache),
      3,
      'cache ran after storage was set to different value'
    );
  });
});
