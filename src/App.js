import React from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import './App.css';

const rows = 12;
const cols = 12;

const colors = {
  red:    {value: "#d32f2f", textColor: "white", label: "red"},
  pink:   {value: "#c2185b", textColor: "white", label: "pink"},
  violet: {value: "#7b1fa2", textColor: "white", label: "violet"},
  purple: {value: "#512da8", textColor: "white", label: "purple"},
  indigo: {value: "#303f9f", textColor: "white", label: "indigo"},
  blue:   {value: "#1976d2", textColor: "white", label: "blue"},
  sky:    {value: "#5eb8ff", textColor: "black", label: "sky"},
  cyan:   {value: "#00acc1", textColor: "black", label: "cyan"},
  green:  {value: "#43a047", textColor: "black", label: "green"},
  gold:   {value: "#c0ca33", textColor: "black", label: "gold"},
  yellow: {value: "#ffeb3b", textColor: "black", label: "yellow"},
  orange: {value: "#fb8c00", textColor: "black", label: "orange"},
  brown:  {value: "#6d4c41", textColor: "white", label: "brown"},
  black:  {value: "#212121", textColor: "white", label: "black"},
};
const colorStyles = {
  control: (styles, state) => {
    const data = state.getValue();
    return {
      ...styles, 
      backgroundColor: state.hasValue ? data[0].value : 'white',
      border: "none",
    }
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.value);
    return {
      ...styles,
      fontSize: "0.75rem",
      padding: "0px 5px",

      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.value
        : isFocused
        ? data.value
        : "white",
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? data.textColor
        : isFocused
        ? data.textColor
        : data.value,
      cursor: isDisabled ? 'not-allowed' : 'default',
      borderRadius: isFocused
        ? "10px"
        : null,

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.value : color.alpha(0.3).css()),
      },
    };
  },
  menu: (styles) => ({ ...styles, minWidth: "3em"}),
  valueContainer: () => ({width: "0" }),
  input: styles => ({ ...styles, display: "none"}),
  placeholder: (styles, state) => ({ ...styles, display: "none" }),
  singleValue: (styles) => ({ ...styles, display: "none" }),
  container: (styles) => ({ ...styles, display: "inline-flex", top: "2.2px"}),
};
const theme = theme => ({
  ...theme,
  borderRadius: "0",
  spacing: {
    ...theme.spacing,
    baseUnit: "0",
    controlHeight: "17px",
  }
});

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
    if(this.props.colorlabel !== nextProps.colorlabel) {
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
      onContextMenu={this.props.onMouseDown}
      title={(this.props.colorlabel) ? this.props.colorlabel.label : "Empty"}
      style={{"backgroundColor" : (this.props.colorlabel) ? this.props.colorlabel.color.value : "white",
              "border" : (this.props.colorlabel) ? "0px" : "1px solid #999",}}>
      </button>
    );
  }
}

class Row extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    for(let i=0; i < this.props.numCols; i++) {
      if(this.props.row[i] !== nextProps.row[i]) {
        return true;
      }
    }
    return false;
  }

  renderSquare(i, cl) {
    return <Square 
      colorlabel={cl}
      onMouseEnter={(event) => this.props.onMouseEnter(i, event)}
      onMouseDown={(event) => this.props.onMouseDown(i, event)}
      onMouseUp={this.props.onMouseUp}
    />;
  }

  render() {
    const m = this.props.rowNum;
    const n = this.props.numCols;
    // let res = [];
    // for (let index=0; index < n; index++) {
    //   res.push(
    //     <td key={"data"+ (m*n + index)}>
    //       {this.renderSquare(m*n + index)}
    //     </td>
    //   )
    // }
    // Array(n).fill().map( 
    //   (value, index) => {
    //     return (<td key={"data"+ (m*n + index)}>
    //       {this.renderSquare(m*n + index)}
    //     </td>)
    //   }
    // )
    return (
      <tr key={"row:"+(m)}>
        <th key={"rowh:"+m}>{(2*m+5)%12}</th>
        {this.props.row.map( 
          (value, index) => {
            return (<td key={"data"+ (m*n + index)}>
              {this.renderSquare(m*n + index, value)}
            </td>)
          }
        )}
      </tr>
    );
  }
}

class Grid extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.grid !== nextProps.grid;
  }

  renderTable() {
    const tbheadrow = (
      <tr>
        <th/><th/><th/><th/><th/><th/><th/><th>|</th><th/><th/><th/><th/><th/>
      </tr>
    );

    let tbrows = [];
    for (let i = 0; i < rows; i++) {
      tbrows.push(
      <Row
        key={i}
        rowNum={i} 
        numCols={cols} 
        row={this.props.grid.slice(i*cols, (i+1)*cols)}
        onMouseEnter={this.props.onMouseEnter}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
      />);
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
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.colorList !== nextProps.colorList;
  }

  makeColorItem(colorLabel, index) {
    return (
      <li key={colorLabel.toString()}>
        <button
        className="deleteColor"
        onClick={() => this.props.onDeleteColorItem(colorLabel)}
        >
          X
        </button>
        <button 
        className="colorButton" 
        style={{"backgroundColor" : colorLabel.color.value}}
        onClick={() => this.props.onClickColor(colorLabel)}
        >
          <span style={{"color" : colorLabel.color.textColor}}>{colorLabel.label}</span>
        </button>
        <Select
          options={Object.values(colors)}
          styles={colorStyles}
          defaultValue={colorLabel.color}
          isSearchable={false}
          theme={theme}
          onChange={(value, action) => this.props.onChange(index, value, action)}
        />
      </li>
    );
  }

  makeEraseItem() {
    return (
        <li><button 
        className="colorButton" 
        onClick={() => this.props.onClickColor(null)}
        >
          Empty (or right click)
        </button>
      </li>
    )
  }

  makeColorList() {
    return (
      <ul className="colorMenuList">
        {this.makeEraseItem()}
        {this.props.colorList.map((cl, index) => this.makeColorItem(cl, index))}
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
  onChange(i, value, action) {
    if(action && action.action === "select-option") {
      const newColorList = this.state.colorList.slice();
      newColorList[i].color = value;
      this.setState({colorList: newColorList});
    }
  }
  onMouseEnter(i, event) {
    // Can probably short-circuit if the Square clicked is the same color.
    // Is implemented by shouldComponentUpdate(nextProps, nextState) in React.Component (in Square)
    /*if(this.state.grid[i] === this.state.mainColorLabel){
      return;
    }*/
    if(!this.painting) {
      return;
    }
    if(event.buttons === 0) {
      this.painting = false;
      return;
    }
    const grid = this.state.grid.slice();

    if(event.buttons === 2) {
      grid[i] = null;
    } else {
      grid[i] = this.state.mainColorLabel;
    }
    this.setState({
      grid: grid
    });
  }
  onMouseDown(i, event) {
    if(event.button === 1) {
      return;
    }

    if(event.button === 2) {
      event.preventDefault();
    }

    this.painting = true;

    const grid = this.state.grid.slice();

    if(event.button === 2) {
      grid[i] = null;
    }
    else {
      grid[i] = this.state.mainColorLabel;
    }
    this.setState({
      grid: grid
    });
  }
  onMouseUp() {
    this.painting = false;
  }
  onClickColor(colorlabel) {
    this.setState({mainColorLabel: colorlabel});
  }
  onContextMenu(i, event) {
    event.preventDefault();

    this.painting = true;

    const grid = this.state.grid.slice();

    grid[i] = null;
    this.setState({
      grid: grid
    });
  }
  onDeleteColorItem(colorlabel) {
    if(!window.confirm("Delete '" + colorlabel.label + "'?")) {
      return;
    }
    let index = this.state.colorList.indexOf(colorlabel);
    const list = this.state.colorList.slice(0, index).concat(this.state.colorList.slice(index+1));
    // Also, remove color from grid
    const grid = this.state.grid.map((cl) => {if(cl === colorlabel){return null;} else {return cl}})
    if(index !== -1) {
      // Also, remove as mainColorLabel
      this.setState({colorList: list, mainColorLabel: list[0], grid: grid});
    }

  }

  render() { 
    return (
      <div className="App">
        <Grid
          grid={this.state.grid}
          onMouseEnter={(i, event) => this.onMouseEnter(i, event)}
          onMouseDown={(i, event) => this.onMouseDown(i, event)}
          onMouseUp={() => this.onMouseUp()}
        />
        <ColorMenu
          colorList={this.state.colorList}
          onClickColor={(colorlabel) => this.onClickColor(colorlabel)}
          onDeleteColorItem={(colorlabel) => this.onDeleteColorItem(colorlabel)}
          onChange={(i, value, action) => this.onChange(i, value, action)}
        />
      </div>
    );
  }
}

export default App;
