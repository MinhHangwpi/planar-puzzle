import React from 'react';
import logo from './logo.svg';
import './App.css';
import { layout } from './Layout.js'
import Model from './model/Model.js';

import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from './model/PuzzleConfig.js';
import { Up, Down, Left, Right } from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary';


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


  return (
    <main style={layout.Appmain} ref={appRef}>
      <canvas tabIndex="1"
        //className='App-canvas'
        ref={canvasRef}
        width={layout.canvas.width}
        heigh={layout.canvas.height}
      />

    {/* <label>"numRows: " {model.puzzle.numRows}</label>
    <label>"numColumns: " {model.puzzle.numColumns}</label> */}

      <label style={layout.text}> {model.isVictorious() ? "Congratulations" : null}</label>
      <button style={layout.resetbutton}> Reset Puzzle</button>

      <div style={layout.buttons}>
        <button style={layout.easybutton}> level: easy</button>
        <button style={layout.mediumbutton}> level: medium</button>
        <button style={layout.hardbutton}> level: hard</button>
      </div>

      <div style={layout.buttons}>
        <button style={layout.upbutton}>^</button>
        <button style={layout.downbutton}>v</button>
        <button style={layout.leftbutton}>&lt;</button>
        <button style={layout.rightbutton}>&gt;</button>

      </div>

    </main>
  );
}

export default App;

//canvas is where everything happens.