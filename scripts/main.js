$(document).ready(function() {
                                    
    $("#level1").click(function(){
        console.log("level1");
        beginGame(3);
    });
    
    $("#level2").click(function(){
        console.log("level2");
        beginGame(4);
    });
    
    $("#level3").click(function(){
        console.log("level3");
        beginGame(5);
    });
             
});

function beginGame(pieces){
        
    var puzzle1 = new Puzzle("./images/puzzle1.jpg", "puzzle1", pieces);
    var puzzle2 = new Puzzle("./images/puzzle2.jpg", "puzzle2", pieces);
    var puzzle3 = new Puzzle("./images/puzzle3.jpg", "puzzle3", pieces);
    var puzzle4 = new Puzzle("./images/puzzle4.jpg", "puzzle4", pieces);
    var puzzle5 = new Puzzle("./images/puzzle5.jpg", "puzzle5", pieces);
    var puzzle6 = new Puzzle("./images/puzzle6.jpg", "puzzle6", pieces);
    
    TweenMax.to($("#level-select"), 0.6, {css:{opacity:0}});
    $("#stage").css("display","block");
    $("#title").css("margin-top","-30px");
    TweenMax.to($("#stage"), 0.6, {css:{opacity:1}});
    
                
    var traqball = new Traqball({stage: "stage", activationElement: "wrapper"});
    
    
}


document.ontouchmove = function(event) {
    event.preventDefault();
};