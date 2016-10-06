class Tower {
	//status: 1 for black, -1 for white, 0 for empty
	constructor(public status: number, 
				public count: number) {
	}
}

module DieCombo {
	export function generate(): number[] {
		let die1: number = Math.floor(Math.random() * 6 + 1);
		let die2: number = Math.floor(Math.random() * 6 + 1);
		let list: number[];
		if (die1 === die2) {
			list = [die1, die1, die1, die1];
		} else {
			list = [die1, die2];
		}
		return list;
	}
}

type Board = Tower[];

interface BoardDelta {

}

interface IState {
	board: Board;
	delta: BoardDelta;
}

module gameLogic {
	export const BLACKHOME = 27;
	export const BLACKBAR = 1;
	export const WHITEHOME = 0;
	export const WHITEBAR = 26;
	export const BLACK = 1;
	export const WHITE = -1;
	export const EMPTY = 0;

	//2, 13, 18, 20 black
	//7, 9, 14, 25 white
	/** Returns the initial Backgammon board. */
	function getInitialBoard(): Board {
		let board: Board = [];
		for (let i = 0; i < 28; i++) {
			if (i == WHITEHOME || i == WHITEBAR) {
				board[i] = new Tower(WHITE, 0);
			} else if (i == BLACKHOME || i == BLACKBAR) {
				board[i] = new Tower(BLACK, 0);
			} else if (i == 2) {
				board[i] = new Tower(BLACK, 2);
			} else if (i == 7) {
				board[i] = new Tower(WHITE, 5);
			} else if (i == 9) {
				board[i] = new Tower(WHITE, 3);
			} else if (i == 13) {
				board[i] = new Tower(BLACK, 5);
			} else if (i == 14) {
				board[i] = new Tower(WHITE, 5);
			} else if (i == 18) {
				board[i] = new Tower(BLACK, 3);
			} else if (i == 20) {
				board[i] = new Tower(BLACK, 5);
			} else if (i == 25) {
				board[i] = new Tower(WHITE, 2);
			} else {
				board[i] = new Tower(EMPTY, 0);
			}
		}
		return board;
	}

	export function getInitialState(): IState {
		return {board: getInitialBoard(), delta: null};
	}

	/** If one player has born off all 15 checkers, he wins. */
	function getWinner(board: Board): String {
		if (board[WHITEHOME].count == 15) {
			return "White";
		} else if (board[BLACKHOME].count == 15) {
			return "Black";
		} else {
			return "";
		}
	}

	export function createMove(
		stateBeforeMove: IState, start: number, end: number, turnIndexBeforeMove: number): IMove {
		if (!stateBeforeMove) {
			stateBeforeMove = getInitialState();
		}
		let board: Board = stateBeforeMove.board;
		if (board[start].status !== turnIndexBeforeMove) {
			throw new Error("One can only make a move with his own checkers!");
		}
		if (getWinner(board) !== "") {
			throw new Error("One can only make a move if the game is not over!");
		}
		let boardAfterMove: Tower[] = angular.copy(board);
		if (boardAfterMove[end].status === EMPTY) {//end position is empty, safe to occupy
			boardAfterMove[start].count -= 1;
			if (boardAfterMove[start].count === 0) {
				boardAfterMove[start].status = EMPTY;
			}
			boardAfterMove[end].count = 1;
			boardAfterMove[end].status = turnIndexBeforeMove;
		} else if (boardAfterMove[end].status === -turnIndexBeforeMove && boardAfterMove[end].count === 1) {
			boardAfterMove[start].count -= 1;
			if (boardAfterMove[start].count === 0) {
				boardAfterMove[start].status = EMPTY;
			}
			boardAfterMove[end].count = 1;
			boardAfterMove[end].status = turnIndexBeforeMove;
			if (turnIndexBeforeMove === BLACK) {
				boardAfterMove[WHITEBAR].count += 1;
			} else {
				boardAfterMove[BLACKBAR].count += 1;
			}
		} else if (boardAfterMove[end].status === turnIndexBeforeMove) {
			boardAfterMove[start].count -= 1;
			if (boardAfterMove[start].count === 0) {
				boardAfterMove[start].status = EMPTY;
			}
			boardAfterMove[end].count += 1;
		}

		let winner = getWinner(boardAfterMove);
		let turnIndexAfterMove: number;//rest moves?
		if (winner !== "") {
			//Game over
			turnIndexAfterMove = 0;
		} else {
			//Game continues, the player may continue his move, or switch turn
		}
	}
}