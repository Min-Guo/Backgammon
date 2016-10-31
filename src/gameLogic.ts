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

interface IMiniMove {
	start: number;
	end: number;
}

interface BoardDelta {
	originalSteps: Steps;
	moves: IMiniMove[];
}

interface IState {
	board: Board;
	delta: BoardDelta;
}

interface IEndToStepIndex {
	[key: number]: number[];
}

module gameLogic {
	let currentState: IState = {
		/** 
		 * A successful minimove modifies the currentState's board. 
		 * When all minimoves are done, it serves as the boardAfterMove.
		 */
		board: null,
		/**
		 * Records the die combination used.
		 * Records the minimoves to produce the current state from stateBeforeMove in order.
		 */
		delta: {
			originalSteps: null,
			moves: null,
		},
	};

	/** 
	 * A successful minimove shortens the currentSteps. 
	 * When it reaches 0, the move is submitted.
	 */
	let currentSteps: Steps = null;

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
		let board: Board = Array(27);
		for (let i = 0; i < 28; i++) {
			if (i === WHITEHOME || i === WHITEBAR) {
				board[i] = new Tower(i, WHITE, 0);
			} else if (i === BLACKHOME || i === BLACKBAR) {
				board[i] = new Tower(i, BLACK, 0);
			} else if (i === 2) {
				board[i] = new Tower(i, BLACK, 2);
			} else if (i === 7) {
				board[i] = new Tower(i, WHITE, 5);
			} else if (i === 9) {
				board[i] = new Tower(i, WHITE, 3);
			} else if (i === 13) {
				board[i] = new Tower(i, BLACK, 5);
			} else if (i === 14) {
				board[i] = new Tower(i, WHITE, 5);
			} else if (i === 18) {
				board[i] = new Tower(i, BLACK, 3);
			} else if (i === 20) {
				board[i] = new Tower(i, BLACK, 5);
			} else if (i === 25) {
				board[i] = new Tower(i, WHITE, 2);
			} else {
				board[i] = new Tower(i, EMPTY, 0);
			}
		}
		return board;
	}

	export function getInitialState(): IState {
		return {board: getInitialBoard(), delta: null};
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

	/** Set the dies value. Initialize the local copy of modifiable steps. */
	export function setOriginalSteps(): void {
		if (currentSteps) {
			throw new Error("You have already rolled the dices!");
		}
		if (!currentState) {
			currentState = getInitialState();
		}
		if (!currentState.delta) {
			currentState.delta = {originalSteps: null, moves: null};
		}
		currentState.delta.originalSteps = DieCombo.generate();
		currentSteps = angular.copy(currentState.delta.originalSteps);
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
			if (start + step > BLACKHOME - 1) {
				for (let i = start - 1; i > 19; i--) {
					if (board[i].status === BLACK) {
						return false;
					}
				}
			}			
			board[start].count -= 1;
			if (board[start].count === 0) {
				board[start].status = EMPTY;
			}
			board[BLACKHOME].count += 1;
			return true;
		} else if (role === WHITE && end === WHITEHOME && canBearOff(board, WHITE)) {
			if (start - step < WHITEHOME + 1) {
				for (let i = start + 1; i < 8; i++) {
					if (board[i].status === WHITE) {
						return false;
					}
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
	export function startMove(start: number, role: number): IEndToStepIndex {
		let res: IEndToStepIndex = {};
		if (currentSteps.length === 0) {
			return res;
		} else if (currentSteps.length === 2) {
			let board: Board;
			let newStart: number;
			// 1 -> 2
			board = angular.copy(currentState.board);
			newStart = start;
			for (let i = 0; i < currentSteps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, currentSteps[i], role);
				let modified = modelMove(board, oldStart, currentSteps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					if (!res[board[newStart].tid]) {
						res[board[newStart].tid] = [];
					}
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}			
			// 2 -> 1
			board = angular.copy(currentState.board);
			newStart = start;
			for (let i = currentSteps.length - 1; i >= 0; i--) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, currentSteps[i], role);
				let modified = modelMove(board, oldStart, currentSteps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					if (!res[board[newStart].tid]) {
						res[board[newStart].tid] = [];
					}
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}
		} else {
			let board: Board;
			let newStart = start;
			// 1
			// 1 -> 2 -> 3 [-> 4]
			board = angular.copy(currentState.board);
			for (let i = 0; i < currentSteps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, currentSteps[i], role);
				let modified = modelMove(board, oldStart, currentSteps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					if (!res[board[newStart].tid]) {
						res[board[newStart].tid] = [];
					}
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				}
			}
		}
		return res;
	}

	export function createMove(stateBeforeMove: IState, delta: BoardDelta, turnIndexBeforeMove: number): IMove {
		if (!stateBeforeMove) {
			stateBeforeMove = getInitialState();
		}
		let oldBoard: Board = stateBeforeMove.board;
		if (getWinner(oldBoard) !== '') {
			throw new Error("Can only make a move if the game is not over!");
		}
		if (!currentSteps) {
			throw new Error("You haven't yet rolled the dices!");
		}
		let newBoard: Board = angular.copy(currentState.board);
		let winner = getWinner(newBoard);
		let endMatchScores: number[];
		let turnIndexAfterMove: number;
		if (winner !== '') {
			// Game over.
			turnIndexAfterMove = -1;
			endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
		} else if (currentSteps.length !== 0) {
			throw new Error("You haven't completed your moves!");
		} else {
			// Game continues. Now it's the opponent's turn.
			turnIndexAfterMove = 1 - turnIndexBeforeMove;
			endMatchScores = null;
		}
		let newDelta: BoardDelta = angular.copy(currentState.delta);
		let stateAfterMove: IState = {board: newBoard, delta: newDelta};
		// Reset after the turn ends.
		currentState.delta = null;
		currentSteps = null;
		return {endMatchScores: endMatchScores, 
				turnIndexAfterMove: turnIndexAfterMove, 
				stateAfterMove: stateAfterMove};
	}	

	/**
	 * This function reacts on the mouse second click or drop event to trigger a move to be created on the original board.
	 * Param start comes from the mouse first click or drag event, and denotes the starting point of this move.
	 * Param end comes from the mouse second click or drop event, and denotes the ending point of this move.
	 * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
	 * When no more step available, players are switched.
	 */
	export function createMiniMove(start: number, end: number, roleBeforeMove: number): void {
		if (!currentSteps) {
			throw new Error("You haven't yet rolled the dices!");
		} else if (currentSteps.length === 0) {
			console.log("All moves complete. Please submit!");
			return;
		}
		if (getWinner(currentState.board) !== "") {
			throw new Error("One can only make a move if the game is not over!");
		}
		let posToStep = startMove(start, roleBeforeMove);
		if (end in posToStep) {
			//posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
			let index = posToStep[end][0];
			modelMove(currentState.board, start, currentSteps[index], roleBeforeMove);
			currentSteps.splice(index, 1);
			if (!currentState.delta.moves) {
				currentState.delta.moves = [];
			}
			let oneMiniMove: IMiniMove = {start: start, end: end};
			currentState.delta.moves.push(oneMiniMove);
		} else {
			//no such value found tossed, not a legal move
			throw new Error("No such move!");
		}
	}

	export function createInitialMove(): IMove {
    	return {endMatchScores: null, turnIndexAfterMove: 0, stateAfterMove: getInitialState()};  
  	}

	export function checkMoveOk(stateTransition: IStateTransition): void {
		// We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
		// to verify that the move is OK.
		let turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
		let stateBeforeMove: IState = stateTransition.stateBeforeMove;
		let move: IMove = stateTransition.move;
		if (!stateBeforeMove && turnIndexBeforeMove === -1 &&
			angular.equals(createInitialMove(), move)) {
		return;
		}
		let deltaValue: BoardDelta = move.stateAfterMove.delta;
		let expectedMove: IMove = null;
		
		expectedMove = createMove(stateBeforeMove, deltaValue, turnIndexBeforeMove);
		if (!angular.equals(move, expectedMove)) {
		throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
			", but got stateTransition=" + angular.toJson(stateTransition, true))
		}
	}	
}