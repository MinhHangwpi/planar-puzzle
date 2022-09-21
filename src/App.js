import React from 'react';
import logo from './logo.svg';
import './App.css';
//import { layout } from './Layout.js'
import Model from './model/Model.js';

import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from './model/PuzzleConfig.js';
import { Up, Down, Left, Right } from './model/Model.js';

// a function to parse config information

var actualPuzzle = getActualPuzzle(configuration_1);

function App() {
  
  // initial instantiation of the Model
  const [model, setModel] = React.useState(new Model(actualPuzzle));

  const appRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  
  return (
    <main ref={appRef}>
      ref={canvasRef}
      <div>Hello World!</div>
    </main>
  );
}

export default App;
