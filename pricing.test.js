'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { estimate } = require('./pricing.js');

// Sample pricing mirroring the original Matt's Movers defaults.
const PRICING = {
  hourlyRate: 90,
  truckFee: 90,
  roundTo: 10,
  rangeLow: 0.9,
  rangeHigh: 1.15,
  homeSizes: {
    studio_1br: { crew: 2, hours: 3 },
    '2br': { crew: 2, hours: 4 },
    '3br': { crew: 3, hours: 5 },
    '4br': { crew: 4, hours: 7 },
  },
  addOns: [
    { id: 'packing', effect: { type: 'hoursMult', value: 1.25 } },
    { id: 'piano', effect: { type: 'flat', value: 150 } },
    { id: 'heavy', effect: { type: 'hoursAdd', value: 1 } },
    { id: 'stairs', effect: { type: 'hoursAdd', value: 1 } },
    { id: 'junk', effect: { type: 'flat', value: 120 } },
  ],
};

test('2BR local, no add-ons', () => {
  const r = estimate(PRICING, { homeSize: '2br', moveMode: 'hourly', addOnIds: [] });
  assert.deepEqual(r, { crew: 2, hours: 4, low: 730, high: 930 });
});

test('3BR local + packing (hours multiplier)', () => {
  const r = estimate(PRICING, { homeSize: '3br', moveMode: 'hourly', addOnIds: ['packing'] });
  assert.deepEqual(r, { crew: 3, hours: 6.5, low: 1600, high: 2040 });
});

test('4BR local + heavy + stairs (hours adders)', () => {
  const r = estimate(PRICING, { homeSize: '4br', moveMode: 'hourly', addOnIds: ['heavy', 'stairs'] });
  assert.deepEqual(r, { crew: 4, hours: 9, low: 3000, high: 3830 });
});

test('2BR local + piano (flat fee)', () => {
  const r = estimate(PRICING, { homeSize: '2br', moveMode: 'hourly', addOnIds: ['piano'] });
  assert.deepEqual(r, { crew: 2, hours: 4, low: 860, high: 1100 });
});

test('long-distance returns contact flag', () => {
  const r = estimate(PRICING, { homeSize: '2br', moveMode: 'contact', addOnIds: [] });
  assert.deepEqual(r, { contact: true });
});

test('unknown home size falls back to contact', () => {
  const r = estimate(PRICING, { homeSize: 'mansion', moveMode: 'hourly', addOnIds: [] });
  assert.deepEqual(r, { contact: true });
});
