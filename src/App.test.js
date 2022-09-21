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
  let square = new Square(0, 0, false, 'red');
  expect(square.color).toBe('red');
})

test('square.copy() method', () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.squares[0].copy()).not.toBe(model.puzzle.squares[0]);
})

// config 2

var actualPuzzle2 = getActualPuzzle(configuration_2);

test('the unused square is at row 1, column 1', () => {
  var model = new Model(actualPuzzle2);
  expect(model.puzzle.squares[9].color).toBe('black');
})

