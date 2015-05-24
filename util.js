function sum(xs) {
  var ret = 0;
  xs.forEach(x => {
    ret += x;
  });
  return ret;
}

function cumsum(xs) {
  var ret = 0;
  return [0].concat(xs).map(x => {
    ret += x;
    return ret;
  });
}

function sorted(xs) {
  var ret = xs.slice();
  ret.sort();
  return ret;
}

exports.sum = sum;
exports.cumsum = cumsum;
exports.sorted = sorted;
