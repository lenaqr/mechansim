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

exports.sum = sum;
exports.cumsum = cumsum;
