window.tetris = {};
(function(SCOPE) {
    // constants and such
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
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]
                ],
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]
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

    // matrix singleton
    var MATRIX = {
        render: function() {
            // local helper functions
            function buildMatrixCell(matrixCell) {
                return '<td' + (matrixCell ? ' class="full"' : '') + '></td>';
            }
            function buildMatrixRow(matrixRow) {
                var matrixRowHtml = '<tr>';
                for (var i = 0; i < matrixRow.length; i++) {
                    matrixRowHtml += buildMatrixCell(matrixRow[i]);
                }
                matrixRowHtml += '</tr>';
                return matrixRowHtml;
            }

            // create HTML and fill it
            var matrixHtml = '<tbody>';
            for (var i = 0; i < this.grid.length; i++) {
                matrixHtml += buildMatrixRow(this.grid[i]);
            }
            matrixHtml += '</tbody>';
            this.$elem.children('table').html(matrixHtml);
        },
        init: function($elem, height, width) {
            this.$elem = $elem;
            this.height = height;
            this.width = width;
            this.grid = (function() {
                var grid = [];
                for (var i = 0; i < height; i++) {
                    var matrixRow = [];
                    for (var k = 0; k < width; k++) {
                        matrixRow.push(0);    
                    }
                    grid.push(matrixRow);
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
            // TODO: decouple somehow
            MATRIX.$elem.prepend('<div id="tetromino" class="' + type + '"></div>');        
            $elem = $('#tetromino');
            $elem.css({
                top: (40 * y) + 'px',
                left: (40 * x) + 'px'
            });
        };
        function destroy() {
            $elem.remove();
        };
        function checkCollision(xShift, yShift, spinShift) {
            for (var i = 0; i < height; i++) {
                var tetrominoGrid = TETROMINO_CONFIG[type].grids[(spin + spinShift) % 4], // the new grid config, taking the spin into account
                    tetrominoRowValue = parseInt(tetrominoGrid[i].join(''), 2), // the value for this row
                    leftShiftAmount = MATRIX.width - width - x - xShift, // the amount to shift this row by to match the matrix
                    paddedTetrominoRowValue = leftShiftAmount > 0 ? tetrominoRowValue << leftShiftAmount : tetrominoRowValue >>> -leftShiftAmount, // the value for this row with padding added to match the matrix
                    matrixRowIndex = i + y + yShift; // the row index to check in the matrix

                if (x + xShift + width > MATRIX.width && tetrominoRowValue % 2) {
                    // we hit the right side of the matrix!
                    console.log('we hit the right side of the matrix!');
                    return false;
                } else if (x + xShift < 0 && tetrominoGrid[i][0]) {
                    // we hit the right side of the matrix!
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
                destroy();
                // TODO: use pubsub for this part
                MATRIX.render();
                SCOPE.tetromino = new Tetromino('T');
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
        SCOPE.tetromino = new Tetromino('T'); // our current tetromino
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


