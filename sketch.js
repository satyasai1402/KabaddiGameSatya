// add your code here
var player1,player2,player1Animation,player2Animation;
var database,player1Score,player2Score;
var gameState;
var position1,position2;
var toss=0;
var win_team;
var msg=0;

function preload()
{
    player1Animation=loadAnimation("assets/player1a.png","assets/player1b.png","assets/player1a.png");
    player2Animation=loadAnimation("assets/player2a.png","assets/player2b.png","assets/player2a.png");
        
} 

function setup(){

    createCanvas(600,600);
    msg=0;
    //creating player1
    player1=createSprite(300,250,10,10);
    player1.addAnimation("walking",player1Animation);
    player1.scale=0.5;
    player1Animation.frameDelay=200;
    player1.setCollider("circle",0,0,60);
    //player1.debug=true;

    //creating player2
    player2=createSprite(200,500,10,10);
    player2.addAnimation("walking",player2Animation);
    player2.scale=-0.5;
    player2Animation.frameDelay=200;
    player2.setCollider("circle",0,0,60);
    //player2.debug=true;


    database=firebase.database();
    
    var player1Position=database.ref('player1/position');
    player1Position.on("value",readPosition1,showError);

    var player2Position=database.ref('player2/position');
    player2Position.on("value",readPosition2,showError);

    var tossRef=database.ref('toss');
    tossRef.on("value",function(data){
        toss=data.val();
    })

    var player1ScoreRef=database.ref('player1Score');
    player1ScoreRef.on("value",function(data){
        player1Score=data.val();
    });
    var player2ScoreRef=database.ref('player2Score');
    player2ScoreRef.on("value",function(data){
    player2Score=data.val();
    });
    var gameStateRef=database.ref('gameState');
    gameStateRef.on("value",function(data){
        gameState=data.val();
    });
    
    message=createElement('h2');
    message.position(580,8);
    message.html("WELCOME to KABADDI");
    
    resetbutton=createButton('Reset');
    resetbutton.position(300,120);
    resetbutton.style.fontSize='30px';

    database.ref('player1/position').update({
        'x': 150,
        'y': 300  
    })
    database.ref('player2/position').update({
        'x': 450,
        'y': 300  
    })
    database.ref('/').update({            
        'player1Score':0,
        'player2Score':0,
        'gameState':0,
        'toss':0
       
    })    
    resetbutton.mousePressed(()=>{        
        database.ref('player1/position').update({
            'x': 150,
            'y': 300  
        })
        database.ref('player2/position').update({
            'x': 450,
            'y': 300  
        })
        database.ref('/').update({            
            'player1Score':0,
            'player2Score':0,
            'gameState':0,
            'toss':0           
        }) 
        msg=0; 
        message.html("WELCOME to KABADDI")              
    })   
}

function draw(){
    background("green");
 
    if(gameState==0){
        if(msg==0){    
            fill("white");
            textSize(24);
            text("Press space to toss",200,550);
        }
        if(msg==1){
            fill("white");
            textSize(24);
            text("Press space to continue",200,550);   
        }
        if(keyDown("space")){ 
            if(toss==1){
                message.html("YELLOW RIDE");
                msg=1;
                database.ref('/').update({
                'gameState':2                                 
                })
            }
            else if(toss==2){
                message.html("RED RIDE");
                msg=1;
                database.ref('/').update({
                'gameState':1 
                 })
            }          
            else if(toss==0){                
                var rand=Math.round(random(1,2));
                if(rand==1){
                    database.ref('/').update({
                        'gameState':1
                    });                      
                    message.html("RED RIDE");               
                }

                if (rand==2){
                    database.ref('/').update({
                        'gameState':2
                    });                      
                    message.html("YELLOW RIDE")     
                }               
            }
            
            database.ref('player1/position').update({
                'x': 150,
                'y': 300  
            })
        
            database.ref('player2/position').update({
                'x': 450,
                'y': 300  
            })
        }
        
    }
   
    if(gameState==1){

        textSize(20);        
        fill("white");
        text("RED - Arrow keys for moving",105,560);
        text("YELLOW - To move up  -->  W, To move down --> D",105,580);
        
        
        if(keyDown(LEFT_ARROW)){            
            writePosition1(-5,0);
        }
        
        else if(keyDown(RIGHT_ARROW)){
            writePosition1(5,0);
        }
        
        else if(keyDown(UP_ARROW)){
            writePosition1(0,-5);
        }
        
        else if(keyDown(DOWN_ARROW)){
            writePosition1(0,5);
        }
        
        else if(keyDown("w")){
            writePosition2(0,-5);
        }
        
        else if(keyDown("d")){
            writePosition2(0,5);
        }

        if(player1.x>500){                    
            database.ref('/').update({
                'player1Score':player1Score+5,
                'gameState':0,
                //'player2Score':player2Score-5,
                'toss':1            
            })      
            win_team="red"; 
            
            msg=1;              
        }
        if(player1.isTouching(player2)){            
            database.ref('/').update({
                'gameState':0,
                //'player1Score':player1Score-5,
                'player2Score':player2Score+5,
                'toss':1                          
            })        
            win_team="yellow"; 
            
            msg=1;          
        }
    }
    if(gameState==2){
        textSize(20);        
        fill("white");
        text("YELLOW - Arrow keys for moving",105,560);
        text("RED - To move up  -->  W, To move down --> D",105,580); 
              

        if(keyDown(LEFT_ARROW)){            
            writePosition2(-5,0);
        }
        
        else if(keyDown(RIGHT_ARROW)){           
            writePosition2(5,0);
        }
        
        else if(keyDown(UP_ARROW)){
            writePosition2(0,-5);
        }
        
        else if(keyDown(DOWN_ARROW)){
            writePosition2(0,5);
        }
        
        else if(keyDown("w")){
            writePosition1(0,-5);
        }
        
        else if(keyDown("d")){
            writePosition1(0,5);
        }
        if(player2.x<150){           
            database.ref('/').update({            
                //'player1Score':player1Score-5,
                'gameState':0,
                'player2Score':player2Score+5, 
                'toss':2           
            })            
            win_team="yellow";
            
            msg=1;
        }
        if(player2.isTouching(player1)){                        
            database.ref('/').update({
                'gameState':0,
                'player1Score':player1Score+5,
               // 'player2Score':player2Score-5,
                'toss':2            
            })      
            win_team="red"; 
            
            msg=1;                 
        }
    }

    if(win_team=="red"){        
    message.html("RED WINS");
    win_team=""
    }
    else if(win_team=="yellow") {         
    message.html("YELLOW WINS");
    win_team="";
    }
    if(player1Score===30 || player2Score===30){            
        textSize(24);           
        
        if(player1Score===30){              
            message.html("Red Won the Game!!!!!!!");             
        }
        if(player2Score===30){              
            message.html("Yellow Won the Game!!!!!!!");            
        }
        fill("white")
        text("Press 'R' to restart",200,200);        
        database.ref('/').update({                
            'gameState' : 3                 
        })
    }

    if(keyDown("r") && gameState===3){
        msg=0;
        message.html("WELCOME to KABADDI");
        database.ref('player1/position').update({
            'x': 150,
            'y': 300  
        })
    
        database.ref('player2/position').update({
            'x': 450,
            'y': 300  
        })
        
        database.ref('/').update({
            'player1Score': 0,
            'player2Score': 0,
            'toss':0,            
            'gameState' : 0            
        })
    }
    textSize(20);
    fill("white");
    text("RED: "+player1Score,350,30);
    text("YELLOW: "+player2Score,150,30);
    drawLine(300);
    drawLine(100);
    drawLine(500);
    drawSprites();
}



function readPosition1(data)
{
    position1=data.val();
    player1.x=position1.x;
    player1.y=position1.y;

}
function readPosition2(data)
{
    position2=data.val();
    player2.x=position2.x;
    player2.y=position2.y;

}

function writePosition1(x,y)
{
    database.ref('player1/position').set({
        'x':position1.x+x,
        'y':position1.y+y
    })
}
function writePosition2(x,y)
{
    database.ref('player2/position').set({
        'x':position2.x+x,
        'y':position2.y+y
    })
}
function showError()
{
    message.html("Database Error")
}

function drawLine(x)
{
    for(var i=0;i<600;i=i+20)
    {
        strokeWeight(4);
        line(x,i,x,i+10);
    }
}
