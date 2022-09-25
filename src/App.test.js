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

test('left neighbor of (0,1) must be 0,0', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[0]).toBe(model.puzzle.squares[0]);
})

test('right neighbor of (0,1) is (0,2)', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[1]).toBe(model.puzzle.squares[2]);
})

test('up neighbor of (0,1) must be null', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[2]).toBe(null);
})

test('down neighbor of (0,1) is (1,1)', () => {
  var model = new Model(actualPuzzle);
  var selectedSquare = model.puzzle.squares[1];
  expect(model.puzzle.neighbors(selectedSquare)[3]).toBe(model.puzzle.squares[5]);
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


// config 2

var actualPuzzle2 = getActualPuzzle(configuration_2);

test('the unused square is at row 1, column 1', () => {
  var model = new Model(actualPuzzle2);
  expect(model.puzzle.squares[9].color).toBe('black');
})

