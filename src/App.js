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
      <canvas tabIndex="1"
        //className='App-canvas'
        ref={canvasRef}
        width={layout.canvas.width}
        heigh={layout.canvas.height}
        onClick={handleClick}
      />

      <button onClick={unselectHandler}> Unselect </button>

      <label style={layout.text}> {model.isVictorious() ? "Congratulations" : null}</label>
      
      <button style={layout.resetbutton} onClick={resetPuzzleHandler}> Reset Puzzle</button>
{/* 
      onClick={resetPuzzleHandler} */}

      <div style={layout.buttons}>
        <button style={layout.easybutton} onClick={(e) => configurationHandler(configuration_1)}> level: easy</button>
        <button style={layout.mediumbutton} onClick={(e) => configurationHandler(configuration_2)}> level: medium</button>
        <button style={layout.hardbutton} onClick={(e) => configurationHandler(configuration_3)}> level: hard</button>
      </div>

      <div style={layout.buttons}>
        <button style={layout.leftbutton} onClick={(e) => extendFromHandler(0)}>&lt;</button>
        <button style={layout.rightbutton} onClick={(e) => extendFromHandler(1)}>&gt;</button>
        <button style={layout.upbutton} onClick={(e) => extendFromHandler(2)}>^</button>
        <button style={layout.downbutton} onClick={(e) => extendFromHandler(3)}>v</button>

      </div>

    </main>
  );
}

export default App;

//canvas is where everything happens.