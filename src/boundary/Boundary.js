/** Redraw the entire canvas from model */

/** Scaling constants for canvas */
var BOXSIZE = 100;
const OFFSET = 8;
const SQUAREWIDTH = 100;
const SQUAREHEIGHT = 100;


/** Represents a square visually */
export class VisualSquare {
    constructor(row, column, width, height) {
        this.row = row;
        this.column = column;
        this.width = width;
        this.height = height;
    }
}



/** Map square into the puzzle view*/

export function computeSquare(square) {
    return new VisualSquare(BOXSIZE * square.column + OFFSET, BOXSIZE * square.row + OFFSET,
        80 , 80)
}


/** Draw puzzle */

export function drawPuzzle(ctx, puzzle, showLabels) {
    ctx.shadowColor = "black";
    let selected = puzzle.selected;

    //do sth for every piece
    puzzle.squares.forEach(square => {
        let sq = computeSquare(square);

        if (square === selected) {
            ctx.fillStyle = 'green'; //darker than its color
        } else {
            if (!square.color) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = square.color;
            }
        }
        //ctx.shadowBlur = 10;
        ctx.fillRect(sq.row, sq.column, sq.width, sq.height); // draw a filled rectangle whose starting point at (x, y)
    })
}

export function redrawCanvas(model, canvasObj, appObj) {
    const ctx = canvasObj.getContext('2d');
    if (ctx === null) { return; } //here for testing purposes

    // clear the canvas area before rendering the coordinations held in state
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);


    if (model.puzzle) {
        drawPuzzle(ctx, model.puzzle, model.showLabels);
    }

    // let nr = model.puzzle.numRows;
    // let nc = model.puzzle.numColumns;

    // ctx.fillStyle = 'yellow';
    // ctx.fillRect(100, 100, canvasObj.width, canvasObj.height)

}