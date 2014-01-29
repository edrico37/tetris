window.tetris = {};
(function(SCOPE) {
    // private properties (constants and such)
    var BLOCK_SIZE = 40;
    var TETROMINO_CONFIG = {
        T: {
            height: 3,
            width: 3,
            grids: [
                [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ]
            ]
        },
        S: {
            height: 3,
            width: 3,
            grids: [
                [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ]
            ]
        },
        Z: {
            height: 3,
            width: 3,
            grids: [
                [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [1, 0, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 0],
                    [1, 0, 0]
                ]
            ]
        },
        L: {
            height: 3,
            width: 3,
            grids: [
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [1, 0, 0]
                ],
                [
                    [1, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ]
            ]
        },
        J: {
            height: 3,
            width: 3,
            grids: [
                [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                [
                    [0, 1, 1],
                    [0, 1, 0],
                    [0, 1, 0]
                ],
                [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 1]
                ]
            ]
        },
        I: {
            height: 4,
            width: 4,
            grids: [
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]
                ],
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]
                ]
            ]
        },
        O: {
            height: 2,
            width: 2,
            grids: [
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 1]
                ]
            ]
        }
    }

    // private util functions
    function buildGrid(grid) {
        var gridHtml = '<table class="grid"><tbody>'
        for (var i = 0; i < grid.length; i++) {
            gridHtml += '<tr class="row">';
            var gridRow = grid[i];
            for (var k = 0; k < gridRow.length; k++) {
                gridHtml += '<td class="cell' + (gridRow[k] ? ' full' : '') + '"></td>';
            }
            gridHtml += '</tr>';
        }
        gridHtml += '</tbody></table>';
        return gridHtml;
    }

    function getRandomType() {
        // generates a random tetromino type
        var types = ['T', 'S', 'Z', 'L', 'J', 'I', 'O'];

        return types[Math.round(Math.random() * 6)];
    }

    // matrix singleton
    var MATRIX = {
        render: function() {
            this.$elem.html(buildGrid(this.grid));
        },
        init: function($elem, height, width) {
            this.$elem = $elem;
            this.height = height;
            this.width = width;
            this.grid = (function() {
                var grid = [];
                for (var i = 0; i < height; i++) {
                    var gridRow = [];
                    for (var k = 0; k < width; k++) {
                        gridRow.push(0);    
                    }
                    grid.push(gridRow);
                }
                return grid;
            })();
            this.render();
        }
    };

    function Tetromino(type) {
        // private properties
        var $elem,
            spin = 0,
            x = 4,
            y = 0,
            grid = TETROMINO_CONFIG[type].grids[spin],
            height = TETROMINO_CONFIG[type].height,
            width = TETROMINO_CONFIG[type].width;


        // private functions
        function render() {
            $elem = $(document.createElement('div'));
            $elem.addClass('tetromino ' + type).html(buildGrid(grid)).css({
                top: (40 * y) + 'px',
                left: (40 * x) + 'px'
            });
            $('body').prepend($elem);
        };
        function checkCollision(xShift, yShift, spinShift) {
            for (var i = 0; i < height; i++) {
                var tetrominoGrid = TETROMINO_CONFIG[type].grids[(spin + spinShift) % 4], // the new grid config, taking the spin into account
                    tetrominoRowValue = parseInt(tetrominoGrid[i].join(''), 2), // the value for this row
                    leftShiftAmount = MATRIX.width - width - x - xShift, // the amount to shift this row by to match the matrix
                    paddedTetrominoRowValue = leftShiftAmount > 0 ? tetrominoRowValue << leftShiftAmount : tetrominoRowValue >>> -leftShiftAmount, // the value for this row with padding added to match the matrix
                    matrixRowIndex = i + y + yShift; // the row index to check in the matrix

                if (x + xShift + width > MATRIX.width && tetrominoRowValue % Math.pow(2, x + xShift + width - MATRIX.width)) { // this will make sure we're looking deep enough into the tetromino grid
                    // we hit the right side of the matrix!
                    console.log('we hit the right side of the matrix!');
                    return false;
                } else if (x + xShift < 0 && tetrominoGrid[i][-1 * (1 + x + xShift)]) { // see above for formula explanation
                    // we hit the left side of the matrix!
                    console.log('we hit the left side of the matrix!');
                    return false;
                } else if (matrixRowIndex < MATRIX.grid.length) {
                    var matrixRowValue = parseInt(MATRIX.grid[matrixRowIndex].join(''), 2);
                    if (matrixRowValue & paddedTetrominoRowValue) {
                        // we hit another piece!
                        console.log('we hit another piece!');
                        return false;
                    }
                } else if (tetrominoRowValue) {
                    // we hit the bottom of the matrix!
                    console.log('we hit the bottom of the matrix!');
                    return false;
                }
            }
            // no collisions!
            return true;
        };
        function lock() {
            for (var i = 0; i < height; i++) {
                for (k = 0; k < width; k++) {
                    var mY = i + y, // y-coordinate in matrix
                        mX = k + x; // x-coordinate in matrix
                    if (mY < MATRIX.height && mX < MATRIX.width) {
                        var matrixCell = MATRIX.grid[mY][mX],
                            tetrominoCell = grid[i][k];
                        MATRIX.grid[mY][mX] = matrixCell || tetrominoCell;
                    }
                }
            }
            $elem.addClass('locked');
        };

        // public functions
        this.moveDown = function() {
            if (checkCollision(0, 1, 0)) {
                console.log('moving down...');
                y++;
                $elem.css({
                    top: (40 * y) + 'px'
                });
            } else {
                lock();
                SCOPE.tetromino = new Tetromino(getRandomType());
            }
        };

        this.moveLeft = function() {
            if (checkCollision(-1, 0, 0)) {
                console.log('moving left...');
                x--;
                $elem.css({
                    left: (40 * x) + 'px'
                });
            }
        };

        this.moveRight = function() {
            if (checkCollision(1, 0, 0)) {
                console.log('moving right...');
                x++;
                $elem.css({
                    left: (40 * x) + 'px'
                });
            }
        };

        this.rotate = function() {
            if (checkCollision(0, 0, 1)) {
                console.log('rotating...');
                $elem.removeClass('spin-' + spin);
                spin = (spin + 1) % 4;
                grid = TETROMINO_CONFIG[type].grids[spin];
                $elem.addClass('spin-' + spin);
            }
        };

        // render on creation
        render();
    }


    // initialization bullshit
    function init() {
        MATRIX.init($('#matrix'), 20, 10); // initialize matrix
        SCOPE.tetromino = new Tetromino(getRandomType()); // our current tetromino
        // controls
        $(document).keydown(function(event) {
            var key = event.which;
            if (key >= 37 && key <= 40) {
                // arrow keys
                event.preventDefault();
                switch (key) {
                    case 37:
                        SCOPE.tetromino.moveLeft();
                        break;
                    case 38:
                        SCOPE.tetromino.rotate();
                        break;
                    case 39:
                        SCOPE.tetromino.moveRight();
                        break;
                    case 40:
                        SCOPE.tetromino.moveDown();
                        break;
                }
            }
        });
    }

    $(document).ready(function() {
        init();
    })
})(window.tetris);


