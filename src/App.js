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

function colorStyles(colorLabel=null, mainColorLabel=null) {
  return {
    control: (styles, state) => {
      const data = state.getValue();
      return {
        ...styles, 
        backgroundColor: state.hasValue ? data[0].value : 'white',
        border: "none",
        boxShadow : (colorLabel === mainColorLabel && colorLabel) ? "0px 0px 1px 1px ".concat(colorLabel.color.value) : null,
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
    placeholder: (styles) => ({ ...styles, display: "none" }),
    singleValue: (styles) => ({ ...styles, display: "none" }),
    container: (styles) => ({ ...styles, display: "inline-block", top: "2.2px"}),
  };
}
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
    } else if (this.props.colorLabel && nextProps.colorLabel) {
      if(this.props.colorLabel.color !== nextProps.colorLabel.color) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
    <button 
      className="square" 
      onPointerEnter={this.props.onMouseEnter} 
      onPointerDown={this.props.onMouseDown}
      onPointerUp={this.props.onMouseUp}
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
        <th/><th/><th/><th/><th/><th/>
        <th/><th style={{height: "1em", borderLeft: "2px solid black"}}/>
        <th/><th/><th/><th/><th/>
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

class AddEventComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'showFields': false, 'labelValue': ""};
  }
  onClickOpen(event) {
    this.setState({'showFields': true});
  }
  onClickCancel(event) {
    this.setState({'showFields': false});
  }
  onClickAdd(event) {
    this.props.onClickAdd(event, this.state.labelValue);
    this.setState({'showFields': false, labelValue: ""});
  }
  onChange(event) {
    this.setState({labelValue: event.target.value});
  }
  
  render() {
    let fields = null;

    if(this.state.showFields) {
      fields = (
        <div>
          <label>
            Label: 
          </label>
          <input type="text" name="label" id="label" value={this.state.labelValue} onChange={this.onChange.bind(this)}/>
          <button onClick={this.onClickAdd.bind(this)}>Add</button>
          <button onClick={this.onClickCancel.bind(this)}>Cancel</button>
        </div>
      )
    } else {
      fields = (
        <button className="newColorButton" onClick={() => this.onClickOpen()}>
          Add Event
        </button>
      )
    }

    return (
      <form className="fields">
        {fields}
      </form>)
  }
}
class SelectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.lastUpdated = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.mainColorLabel === nextProps.colorLabel) {
      this.lastUpdated = true;
      return true;
    }
    return this.lastUpdated;
  }

  render() {
    if(this.props.mainColorLabel !== this.props.colorLabel) {
      this.lastUpdated = false;
    }
    return <Select
      options={this.props.options}
      styles={colorStyles(this.props.colorLabel, this.props.mainColorLabel)}
      value={this.props.value}
      isSearchable={this.props.isSearchable}
      theme={this.props.theme}
      onChange={this.props.onChange}
    />
  }
}

class ColorMenu extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.colorList !== nextProps.colorList || this.props.mainColorLabel !== nextProps.mainColorLabel;
  }

  makeColorItem(colorLabel, index, mainColorLabel) {
    return (
      <li key={colorLabel.toString()}>
        <button
        className="deleteColor"
        onClick={() => this.props.onDeleteColorItem(colorLabel)}
        style={{"boxShadow" : (colorLabel === mainColorLabel) ? "0px 0px 1px 1px ".concat(colorLabel.color.value) : null,}}
        >
          X
        </button>
        <button 
        className="colorButton" 
        style={{
          "backgroundColor" : colorLabel.color.value, 
          "boxShadow" : (colorLabel === mainColorLabel) ? "0px 0px 1px 1px ".concat(colorLabel.color.value) : null,
        }}
        onClick={() => this.props.onClickColor(colorLabel)}
        >
          <span style={{"color" : colorLabel.color.textColor}}>{colorLabel.label}</span>
        </button>
        <SelectComponent
        options={Object.values(colors)}
        colorLabel={colorLabel}
        mainColorLabel={mainColorLabel}
        value={colorLabel.color}
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
        {this.props.colorList.map((cl, index) => this.makeColorItem(cl, index, this.props.mainColorLabel))}
      </ul>
    );
  }

  addNewColor() {
    return (
      <AddEventComponent
        onClickAdd={this.props.onClickAdd}
      />
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
      //let setMainColorLabel = newColorList[i] === this.state.mainColorLabel;
      let oldColorLabel = newColorList[i];
      let newColorLabel = new ColorLabel(value, newColorList[i].label);
      //newColorList[i].color = value;
      newColorList[i] = newColorLabel;
      
      const grid = this.state.grid.map((value) => value === oldColorLabel ? newColorLabel : value);

      this.setState({colorList: newColorList, grid: grid, mainColorLabel: newColorList[i]});
      // if(setMainColorLabel) {
      //   this.setState({colorList: newColorList, grid: grid, mainColorLabel: newColorList[i]});
      // } else {
      //   this.setState({colorList: newColorList, grid: grid});
      // }
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
  onClickAdd(event, label = "") {
    const list = this.state.colorList.concat([new ColorLabel(colors.red, label)]);
    this.setState({colorList: list});
    return;
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
          onClickAdd={(event, label) => this.onClickAdd(event, label)}
          mainColorLabel={this.state.mainColorLabel}
        />
      </div>
    );
  }
}

export default App;
