$(document).ready(function() {
                                    
    $("#level1").on("click",function(){
        fadeOutIntro(3);
    });
    
    $("#level2").on("click",function(){
        fadeOutIntro(4);
    });
    
    $("#level3").on("click",function(){
        fadeOutIntro(5);
    });
             
});

function fadeOutIntro(levelSelected){
    
    $("#level1").off("click");
    $("#level2").off("click");
    $("#level3").off("click");
    
    TweenMax.to($("#level1"), 0.6, {css:{opacity:0}, delay:0});
    TweenMax.to($("#level2"), 0.6, {css:{opacity:0}, delay:0.2});
    TweenMax.to($("#level3"), 0.6, {css:{opacity:0}, delay:0.4, onComplete:beginGame, onCompleteParams:[levelSelected]});
    
    var puzzle1 = new Puzzle("./images/puzzle1.jpg", "puzzle1", levelSelected);
    var puzzle2 = new Puzzle("./images/puzzle2.jpg", "puzzle2", levelSelected);
    var puzzle3 = new Puzzle("./images/puzzle3.jpg", "puzzle3", levelSelected);
    var puzzle4 = new Puzzle("./images/puzzle4.jpg", "puzzle4", levelSelected);
    var puzzle5 = new Puzzle("./images/puzzle5.jpg", "puzzle5", levelSelected);
    var puzzle6 = new Puzzle("./images/puzzle6.jpg", "puzzle6", levelSelected);

}

function beginGame(){
        
    $("#level-select").css("opacity",0);
    $("#level-select").css("display","none");
    $("#wrapper").css("display","block");
    TweenMax.to($("#wrapper"), 0.6, {css:{opacity:1}, delay:0.5});
                        
    var traqball = new Traqball({stage: "stage", activationElement: "wrapper"});
    
}

document.ontouchmove = function(event) {
    event.preventDefault();
};