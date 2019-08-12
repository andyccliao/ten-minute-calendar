import React from 'react';
import './App.css';

const rows = 12;
const cols = 12;

const colors = {
  red:    {value: "#d32f2f", textColor: "white", name: "red"},
  pink:   {value: "#c2185b", textColor: "white", name: "pink"},
  violet: {value: "#7b1fa2", textColor: "white", name: "violet"},
  purple: {value: "#512da8", textColor: "white", name: "purple"},
  indigo: {value: "#303f9f", textColor: "white", name: "indigo"},
  blue:   {value: "#1976d2", textColor: "white", name: "blue"},
  sky:    {value: "#5eb8ff", textColor: "black", name: "sky"},
  cyan:   {value: "#00acc1", textColor: "black", name: "cyan"},
  green:  {value: "#43a047", textColor: "black", name: "green"},
  gold:   {value: "#c0ca33", textColor: "black", name: "gold"},
  yellow: {value: "#ffeb3b", textColor: "black", name: "yellow"},
  orange: {value: "#fb8c00", textColor: "black", name: "orange"},
  brown:  {value: "#6d4c41", textColor: "white", name: "brown"},
  black:  {value: "#212121", textColor: "white", name: "black"},
};

class ColorLabel {
  constructor(color, label) {
    this.color = color;
    this.label = label;
  }

  toString() {
    return this.color + this.label;
  }
}

class Square extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.colorlabel !== nextProps.value) {
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
      title={(this.props.colorlabel) ? this.props.colorlabel.label : "Empty"}
      style={{"backgroundColor" : (this.props.colorlabel) ? this.props.colorlabel.color.value : "white"}}>
      </button>
    );
  }
}

class Grid extends React.Component {
  renderSquare(i) {
    return <Square 
      colorlabel={this.props.grid[i]}
      onMouseEnter={() => this.props.onMouseEnter(i)}
      onMouseDown={() => this.props.onMouseDown(i)}
      onMouseUp={this.props.onMouseUp}
    />;
  }

  renderRow(m, n) {
    const row = this.props.grid.slice(m*n, (m+1)*n);

    return (
      <tr key={"row:"+(m)}>
        <th key={"rowh:"+m}>{(2*m+5)%12}</th>
        {row.map( 
          (value, index) => {
            return (<td key={"data"+ (m*n + index)}>
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
        <thead>{tbheadrow}</thead>
        <tbody>{tbrows}</tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="Grid">
        {this.renderTable()}
      </div>
    )
  }
}

class ColorMenu extends React.Component {
  makeColorItem(colorLabel) {
    return (
      <li key={colorLabel.toString()}>
        <button 
        className="colorButton" 
        style={{"backgroundColor" : colorLabel.color.value}}
        onClick={() => this.props.onClick(colorLabel)}
        >
          <span style={{"color" : colorLabel.color.textColor}}>{colorLabel.label}</span>
        </button>
      </li>
    );
  }

  makeEraseItem() {
    return (
      <button 
      className="colorButton" 
      onClick={() => this.props.onClick(null)}
      >
        Empty
      </button>
    )
  }

  makeColorList() {
    return (
      <ul className="colorMenuList">
        {this.makeEraseItem()}
        {this.props.colorList.map((cl) => this.makeColorItem(cl))}
      </ul>
    );
  }

  addNewColor() {
    return (
      <button className="newColorButton">
        Add Event
      </button>
    )
  }
  
  render() {
    return (
      <div className="ColorMenu">
        {this.makeColorList()}
        {this.addNewColor()}
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    let startingColorLabel = new ColorLabel(colors.orange, "Work");
    this.state = {
      grid: Array(144).fill(null),
      colorList: [
        startingColorLabel,
        new ColorLabel(colors.black,  "Commute"),
        new ColorLabel(colors.blue,   "Eat"),
        new ColorLabel(colors.purple, "Sleep"),
        new ColorLabel(colors.green,  "Entertainment"),
      ],
      mainColorLabel: startingColorLabel,
    }
    this.painting = false;
  }

  onMouseEnter(i) {
    // Can probably short-circuit if the Square clicked is the same color.
    // Is implemented by shouldComponentUpdate(nextProps, nextState) in React.Component (in Square)
    /*if(this.state.grid[i] === this.state.mainColorLabel){
      return;
    }*/
    if(!this.painting) {
      return;
    }
    const grid = this.state.grid;

    grid[i] = this.state.mainColorLabel;
    this.setState({
      grid: grid
    });
  }

  onMouseDown(i) {
    this.painting = true;

    const grid = this.state.grid;

    grid[i] = this.state.mainColorLabel;
    this.setState({
      grid: grid
    });
  }

  onMouseUp() {
    this.painting = false;
  }

  onClick(colorlabel) {
    this.setState({mainColorLabel: colorlabel});
  }

  render() { 
    return (
      <div className="App">
        <Grid
          grid={this.state.grid}
          onMouseEnter={(i) => this.onMouseEnter(i)}
          onMouseDown={(i) => this.onMouseDown(i)}
          onMouseUp={() => this.onMouseUp()}
        />
        <ColorMenu
          colorList={this.state.colorList}
          onClick={(colorlabel) => this.onClick(colorlabel)}
        />
      </div>
    );
  }
}

export default App;
