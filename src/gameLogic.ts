type Board = Tower[];
type Steps = number[];

class Tower {
	//status: 0 for black, 1 for white, -1 for empty
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

/** The mini-move level delta contains the start and end of this mini-move. */
interface IMiniMove {
	start: number;
	end: number;
}

/** The turn level delta has info on the original dices, remaining dices, and ordered mini-moves. */
interface ITurnDelta {
	originalSteps: Steps; // immutable
	currentSteps: Steps; // mutable
	moves: IMiniMove[];
}

/** The top level delta may contain more than one turn level delta. */
interface BoardDelta {
	turns: ITurnDelta[];
}

/** The top level state contains the final board, and top level delta to reach the board. */
interface IState {
	board: Board;
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
	export const BLACK = 0;
	export const WHITE = 1;
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
	export function canBearOff(board: Board, role: number): boolean {
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

	export function getOriginalSteps(currentState: IState, role: number): Steps {
		let lastTurn = currentState.delta.turns[currentState.delta.turns.length - 1];
		return lastTurn.originalSteps;
	}

	/** Start a new turn. Set the original dice values. */
	export function setOriginalSteps(currentState: IState, role: number): void {
		// We can assume the currentState has been properly initialized with the final board,
		// while the final delta may or may not be initialized:
		// if yes, not the first turn; if not, the first turn.
		if (!currentState.delta) {
			currentState.delta = {turns: []};
			let imSteps = DieCombo.generate();
			let mSteps = angular.copy(imSteps);
			currentState.delta.turns.push({originalSteps: imSteps, currentSteps: mSteps, moves: null});
		} else if (shouldRollDicesAgain(currentState, role)) {
			let imSteps = DieCombo.generate();
			let mSteps = angular.copy(imSteps);
			currentState.delta.turns.push({originalSteps: imSteps, currentSteps: mSteps, moves: null});
		} else {
			throw new Error("You should not try to roll the dices again, your opponent has a chance to move!");
		}
	}

	/** Start a new turn with customized original dice values. */
	function setOriginalStepsWithDefault(currentState: IState, role: number, steps: Steps): void {
		if (!currentState.delta) {
			currentState.delta = {turns: []};
			let imSteps = angular.copy(steps);
			let mSteps = angular.copy(imSteps);
			currentState.delta.turns.push({originalSteps: imSteps, currentSteps: mSteps, moves: null});
		} else if (shouldRollDicesAgain(currentState, role)) {
			let imSteps = angular.copy(steps);
			let mSteps = angular.copy(imSteps);
			currentState.delta.turns.push({originalSteps: imSteps, currentSteps: mSteps, moves: null});
		} else {
			throw new Error("You should not try to roll the dices again, your opponent has a chance to move!");
		}
	}

	/** 
	 * This function checks the extreme case whether the opponent's home board has been occupied by six doubles.
	 * And the opponent still has checkers waiting on the bar to enter the board.
	 * No matter how the dices are rolled, the opponent cannot make a move in this case.
	 * Therefore it signals the current player to roll the dices legally to start the next turn.
	 */
	function isEnemySurelyStuck(board: Board, role: number): boolean {
		let enemyBar = role === BLACK ? WHITEBAR : BLACKBAR;
		if (board[enemyBar].count !== 0) {
			if (role === BLACK) {
				for (let i = 20; i < 26; i++) { // white home board
					if (board[i].status !== role || board[i].count === 1) {
						return false;
					}
				}
				return true;
			} else {
				for (let i = 2; i < 8; i++) { // black home board
					if (board[i].status !== role || board[i].count === 1) {
						return false;
					}
				}
				return true;
			}
		} else {
			return false;
		}
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
	 * This function models the board result after this mini-move.
	 * Successful mini-move modifies the board, and returns true.
	 * Unsuccessful mini-move leaves the board unmodified and returns false.
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
			let myHome = role === BLACK ? BLACKHOME : WHITEHOME;
			if (end === myHome && !canBearOff(board, role)) return false;
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
	export function startMove(curBoard: Board, curSteps: Steps, start: number, role: number): IEndToStepIndex {
		let res: IEndToStepIndex = {};
		let myBar = role === BLACK ? BLACKBAR : WHITEBAR;
		if ((curBoard[myBar].count !== 0 && start !== myBar) || curSteps.length === 0) {
			return res;
		} else if (curSteps.length === 2) {
			let board: Board;
			let newStart: number;
			// 1 -> 2
			board = angular.copy(curBoard);
			newStart = start;
			for (let i = 0; i < curSteps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, curSteps[i], role);
				let modified = modelMove(board, oldStart, curSteps[i], role);
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
			board = angular.copy(curBoard);
			newStart = start;
			for (let i = curSteps.length - 1; i >= 0; i--) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, curSteps[i], role);
				let modified = modelMove(board, oldStart, curSteps[i], role);
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
			board = angular.copy(curBoard);
			for (let i = 0; i < curSteps.length; i++) {
				let oldStart = newStart;
				newStart = getValidPos(oldStart, curSteps[i], role);
				let modified = modelMove(board, oldStart, curSteps[i], role);
				if (modified) {
					//assume an automatic conversion from number to string
					if (!res[board[newStart].tid]) {
						res[board[newStart].tid] = [];
					}
					res[board[newStart].tid].push(i);
					if (newStart === BLACKHOME || newStart == WHITEHOME) {
						break;
					}
				} else {
					break;
				}
			}
		}
		return res;
	}

	export function createMove(originalState: IState, currentState: IState, turnIndexBeforeMove: number): IMove {
		// if (!stateBeforeMove) {
		// 	stateBeforeMove = getInitialState();
		// }
		let oldBoard: Board = originalState.board;
		if (getWinner(oldBoard) !== '') {
			throw new Error("Can only make a move if the game is not over!");
		}
		if (!currentState.delta) {
			throw new Error("Please roll the dices to start your turn!");
		}
		let last = currentState.delta.turns.length - 1;
		let lastTurn = currentState.delta.turns[last];
		let winner = getWinner(currentState.board);
		let endMatchScores: number[];
		let turnIndexAfterMove: number;
		if (winner !== '') {
			// Game over.
			turnIndexAfterMove = -1;
			endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
		} else if (shouldRollDicesAgain(currentState, turnIndexBeforeMove)) {
			// Game continues. You should roll the dices again to start a new turn directly.
			throw new Error("Your opponent is closed out. You should roll the dices again to start a new turn directly.");
		} else if (lastTurn.currentSteps.length !== 0 && moveExist(currentState, turnIndexBeforeMove)) {
			// Game continues. You should complete all available mini-moves within your turn.
			throw new Error("You should complete all available mini-moves within your turn.");
		} else {
			// Game continues. Now it's the opponent's turn.
			turnIndexAfterMove = 1 - turnIndexBeforeMove;
			endMatchScores = null;
		}
		//let stateAfterMove: IState = angular.copy(currentState); // do we need to copy this?
		let stateAfterMove: IState = angular.copy(currentState);
		return {endMatchScores: endMatchScores, 
				turnIndexAfterMove: turnIndexAfterMove, 
				stateAfterMove: stateAfterMove};
	}	

	/**
	 * This function reacts on the mouse second click or drop event to trigger a mini-move to be created on the current board.
	 * Param start comes from the mouse first click or drag event, and denotes the starting point of this mini-move.
	 * Param end comes from the mouse second click or drop event, and denotes the ending point of this mini-move.
	 * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
	 * When no more step available, players are switched.
	 */
	export function createMiniMove(stateBeforeMove: IState, start: number, end: number, roleBeforeMove: number): boolean {
		// We can assume the stateBeforeMove has been properly initialized with the final board,
		// while the turns or originalSteps in the current turn may not be initialized (dices not rolled first).
		let turns = stateBeforeMove.delta.turns;
		if (!turns) {
			// throw new Error("You have to roll the dices to start a new turn!");
			log.info(["You have to roll the dices to start a new turn!"]);
			return false;
		} else if (shouldRollDicesAgain(stateBeforeMove, roleBeforeMove)) {
			// throw new Error("Your opponent is closed out. You can roll the dices to start a new turn again!");
			log.info(["Your opponent is closed out. You can roll the dices to start a new turn again!"]);
			return false;
		} else if (turns[turns.length - 1].currentSteps.length === 0) {
			// Cannot re-roll the dices, and the current turn is complete, must submit the move.
			log.info(["All mini-moves complete. Please submit your move!"]);
			return false;
		} else {
			// make a mini-move
			let curTurn = turns[turns.length - 1];
			if (getWinner(stateBeforeMove.board) !== "") {
				log.info(["The game is over. If it's your turn, you can submit this move now!"]);
				return false;
			}
			let posToStep = startMove(stateBeforeMove.board, curTurn.currentSteps, start, roleBeforeMove);
			if (end in posToStep) {
				//posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
				let index = posToStep[end][0];
				modelMove(stateBeforeMove.board, start, curTurn.currentSteps[index], roleBeforeMove);
				curTurn.currentSteps.splice(index, 1);
				if (!curTurn.moves) {
					curTurn.moves = [];
				}
				let oneMiniMove: IMiniMove = {start: start, end: end};
				curTurn.moves.push(oneMiniMove);
				return true;
			} else {
				//no such value found tossed, not a legal move
				log.info(["No such move!"]);
				return false;
			}
		}
	}

	/** 
	 * This function checks whether it is legal to roll the dices again. 
	 * The only allowed case is when the player has completed the current turn, 
	 * and the opponent is closed out for moves.
	 */
	function shouldRollDicesAgain(state: IState, role: number): boolean {
		// We can assume the state has at least one turn in the delta
		let last = state.delta.turns.length - 1;
		let lastTurn = state.delta.turns[last];
		if (lastTurn.currentSteps.length !== 0) {
			return false;
		} else if (isEnemySurelyStuck(state.board, role)) {
			return true;
		} else {
			return false;
		}
	}

	/** 
	 * This functions checks whether a mini-move is possible, 
	 * given current board, role and remaining steps. 
	 */
	export function moveExist(state: IState, role: number): boolean {
		//no move exists for ended game
		if (role === -1) {
			return false;
		}
		let board = state.board;
		let last = state.delta.turns.length - 1;
		let currentSteps = state.delta.turns[last].currentSteps;
		let stepCombination: number[] = [];
		let bearTime: boolean = canBearOff(board, role);
		// valid move always exists when bearoff time
		if (bearTime) {
			return true;
		}
		//for the purpose of this function, stepCombination contains at most two numbers
		stepCombination.push(currentSteps[0]); // first element is always included
		// if different, include the second element
		if (currentSteps.length === 2 && currentSteps[0] !== currentSteps[1]) {
			stepCombination.push(currentSteps[1]);
		}
		let myBar = role === BLACK ? BLACKBAR : WHITEBAR;
		let moves: IEndToStepIndex = null;
		if (board[myBar].count !== 0) {
			moves = startMove(board, stepCombination, myBar, role);
			if (angular.equals(moves, {})) {
				return false;
			}
		}
		for (let i = 2; i < 26; i++) {
			moves = startMove(board, stepCombination, i, role);
			if (!angular.equals(moves, {})) {
				return true;
			}
		}
		return false;
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
		if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
			angular.equals(createInitialMove(), move)) {
			return;
		}
		let delta: BoardDelta = move.stateAfterMove.delta;
		let expectedMove: IMove = null;
		let tmpState: IState = {board: angular.copy(stateBeforeMove.board), delta: null};
		for (let turn of delta.turns) {
			setOriginalStepsWithDefault(tmpState, turnIndexBeforeMove, turn.originalSteps);
			// this check needed if the player is completely closed out so moves is null			
			if (turn.moves) { 
				for (let move of turn.moves) {
					createMiniMove(tmpState, move.start, move.end, turnIndexBeforeMove);
				}
			}
		}
		expectedMove = createMove(stateBeforeMove, tmpState, turnIndexBeforeMove);
		if (!angular.equals(move, expectedMove)) {
		throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
			", but got stateTransition=" + angular.toJson(stateTransition, true))
		}
	}	
}