var {sum, sorted} = require('./util');

var uniform01Dist = {
  sample: function () {
    return Math.random();
  },
  CDF: function (q) {
    return q;
  },
  bestReserve: 0.5
}

function vickreyWithReservePrice(reserve, bids) {
  var topBidder = null;
  var topBid = 0;
  var nextBid = 0;
  bids.forEach((bid, i) => {
    if (bid > topBid) {
      nextBid = topBid;
      topBid = bid;
      topBidder = i;
    }
    else if (bid > nextBid) {
      nextBid = bid;
    }
  });
  if (topBid >= reserve) {
    var price = Math.max(nextBid, reserve);
    return { allocation: topBidder, price: price };
  }
  else {
    return { allocation: null, price: 0 };
  }
}

function vickreyMechanism(dist, bids) {
  return vickreyWithReservePrice(0, bids);
}

function myersonMechanism(dist, bids) {
  return vickreyWithReservePrice(dist.bestReserve, bids);
}

function learnedMechanism(dist, bids, bidData) {
  var bidData = sorted(bidData);
  var reservePrice = 0;
  var bestRevenue = 0;
  bidData.forEach((bid, i) => {
    var q = (i+1)/(bidData.length+1);
    var r = bid*(1-q);
    if (r > bestRevenue) {
      reservePrice = bid;
      bestRevenue = r;
    }
  });
  return vickreyWithReservePrice(reservePrice, bids);
}

function sampleBids(dist, n) {
  var bids = [];
  for (var i = 0; i < n; i++) {
    bids.push(dist.sample());
  }
  return bids;
}

function simulateAuction(dist, mechanism, players, rounds, bidData, altMechanism) {
  var resultMessage;
  var revenueSeries = [];
  var altRevenueSeries = [];
  for (var k = 0; k < rounds; k++) {
    var bids = sampleBids(dist, players);
    var result = mechanism(dist, bids, bidData);
    revenueSeries.push(result.price);
    if (altMechanism !== undefined) {
      var altResult = altMechanism(dist, bids, bidData);
      altRevenueSeries.push(altResult.price);
    }
    [].push.apply(bidData, bids)
  }
  if (rounds === 1) {
    var formattedBids = `Received bids: ${bids.map(bid => bid.toFixed(2)).join(", ")}.`;
    var formattedAllocation = result.allocation === null ? `Item not allocated.` : `Player ${result.allocation+1} wins!`
    var formattedRevenue = `Revenue collected: ${result.price.toFixed(2)}.`;
    resultMessage = [formattedBids, formattedAllocation, formattedRevenue].join(" ");
  }
  else if (rounds <= 10) {
    var formattedRevenue = revenueSeries.map(x => x.toFixed(2)).join(", ");
    var totalRevenue = sum(revenueSeries).toFixed(2);
    resultMessage = `Revenue over ${rounds} rounds: ${formattedRevenue} (total ${totalRevenue}).`
  }
  else {
    var totalRevenue = sum(revenueSeries).toFixed(2);
    resultMessage = `Revenue over ${rounds} rounds: ${totalRevenue}.`
  }
  return {
    message: resultMessage,
    revenueSeries: revenueSeries,
    bidData: bidData,
    altRevenueSeries: altRevenueSeries
  };
}

exports.bidderDists = {
  uniform01: uniform01Dist
};
exports.mechanisms = {
  vickrey: vickreyMechanism,
  myerson: myersonMechanism,
  learned: learnedMechanism,
};
exports.simulateAuction = simulateAuction;
