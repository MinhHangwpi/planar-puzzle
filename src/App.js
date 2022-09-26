import React from 'react';
import logo from './logo.svg';
import './App.css';
import { layout } from './Layout.js'
import Model from './model/Model.js';

import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from './model/PuzzleConfig.js';
import { Up, Down, Left, Right } from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary';
import { selectSquare, setConfiguration, unselectSquare, resetPuzzle, extendColorController } from './controller/Controller';


// a function to parse config information

var actualPuzzle = getActualPuzzle(configuration_1);

function App() {

  // initial instantiation of the Model
  const [model, setModel] = React.useState(new Model(actualPuzzle));

  // need to have ref to top level boundary object.
  const appRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  /**Ensures initial rendering is performed, and that whenever the model changes, it is re-rendered. */
  React.useEffect(() => {
    //document.querySelector('.App-canvas').height = 800
    /** Happens once */
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model]) //this second argument is CRITICAL, since it declares when to refresh

  const handleClick = (e) => {
    let newModel = selectSquare(model, canvasRef.current, e);
    setModel(newModel);
  }

  const unselectHandler = (e) => {
    let newModel = unselectSquare(model);
    setModel(newModel);
  }

  const configurationHandler = (configName) => {
    let newModel = setConfiguration(configName);
    setModel(newModel);
  }

  const resetPuzzleHandler = (e) => {
    let newModel = resetPuzzle(model);
    setModel(newModel);
  }

  const extendFromHandler = (fromNeighBorIdx) => {
    let newModel = extendColorController(model, fromNeighBorIdx);
    setModel(newModel);
  }

  return (
    <main style={layout.Appmain} ref={appRef}>
      <canvas
        className="App-canvas"
        ref={canvasRef}
        width={layout.canvas.width}
        height={layout.canvas.height}
        onClick={handleClick}
      />

      <label style={layout.text} className={"display-5 mb-3"}> {model.isVictorious() ? "Congratulations, you have won!!!" : "Try harder!!!"}</label>


      <div style={layout.buttons}>
        <button onClick={unselectHandler} className={"btn btn-info mb-4 border border-dark"}> Unselect </button>
        <button style={layout.resetbutton} className={"btn btn-info mb-4 border border-dark"} onClick={resetPuzzleHandler}> Reset Puzzle</button>
      </div>


      <div style={layout.levels}>
        <div>
          <label className={"bg-gradient-dark mb-3 text-uppercase"}>Choose Your Level:</label>
        </div>
        <button
          style={layout.easybutton}
          className={"btn btn-success border border-dark"}
          onClick={(e) => configurationHandler(configuration_1)}
        > easy</button>
        <button
          style={layout.mediumbutton}
          className={"btn btn-warning border border-dark"}
          onClick={(e) => configurationHandler(configuration_2)}
        > medium</button>
        <button
          style={layout.hardbutton}
          className={"btn btn-danger border border-dark"}
          onClick={(e) => configurationHandler(configuration_3)}
        > hard</button>
      </div>

      <div style={layout.buttons}>
        <button
          style={layout.leftbutton}
          className={"btn btn-light border border-dark"}
          onClick={(e) => extendFromHandler(0)}
          disabled={false}
        >&lt;</button>
        <button
          style={layout.rightbutton}
          className={"btn btn-light border border-dark"}
          onClick={(e) => extendFromHandler(1)}
        >&gt;</button>
        <button
          style={layout.upbutton}
          className={"btn btn-light border border-dark"}
          onClick={(e) => extendFromHandler(2)}
        >^</button>
        <button
          style={layout.downbutton}
          className={"btn btn-light border border-dark"}
          onClick={(e) => extendFromHandler(3)}
        >v</button>

      </div>

    </main>
  );
}

export default App;

//canvas is where everything happens.