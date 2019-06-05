import * as React from 'preact';

import {WinInfo, TurnType} from "./abg-core/board";
import {Game, EventType} from "./abg-core/game";
import * as Url from "./abg-core/url";
import * as Draw from "./abg-core/draw";

import {TTTBoard, TTTWinInfo, COUNT_GRID} from '../board';


const SIZE_CANVAS = 600;
const SIZE_GRID = SIZE_CANVAS/COUNT_GRID;
const SIZE_HALF_GRID = SIZE_GRID/2;

class Cursor {
    public r:number = 0;
    public c:number = 0;
    public x:number = 0;
    public y:number = 0;

    public update(x:number, y:number) {
      
        this.r = Math.floor(y/SIZE_GRID);
        this.c = Math.floor(x/SIZE_GRID);	
        this.x = this.c*SIZE_GRID;
        this.y = this.r*SIZE_GRID;
    }
}

var board:TTTBoard;
var canvas;	
var ctx:CanvasRenderingContext2D;
var canvasBounds;	
var cursor:Cursor;
var game:Game;
var gameOver = false;
var gameWinInfo:TTTWinInfo;
var occupied = [false, false, false, false, false, false, false, false, false];


interface Line {
    x1:number;
    y1:number;
    x2:number;
    y2:number;
}
interface Pin {
    x:number;
    y:number;    
    label:string;
    color:string;
}

var linesGrid:Line[] = [];
var pins:Pin[] = [];

export class Stage extends React.Component {
    constructor() {
        super();
        Url.init(function(e) {            
            board = TTTBoard.fromString(window.location.hash.replace('#',''));
            game.updateBoard(board);
        });
        board = new TTTBoard();
        game = new Game(board);                
    }

    componentDidMount() {        
        canvas = document.getElementById('canvas');
        canvas.width = SIZE_CANVAS;
        canvas.height = SIZE_CANVAS;    
        canvasBounds = canvas.getBoundingClientRect(); 
        ctx = canvas.getContext('2d');    			
        ctx.font = 'bold 45px Verdana';
        
        cursor = new Cursor();

        //Game event callbacks
        game.addEventListener(EventType.BOARD_UPDATE, onBoardUpdate);
        game.addEventListener(EventType.GAME_OVER, onGameOver);
        game.addEventListener(EventType.INVALID, onGameInvalid);
        game.addEventListener(EventType.PLAYED, onGamePlayed);
        

        //Event callbacks
        canvas.addEventListener('click', onMouseClick.bind(this), false);
        canvas.addEventListener('mousemove', onMouseMove.bind(this), false);		
        //window.addEventListener('keydown', onKeyDown.bind(this), false);				
        //window.addEventListener('keyup', onKeyUp.bind(this), false);		
        //window.addEventListener('scroll', onWindowScroll.bind(this), false);		
            
        //Drawing cache
        for (var i = 1; i < COUNT_GRID; i++){
            var unit = i * SIZE_GRID;
            linesGrid.push({x1:unit, y1:0, x2:unit, y2:SIZE_CANVAS}); //Vert
            linesGrid.push({x1:0, y1:unit, x2:SIZE_CANVAS, y2:unit}); //Horz                                  
        }        
        draw();    
    }

    render() {
        return <canvas id="canvas"></canvas>
    }
}



function onMouseClick(e) {
    var x:number = e.clientX - canvasBounds.left; 
    var y:number = e.cursorY = e.clientY - canvasBounds.top;
    cursor.update(x, y);
    var move = {r:cursor.r, c:cursor.c};
    
    game.play(move);
    
}

function onMouseMove(e) {
    var x:number = e.clientX - canvasBounds.left; 
    var y:number = e.cursorY = e.clientY - canvasBounds.top;
    cursor.update(x, y);
}

function onBoardUpdate(newBoard) {
    //board = newBoard;  
    board = newBoard;

    //Update pins
    pins = [];
    for (var r = 0; r < COUNT_GRID; r++) {
        var y = r * SIZE_GRID;
        for (var c = 0; c < COUNT_GRID; c++) {
            var x = c * SIZE_GRID;
            var pin:string = board.get(r,c);
            var color = (pin == 'X')? 'lightblue' : 'pink';
            pins.push({x:x, y:y, label:pin, color:color});            
            occupied[(r*COUNT_GRID)+c] = true;
        }
    }
    Url.setHash(board.toString());  
}

function onGamePlayed(newBoard) {
    
}

function onGameOver(winInfo:TTTWinInfo) {
      
    gameOver = true;
    gameWinInfo = winInfo;
    
    setTimeout(function() {
        if (winInfo.winner == TurnType.FIRST) alert('Game Over!\nPlayer 1 Wins!');
        else if (winInfo.winner == TurnType.SECOND) alert('Game Over!\nPlayer 2 Wins!');
        else alert('Game Over!\nCat\'s Game!');  
    }, 100);
}

function onGameInvalid(message) {
    alert('Player attempted invalid move:' + message);
}



function draw() {
    ctx.clearRect(0, 0, SIZE_CANVAS, SIZE_CANVAS);

    drawCursor();
    drawPins();
    
    if (window.menu.showGrid) drawGrid();               
    if (gameOver && gameWinInfo.winner >= 0) drawWin();             
    
    requestAnimationFrame(draw.bind(this)); //Repaint	
}

function drawCursor() {

    //Hover
    ctx.fillStyle = 'aliceblue';
    ctx.fillRect(cursor.c * SIZE_GRID, cursor.r * SIZE_GRID, SIZE_GRID, SIZE_GRID);

    //Label
    if (!occupied[(cursor.r*COUNT_GRID)+cursor.c]) {
        ctx.fillStyle = 'gray';        
        var label = (board.turn == TurnType.FIRST)? 'X' : 'O';
        ctx.fillText(label, cursor.x+SIZE_HALF_GRID-20, cursor.y+SIZE_HALF_GRID+20);
    }
}

function drawPins() {
       
    for (var i = 0; i < pins.length; i++) {
        var pin = pins[i];
        var x = pin.x+SIZE_HALF_GRID;
        var y = pin.y+SIZE_HALF_GRID;        
        ctx.fillStyle = pin.color;
        ctx.fillText(pin.label, x-20, y+20);
    }
}

function drawWin() {
    var y1 = SIZE_GRID * (gameWinInfo.r1) + SIZE_HALF_GRID;
    var x1 = SIZE_GRID * (gameWinInfo.c1) + SIZE_HALF_GRID;

    var x2 = SIZE_GRID * (gameWinInfo.c2+1) - SIZE_HALF_GRID;
    var y2 = SIZE_GRID * (gameWinInfo.r2+1) - SIZE_HALF_GRID;

    ctx.strokeStyle = 'red';
    Draw.line(ctx, x1, y1, x2, y2);
}

function drawGrid() {
    ctx.lineWidth = 10;//WIDTH_GRID;
    ctx.strokeStyle = 'black';//COLOR_GRID;	
    
    for (var i = 0; i < linesGrid.length; i++) { //Strided
        var line = linesGrid[i];        
        Draw.line(ctx, line.x1, line.y1, line.x2, line.y2);
    }    
}





