export class ExtendType {
    constructor(dr, dc) {
        this.deltar = dr;
        this.deltac = dc;
    }
    //later on may add more methods in here.
    static parse(s) {
        if ((s === "down") || (s === "Down")) { return Down; }
        if ((s === "up") || (s === "Up")) { return Up; }
        if ((s === "left") || (s === "Left")) { return Left; }
        if ((s === "right") || (s === "Right")) { return Right; }

        return NoMove;
    }
}

export const Down = new ExtendType(1, 0, "down");
export const Up = new ExtendType(-1, 0, "up");
export const Left = new ExtendType(0, -1, "left");
export const Right = new ExtendType(0, 1, "right");
export const NoMove = new ExtendType(0, 0, "*");  // no move is possible



export class Square {
    constructor(row, column, isUnused, color, label) {
        this.row = row;
        this.column = column;
        this.isUnused = isUnused;
        this.color = color;
        //label = null at first;
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
        //s.selected = this.selected;
        return s;
    }
}

export class Puzzle {
    constructor(numRows, numColumns) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.selected = null;
    }
    initialize(squares) {
        //make sure to create new Square objects
        this.squares = squares.map(p => p.copy());
    }

    getSquareByLoc(row, column) {
        let idx = row * this.numRows + column;
        return this.squares[idx];
    }

    select(square) {
        if (square.isUnused) { return; }
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



    //isValidExtend

    isValidExtend(fromSquare) {
        //this.selected fromSquare
        //** An empty square (+1) is adjacent in a given direction (+1) to a square filled with a color (+1) that has the highest label number for that color (+1). */
        if (this.selected.isUnused || this.selected.color || !fromSquare.color || fromSquare.isUnused) { //note: need to add condition that the fromSquare has the highest label number.
            return false;
        }
        //check if the fromSquare has the highest label number or is either empty Square.
        if (fromSquare.label === 'base') {
            return true;
        }

        // if fromSquare.label is a number => must make sure it has the highest label
        let fSNeighbors = this.neighbors(fromSquare);

        return ((fSNeighbors[0] !== null) && (fSNeighbors[0].label !== null) && (+fromSquare.label > +fSNeighbors[0].label)) ||
            ((fSNeighbors[1] !== null) && (fSNeighbors[1].label !== null) && (+fromSquare.label > +fSNeighbors[1].label)) ||
            ((fSNeighbors[2] !== null) && (fSNeighbors[2].label !== null) && (+fromSquare.label > +fSNeighbors[2].label)) ||
            ((fSNeighbors[3] !== null) && (fSNeighbors[3].label !== null) && (+fromSquare.label > +fSNeighbors[3].label))
    }


    //extendColor
    /**
     * 
     * @returns /**
         * if no square is selected, return false;
         * else:
         *      this.selected.label - fromSquare.label.
         * 
         * if label == null => false
         * if label === a color => this.selected.label = 1
         * if label != a color but is a number => this.selected.label = fromSquare.label + 1
         */
    extendColor(fromSquare) {
        if (!this.selected || !this.isValidExtend(fromSquare)) { return; }

        if (fromSquare.label === 'base') {
            this.selected.addLabel("1");
            this.selected.fillColor(fromSquare.color);
            return;
        }

        if (fromSquare.label !== null && typeof (+fromSquare.label) === 'number') {
            let fSNumericLabel = +fromSquare.label;
            this.selected.addLabel(fSNumericLabel + 1);
            this.selected.fillColor(fromSquare.color);
            return;
        }
    }




    //hasWon()

    //availableMoves()

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
        return copy;
    }

    /**
     * +2	PlanarPuzzle(info)	+1 for constructor; +1 for incoming info 
+4	neighbors (sq:Square) : Square[*]	+1 for method; +1 for arg; + 2 for response/multiplicity 
+4	isValidExtend(row:int, col:int, c:Color) : bool	+1 for method; +1 for coordinate position; +1 for color 
          +1 for result 
+4	extendColor(row:int, col:int, c:Color) : bool	+1 for method; +1 for coordinate position; +1 for color 
          +1 for result 
+2	hasWon() : Boolean	+1 for method; +1 for result
     */

    // return all blocks

    *blocks() {
        for (let i = 0; i < this.squares.length; i++) {
            yield this.squares[i];
        }
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

        //special pieces
        for (let sq of info.baseSquares) {
            let bSquare = new Square(parseInt(sq.row), parseInt(sq.column), false, sq.color, 'base'); //note that isUnused of baseSquares is false
            let idx = allSquares.findIndex(square => (square.row == bSquare.row && square.column === bSquare.column));
            allSquares.splice(idx, 1, bSquare);
        }
        //unused squares
        for (let sq of info.unusedSquares) {
            let uSquare = new Square(parseInt(sq.row), parseInt(sq.column), true, 'black', null);
            let idx = allSquares.findIndex(square => (square.row === uSquare.row && square.column === uSquare.column));
            allSquares.splice(idx, 1, uSquare);
        }

        this.puzzle = new Puzzle(numRows, numColumns);
        this.puzzle.initialize(allSquares);
        this.victory = false;
        this.showLabels = false;
    }

    //setConfiguration()

    //setVictorious()
    setVictorious() {
        this.victory = true;
    }


    //isVictorious()
    isVictorious() {
        return this.victory;
    }


    //available(direction)


    //copy()
    copy() {
        let m = new Model(this.info);
        m.puzzle = this.puzzle.clone();
        m.showLabels = this.showLabels;
        m.victory = this.victory;
        return m;
    }
}

//
