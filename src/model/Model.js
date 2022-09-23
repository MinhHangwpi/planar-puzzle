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
    constructor(row, column, isUnused, color) {
        this.row = row;
        this.column = column;
        this.isUnused = isUnused;
        this.color = color;
        //this.selected = false; //check again to see if this overlaps with .select in Puzzle.
    }

    //selectSquare(): boolean

    //fillColor(color) : boolean

    //addLabel(): boolean; automatically add label based on status of surrounding neighbors and movetypes


    copy() {
        let s = new Square(this.row, this.column, this.isUnused, this.color);
        s.selected = this.selected;
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
    }

    //neighbors
    neighbors(square) {
        let neighborsList = [];
        let sRow = square.row;
        let sColumn = square.column;

        let left = this.getSquareByLoc(sRow - 1, sColumn);
        let right = this.getSquareByLoc(sRow + 1, sColumn);
        let up = this.getSquareByLoc(sRow, sColumn + 1);
        let down = this.getSquareByLoc(sRow, sColumn - 1);

    }

    select(square) {
        this.selected = square;
    }

    isSelected(square) {
        return square === this.selected;
    }
    //isValidExtend

    //extendColor

    //hasWon()

    //availableMoves()

    //copy()/or clone()

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
                let aSquare = new Square(i, j, false, null);
                allSquares.push(aSquare);
            }
        }

        //special pieces
        for (let sq of info.baseSquares) {
            let bSquare = new Square(parseInt(sq.row), parseInt(sq.column), false, sq.color); //note that isUnused of baseSquares is false
            let idx = allSquares.findIndex(square => (square.row == bSquare.row && square.column === bSquare.column));
            allSquares.splice(idx, 1, bSquare);
        }
        //unused squares
        for (let sq of info.unusedSquares) {
            let uSquare = new Square(parseInt(sq.row), parseInt(sq.column), true, 'black');
            let idx = allSquares.findIndex(square => (square.row === uSquare.row && square.column === uSquare.column));
            allSquares.splice(idx, 1, uSquare);
        }

        this.puzzle = new Puzzle(numRows, numColumns);
        this.puzzle.initialize(allSquares);
        this.victory = false;
        this.showLabels = false;
    }

    //setConfiguration(); parameter (config_name)




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
}
