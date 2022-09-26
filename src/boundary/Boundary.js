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

    /** Does the (x,y) point exist within the rectangle. */
    contains(row, column) {
        return row >= this.row && row <= (this.row + this.width) && column >= this.column && column <= (this.column + this.height);
    }
}

/** Map square into the puzzle view*/

export function computeSquare(square) {
    return new VisualSquare(BOXSIZE * square.column + OFFSET, BOXSIZE * square.row + OFFSET,
        SQUAREWIDTH - OFFSET, SQUAREHEIGHT - OFFSET)
}


/** Draw puzzle */

export function drawPuzzle(ctx, puzzle, showLabels) {
    ctx.shadowColor = "black";
    let selected = puzzle.selected;

    //do sth for every piece
    puzzle.squares.forEach(square => {
        let sq = computeSquare(square);

        if (square === selected) {
            ctx.fillStyle = 'green';
        } else {
            if (!square.color) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = square.color;
            }
        }
        ctx.shadowBlur = 5;
        ctx.fillRect(sq.row, sq.column, sq.width, sq.height); // draw a filled rectangle whose starting point at (x, y)
        
        // if (square.color) {
        //     ctx.fillText(square.color, sq.row, sq.column);
        // }
        ctx.fillText(square.label, sq.row, sq.column) // issue with label here.
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



}