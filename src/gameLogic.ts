class Tower {
	//status: 1 for black, -1 for white, 0 for empty
	constructor(public status: number, 
				public count: number) {
	}
}

class Backgammon {
	constructor(public board: Tower[],
				public role: number,
				public steps: number[]) {
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

	export function init(): number[] {
		let die1: number = Math.floor(Math.random() * 6 + 1);
		let die2: number = Math.floor(Math.random() * 6 + 1);
		while (die1 === die2) {
			//have to regenerate two dies together for fairness issue
			die1 = Math.floor(Math.random() * 6 + 1);
			die2 = Math.floor(Math.random() * 6 + 1);
		}
		return [die1, die2];
	}
}

type Board = Tower[];

interface BackgammonDelta {
	start: number;
	end: number;
}

interface IState {
	backgammon: Backgammon;
	delta: BackgammonDelta;
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
	/** Returns the initial Backgammon instance. */
	function getInitialBackgammon(): Backgammon {
		let backgammon: Backgammon;
		let board: Board = backgammon.board;
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
		backgammon.steps = DieCombo.init();
		//first die tossed by white, and second die tossed by black
		if (backgammon.steps[0] < backgammon.steps[1]) {
			backgammon.role = 1;
		} else {
			backgammon.role = -1;
		}
		return backgammon;
	}

	export function getInitialState(): IState {
		return {backgammon: getInitialBackgammon(), delta: null};
	}

	/** If all checkers of one player are in his homeboard, he can bear them off. */
	function canBearOff(board: Board, role: number): boolean {
		if (role === BLACK) {
			if (board[BLACKBAR].count !== 0) {
				return false;
			}
			for (let i = 2; i < 20; i++) {
				if (board[i].status === BLACK) {
					return false;
				}
			}
			return true;
		} else {
			if (board[WHITEBAR].count !== 0) {
				return false;
			}
			for (let i = 25; i > 7; i--) {
				if (board[i].status === WHITE) {
					return false;
				}
			}
			return true;
		}
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
			stateBeforeMove: IState, start: number, end: number, roleBeforeMove: number): IMove {
		//assume now that (end-start) appears in steps, and no automatic move relay
		if (!stateBeforeMove) {
			stateBeforeMove = getInitialState();
		} else {
			stateBeforeMove.backgammon.steps = DieCombo.generate();
		}
		let board = stateBeforeMove.backgammon.board;
		//let role = stateBeforeMove.backgammon.role;
		let steps = stateBeforeMove.backgammon.steps;
		if (getWinner(board) !== "") {
			throw new Error("One can only make a move if the game is not over!");
		}

		//move this into moveExist!
		if (board[start].status !== roleBeforeMove) {
			throw new Error("One can only make a move with his own checkers!");
		}
		let endMatchScores: number[];
		let roleAfterMove: number;
		//let winner = "";
		if (moveExist(board, start, end, steps, roleBeforeMove)) {
			let boardAfterMove = angular.copy(board);
			if (boardAfterMove[end].status === EMPTY || boardAfterMove[end].status === roleBeforeMove) {
				//safe to occupy or add
				boardAfterMove[start].count -= 1;
				if (boardAfterMove[start].count === 0) {
					boardAfterMove[start].status = EMPTY;
				}
				boardAfterMove[end].count += 1;
				boardAfterMove[end].status = roleBeforeMove;
			} else if (boardAfterMove[end].status === -roleBeforeMove && boardAfterMove[end].count === 1) {
				//safe to hit
				boardAfterMove[start].count -= 1;
				if (boardAfterMove[start].count === 0) {
					boardAfterMove[start].status = EMPTY;
				}
				boardAfterMove[end].count = 1;
				boardAfterMove[end].status = roleBeforeMove;
				if (roleBeforeMove === BLACK) {
					boardAfterMove[WHITEBAR].count += 1;
				} else {
					boardAfterMove[BLACKBAR].count += 1;
				}
			}
			//update backgammon's board
			stateBeforeMove.backgammon.board = boardAfterMove;

			//update backgammon's steps after this move, delete that tossed value from steps
			//browser support for indexOf is limited; it is not supported in Internet Explorer 7 and 8.
			let index = steps.indexOf(end - start);
			if (index > -1) {
				steps.splice(index, 1);
			}

			//update backgammon's role if necessary
			if (steps.length === 0) {
				stateBeforeMove.backgammon.role = -roleBeforeMove;
			}

			let winner = getWinner(boardAfterMove);
			if (winner !== "") {
				//Game over.
				roleAfterMove = 0; //role 0 denotes game over!
				endMatchScores = winner === "Black" ? [1, 0] : winner === "White" ? [0, 1] : [0, 0];
			} else {
				//reflect possibly updated role value of backgammon
				roleAfterMove = stateBeforeMove.backgammon.role;
				endMatchScores = null;
			}
			let delta: BackgammonDelta = {start: start, end: end};
			let stateAfterMove: IState = {backgammon: stateBeforeMove.backgammon, delta: delta};
			return {endMatchScores: endMatchScores, turnIndexAfterMove: roleAfterMove, stateAfterMove: stateAfterMove};
		} else {
			stateBeforeMove.backgammon.role = -roleBeforeMove;
			roleAfterMove = stateBeforeMove.backgammon.role;
			endMatchScores = null;
			let delta: BackgammonDelta = {start: start, end: end};
			let stateAfterMove: IState = {backgammon: stateBeforeMove.backgammon, delta: delta};
			return {endMatchScores: endMatchScores, turnIndexAfterMove: roleAfterMove, stateAfterMove: stateAfterMove};
		}
	}

	function moveExist(board: Board, start: number, end: number, steps: number[], role: number): boolean {
		//to do
		return false;
	}
}