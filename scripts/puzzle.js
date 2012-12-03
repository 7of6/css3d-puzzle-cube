(function(){
                
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
        this.stage.mouseEnabled = false;
        
        if (createjs.Touch.isSupported()) { createjs.Touch.enable(this.stage); }
        
        createjs.Ticker.addListener(this);
        createjs.Ticker.setFPS(60);
        
        var img = new Image();
        img.src = THIS.image;
        img.addEventListener('load', setupGame, false);
        
        var emptyLoc = new Object; 
        
        function setupGame() {
            
            var bmp;
            var cont;
            var stroke;
            var highlight;
            
            boardArr = new Array(tileCount);  
            
            for (var i = 0; i < tileCount; i++) {
                
                boardArr[i] = new Array(tileCount);
                
                for (var j = 0; j < tileCount; j++) {
                    
                    cont = new createjs.Container();
                                                            
                    bmp = new createjs.Bitmap(img);
                    bmp.sourceRect = new createjs.Rectangle(i*tileSize,j*tileSize,tileSize,tileSize);
                    
                    cont.onPress = clickHandler;
                    cont.x = i*tileSize;
                    cont.y = j*tileSize;
                    
                    cont.addChild(bmp);
                    
                    var g = new createjs.Graphics();
                    g.setStrokeStyle(1);
                    g.beginStroke(createjs.Graphics.getRGB(0,0,0));
                    g.drawRect(0,0,tileSize,tileSize);
                    
                    stroke = new createjs.Shape(g);
                    cont.addChild(stroke);
                    
                    var g = new createjs.Graphics();
                    g.setStrokeStyle(2);
                    g.beginStroke(createjs.Graphics.getRGB(255,255,255));
                    g.drawRect(2,2,tileSize-4,tileSize-4);
                    
                    highlight = new createjs.Shape(g);
                    highlight.alpha = 0;
                    cont.addChild(highlight);
                    
                    THIS.stage.addChild(cont);
                    boardArr[i][j] = new Object;
                    boardArr[i][j].tile = cont;
                    boardArr[i][j].stroke = stroke;
                    boardArr[i][j].highlight = highlight;
                        
                }
            }
            
            emptyLoc = boardArr[boardArr.length-1][boardArr.length-1];
            emptyLoc.tile.alpha = 0;
            emptyLoc.tile.visible = false;
            
            shuffleTiles(THIS.extent);

        }
        
        
        // --------------------------------------------------------------------------
		// Event Handlers
		// --------------------------------------------------------------------------            
        function clickHandler(e) {
            
            //console.log("piece:",e.target.id, e.target.x, e.target.y);
            
            if (!completed && !THIS.animating){
                            
                if (distance(e.target.x / tileSize, e.target.y / tileSize, emptyLoc.tile.x / tileSize, emptyLoc.tile.y / tileSize) == 1) {
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
                
                var obj = getTile(target);
                                
                TweenLite.to(target, 0.4, {x:emptyLoc.tile.x, y:emptyLoc.tile.y});
                TweenMax.to(obj.highlight, 0.2, {alpha:1, yoyo:true, repeat:1});
                TweenLite.to(emptyLoc.tile, 0.4, {x:target.x, y:target.y, onComplete:animEnd});    

            }
        }
                
        function animEnd() {
            THIS.animating = false;
            if (!completed){
            checkCompleted();
                if (completed){
                    //console.log("complete");
                    THIS.animating = true;
                    emptyLoc.tile.visible = true;
                    
                    for (var i = 0; i < tileCount; i++) {                
                        for (var j = 0; j < tileCount; j++) { 
                            TweenLite.to(boardArr[i][j].stroke, 0.6, {alpha:0});
                        }
                    }
                    
                    TweenLite.to(emptyLoc.tile, 0.6, {alpha:1, onComplete:animEnd});
                }
            }
        }
                
        function getTile(target) {
            
            var obj;
            
            for (var i = 0; i < tileCount; i++) {                
                for (var j = 0; j < tileCount; j++) {
                    if (boardArr[i][j].tile === target){
                        obj = boardArr[i][j];   
                    }
                }
            }
            
            
            return obj;
            
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
                        if (emptyLoc.tile.y > 0){
                            piece = getPiece(emptyLoc.tile.x, ((emptyLoc.tile.y / tileSize) - 1)*tileSize);
                        }
                        break;
                    case 1 :
                        if ((emptyLoc.tile.x / tileSize) + 1 < tileCount) {
                            piece = getPiece(((emptyLoc.tile.x / tileSize) + 1)*tileSize, emptyLoc.tile.y);
                        }
                        break;
                    case 2 :
                        if ((emptyLoc.tile.y / tileSize) + 1 < tileCount) {
                            piece = getPiece(emptyLoc.tile.x, ((emptyLoc.tile.y / tileSize) + 1)*tileSize);
                        }
                        break;
                    case 3 :
                        if (emptyLoc.tile.x > 0) {
                            piece = getPiece(((emptyLoc.tile.x / tileSize) - 1)*tileSize, emptyLoc.tile.y);
                        }
                        break;
                }
                
                if (piece){
                    
                    var tempPiece = new Object;
                    tempPiece.x = emptyLoc.tile.x;
                    tempPiece.y = emptyLoc.tile.y;
                    
                    emptyLoc.tile.x = piece.x;
                    emptyLoc.tile.y = piece.y;
                    
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
            
            var tile;
            
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {

                    if (boardArr[i][j].tile.x == posX && boardArr[i][j].tile.y == posY) {
                        tile = boardArr[i][j].tile;
                    }    
                }
            }
                        
            return tile;
            
        }
                
                
        // --------------------------------------------------------------------------
		// Check if puzzle is complete
		// --------------------------------------------------------------------------
        function checkCompleted() {
            var flag = true;
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {

                    if ((boardArr[i][j].tile.x / tileSize) != i || (boardArr[i][j].tile.y / tileSize) != j) {
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
            
            //console.log(x1, y1, x2, y2, "distance is:", Math.abs(x1 - x2) + Math.abs(y1 - y2));
            
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
                
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
    }
    
    window.Puzzle = Puzzle;
    
})();