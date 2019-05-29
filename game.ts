import {Move, Board, PlayerType, Player} from "./board";



export enum EventType {
    INVALID = 0,    
    PLAYED = 1,
    GAME_OVER = 2,
    BOARD_UPDATE = 3,
    SUGGEST = 4,
    MESSAGE = 5,
}

interface Listener {
    [key:number]: Function;
}


export class Game {
    private eventListeners:Listener;
    private players:Player[];
    public board:Board;

    constructor(board?:Board|string) {
        if (typeof(board) != "string") this.board = board;                
        
        this.eventListeners = {};
        this.players = [
            new Player(PlayerType.HUMAN), 
            new Player(PlayerType.HUMAN)
        ];
        
    }

    //Event methods
    public addEventListener(eventType:EventType, callback:Function) {
        this.eventListeners[eventType] = callback;
        
    }

    public sendMessage(message:string) {
        this.eventListeners[EventType.MESSAGE](message);
    }
           
    public play(move:Move) {
        //if (player == PLAYER_HUMAN) return; //Ignore
        if (!this.board.isValid(move)) {
            this.eventListeners[EventType.INVALID]();  
        }

        this.board.makeMove(move);
        this.eventListeners[EventType.BOARD_UPDATE](this.board); 

        var winInfo = this.board.getWinInfo();
        if (winInfo.isGameOver) {            
            this.eventListeners[EventType.GAME_OVER](winInfo);    
        }
        else this.eventListeners[EventType.PLAYED](this.board);
    }

    //Stubs:
    public save() {}
    public load() {}

}