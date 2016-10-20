type Board = Tower[];
type Steps = number[];

class Tower {
	//status: 1 for black, 0 for white, -1 for empty
	constructor(public tid: number,
				public status: number, 
				public count: number) {
	}
}

module DieCombo {
	export function generate(): Steps {
		let die1: number = Math.floor(Math.random() * 6 + 1);
		let die2: number = Math.floor(Math.random() * 6 + 1);
		if (die1 === die2) {
			return [die1, die1, die1, die1];
		} else {
			return [die1, die2];
		}
	}

	export function init(): Steps {
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

interface BoardDelta {
	start: number;
	end: number;
}

interface IState {
	board: Board;
	steps: Steps;
	delta: BoardDelta;
}

interface IEndToStepIndex {
	[key: number]: number[];
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

	/** This function simply converts overflow indexes to respective home value. */
	export function getValidPos(start: number, step: number, role: number) {
		let pos: number;
		if (role === BLACK) {
			let tmp = start + step;
			pos = tmp > 25 ? BLACKHOME : tmp;
		} else {
			let tmp = start - step;
			pos = tmp < 2 ? WHITEHOME : tmp;
		}
		return pos;
	}

	/** 
	 * This function models the board result after this move.
	 * Successful moves modified the board, and return true.
	 * Unsuccessful moves leave the board unmodified and return false.
	 */
	function modelMove(board: Board, start: number, step: number, role: number): boolean {
		if (board[start].status !== role) {
			return false;
		}
		let end = getValidPos(start, step, role);
		if (role === BLACK && end === BLACKHOME && canBearOff(board, BLACK)) {
			for (let i = 20; i < start; i++) {
				if (board[i].status === BLACK) {
					return false;
				}
			}
			board[start].count -= 1;
			if (board[start].count === 0) {
				board[start].status = EMPTY;
			}
			board[BLACKHOME].count += 1;
			return true;
		} else if (role === WHITE && end === WHITEHOME && canBearOff(board, WHITE)) {
			for (let i = 7; i > start; i--) {
				if (board[i].status === WHITE) {
					return false;
				}
			}
			board[start].count -= 1;
			if (board[start].count === 0) {
				board[start].status = EMPTY;
			}
			board[WHITEHOME].count += 1;
			return true;
		} else if (board[end].status !== 1 - role || board[end].count === 1) {
			board[start].count -= 1;
			if (board[start].count === 0 && start !== BLACKBAR && start !== WHITEBAR) {
				board[start].status = EMPTY;
			}
			if (board[end].status !== 1 - role) {
				board[end].count += 1;
			} else {
				let enemyBar = role === BLACK ? WHITEBAR : BLACKBAR;
				board[enemyBar].count += 1;
			}
			board[end].status = role;
			return true;
		}
		return false;
	}

	/** 
	 * This function reflects all reachable positions, given starting position.
	 * From start, all possible moves are assumed from original in order.
	 * Returns an object, containing reachable Tower tid's as keys, and an array of steps indexes by which to walk from start.
	 * For example, assuming black and starting from 2, steps[4, 6], returns {6: [0], 8: [1], 12: [1, 0]} 
	 */
	export function startMove(stateBeforeMove: IState, start: number, role: number): IEndToStepIndex {
		let res: IEndToStepIndex = {};
		if (stateBeforeMove.steps.length === 0) {
			return res;
		} else if (stateBeforeMove.steps.length === 2) {
			let board: Board;
			let steps = stateBeforeMove.steps;
			let newStart: number;
			// 1 -> 2
			board = angular.copy(stateBeforeMove.board);
			newStart = start;
			for (let i = 0; i < steps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, steps[i], role);
				let modified = modelMove(board, oldStart, steps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}			
			// 2 -> 1
			board = angular.copy(stateBeforeMove.board);
			newStart = start;
			for (let i = steps.length - 1; i >= 0; i--) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, steps[i], role);
				let modified = modelMove(board, oldStart, steps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}
		} else {
			let board: Board;
			let steps = stateBeforeMove.steps;
			let newStart = start;
			// 1
			// 1 -> 2 -> 3 [-> 4]
			board = angular.copy(stateBeforeMove.board);
			for (let i = 0; i < steps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, steps[i], role);
				let modified = modelMove(board, oldStart, steps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}
		}
		return res;
	}

	// function checkValidPos(board: Board, start: number, end: number, result: Board, role: number): void {
	// 	if (role === BLACK) {
	// 		if (end <= 25) {
	// 			if (board[end].status === role || (board[end].status === WHITE && board[end].count === 1)) {
	// 				let tBoard = board[end];
	// 				result.push(tBoard);
	// 			} 
	// 		} else if (end === 26){
	// 			///if end is 26, home is a reachable position.
	// 			let tBoard = board[27];
	// 			result.push(tBoard);
	// 		} else {
	// 			///home is reachable postion if there is no checker left on its left side. Otherwise, there is no reachable position.
	// 			let fakeStart = start - 1;
	// 			while (fakeStart > 19) {
	// 				if (board[fakeStart].status === role) {
	// 					throw new Error("Must move leftmost checker first!");
	// 				}
	// 				fakeStart--;
	// 			}
	// 			let tBoard = board[27];
	// 			result.push(tBoard);
	// 		} 
	// 	}
	// 	if (role === WHITE) {
	// 		if (end >= 2) {
	// 			if (board[end].status === role || (board[end].status === BLACK && board[end].count === 1)) {
	// 				let tBoard = board[end];
	// 				result.push(tBoard);
	// 			}
	// 		} else if (end === 1){
	// 			///if end is 1, home is a reachable postion.
	// 			let tBoard = board[0];
	// 			result.push(tBoard);
	// 		} else {
	// 			///home is reachable postion if there is no checker left on its left side. Otherwise, there is no reachable position.
	// 			let fakeStart = start + 1;
	// 			while (fakeStart < 8) {
	// 				if (board[fakeStart].status === role) {
	// 					throw new Error("Must move leftmost checker first!");
	// 				}
	// 				fakeStart++;
	// 			}
	// 			let tBoard = board[0];
	// 			result.push(tBoard);
	// 		} 
	// 	}
	// }

	// function bearOffStartMove(stateBeforeMove: IState, start: number, role: number): Board {
	// 	let board = stateBeforeMove.board;
	// 	let steps = stateBeforeMove.steps;
	// 	let bearOffRes: Board;
	// 	if (steps.length === 1) {
	// 		if (role === BLACK) {
	// 			checkValidPos(board, start, start + steps[0], bearOffRes, role);
	// 		} else {
	// 			checkValidPos(board, start, start - steps[0], bearOffRes, role);
	// 		}
	// 	}
	// 	if (steps.length === 2 && (steps[0] !== steps[1])) {
	// 		if (role === BLACK) {
	// 			checkValidPos(board, start, start + steps[0], bearOffRes, role);
	// 			checkValidPos(board, start, start + steps[1], bearOffRes, role);
	// 			checkValidPos(board, start, start + steps[0] + start[1], bearOffRes, role);
	// 		} else {
	// 			checkValidPos(board, start, start - steps[0], bearOffRes, role);
	// 			checkValidPos(board, start, start - steps[1], bearOffRes, role);
	// 			checkValidPos(board, start, start - steps[0] - start[1], bearOffRes, role);
	// 		}
	// 	}
	// 	if (steps.length >= 2 && steps[0] === steps[1]) {
	// 		let len = steps.length;
	// 		if (role === BLACK) {
	// 			for (let i = 2; i <= len; i++) {
	// 				checkValidPos(board, start, start + i * steps[0], bearOffRes, role);
	// 			}
	// 		} else {
	// 			for (let i = 2; i <= len; i++) {
	// 				checkValidPos(board, start, start - i * steps[0], bearOffRes, role);
	// 			}
	// 		}
	// 	}
	// 	return bearOffRes;
	// }	

	/**
	 * This function reacts on the mouse second click or drop event to trigger a move to be created on the original board.
	 * Param start comes from the mouse first click or drag event, and denotes the starting point of this move.
	 * Param end comes from the mouse second click or drop event, and denotes the ending point of this move.
	 * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
	 * When no more step available, players are switched.
	 */
	export function createMove(stateBeforeMove: IState, start: number, end: number, roleBeforeMove: number): IMove {
		//assume now that |end-start| appears in steps, and no automatic move relay
		if (!stateBeforeMove) {
			stateBeforeMove = getInitialState();
		}
		let board = stateBeforeMove.board;
		let steps = stateBeforeMove.steps;
		if (getWinner(board) !== "") {
			throw new Error("One can only make a move if the game is not over!");
		}
		let boardAfterMove: Board;
		//if the move exists, process the move on the copy board, and remove the step from the steps
		let posToStep = startMove(stateBeforeMove, start, roleBeforeMove);
		if (end in posToStep) {
			//posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
			let index = posToStep[end][0];
			boardAfterMove = angular.copy(board);
			modelMove(boardAfterMove, start, steps[index], roleBeforeMove);
			steps.splice(index, 1);
		} else {
			//no such value found tossed, must roll back
			return {endMatchScores: null, turnIndexAfterMove: roleBeforeMove, stateAfterMove: stateBeforeMove};
		}
		let endMatchScores: number[];
		let roleAfterMove: number;
		let winner = getWinner(boardAfterMove);
		if (winner !== "") {
			//Game over.
			roleAfterMove = -1;
			endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
		} else {
			if (steps.length === 0) {
				//if no further steps, switch player.
				roleAfterMove = 1 - roleBeforeMove;
			} else {
				//further steps, player unchanged.
				roleAfterMove = roleBeforeMove;
			}
			endMatchScores = null;
		}
		let delta: BoardDelta = {start: start, end: end};
		let stateAfterMove: IState = {board: boardAfterMove, steps: steps, delta: delta};
		return {endMatchScores: endMatchScores, turnIndexAfterMove: roleAfterMove, stateAfterMove: stateAfterMove};
	}

	export function createInitialMove(): IMove {
    	return {endMatchScores: null, turnIndexAfterMove: -1, stateAfterMove: getInitialState()};  
  	}

	function moveExist(stateBeforeMove: IState, role: number): boolean {
		//no move exists for ended game
		if (role === -1) {
			return false;
		}

		let board = stateBeforeMove.board;
		let steps = stateBeforeMove.steps;

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
				// for (let step of stepCombination) {
				let moves = startMove(stateBeforeMove, BLACKBAR, BLACK);
					// if (angular.equals(moves, {})) {
					// 	return false;
					// }
				if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
					return true;
				}
				// }
				return false;
			} else {
				for (let i = 2; i < 26; i++) {
					let moves = startMove(stateBeforeMove, i, BLACK);
					if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
						return true;
					}
				}
				return false;
			}
		} else {
			if (board[WHITEBAR].count !== 0) {
				// for (let step of stepCombination) {
				let moves = startMove(stateBeforeMove, WHITEBAR, WHITE);
					// if (angular.equals(moves, {})) {
					// 	return false;
					// }
				if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
					return true;
				}
				// }
				return false;
			} else {
				for (let i = 25; i > 1; i--) {
					let moves = startMove(stateBeforeMove, i, WHITE);
					if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
						return true;
					}
				}
				return false;
			}
		}
	}

// interface IStateTransition {
//   turnIndexBeforeMove : number;
//   stateBeforeMove: IState;
//   numberOfPlayers: number;
//   move: IMove;
// }
  export function checkMoveOk(stateTransition: IStateTransition): void {
    // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    // to verify that the move is OK.
    let turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
    let stateBeforeMove: IState = stateTransition.stateBeforeMove;
    let move: IMove = stateTransition.move;
    if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
        angular.equals(createInitialMove(), move)) {
      return;
    }
    let deltaValue: BoardDelta = move.stateAfterMove.delta;
    let start = deltaValue.start;
    let end = deltaValue.end;
    let expectedMove = createMove(stateBeforeMove, start, end, turnIndexBeforeMove);
    if (!angular.equals(move, expectedMove)) {
      throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
          ", but got stateTransition=" + angular.toJson(stateTransition, true))
    }
  }	
}