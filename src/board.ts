export enum PlayerType{
    HUMAN = 0,
    RANDOM = 1
}

export class Player {
    public name:string;
    public playerType:PlayerType;
    //Turn?
    constructor(playerType?:PlayerType) {
        this.playerType = (playerType)? playerType : PlayerType.HUMAN;        
    }
    getName() {
        return this.name;
    }
}

export enum TurnType {
    FIRST = 0, //PLAYER1, //TURN1, //ONE
    SECOND = 1
};

export class Move {
    
    public r:number;
    public c:number;
    constructor(r:number, c:number) {
        this.r = r;
        this.c = c;
    }
}

export class WinInfo {
    
    public winner:TurnType;
    public loser:TurnType;
    public isGameOver:boolean;   

    constructor(isGameOver:boolean, winner?:TurnType) {
        this.isGameOver = isGameOver;
        if (isGameOver) {
            this.winner = winner;
            this.loser = +(!winner);           
        }
    }
}

interface IBoard {   
    getWinInfo:Function;
    //getMoves[]
    //isGameOver -> winner, loser, stuff to draw win
    makeMove(move:Move):void;
    isValid(move:Move):boolean
}

export class Board implements IBoard {
    makeMove(move:Move) {}
    isValid(move:Move) { return false}
    getWinInfo():WinInfo {
        return new WinInfo(false);
    }
}