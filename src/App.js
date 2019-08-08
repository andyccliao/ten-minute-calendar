import React from 'react';
import './App.css';

const rows = 12;
const cols = 12;

function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick} 
    style={{"background-color" : (props.value) ? props.value : "white"}}>
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
      grid: Array(144).fill(null),
      mainColor: "red",
    }
  }

  onClick(i) {
    // Can probably short-circuit if the Square clicked is the same color.
    if(this.state.grid[i] === this.state.mainColor){
      return;
    }
    const grid = this.state.grid;

    grid[i] = this.state.mainColor;
    this.setState({
      grid: grid
    });
  }

  render() { 
    return (
      <div className="App">
        <div className="Grid">
          <Grid
            grid={this.state.grid}
            onClick={(i) => this.onClick(i)}
          />
        </div>
      </div>
    );
  }
}

export default App;
