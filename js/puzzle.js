(function(window){
                
    var Puzzle = function(image, target, size){
        
        this.animating = false;
        this.stage;
        this.extent = 25;
        
        this.image = image;    
        this.target = target;
        this.size = size;
        
        this.init();
    };
    
    Puzzle.prototype.tick = function(){
     
        if (this.animating){
             
            //console.log("tick");
            
            this.stage.update();
                
        }
        
    }
    
    Puzzle.prototype.init = function(){
             
        // --------------------------------------------------------------------------
		// Initialization
		// --------------------------------------------------------------------------
        var THIS = this;
        var boardArr;
        var boardSize = document.getElementById(THIS.target).width;
        var tileCount = THIS.size;
        var tileSize = boardSize / tileCount;
        var completed = false;
        var shuffles = 0;
        
        var canvas = document.getElementById(THIS.target);
        this.stage = new createjs.Stage(canvas);
        
        
        if (createjs.Touch.isSupported()) { createjs.Touch.enable(this.stage); }
        
        createjs.Ticker.addListener(this);
        createjs.Ticker.setFPS(60);
        
        var img = new Image();
        img.src = THIS.image;
        img.addEventListener('load', setupGame, false);
        
        var emptyLoc = new Object; 
        
        function setupGame() {
            
            var bmp;
            
            boardArr = new Array(tileCount);  
            
            for (var i = 0; i < tileCount; i++) {
                
                boardArr[i] = new Array(tileCount);
                
                for (var j = 0; j < tileCount; j++) {
                                        
                    bmp = new createjs.Bitmap(img);
                    bmp.sourceRect = new createjs.Rectangle(i*tileSize,j*tileSize,tileSize,tileSize);
                    bmp.onClick = clickHandler;
                    bmp.x = i*tileSize;
                    bmp.y = j*tileSize;
                    THIS.stage.addChild(bmp);
                    boardArr[i][j] = new Object;
                    boardArr[i][j].bmp = bmp;
                        
                }
            }
            
            emptyLoc = boardArr[boardArr.length-1][boardArr.length-1];
            emptyLoc.bmp.alpha = 0.1;
            
            shuffleTiles(THIS.extent);

        }
        
        
        // --------------------------------------------------------------------------
		// Event Handlers
		// --------------------------------------------------------------------------            
        function clickHandler(e) {
            
            if (!completed){
                            
                if (distance(e.target.x / tileSize, e.target.y / tileSize, emptyLoc.bmp.x / tileSize, emptyLoc.bmp.y / tileSize) == 1) {
                    slideTile(e.target);
                    THIS.animating = true;
                }
            }
        };
 
        // --------------------------------------------------------------------------
		// Move Tiles
		// --------------------------------------------------------------------------
        function slideTile(target) {
            
            if (!completed) {
                
                TweenLite.to(target, 0.6, {x:emptyLoc.bmp.x, y:emptyLoc.bmp.y});
                TweenLite.to(emptyLoc.bmp, 0.6, {x:target.x, y:target.y, onComplete:animEnd});                

            }
        }
                
        function animEnd() {
            THIS.animating = false;
            if (!completed){
            checkCompleted();
                if (completed){
                    console.log("complete");
                    THIS.animating = true;
                    TweenLite.to(emptyLoc.bmp, 0.6, {alpha:1, onComplete:animEnd});
                }
            }
        }
                
                
        // --------------------------------------------------------------------------
		// Shuffle Tiles
		// --------------------------------------------------------------------------
        function shuffleTiles() {
            
            var piece;
            
            for (var i = 0; i < THIS.extent; i++){
                
                // choose a random piece next to the empty slot and move it (if it exists)
                switch(getRandomInt(0, 3))
                {
                    case 0 :
                        if (emptyLoc.bmp.y > 0){
                            piece = getPiece(emptyLoc.bmp.x, ((emptyLoc.bmp.y / tileSize) - 1)*tileSize);
                        }
                        break;
                    case 1 :
                        if ((emptyLoc.bmp.x / tileSize) + 1 < tileCount) {
                            piece = getPiece(((emptyLoc.bmp.x / tileSize) + 1)*tileSize, emptyLoc.bmp.y);
                        }
                        break;
                    case 2 :
                        if ((emptyLoc.bmp.y / tileSize) + 1 < tileCount) {
                            piece = getPiece(emptyLoc.bmp.x, ((emptyLoc.bmp.y / tileSize) + 1)*tileSize);
                        }
                        break;
                    case 3 :
                        if (emptyLoc.bmp.x > 0) {
                            piece = getPiece(((emptyLoc.bmp.x / tileSize) - 1)*tileSize, emptyLoc.bmp.y);
                        }
                        break;
                }
                
                if (piece){
                    
                    var tempPiece = new Object;
                    tempPiece.x = emptyLoc.bmp.x;
                    tempPiece.y = emptyLoc.bmp.y;
                    
                    emptyLoc.bmp.x = piece.x;
                    emptyLoc.bmp.y = piece.y;
                    
                    piece.x = tempPiece.x;
                    piece.y = tempPiece.y;
                    
                    shuffles ++;
                    
                }
                
            }
            
            if (shuffles < THIS.extent){
                
                THIS.extent = THIS.extent - shuffles;
                shuffleTiles();
                
            }else{
            
                THIS.stage.update();   
                
            }
        }
        
        function getPiece(posX, posY) {
            
            var bmp;
            
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {

                    if (boardArr[i][j].bmp.x == posX && boardArr[i][j].bmp.y == posY) {
                        bmp = boardArr[i][j].bmp;
                    }    
                }
            }
                        
            return bmp;
            
        }
                
                
        // --------------------------------------------------------------------------
		// Check if puzzle is complete
		// --------------------------------------------------------------------------
        function checkCompleted() {
            var flag = true;
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {

                    if ((boardArr[i][j].bmp.x / tileSize) != i || (boardArr[i][j].bmp.y / tileSize) != j) {
                        flag = false;
                    }
                }
            }
            completed = flag;
        }

        // --------------------------------------------------------------------------
		// Utils
		// --------------------------------------------------------------------------
        function distance(x1, y1, x2, y2) {
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
                
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
    }
    
    window.Puzzle = Puzzle;
    
})(window);