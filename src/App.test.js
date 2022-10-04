import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from './model/PuzzleConfig.js';
import Model, { Square } from './model/Model.js';
import { extendColorController, setConfiguration, resetPuzzle } from './controller/Controller';


/****
 * 
 * TEST CONFIGURATION 1
 */

var actualPuzzle = getActualPuzzle(configuration_1);

test('When initilized, a config 1 puzzle has 8 squares', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares.length).toBe(8);
})

test('Properly renders "Try harder!!!" label, which is the default', () => {
  const { getByText } = render(<App />);
  const victoryElement = getByText(/Try harder!!!/);
  expect(victoryElement).toBeInTheDocument();
  const victoryLabel = screen.getByTestId('victory-label');
  expect(victoryLabel).toBeInTheDocument();
});

test('Test the getSquareByLoc() method', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].row).toBe(0);
})

test('In A config 1 puzzle, the first square is a red base square with label "0"', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].color).toBe('red');
  expect(model.puzzle.squares[0].label).toBe(0);
})

test('Square.copy() method must return a different square object', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].copy()).not.toBe(model.puzzle.squares[0]);
})

test('Test square constuctor to show the label', () => {
  let square = new Square(0, 0, false, 'red', 'base');
  expect(square.label).toBe('base');
})

test('Show 4 neighbors of (0,1) in configuration 1', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[0]).toBe(model.puzzle.squares[0]);
  expect(model.puzzle.neighbors(selectedSquare)[1]).toBe(model.puzzle.squares[2]);
  expect(model.puzzle.neighbors(selectedSquare)[2]).toBe(null);
  expect(model.puzzle.neighbors(selectedSquare)[3]).toBe(model.puzzle.squares[5]);
})

test('Show 4 neighbors of (1,3) in configuration 1', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[7];
  expect(model.puzzle.neighbors(selectedSquare)[0]).toBe(model.puzzle.squares[6]);
  expect(model.puzzle.neighbors(selectedSquare)[1]).toBe(null);
  expect(model.puzzle.neighbors(selectedSquare)[2]).toBe(model.puzzle.squares[3]);
  expect(model.puzzle.neighbors(selectedSquare)[3]).toBe(null);
})

test('test controller classes', () => {
  var model = new Model(actualPuzzle);
  model.puzzle.select(model.puzzle.squares[4]);

  let newModel = extendColorController(model, 2);
  expect(newModel.puzzle.squares[4].color).toBe('red');
  expect(newModel.puzzle.squares[4].label).toBe(1);

  newModel = resetPuzzle(newModel);
  expect(newModel.puzzle.squares[4].color).toBe(null);

  newModel = setConfiguration(configuration_2);
  expect(newModel.puzzle.squares.length).toBe(32);
})


/** Test is valid extend */
test('Valid to extend from (0,0) to (1,0) in initial config 1', () => {
  var model = new Model(actualPuzzle);
  //select square (1,0)
  model.puzzle.select(model.puzzle.squares[4]);

  //expect certain extend types to be available/unavailable
  expect(model.available(0)).toBe(false); //from left neighbor
  expect(model.available(1)).toBe(false); //from right neighbor
  expect(model.available(2)).toBe(true); //from up neighbor
  expect(model.available(3)).toBe(false); //from down neighbor

  // fromSquare
  let fromSquare = model.puzzle.squares[0];
  expect(model.puzzle.isValidExtend(fromSquare)).toBe(true);
})

test('Valid to extend from (1,0), labeled with "1" to (1,1)', () => {
  var model = new Model(actualPuzzle);
  //fromSquare
  let fromSquare = model.puzzle.squares[4];
  //add label "1" to fromSquare
  fromSquare.addLabel('1');
  //addColor to fromSquare;
  fromSquare.fillColor('red');
  //update the highestLabel for red
  model.puzzle.highestLabels[fromSquare.color] = fromSquare.label;
  //select square (1, 1)
  model.puzzle.select(model.puzzle.squares[5]);
  expect(model.puzzle.isValidExtend(fromSquare)).toBe(true);
})

test('Extend color from (0,0) to (1,0)', () => {
  var model = new Model(actualPuzzle);
  //select square (1,0)
  model.puzzle.select(model.puzzle.squares[4]);
  // fromSquare
  let fromSquare = model.puzzle.squares[0];
  model.puzzle.extendColor(fromSquare);
  //toSquare:
  let toSquare = model.puzzle.squares[4]
  expect(toSquare.color).toBe("red");
  expect(toSquare.label).toBe(1);
})

test('Test is valid path', () => {
  var model = new Model(actualPuzzle);

  let base1 = model.puzzle.squares[0];
  let base2 = model.puzzle.squares[2];
  expect(model.puzzle.isPath(base1, base2)).toBe(false);
  /**these is still no path after (1,0) is extended' */
  //select square (0,1)
  model.puzzle.select(model.puzzle.squares[4]);
  model.puzzle.extendColor(base1);
  expect(model.puzzle.isPath(base1, base2)).toBe(false);
  /**there is a path after (1, 1) and (0,1) are extended */
  //extend (1,1)
  model.puzzle.select(model.puzzle.squares[5]);
  model.puzzle.extendColor(model.puzzle.squares[4]);
  expect(model.puzzle.isPath(base1, base2)).toBe(false);
  //extend (0,1)
  model.puzzle.select(model.puzzle.squares[1]);
  model.puzzle.extendColor(model.puzzle.squares[5]);
  expect(model.puzzle.isPath(base1, base2)).toBe(true);
  //extend (1,3) from (1,2)
  let base3 = model.puzzle.squares[6];
  let base4 = model.puzzle.squares[3];
  model.puzzle.select(model.puzzle.squares[7]);
  model.puzzle.extendColor(base3);
  expect(model.puzzle.isPath(base3, base4)).toBe(true);
  // the puzzle should be all filled;
  expect(model.puzzle.isFull()).toBe(true);

  // game should be won
  expect(model.puzzle.hasWon()).toBe(true);

  //no more piece is selected
  expect(model.puzzle.isSelected()).toBe(false);
})


test('Test an alternative valid path in config 1', () => {
  var model = new Model(actualPuzzle);

  let base1 = model.puzzle.squares[2];
  let base2 = model.puzzle.squares[0];
  expect(model.puzzle.isPath(base1, base2)).toBe(false);

  //select square (0,1)
  model.puzzle.select(model.puzzle.squares[1]);

  model.puzzle.extendColor(base1);

  /**there is a path after (1, 1) and (1,0) are extended */

  //extend (1,1)
  model.puzzle.select(model.puzzle.squares[5]);
  model.puzzle.extendColor(model.puzzle.squares[1]);
  //extend (1,0)
  model.puzzle.select(model.puzzle.squares[4]);
  model.puzzle.extendColor(model.puzzle.squares[5]);
  expect(model.puzzle.isPath(base1, base2)).toBe(true);

  //extend (1,3) from (1,2)
  let base3 = model.puzzle.squares[6];
  let base4 = model.puzzle.squares[3];
  model.puzzle.select(model.puzzle.squares[7]);
  model.puzzle.extendColor(base3);
  expect(model.puzzle.isPath(base3, base4)).toBe(true);

  // the puzzle should be all filled;
  expect(model.puzzle.isFull()).toBe(true);

  // game should be won
  expect(model.puzzle.hasWon()).toBe(true);

  //no more piece is selected
  expect(model.puzzle.isSelected()).toBe(false);
})


test('Test the .isFull() method', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.isFull()).toBe(false);
})


/****
 * 
 * TEST CONFIGURATION 2
 */


var actualPuzzle2 = getActualPuzzle(configuration_2);

test('Correctly identify the unused square is at row 1, column 1', () => {
  var model = new Model(actualPuzzle2);
  expect(model.puzzle.squares[9].color).toBe('black');
})

test('Test valid path for config 2', () => {
  var model = new Model(actualPuzzle2);
  /**there must be 3 pairs of base squares */
  expect(model.puzzle.getBasePairs().length).toBe(3);

  /**red base squares */
  let base1 = model.puzzle.squares[1];
  let base2 = model.puzzle.squares[20];

  /**no path between two red base squares */
  expect(model.puzzle.isPath(base1, base2)).toBe(false);

  /**fully extend the red base squares path; should be a path but game is not won yet */
  //extend square (2,3)
  model.puzzle.select(model.puzzle.squares[19]);
  model.puzzle.extendColor(base2);

  //extend square (3,3)
  model.puzzle.select(model.puzzle.squares[27]);
  model.puzzle.extendColor(model.puzzle.squares[19]);

  //extend square (3,2)
  model.puzzle.select(model.puzzle.squares[26]);
  model.puzzle.extendColor(model.puzzle.squares[27]);

  //extend square (2,2)
  model.puzzle.select(model.puzzle.squares[18]);
  model.puzzle.extendColor(model.puzzle.squares[26]);

  //extend square (2,1)
  model.puzzle.select(model.puzzle.squares[17]);
  model.puzzle.extendColor(model.puzzle.squares[18]);

  //extend square (3,1)
  model.puzzle.select(model.puzzle.squares[25]);
  model.puzzle.extendColor(model.puzzle.squares[17]);

  //extend square (3,0)
  model.puzzle.select(model.puzzle.squares[24]);
  model.puzzle.extendColor(model.puzzle.squares[25]);

  //extend square (2,0)
  model.puzzle.select(model.puzzle.squares[16]);
  model.puzzle.extendColor(model.puzzle.squares[24]);

  //extend square (1,0)
  model.puzzle.select(model.puzzle.squares[8]);
  model.puzzle.extendColor(model.puzzle.squares[16]);

  //extend square (0,0)
  model.puzzle.select(model.puzzle.squares[0]);
  model.puzzle.extendColor(model.puzzle.squares[8]);

  expect(model.puzzle.isPath(base2, base1)).toBe(true);  
  //the puzzle should not be all filled;
  expect(model.puzzle.isFull()).toBe(false);
  //game should not be won
  expect(model.puzzle.hasWon()).toBe(false);
})


/**
 * 
 * GUI TEST CASES.
//  * 
// */

test('Access GUI', () => {
  var model = new Model(actualPuzzle);
  const { getByText } = render(<App />); //when rendered, inside a virtual screen, can't see but can refer to it.
  const leftButton = screen.getByTestId('left-button');
  const rightButton = screen.getByTestId('right-button');
  const hardButton = screen.getByTestId('hard-button');
  const resetButton = screen.getByTestId('reset-button');
  const canvasElement = screen.getByTestId('canvas');
  //canvas color
  expect(screen.getByTestId('canvas')).toHaveStyle("backgroundColor: '#f9f4e'")

  // //initially this button is disabled.
  expect(leftButton.disabled).toBeTruthy();

  //click on the square (1,0) triggers a select controller
  fireEvent.click(canvasElement, { screenX: 2042, screenY: 259, clientX: 50, clientY: 159 })
  expect(leftButton.disabled).toBeTruthy();
  expect(rightButton.disabled).toBeTruthy();
})