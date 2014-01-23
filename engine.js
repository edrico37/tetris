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

function Matrix(height, width) {
    // properties
    this.element = $('#matrix');
    this.height = height;
    this.width = width;
    this.grid = [];
    for (var i = 0; i < this.height; i++) {
        var matrixRow = [];
        for (var k = 0; k < this.width; k++) {
            matrixRow.push(0);    
        }
        this.grid.push(matrixRow);
    }

    // functions
    this.lockTetromino = function(tetromino) {
        // can we do this more efficiently with bitwise operators?
        for (var i = 0; i < tetromino.height; i++) {
            for (k = 0; k < tetromino.width; k++) {
                var y = i + tetromino.y;
                var x = k + tetromino.x;
                if (y < this.height && x < this.width) {
                    var matrixCell = this.grid[y][x];
                    var tetrominoCell = tetromino.grid[i][k];
                    this.grid[y][x] = matrixCell || tetrominoCell;
                }
            }
        }
        // overwrite old tetromino
        tetromino.destroy();
        window.tetromino = new Tetromino('T');
        window.tetromino.render();
    };
    
    this.render = function() {
        // local helper functions
        function buildMatrixCell(matrixCell) {
            return '<td' + (matrixCell ? ' class="full"' : '') + '></td>';
        }
        function buildMatrixRow(matrixRow) {
            var matrixRowHtml = '<tr>';
            for (var i = 0; i < matrixRow.length; i++) {
                matrixRowHtml += buildMatrixCell(matrixRow[i]);
            }
            matrixRowHtml += '</tr>'
            return matrixRowHtml;
        }

        // create HTML and fill it
        var matrixHtml = '<tbody>';
        for (var i = 0; i < this.grid.length; i++) {
            matrixHtml += buildMatrixRow(this.grid[i]);
        }
        matrixHtml += '</tbody>';
        this.element.children('table').html(matrixHtml);
    };
}

function Tetromino(type) {
    // properties
    this.type = type;
    this.spin = 0;
    this.x = 4;
    this.y = 0;
    this.grid = TETROMINO_CONFIG[this.type].grids[this.spin];
    this.height = TETROMINO_CONFIG[this.type].height;
    this.width = TETROMINO_CONFIG[this.type].width;


    // functions
    this.render = function() {
        matrix.element.prepend('<div id="tetromino" class="' + this.type + '"></div>');        
        this.element = $('#tetromino');
        this.element.css({
            top: (40 * this.y) + 'px',
            left: (40 * this.x) + 'px'
        });
    };
    
    this.destroy = function() {
        this.element.remove();
    };

    this.checkCollision = function(xShift, yShift, spin) {
        for (var i = 0; i < this.height; i++) {
            var tetrominoGrid = TETROMINO_CONFIG[this.type].grids[(this.spin + spin) % 4], // the new grid config, taking the spin into account
                tetrominoRowValue = parseInt(tetrominoGrid[i].join(''), 2), // the value for this row
                leftShiftAmount = matrix.width - this.width - this.x - xShift, // the amount to shift this row by to match the matrix
                paddedTetrominoRowValue = leftShiftAmount > 0 ? tetrominoRowValue << leftShiftAmount : tetrominoRowValue >>> -leftShiftAmount, // the value for this row with padding added to match the matrix
                matrixRowIndex = i + this.y + yShift; // the row index to check in the matrix

            if (this.x + xShift + this.width > matrix.width && tetrominoRowValue % 2) {
                // we hit the right side of the matrix!
                console.log('we hit the right side of the matrix!');
                return false;
            } else if (this.x + xShift < 0 && tetrominoGrid[i][0]) {
                // we hit the right side of the matrix!
                console.log('we hit the left side of the matrix!');
                return false;
            } else if (matrixRowIndex < matrix.grid.length) {
                var matrixRowValue = parseInt(matrix.grid[matrixRowIndex].join(''), 2);
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

    this.moveDown = function() {
        if (this.checkCollision(0, 1, 0)) {
            console.log('moving down...');
            this.y++;
            this.element.css({
                top: (40 * this.y) + 'px'
            });
        } else {
            matrix.lockTetromino(this);
            matrix.render();
        }
    };

    this.moveLeft = function() {
        if (this.checkCollision(-1, 0, 0)) {
            console.log('moving left...');
            this.x--;
            this.element.css({
                left: (40 * this.x) + 'px'
            });
        }
    };

    this.moveRight = function() {
        if (this.checkCollision(1, 0, 0)) {
            console.log('moving right...');
            this.x++;
            this.element.css({
                left: (40 * this.x) + 'px'
            });
        }
    };

    this.rotate = function() {
        if (this.checkCollision(0, 0, 1)) {
            console.log('rotating...');
            this.element.removeClass('spin-' + this.spin);
            this.spin = (this.spin + 1) % 4;
            this.grid = TETROMINO_CONFIG[this.type].grids[this.spin];
            this.element.addClass('spin-' + this.spin);
        }
    };
}


// initialization bullshit
function init() {
    window.matrix = new Matrix(20, 10);
    matrix.render();
    window.tetromino = new Tetromino('T');
    tetromino.render();
    // controls
    $(document).keydown(function(event) {
        var key = event.which;
        if (key >= 37 && key <= 40) {
            // arrow keys
            event.preventDefault();
            switch (key) {
                case 37:
                    tetromino.moveLeft();
                    break;
                case 38:
                    tetromino.rotate();
                    break;
                case 39:
                    tetromino.moveRight();
                    break;
                case 40:
                    tetromino.moveDown();
                    break;
            }
        }
    });
}

$(document).ready(function() {
    init();
})


