;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MoveQuote = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Pure pricing. Reads only from `pricing`. Same inputs -> same output.
  // selection: { homeSize, moveMode: 'hourly'|'contact', addOnIds: string[] }
  function estimate(pricing, selection) {
    var sel = selection || {};
    if (sel.moveMode === 'contact') return { contact: true };

    var size = pricing.homeSizes[sel.homeSize];
    if (!size) return { contact: true };

    var ids = sel.addOnIds || [];
    var chosen = (pricing.addOns || []).filter(function (a) {
      return ids.indexOf(a.id) !== -1;
    });

    var hours = size.hours;
    // Multipliers first, then adders — preserves original ordering.
    chosen.forEach(function (a) {
      if (a.effect && a.effect.type === 'hoursMult') hours *= a.effect.value;
    });
    chosen.forEach(function (a) {
      if (a.effect && a.effect.type === 'hoursAdd') hours += a.effect.value;
    });

    var flat = pricing.truckFee;
    chosen.forEach(function (a) {
      if (a.effect && a.effect.type === 'flat') flat += a.effect.value;
    });

    var labor = hours * size.crew * pricing.hourlyRate;
    var total = labor + flat;
    var roundTo = pricing.roundTo || 10;

    return {
      crew: size.crew,
      hours: Math.round(hours * 2) / 2,
      low: Math.round((total * pricing.rangeLow) / roundTo) * roundTo,
      high: Math.round((total * pricing.rangeHigh) / roundTo) * roundTo,
    };
  }

  return { estimate: estimate };
});
