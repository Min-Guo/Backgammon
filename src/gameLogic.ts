class Tower {
	//status: 1 for black, 0 for white, -1 for empty
	constructor(public tid: number,
				public status: number, 
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

interface BoardDelta {
	start: number;
	end: number;
}

interface IState {
	//backgammon: Backgammon;
	board: Board;
	steps: number[];
	delta: BoardDelta;
}

module gameLogic {
	export const BLACKHOME = 27;
	export const BLACKBAR = 1;
	export const WHITEHOME = 0;
	export const WHITEBAR = 26;
	export const BLACK = 1;
	export const WHITE = 0;
	export const EMPTY = -1;

	//2, 13, 18, 20 black
	//7, 9, 14, 25 white
	/** Returns the initial board. */
	function getInitialBoard(): Board {
		//let backgammon: Backgammon;
		// let board: Board = backgammon.board;
		let board: Board;
		for (let i = 0; i < 28; i++) {
			if (i == WHITEHOME || i == WHITEBAR) {
				board[i] = new Tower(i, WHITE, 0);
			} else if (i == BLACKHOME || i == BLACKBAR) {
				board[i] = new Tower(i, BLACK, 0);
			} else if (i == 2) {
				board[i] = new Tower(i, BLACK, 2);
			} else if (i == 7) {
				board[i] = new Tower(i, WHITE, 5);
			} else if (i == 9) {
				board[i] = new Tower(i, WHITE, 3);
			} else if (i == 13) {
				board[i] = new Tower(i, BLACK, 5);
			} else if (i == 14) {
				board[i] = new Tower(i, WHITE, 5);
			} else if (i == 18) {
				board[i] = new Tower(i, BLACK, 3);
			} else if (i == 20) {
				board[i] = new Tower(i, BLACK, 5);
			} else if (i == 25) {
				board[i] = new Tower(i, WHITE, 2);
			} else {
				board[i] = new Tower(i, EMPTY, 0);
			}
		}
		// backgammon.steps = DieCombo.init();
		// //first die tossed by white, and second die tossed by black
		// if (backgammon.steps[0] < backgammon.steps[1]) {
		// 	backgammon.role = 1;
		// } else {
		// 	backgammon.role = -1;
		// }
		//return backgammon;
		return board;
	}

	export function getInitialState(): IState {
		return {board: getInitialBoard(), steps: DieCombo.init(), delta: null};
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

	//make it a stateBeforeToss transition, or a IMove?
	export function toss(stateBeforeToss: IState, roleBeforeToss: number): void {
		stateBeforeToss.steps = DieCombo.generate();
	}

	/** Given a starting position, reflect all reachable positions. */
	export function startMove(stateBeforeMove: IState, start: number, role: number): Board {
		let board = stateBeforeMove.board;
		let steps = stateBeforeMove.steps;
		let res: Board;
		for (let i = 0; i < steps.length; i++) {
			if (role === WHITE) {
				steps[i] = -steps[i];
			}
		}
		if (steps.length === 1) {
			let t = board[start + steps[0]];
			if (t.status !== 1 - role) {
				res.push(t);
			} else if (t.count === 1) {
				res.push(t);
			}
		} else if (steps.length === 2) {
			let needSum = false;
			for (let i = 0; i < steps.length; i++) {
				let t = board[start + steps[i]];
				if (t.status !== 1 - role) {
					res.push(t);
					needSum = true;
				} else if (t.count === 1) {
					res.push(t);
					needSum = true;
				}
			}
			if (needSum) {
				let t = board[start + steps[0] + steps[1]];
				if (t.status !== 1 - role) {
					res.push(t);
				} else if (t.count === 1) {
					res.push(t);
				}
			}
		} else if (steps.length === 3 || steps.length === 4) {
			for (let i = 1; i <= steps.length; i++) {
				let t = board[start + i * steps[0]];
				if (t.status !== 1 - role) {
					res.push(t);
				} else if (t.count === 1) {
					res.push(t);
				} else {
					break;
				}
			}
		}
		return res;
	}

	function checkValidPos(board: Board, start: number, end: number, result: Board, role: number): void {
		if (end < 26) {
			if (role === 1) {
				if (board[end].status === role || (board[end].status === WHITE && board[end].count === 1)) {
					let tBoard = board[end];
					result.push(tBoard);
				}
			}
			if (role === 0) {
				if (board[end].status === role || (board[end].status === BLACK && board[end].count === 1)) {
					let tBoard = board[end];
					result.push(tBoard);
				}
			}
		} else if (end > 26) {
			let fakeStart = start + 1;
			while (fakeStart > 19) {
				if (board[fakeStart].status === role) {
					throw new Error("Must move leftmost checker first!");
				}
				fakeStart++;
			}
			let tBoard = board[27];
			result.push(tBoard);
		} else {
			let tBoard = board[27];
			result.push(tBoard);
		}
	}

	function bearOffStartMove(stateBeforeMove: IState, start: number, role: number): Board {
		let board = stateBeforeMove.board;
		let steps = stateBeforeMove.steps;
		let bearOffRes: Board;
		if (steps.length === 1) {
			checkValidPos(board, start, start + steps[0], bearOffRes, role);
		}
		if (steps.length === 2 && (steps[0] !== steps[1])) {
			checkValidPos(board, start, start + steps[0], bearOffRes, role);
			checkValidPos(board, start, start + steps[1], bearOffRes, role);
			checkValidPos(board, start, start + steps[0] + start[1], bearOffRes, role);
		}
		if (steps.length >= 2 && steps[0] === steps[1]) {
			let len = steps.length;
			for (let i = 2; i <= len; i++) {
				checkValidPos(board, start, start + i * steps[0], bearOffRes, role);
			}
		}
		return bearOffRes;
	}	

	export function createMove(stateBeforeMove: IState, start: number, end: number, roleBeforeMove: number): IMove {
		//assume now that (end-start) appears in steps, and no automatic move relay
		if (!stateBeforeMove) {
			stateBeforeMove = getInitialState();
		}
		let board = stateBeforeMove.board;
		//let role = stateBeforeMove.backgammon.role;
		let steps = stateBeforeMove.steps;
		if (getWinner(board) !== "") {
			throw new Error("One can only make a move if the game is not over!");
		}
		let boardAfterMove = angular.copy(board);

		//update steps after this move, delete that tossed value from steps
		//browser support for indexOf is limited; it is not supported in Internet Explorer 7 and 8.
		let index = steps.indexOf(Math.abs(end - start));
		if (index > -1) {
			steps.splice(index, 1);
		} else {
			//roll back
			return {endMatchScores: null, turnIndexAfterMove: roleBeforeMove, stateAfterMove: stateBeforeMove};
		}
		
		if (boardAfterMove[end].status !== 1 - roleBeforeMove) {
			//safe to occupy or add
			boardAfterMove[start].count -= 1;
			if (boardAfterMove[start].count === 0) {
				boardAfterMove[start].status = EMPTY;
			}
			boardAfterMove[end].count += 1;
			boardAfterMove[end].status = roleBeforeMove;
		} else if (boardAfterMove[end].count === 1) {
			boardAfterMove[start].count -= 1;
			if (boardAfterMove[start].count === 0) {
				boardAfterMove[start].status = EMPTY;
			}
			//boardAfterMove[end].count = 1;
			boardAfterMove[end].status = roleBeforeMove;
			if (roleBeforeMove === BLACK) {
				boardAfterMove[WHITEBAR].count += 1;
			} else {
				boardAfterMove[BLACKBAR].count += 1;
			}
		}

		let endMatchScores: number[];
		let roleAfterMove: number;

		let winner = getWinner(boardAfterMove);
		if (winner !== "") {
			//Game over.
			roleAfterMove = -1; //role -1 denotes game over!
			endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
		} else {
			//if no further steps, switch player.
			if (steps.length === 0) {
				roleAfterMove = 1 - roleBeforeMove;
			}
			endMatchScores = null;
		}
		let delta: BoardDelta = {start: start, end: end};
		let stateAfterMove: IState = {board: boardAfterMove, steps: steps, delta: delta};
		return {endMatchScores: endMatchScores, turnIndexAfterMove: roleAfterMove, stateAfterMove: stateAfterMove};
	}

	function moveExist(board: Board, steps: number[], role: number): boolean {
		let stepCombination: number[];
		let bearTime: boolean = canBearOff(board, role);

		//Valid move always exists when bearoff time
		if (bearTime) {
			return true;
		}

		//for the purpose of this function, stepCombination contains at most two numbers
		if (steps.length === 1 || steps.length === 3 || steps.length === 4) {
			stepCombination = [steps[0]];
		} else if (steps.length === 2) {
			if (steps[0] !== steps[1]) {
				//only need to check valid split moves, not sum of split moves
				stepCombination = [steps[0], steps[1]];
			} else {
				stepCombination = [steps[0]];
			}
		}

		if (role === BLACK) {
			if (board[BLACKBAR].count !== 0) {
				//check valid move for the checker on BLACKBAR
				for (let step of stepCombination) {
					let pos = BLACKBAR + step;
					if (board[pos].status === BLACK || board[pos].status === EMPTY 
							|| (board[pos].status === WHITE && board[pos].count === 1)) {
						return true;
					}
				}
			} else {
				//check valid move for any black checker on the board
				for (let i = 2; i < 26; i++) {
					if (board[i].status === BLACK) {
						for (let step of stepCombination) {
							let pos = i + step;
							if (pos < 26) {
								if (board[pos].status === BLACK || board[pos].status === EMPTY 
										|| (board[pos].status === WHITE && board[i].count === 1)) {
									return true;
								}
							}
						}
					}
				}
			}
			return false;
		}

		if (role === WHITE) {
			if (board[WHITEBAR].count !== 0) {
				//check valid move for the checker on WHITEBAR
				for (let step of stepCombination) {
					let pos = WHITEBAR - step;
					if (board[pos].status === WHITE || board[pos].status === EMPTY 
							|| (board[pos].status === BLACK && board[pos].count === 1)) {
						return true;
					}
				}
			} else {
				//check valid move for any white checker on the board
				for (let i = 25; i > 1; i--) {
					if (board[i].status === WHITE) {
						for (let step of stepCombination) {
							let pos = i - step;
							if (pos > 1) {
								if (board[pos].status === WHITE || board[pos].status === EMPTY 
										|| (board[pos].status === BLACK && board[i].count === 1)) {
									return true;
								}
							}
						}
					}
				}
			}
			return false;
		}
	}
}