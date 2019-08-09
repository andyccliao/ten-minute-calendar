import React from 'react';
import './App.css';

const rows = 12;
const cols = 12;

class Square extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.value !== nextProps.value) {
      return true;
    }
    return false;
  }

  render() {
    return (
    <button 
      className="square" 
      onMouseEnter={this.props.onMouseEnter} 
      onMouseDown={this.props.onMouseDown}
      onMouseUp={this.props.onMouseUp}
      style={{"background-color" : (this.props.value) ? this.props.value : "white"}}>
      </button>
    );
  }
}

class Grid extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.grid[i]} 
      onMouseEnter={() => this.props.onMouseEnter(i)}
      onMouseDown={() => this.props.onMouseDown(i)}
      onMouseUp={this.props.onMouseUp}
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

class ColorMenu extends React.Component {
  render() {
    return (
      <ul>
        <li></li>
      </ul>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: Array(144).fill(null),
      mainColor: "red",
      colorMenu: [],
    }
    this.painting = false;
  }

  onMouseEnter(i) {
    // Can probably short-circuit if the Square clicked is the same color.
    // Is implemented by shouldComponentUpdate(nextProps, nextState) in React.Component (in Square)
    /*if(this.state.grid[i] === this.state.mainColor){
      return;
    }*/
    if(!this.painting) {
      return;
    }
    const grid = this.state.grid;

    grid[i] = this.state.mainColor;
    this.setState({
      grid: grid
    });
  }

  onMouseDown(i) {
    this.painting = true;

    const grid = this.state.grid;

    grid[i] = this.state.mainColor;
    this.setState({
      grid: grid
    });
  }

  onMouseUp() {
    this.painting = false;
  }

  render() { 
    return (
      <div className="App">
        <div className="Grid">
          <Grid
            grid={this.state.grid}
            onMouseEnter={(i) => this.onMouseEnter(i)}
            onMouseDown={(i) => this.onMouseDown(i)}
            onMouseUp={() => this.onMouseUp()}
          />
        </div>
        <div className="ColorMenu">
          <ColorMenu
            
          />
        </div>
      </div>
    );
  }
}

export default App;
