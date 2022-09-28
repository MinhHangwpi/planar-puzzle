// export class ExtendType {
//     constructor(dr, dc) {
//         this.deltar = dr;
//         this.deltac = dc;
//     }
//     //later on may add more methods in here.
//     static parse(s) {
//         if ((s === "down") || (s === "Down")) { return Down; }
//         if ((s === "up") || (s === "Up")) { return Up; }
//         if ((s === "left") || (s === "Left")) { return Left; }
//         if ((s === "right") || (s === "Right")) { return Right; }

//         return NoMove;
//     }
// }

// export const Down = new ExtendType(1, 0, "down");
// export const Up = new ExtendType(-1, 0, "up");
// export const Left = new ExtendType(0, -1, "left");
// export const Right = new ExtendType(0, 1, "right");
// export const NoMove = new ExtendType(0, 0, "*");  // no move is possible



export class Square {
    constructor(row, column, isUnused, color, label) {
        this.row = row;
        this.column = column;
        this.isUnused = isUnused;
        this.color = color;
        this.label = label;
    }

    //fillColor(color) : boolean
    fillColor(color) {
        this.color = color;
    }

    //addLabel(): boolean; automatically add label based on status of surrounding neighbors and movetypes
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

        //    An empty square (+1) is adjacent in a given direction (+1) to a square filled with a color (+1) that has the highest label number for that color (+1). */

        if ((this.selected.isUnused) || (this.selected.color !== null) || (fromSquare.color === null) || (fromSquare.isUnused) || (fromSquare.label !== highestLabel)) { //note: need to add condition that the fromSquare has the highest label number.
            return false;
        }
        return true;
        // //check if the fromSquare has the highest label number or is either empty Square.
        // if (fromSquare.label === 'base') {
        //     return true;
        // }

        // // if fromSquare.label is a number => must make sure it has the highest label
        // let nbs = this.neighbors(fromSquare);
        // let count = 0;

        // for (let nb of nbs) {
        //     if (nb) {
        //         if ((nb.color === fromSquare.color) && (fromSquare.label > nb.label || nb.label == 'base')) {
        //             count += 1;
        //         }
        //     }
        // }
        // if (count >= 1) {
        //     return true;
        // }
        // return false;
    }


    isPath(base1, base2) {

        /**first attempt */
        // let queue = [];
        // queue.push(base1);
        // let visited = [];
        // visited.push(base1);

        // while (queue.length !== 0) {

        //     let y = queue.shift(); // pop the element in the front and return it.
        //     let nbs = this.neighbors(y);
        //     for (let nb of nbs) {
        //         if (nb) {
        //             if (!visited.includes(nb) && (nb.color === y.color) && (+nb.label > +y.label || nb.label === 'base' || y.label === 'base')) {
        //                 visited.push(nb);
        //                 if (nb === base2) {
        //                     return true;
        //                 }
        //                 queue.push(nb);
        //             }
        //         }
        //     }
        // }
        // return false;


        /**second attempt */
        //checking if an increasing path from base1 to base2 means checking a decreasing path from base2 to base 1
        let highestLabel = this.highestLabels[base2.color];
        // there must exist a neighbor that has the highest label
        let square = base2;
        while (square !== base1) {
            //nb of base2
            let nbs = this.neighbors(square);
            let hasNext = null;
            for (let nb of nbs) {
                if (nb) {
                    if (nb.label == highestLabel) {
                        //move the "square" pointer to the neighbor with the highestLabel;
                        square = nb;
                        //update highest label
                        highestLabel = highestLabel - 1;
                        hasNext = 1;
                        break;
                    }
                }
            }
            if (hasNext === null){
                return false;
            }
        }
        return true;
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

        if (fromSquare.label === 'base') {
            this.selected.addLabel("1");
            this.selected.fillColor(fromSquare.color);
            //update the highest label
            this.highestLabels[fromSquare.color] = this.selected.label;
            //console.log(this.highestLabels);
            return;
        }

        // if (fromSquare.label !== null && typeof (+fromSquare.label) === 'number') {
        //     let fSNumericLabel = +fromSquare.label;
        //     this.selected.addLabel(fSNumericLabel + 1);
        //     this.selected.fillColor(fromSquare.color);
        //     //update the highest label
        //     this.highestLabels[fromSquare.color] = this.selected.label;
        //     return;
        // }

        let fSNumericLabel = +fromSquare.label;
        this.selected.addLabel(fSNumericLabel + 1);
        this.selected.fillColor(fromSquare.color);
        //update the highest label
        this.highestLabels[fromSquare.color] = this.selected.label;
        //console.log(this.highestLabels);
        return;
    }

    getBasePairs() {
        let allBases = [];
        for (let square of this.squares) {
            if (square.label === 'base') {
                allBases.push(square);
            }
        }
        let basePairs = [];
        while (allBases.length) {
            basePairs.push(allBases.splice(0, 2))
        };
        return basePairs;
    }

    //hasWon()
    hasWon() {
        if (!this.isFull) {
            return false;
        }
        let basePairs = this.getBasePairs();
        for (let base of basePairs) {
            if (!this.isPath(base[0], base[1]) || !this.isPath(base[1], base[0])) {
                return false;
            }
        }
        return true;
    }


    //copy()/or clone()
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


        //all in one array.
        let allSquares = [] //numRows * numColumns in length.
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numColumns; j++) {
                let aSquare = new Square(i, j, false, null, null);
                allSquares.push(aSquare);
            }
        }
        let highestLabels = {};
        //special pieces
        for (let sq of info.baseSquares) {
            let bSquare = new Square(parseInt(sq.row), parseInt(sq.column), false, sq.color, 'base'); //note that isUnused of baseSquares is false
            let idx = allSquares.findIndex(square => (square.row == bSquare.row && square.column === bSquare.column));
            highestLabels[sq.color] = 'base';
            allSquares.splice(idx, 1, bSquare);
        }


        //unused squares
        for (let sq of info.unusedSquares) {
            let uSquare = new Square(parseInt(sq.row), parseInt(sq.column), true, 'black', null);
            let idx = allSquares.findIndex(square => (square.row === uSquare.row && square.column === uSquare.column));
            allSquares.splice(idx, 1, uSquare);
        }


        this.puzzle = new Puzzle(numRows, numColumns);
        this.puzzle.initialize(allSquares, highestLabels);
        this.victory = false;
        this.showLabels = false;
        // this.highestLabels = highestLabels;
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


    //available(direction)
    // available(idx){
    //     let fromNeighbor = this.neighbors(this.selected)[idx];
    //     return this.isValidExtend(fromNeighbor);


    //         //   // if no piece selected? Then none are available.
    //         //   if (!this.puzzle.selected) { return false; }
    //         //   if (direction === NoMove) { return false; }

    //         //   // HANDLE WINNING CONDITION. MUST BE AVAILABLE!
    //         //   if (this.puzzle.selected.isWinner && 
    //         //       this.puzzle.selected.row === this.puzzle.destination.row && 
    //         //       this.puzzle.selected.column === this.puzzle.destination.column && 
    //         //       this.puzzle.finalMove === direction) {
    //         //       return true;
    //         //   }

    //         //   let allMoves = this.puzzle.availableMoves();
    //         //   return allMoves.includes(direction);
    // }
    // available(index) {
    //     let selected = this.puzzle.selected;
    //     if (!this.puzzle.selected) { return false; }


    // }


    copy() {
        let m = new Model(this.info);
        m.puzzle = this.puzzle.clone();
        m.showLabels = this.showLabels;
        m.victory = this.victory;
        //m.highestLabels = this.highestLabels;
        return m;
    }
}

//
