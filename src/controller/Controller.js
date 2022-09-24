import { computeSquare } from '../boundary/Boundary.js';
import Model from '../model/Model.js';
import { configuration_1, configuration_2, configuration_3, getActualPuzzle } from '../model/PuzzleConfig.js';

export function selectSquare(model, canvas, event) {
    //return a DOMRect object with info on size and its position relative to viewport
    const canvasRect = canvas.getBoundingClientRect();

    //find piece on which mouse was clicked. //if no valid piece was clicked on then the idx is <0 
    let idx = model.puzzle.squares.findIndex(square => {
        let rect = computeSquare(square);
        return rect.contains(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
    })
    //don't know who is selected just yet; may be none has been selected or click inside an area where there aren't any squares.

    let selected = null;
    if (idx >= 0) {
        selected = model.puzzle.squares[idx];
        //select this piece! Construct new model to represent this problem.
        model.puzzle.select(selected);
        return model.copy(); // since we need to create a new model on demand as that will trigger the refresh.
    } else { // if the model is selected at one piece => allow to select another one. but if the click was at a location outside of that => unselect
        model.puzzle.unSelect(); // note that unSelect does not need any params.
        return model.copy();
    }
}

/**
 * Unselect
 * - condition: if the select of a piece is ON, then deselect it and update state of model.
 */

export function unselectSquare(model) {
    model.puzzle.unSelect();
    return model.copy();
}


export function setConfiguration(model, configName){
    var actualPuzzle = getActualPuzzle(configName);
    return new Model(actualPuzzle);
}
