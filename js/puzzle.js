(function(){
            
    var Puzzle = function(image, target){
        
        this.image = image;    
        this.target = target;
        this.setup();
    };
    
    Puzzle.prototype.setup = function(){
             
        // define scope
        var THIS = this;
        
        var context = document.getElementById(THIS.target).getContext('2d');
        
        var img = new Image();
        img.src = THIS.image;
        img.addEventListener('load', drawTiles, false);
        
        var boardsize = document.getElementById(THIS.target).width;
        var tilecount = 3;
        var tilesize = boardsize / tilecount;
        
        
        function drawTiles() {
            context.drawImage(img, 0, 0, boardsize, boardsize);
        }
    
        
    }
    
    window.Puzzle = Puzzle;
    
})();