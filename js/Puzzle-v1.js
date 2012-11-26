(function(){
            
    var Puzzle = function(image, target, size){
        
        this.image = image;    
        this.target = target;
        this.size = size;
        this.setup();
    };
    
    Puzzle.prototype.setup = function(){
             
        // --------------------------------------------------------------------------
		// Initialization
		// --------------------------------------------------------------------------
        var THIS = this;
        
        var context = document.getElementById(THIS.target).getContext('2d');
        var boardSize = document.getElementById(THIS.target).width;
        var tileCount = THIS.size;
        var tileSize = boardSize / tileCount;
        
        var clickLoc = new Object;
        clickLoc.x = 0;
        clickLoc.y = 0;
        
        var emptyLoc = new Object;
        emptyLoc.x = 0;
        emptyLoc.y = 0;
        
        var solved;
        
        var boardParts = new Object;
        setBoard();
        
        var img = new Image();
        img.src = THIS.image;
        img.addEventListener('load', drawTiles, false);
        
        // --------------------------------------------------------------------------
		// Event Handlers
		// --------------------------------------------------------------------------
        document.getElementById(THIS.target).onmousemove = function(e) {
            var mouseX, mouseY;
            if(e.offsetX) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            }
            else if(e.layerX) {
                mouseX = e.layerX;
                mouseY = e.layerY;
            }
            clickLoc.x = Math.floor((mouseX) / tileSize);
            clickLoc.y = Math.floor((mouseY) / tileSize);
        };
        
        document.getElementById(THIS.target).onclick = function() {
            if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
                slideTile(emptyLoc, clickLoc);
                drawTiles();
            }
            if (solved) {
                console.log("puzzle solved (" + THIS.target + ")");
            }
        };        
        
        // --------------------------------------------------------------------------
		// Render Tiles
		// --------------------------------------------------------------------------
        function drawTiles() {
            context.clearRect ( 0 , 0 , boardSize , boardSize );
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {
                    var x = boardParts[i][j].x;
                    var y = boardParts[i][j].y;
                    if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize, i * tileSize, j * tileSize, tileSize, tileSize);
                    }
                }
            }
        }
        
        // --------------------------------------------------------------------------
		// Cut up board
		// --------------------------------------------------------------------------        
        function setBoard() {
            boardParts = new Array(tileCount);
            for (var i = 0; i < tileCount; ++i) {
                boardParts[i] = new Array(tileCount);
                for (var j = 0; j < tileCount; ++j) {
                    boardParts[i][j] = new Object;
                    boardParts[i][j].x = (tileCount - 1) - i;
                    boardParts[i][j].y = (tileCount - 1) - j;        
                }
            }
            emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
            emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
            solved = false;
        }
        
        // --------------------------------------------------------------------------
		// Move Tiles
		// --------------------------------------------------------------------------
        function slideTile(toLoc, fromLoc) {
            if (!solved) {
                boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
                boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;  
                boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
                boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;      
                toLoc.x = fromLoc.x;
                toLoc.y = fromLoc.y;
                checkSolved();
            }
        }
        
        // --------------------------------------------------------------------------
		// Check if puzzle is complete
		// --------------------------------------------------------------------------
        function checkSolved() {
            var flag = true;
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {
                    if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                        flag = false;
                    }
                }
            }
            solved = flag;
        }

        // --------------------------------------------------------------------------
		// Utils
		// --------------------------------------------------------------------------
        function distance(x1, y1, x2, y2) {
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
        
    }
    
    window.Puzzle = Puzzle;
    
})();