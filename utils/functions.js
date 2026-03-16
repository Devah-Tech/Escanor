const isInRange = (range, value) => {
  return range.a <= value && range.b >= value;
};

const findInRanges = (ranges, value) => {
  return ranges.find((range) => isInRange(range, value));
};

export { findInRanges, isInRange };
