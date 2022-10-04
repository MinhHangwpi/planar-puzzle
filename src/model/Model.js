export class Square {
    constructor(row, column, isUnused, color, label) {
        this.row = row;
        this.column = column;
        this.isUnused = isUnused;
        this.color = color;
        this.label = label;
    }

    fillColor(color) {
        this.color = color;
    }

    addLabel(string) {
        this.label = string;
    }

    copy() {
        let s = new Square(this.row, this.column, this.isUnused, this.color, this.label);
        return s;
    }
}

export class Puzzle {
    constructor(numRows, numColumns) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.selected = null;
    }
    initialize(squares, highestLabels) {
        //make sure to create new Square objects
        this.squares = squares.map(p => p.copy());
        this.highestLabels = { ...highestLabels };
    }

    getIndexByLoc(row, column) {
        return row * this.numColumns + column;
    }

    getSquareByLoc(row, column) {
        let idx = this.getIndexByLoc(row, column);
        return this.squares[idx];
    }

    select(square) {
        if (square.isUnused || this.isFull()) { return; }
        this.selected = square;
    }

    unSelect() {
        this.selected = null;
    }

    isSelected(square) {
        return square === this.selected;
    }

    neighbors(square) {

        let neighborsList = [];
        let sRow = square.row;
        let sColumn = square.column;

        let left = null;
        let right = null;
        let up = null;
        let down = null;

        //get left neighbor:
        if (sColumn > 0 && sColumn < this.numColumns) {
            left = this.getSquareByLoc(sRow, sColumn - 1);
        }

        //get right neighbor:
        if (sColumn >= 0 && sColumn < this.numColumns - 1) {
            right = this.getSquareByLoc(sRow, sColumn + 1);
        }

        //get up neighbors:
        if (sRow > 0 && sRow < this.numRows) {
            up = this.getSquareByLoc(sRow - 1, sColumn);
        }
        // get down neighbors:
        if (sRow >= 0 && sRow < this.numRows - 1) {
            down = this.getSquareByLoc(sRow + 1, sColumn);
        }

        neighborsList.push(left);
        neighborsList.push(right);
        neighborsList.push(up);
        neighborsList.push(down);

        return neighborsList;
    }

    isValidExtend(fromSquare) {
        let highestLabel = this.highestLabels[fromSquare.color];

        //An empty square (+1) is adjacent in a given direction (+1) to a square filled with a color (+1) that has the highest label number for that color (+1). */

        if ((this.selected.isUnused) || (this.selected.color !== null) || (fromSquare.color === null) || (fromSquare.isUnused) || (fromSquare.label !== highestLabel)) { //note: need to add condition that the fromSquare has the highest label number.
            return false;
        }
        return true;
    }


    isPath(fromSquare, toSquare) {

        let highestLabel = this.highestLabels[toSquare.color];
        //fromSquare must be next to a neighbor labeled 1 of the same color
        let fHasNext = false;
        let fnbs = this.neighbors(fromSquare);
        for (let fnb of fnbs) {
            if (fnb) {
                if (fnb.color === fromSquare.color && fnb.label === 1) {
                    fHasNext = true;
                    break;
                }
            }
        }

        let tHasNext = false;
        //toSquare must be next to a neighbor labeled as the highest label of the same color
        let tnbs = this.neighbors(toSquare);

        for (let tnb of tnbs) {
            if (tnb) {
                if (tnb.color === toSquare.color && tnb.label === highestLabel) {
                    tHasNext = true;
                    break;
                }
            }
        }
        //those two don't happen simultaneously then return false;
        if (fHasNext && tHasNext) {
            return true;
        }
        return false;
    }

    isFull() {
        for (let square of this.squares) {
            if (!square.isUnused && !square.color) {
                return false;
            }
        }
        return true;
    }

    extendColor(fromSquare) {
        if (!this.selected || !this.isValidExtend(fromSquare)) { return; }
        let fromLabel = fromSquare.label;
        this.selected.addLabel(fromLabel + 1);
        this.selected.fillColor(fromSquare.color);
        //update the highest label
        this.highestLabels[fromSquare.color] = this.selected.label;
        // console.log(this.highestLabels);
        return;
    }

    getBasePairs() {
        let allBases = [];
        for (let square of this.squares) {
            if (square.label === 0 && square.color && square.color !== 'black') {
                allBases.push(square);
            }
        }

        allBases.sort((a, b) => {
            if (a.color < b.color) {
                return -1;
            }
            if (a.color > b.color) {
                return 1;
            }
            // a must be equal to b
            return 0;
        })

        let basePairs = [];
        while (allBases.length) {
            basePairs.push(allBases.splice(0, 2))
        };
        return basePairs;
    }

    hasWon() {
        if (!this.isFull()) {
            return false;
        }
        let basePairs = this.getBasePairs();
        let numBasePairs = basePairs.length;

        let pathConnected = 0;
        for (let basePair of basePairs) {

            if (this.isPath(basePair[0], basePair[1]) || this.isPath(basePair[1], basePair[0])) {
                pathConnected++;
            }

            if (pathConnected === numBasePairs) {
                return true;
            }
        }
        return false;
    }

    clone() {
        let copy = new Puzzle(this.numRows, this.numColumns);
        copy.squares = [];
        for (let sq of this.squares) {
            let dup = sq.copy();
            copy.squares.push(dup);
            if (sq === this.selected) {
                copy.selected = dup;
            }
        }
        copy.highestLabels = { ...this.highestLabels };
        return copy;
    }
}


export default class Model {

    //attributes need to include: configurations; currentPuzzle: PlanarPuzzle; victory: boolean
    constructor(info) {
        this.initialize(info);
        this.info = info;
    }
    initialize(info) {
        let name = info.name;
        let numRows = parseInt(info.numRows);
        let numColumns = parseInt(info.numColumns);

        let allSquares = []
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numColumns; j++) {
                let aSquare = new Square(i, j, false, null, 0);
                allSquares.push(aSquare);
            }
        }
        let highestLabels = {};
        //special pieces
        for (let sq of info.baseSquares) {
            let bSquare = new Square(parseInt(sq.row), parseInt(sq.column), false, sq.color, 0);
            let idx = allSquares.findIndex(square => (square.row === bSquare.row && square.column === bSquare.column));
            highestLabels[sq.color] = 0;
            allSquares.splice(idx, 1, bSquare);
        }

        //unused squares
        for (let sq of info.unusedSquares) {
            let uSquare = new Square(parseInt(sq.row), parseInt(sq.column), true, 'black', 0);
            let idx = allSquares.findIndex(square => (square.row === uSquare.row && square.column === uSquare.column));
            allSquares.splice(idx, 1, uSquare);
        }


        this.puzzle = new Puzzle(numRows, numColumns);
        this.puzzle.initialize(allSquares, highestLabels);
        this.victory = false;
        this.showLabels = false;
    }

    //setVictorious()
    setVictorious() {

        if (this.puzzle.isFull() && this.puzzle.hasWon()) {
            this.victory = true;
        } else {
            this.victory = false;
        }
    }
    //isVictorious()
    isVictorious() {
        return this.victory;
    }

    available(idx) {
        // if no piece selected? Then none are available.
        if (!this.puzzle.selected) { return false; }

        if (this.puzzle.hasWon()) {
            return false;
        }
        let nb = this.puzzle.neighbors(this.puzzle.selected)[idx];
        if (nb) {
            return this.puzzle.isValidExtend(nb);
        } else {
            return false;
        }
    }

    copy() {
        let m = new Model(this.info);
        m.puzzle = this.puzzle.clone();
        m.showLabels = this.showLabels;
        m.victory = this.victory;
        return m;
    }
}

//
