import React from 'react';
import './App.css';

const rows = 12;
const cols = 12;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Grid extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.grid[i]} 
      onClick={() => this.props.onClick(i)}
    />;
  }

  renderRow(m, n) {
    const row = this.props.grid.slice(m*n, (m+1)*n);

    return (
      <tr>
        <th>{(2*m+5)%12}</th>
        {row.map( 
          (value, index) => {
            return (<td>
              {this.renderSquare(m*n + index)}
            </td>)
          }
        )}
      </tr>
    );
  }

  renderTable() {
    const tbheadrow = (
      <tr>
        <th/><th/><th/><th/><th/><th/><th/><th>|</th><th/><th/><th/><th/><th/>
      </tr>
    );

    let tbrows = [];
    for (let i = 0; i < rows; i++) {
      tbrows.push(this.renderRow(i, cols));
    }

    return (
      <table>
        {tbheadrow}
        {tbrows}
      </table>
    );
  }

  render() {
    return this.renderTable()
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: Array(144).fill(null)
    }
  }

  render() { 
    return (
      <div className="App">
        <div className="Grid">
          <Grid
            grid={this.state.grid}
          />
        </div>
      </div>
    );
  }
}

export default App;
