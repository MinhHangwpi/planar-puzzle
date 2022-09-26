import React from 'react';
import { render, screen } from '@testing-library/react';
//import Model from './model/Model'; //note: duplicate with line 9
import App from './App';


// import default puzzle to use.
import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from './model/PuzzleConfig.js';
import Model, { Up, Down, Left, Right, Square } from './model/Model.js';

// parses string into JSON object
var actualPuzzle = getActualPuzzle(configuration_1);

//test cases

//notes: may refactor the test cases using beforeEach

test('when initilized, a config 1 puzzle has 8 squares', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares.length).toBe(8);
})

test('when initialized, a config 1 puzzle the first square in array is in row 0', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].row).toBe(0);
})

test('when initialized, a config 1 puzzle the first square is a red base square', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].color).toBe('red');
})

test('test square constuctor', () => {
  let square = new Square(0, 0, false, 'red', 'red');
  expect(square.color).toBe('red');
})

test('square.copy() method', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].copy()).not.toBe(model.puzzle.squares[0]);
})

test('test square constuctor to show the label', () => {
  let square = new Square(0, 0, false, 'red', 'base');
  expect(square.label).toBe('base');
})

test('when initialized, a config 1 puzzle the first square is a red base square and has a "red" label', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].label).toBe('base');
})

/**Test case for neighbors. */

test('neighbors of (0,1)', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[0]).toBe(model.puzzle.squares[0]);
  expect(model.puzzle.neighbors(selectedSquare)[1]).toBe(model.puzzle.squares[2]);
  expect(model.puzzle.neighbors(selectedSquare)[2]).toBe(null);
  expect(model.puzzle.neighbors(selectedSquare)[3]).toBe(model.puzzle.squares[5]);
})

test('neighbors of (1,3)', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[7];
  expect(model.puzzle.neighbors(selectedSquare)[0]).toBe(model.puzzle.squares[6]);
  expect(model.puzzle.neighbors(selectedSquare)[1]).toBe(null);
  expect(model.puzzle.neighbors(selectedSquare)[2]).toBe(model.puzzle.squares[3]);
  expect(model.puzzle.neighbors(selectedSquare)[3]).toBe(null);
})

/** Test is valid extend */
test('it is valid to extend from (0,0) to (1,0)', () => {
  var model = new Model(actualPuzzle);
  //select square (1,0)
  model.puzzle.select(model.puzzle.squares[4]);
  // fromSquare
  let fromSquare = model.puzzle.squares[0];
  expect(model.puzzle.isValidExtend(fromSquare)).toBe(true);
  // expect(fromSquare.label).toBe('base');
})

test('it is valid to extend from (1,0), that is labeled with "1" to (1,1)', () => {
  var model = new Model(actualPuzzle);

  //fromSquare
  let fromSquare = model.puzzle.squares[4];
  //add label "1" to fromSquare
  fromSquare.addLabel('1');
  //addColor to fromSquare;
  fromSquare.fillColor('red');
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
  expect(toSquare.label).toBe("1");

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

  //the puzzle should be all filled;
  expect(model.puzzle.isFull()).toBe(true);

  //game should be won
  expect(model.puzzle.hasWon()).toBe(true);

})


test('Test is valid path', () => {
  var model = new Model(actualPuzzle);

  let base1 = model.puzzle.squares[0];
  let base2 = model.puzzle.squares[2];

  /**these is still no path after (1,0) is extended' */
  //select square (0,1)
  model.puzzle.select(model.puzzle.squares[4]);

  model.puzzle.extendColor(base1);

  expect(model.puzzle.isPath(base1, base2)).toBe(false);

  /**there is no path after (0,1) is extended */
  model.puzzle.select(model.puzzle.squares[1]);
  model.puzzle.extendColor(model.puzzle.squares[2]);
  expect(model.puzzle.isPath(base1, base2)).toBe(false);

  /**there is no path after (1,1) is extended from (0,1) */
  model.puzzle.select(model.puzzle.squares[5]);
  model.puzzle.extendColor(model.puzzle.squares[1]);
  expect(model.puzzle.isPath(base1, base2)).toBe(false);
  //the puzzle is not filled yet;
  expect(model.puzzle.isFull()).toBe(false);

  //extend (1,3) from (1,2)
  let base3 = model.puzzle.squares[6];
  let base4 = model.puzzle.squares[3];
  model.puzzle.select(model.puzzle.squares[7]);
  model.puzzle.extendColor(base3);
  expect(model.puzzle.isPath(base3, base4)).toBe(true);

  //the puzzle should be all filled;
  expect(model.puzzle.isFull()).toBe(true);

  //game should not be won
  expect(model.puzzle.hasWon()).toBe(false);

})

test('puzzle is not full when initialized', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.isFull()).toBe(false);
})


// config 2

var actualPuzzle2 = getActualPuzzle(configuration_2);

test('the unused square is at row 1, column 1', () => {
  var model = new Model(actualPuzzle2);
  expect(model.puzzle.squares[9].color).toBe('black');
})

test('Test valid path for config 2', () => {
  var actualPuzzle = getActualPuzzle(configuration_2);
  var model = new Model(actualPuzzle);
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

  expect(model.puzzle.isPath(base1, base2)).toBe(true);
  expect(model.puzzle.hasWon()).toBe(false);
  // /**these is still no path after (1,0) is extended' */
  // //select square (0,1)
  // model.puzzle.select(model.puzzle.squares[4]);

  // model.puzzle.extendColor(base1);

  // 

  // /**there is no path after (0,1) is extended */
  // model.puzzle.select(model.puzzle.squares[1]);
  // model.puzzle.extendColor(model.puzzle.squares[2]);
  // expect(model.puzzle.isPath(base1, base2)).toBe(false);

  // /**there is no path after (1,1) is extended from (0,1) */
  // model.puzzle.select(model.puzzle.squares[5]);
  // model.puzzle.extendColor(model.puzzle.squares[1]);
  // expect(model.puzzle.isPath(base1, base2)).toBe(false);
  // //the puzzle is not filled yet;
  // expect(model.puzzle.isFull()).toBe(false);

  // //extend (1,3) from (1,2)
  // let base3 = model.puzzle.squares[6];
  // let base4 = model.puzzle.squares[3];
  // model.puzzle.select(model.puzzle.squares[7]);
  // model.puzzle.extendColor(base3);
  // expect(model.puzzle.isPath(base3, base4)).toBe(true);

  // //the puzzle should be all filled;
  // expect(model.puzzle.isFull()).toBe(true);

  // //game should not be won
  // expect(model.puzzle.hasWon()).toBe(false);

})