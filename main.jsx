var React = require('react');
var HighCharts = require('react-highcharts');

var auctions = require('./auctions');
var {sum, cumsum} = require('./util');

var bidderDistOptions = [
  {value: 'uniform01', text: 'Uniform[0,1]'}
];
var bidderDistNames = {
  uniform01: 'Uniform[0,1]'
}
var bidderDists = {
  uniform01: auctions.bidderDists.uniform01
}
var bidderNumOptions = [1,2,3,4,5,6,7,8,9];
var mechanismOptions = [
  {value: 'vickrey', text: 'Vickrey (no reserve price)'},
  {value: 'myerson', text: 'Myerson (optimal reserve price)'}
];
var mechanismNames = {
  vickrey: 'Vickrey',
  myerson: 'Myerson'
};
var mechanisms = {
  vickrey: auctions.mechanisms.vickrey,
  myerson: auctions.mechanisms.myerson
};
var simulateOptions = [1,10,100,1000,10000];

var App = React.createClass({
  getInitialState: function () {
    return {
      messages: ["Welcome to MechanSim! Use the controls above to run simulations."],
      bidderDistribution: 'uniform01',
      numBidders: 2,
      mechanism: 'vickrey',
      revenueSeries: []
    };
  },
  emitMessage: function (message) {
    this.setState(
      ({messages}) => ({messages: [message].concat(messages)})
    );
  },
  changeBidderDistribution: function (event) {
    var bidderDistribution = event.target.value;
    this.emitMessage(`Selected bidder distribution: ${bidderDistNames[bidderDistribution]}`);
    this.setState({bidderDistribution});
    this.setState({revenueSeries: []});
  },
  changeNumBidders: function (event) {
    var numBidders = event.target.value;
    this.emitMessage(`Selected number of bidders: ${numBidders}`);
    this.setState({numBidders});
    this.setState({revenueSeries: []});
  },
  changeMechanism: function (event) {
    var mechanism = event.target.value;
    this.emitMessage(`Selected mechanism: ${mechanismNames[mechanism]}`);
    this.setState({mechanism});
    this.setState({revenueSeries: []});
  },
  simulateAuction: function (event) {
    var numRounds = parseInt(event.target.value, 10);
    var bidderDistributionName = bidderDistNames[this.state.bidderDistribution];
    var numBidders = parseInt(this.state.numBidders, 10);
    var mechanismName = mechanismNames[this.state.mechanism];
    var bidderDistribution = bidderDists[this.state.bidderDistribution];
    var mechanism = mechanisms[this.state.mechanism];
    var result = auctions.simulateAuction(bidderDistribution, mechanism, numBidders, numRounds);
    this.emitMessage(`Simulated ${mechanismName} auction with ${numBidders} ${bidderDistributionName} bidders (${numRounds} times). ${result.message}`);
    this.setState(({revenueSeries}) => ({
      revenueSeries: revenueSeries.concat(result.revenueSeries)
    }));
  },
  render: function () {
    return (
      <div>
        <h1 onClick={this.testMessage}>MechanSim</h1>
        <hr />
        <ControlPane values={this.state}
                     onBidderDistChange={this.changeBidderDistribution}
                     onBidderNumChange={this.changeNumBidders}
                     onMechanismChange={this.changeMechanism}
                     onSimulate={this.simulateAuction} />
        <hr />
        <OutputPane messages={this.state.messages} revenueSeries={this.state.revenueSeries} />
      </div>
    );
  }
});

var ControlPane = React.createClass({
  render: function () {
    return (
      <form className="controlPane">
        <Selector label="Bidder distribution"
                  options={bidderDistOptions}
                  value={this.props.values.bidderDistribution}
                  onChange={this.props.onBidderDistChange} />
        <Selector label="Number of bidders"
                  options={bidderNumOptions}
                  value={this.props.values.numBidders}
                  onChange={this.props.onBidderNumChange} />
        <Selector label="Mechanism"
                  options={mechanismOptions}
                  value={this.props.values.mechanism}
                  onChange={this.props.onMechanismChange} />
        <SimulateButtons values={simulateOptions} onClick={this.props.onSimulate} />
      </form>
    );
  }
});

var Selector = React.createClass({
  render: function () {
    var options = this.props.options.map(
      option => (<option value={option.value || option}>{option.text || option}</option>)
    );
    return (
      <div>{this.props.label}: <select className="selector" value={this.props.value} onChange={this.props.onChange}>{options}</select></div>
    );
  }
});

var SimulateButtons = React.createClass({
  render: function () {
    var buttons = this.props.values.map(
      value => (<input type="button" value={value} onClick={this.props.onClick} />)
    );
    return (
      <div>Simulate: {buttons}</div>
    );
  }
});

var OutputPane = React.createClass({
  render: function () {
    var styles = {
      table: {
        width: '100%',
        tableLayout: 'fixed'
      },
      td: {
        width: '50%'
      }
    }
    return (
      // <div className="outputPane">OutputPane placeholder</div>
      <table className="outputPane" style={styles.table}><tr>
        <td style={styles.td}><MessageBox messages={this.props.messages} /></td>
        <td style={styles.td}><DataBox revenueSeries={this.props.revenueSeries} /></td>
      </tr></table>
    );
  }
});

var MessageBox = React.createClass({
  render: function () {
    var style = {
      height: '30em',
      border: '1px solid black',
      padding: '0 1em',
      overflowY: 'auto'
    };
    var messages = this.props.messages.map(text => (<p>{text}</p>));
    return (
      <div className="messageBox" style={style}>
        {messages}
      </div>
    );
  }
});

var DataBox = React.createClass({
  render: function () {
    var style = {
      height: '30em',
      border: '1px solid black',
      padding: '0 1em',
      overflowY: 'auto'
    };
    var revenueSeries = this.props.revenueSeries;
    var numRounds = revenueSeries.length;
    var cumulativeRevenue = cumsum(revenueSeries);
    var totalRevenue = cumulativeRevenue[numRounds];
    var averageRevenue = totalRevenue/numRounds;
    var lineChartConfig = {
      title: {text: "Revenue per Round"},
      xAxis: {
        min: 0,
        minRange: 1
      },
      yAxis: {
        title: {text: "Revenue"},
        min: 0,
        minRange: 0.05
      },
      series: [{
        name: "Myerson",
        data: cumulativeRevenue
      }],
      plotOptions: {
        line: {animation: false}
      }
    };
    var ret = (
      <div className="dataBox" style={style}>
      <ul>
        <li>Number of rounds simulated: {numRounds}</li>
        <li>Cumulative revenue: {totalRevenue.toFixed(3)}</li>
        <li>Average revenue per round: {averageRevenue.toFixed(3)}</li>
      </ul>
        <HighCharts config={lineChartConfig} />
      </div>
    );
    return ret;
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
