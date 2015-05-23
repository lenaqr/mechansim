var React = require('react');
var {LineChart} = require('react-d3');

var bidderDistOptions = [
  {value: 'uniform01', text: 'Uniform[0,1]'}
];
var bidderDistNames = {
  uniform01: 'Uniform[0,1]'
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
var simulateOptions = [1,10,100];

var App = React.createClass({
  getInitialState: function () {
    var longMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    return {
      messages: ["Welcome to MechanSim!", longMessage, longMessage],
      bidderDistribution: 'uniform01',
      numBidders: 1,
      mechanism: 'vickrey'
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
    // todo: clear data area
  },
  changeNumBidders: function (event) {
    var numBidders = event.target.value;
    this.emitMessage(`Selected number of bidders: ${numBidders}`);
    this.setState({numBidders});
    // todo: clear data area
  },
  changeMechanism: function (event) {
    var mechanism = event.target.value;
    this.emitMessage(`Selected mechanism: ${mechanismNames[mechanism]}`);
    this.setState({mechanism});
    // todo: clear data area
  },
  simulateAuction: function (event) {
    var numTimes = parseInt(event.target.value, 10);
    var bidderDistribution = bidderDistNames[this.state.bidderDistribution];
    var numBidders = parseInt(this.state.numBidders, 10);
    var mechanism = mechanismNames[this.state.mechanism];
    this.emitMessage(`Simulating ${mechanism} auction with ${numBidders} ${bidderDistribution} bidders (${numTimes} times)`);
    // todo: actually simulate auction and display results in data area
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
        <OutputPane messages={this.state.messages} />
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
        <td style={styles.td}><DataBox /></td>
      </tr></table>
    );
  }
});

var MessageBox = React.createClass({
  render: function () {
    var style = {
      height: '20em',
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
      height: '20em',
      border: '1px solid black',
      padding: '0 1em',
      overflowY: 'auto'
    };
    var sampleLineData = [
      {
        name: "revenue",
        values: [{x: 0, y: 0}, {x: 1, y: 20}, {x: 2, y: 35}, {x: 3, y: 48}]
      }
    ];
    return (
      <div className="dataBox" style={style}>
        <h2>DataBox placeholder</h2>
        <LineChart data={sampleLineData} width={300} height={200} title="Revenue per Auction" />
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
