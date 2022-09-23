import { computeSquare } from '../boundary/Boundary.js';

export function selectSquare(model, canvas, event) {
    const canvasRect = canvas.getBoundingClientRect();

    //find piece on which mouse was clicked.
    let idx = model.puzzle.squares.findIndex(square => {
        let rect = computeSquare(square);
        return rect.contains(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
    })
    //don't know who is selected just yet; may be none has been selected or click inside an area where there aren't any squares.

    let selected = null;
    if (idx >= 0) {
        selected = model.puzzle.squares[idx];
    }

    //select this piece! Construct new model to represent this problem.
    model.puzzle.select(selected);
    return model.copy(); // since we need to create a new model on demand as that will trigger the refresh. 
}