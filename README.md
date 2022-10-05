## Download the source code in `src` folder


- Create a local folder and use ```create-react-app``` to initialize the react repository, named it as “plannar-puzzle-app” or what you see fit.
- Then replace the `src` folder of your initialized react app repository with the `src` folder here. 

## Download relevant packages and dependencies

### ```react-scripts```

The first time you retrieve this code, you will need to install the react scripts to work properly. To do this, type:
```npm install react-scripts –-save```

### Additional library for GUI testing
jest-dom to handle canvas elements for testing. Uninstall jest-canvas-mock (if installed) and install canvas and jest-dom

```
npm uninstall jest-canvas-mock
npm i --save-dev canvas
npm I --save-dev @testing-libray/jest-dom
```
Notes: do **not** alter the content of `setupTests.js`

## To run the app in the browser

In the project directory, you can run:
### ```npm start``` 
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.
The page will reload when you make changes.
You may also see any lint errors in the console.

### ```npm test``` 
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### Code coverage
run ```npm test -- --coverage```. If you don't see output as below please use ```npm test -- --coverage --watchAll``` instead. Note: two GUI test suites depend on `canvas` and `jest-dom` being installed, so please make sure you have them working.
```
  ✓ When initilized, a config 1 puzzle has 8 squares (1 ms)
  ✓ Properly renders "Try harder!!!" label, which is the default (52 ms)
  ✓ Test the getSquareByLoc() method (1 ms)
  ✓ In A config 1 puzzle, the first square is a red base square with label "0"
  ✓ Square.copy() method must return a different square object
  ✓ Test square constuctor to show the label (1 ms)
  ✓ Show 4 neighbors of (0,1) in configuration 1 (1 ms)
  ✓ Show 4 neighbors of (1,3) in configuration 1
  ✓ test controller classes (2 ms)
  ✓ Valid to extend from (0,0) to (1,0) in initial config 1 (1 ms)
  ✓ Valid to extend from (1,0), labeled with "1" to (1,1)
  ✓ Extend color from (0,0) to (1,0) (1 ms)
  ✓ Test is valid path (3 ms)
  ✓ Test an alternative valid path in config 1 (1 ms)
  ✓ Test the .isFull() method (1 ms)
  ✓ Correctly identify the unused square is at row 1, column 1
  ✓ Test valid path for config 2 (1 ms)
  ✓ Access GUI (72 ms)

------------------|---------|----------|---------|---------|--------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
------------------|---------|----------|---------|---------|--------------------
All files         |   89.38 |     87.5 |   81.81 |   90.25 |                    
 src              |      50 |       50 |   23.07 |      50 |                    
  App.js          |   51.85 |       50 |   23.07 |   51.85 | ...44,48-49,79-121 
  Layout.js       |     100 |      100 |     100 |     100 |                    
  index.js        |       0 |      100 |     100 |       0 | 7-8                
 src/boundary     |   96.66 |    83.33 |     100 |     100 |                    
  Boundary.js     |   96.66 |    83.33 |     100 |     100 | 66-72              
 src/controller   |   80.76 |    33.33 |     100 |   80.76 |                    
  Controller.js   |   80.76 |    33.33 |     100 |   80.76 | 23-24,38-41        
 src/model        |   96.85 |    92.85 |     100 |   98.01 |                    
  Model.js        |   96.77 |    92.85 |     100 |   97.95 | 206,271,286        
  PuzzleConfig.js |     100 |      100 |     100 |     100 |                    
------------------|---------|----------|---------|---------|--------------------
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        1.255 s
Ran all test suites.
```
## To play the game.

Choose the *puzzle configuration level* (default at easy level). \
Use the `left`, `right`, `up`, `down` to indicate which neighbor the selected square will extend color *from*. For example, if the selected square is located at the second row and the first column, then the `up` button will indicate the neighbor in the first row and first column.

## Contact me

If you run into any issue, please contact me via mgradetsky@wpi.edu. Thank you very much!
