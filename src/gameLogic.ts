enum Status {
	Black,
	White,
	Empty
}

class Tower {
	constructor(public status: Status, 
				public count: number) {
	}

	//static toggle() { }
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

	//2, 13, 18, 20 black
	//7, 9, 14, 25 white
	/** Returns the initial Backgammon board. */
	function getInitialBoard(): Board {
		let board: Board = [];
		for (let i = 0; i < 28; i++) {
			if (i == WHITEHOME || i == WHITEBAR) {
				board[i] = new Tower(Status.White, 0);
			} else if (i == BLACKHOME || i == BLACKBAR) {
				board[i] = new Tower(Status.Black, 0);
			} else if (i == 2) {
				board[i] = new Tower(Status.Black, 2);
			} else if (i == 7) {
				board[i] = new Tower(Status.White, 5);
			} else if (i == 9) {
				board[i] = new Tower(Status.White, 3);
			} else if (i == 13) {
				board[i] = new Tower(Status.Black, 5);
			} else if (i == 14) {
				board[i] = new Tower(Status.White, 5);
			} else if (i == 18) {
				board[i] = new Tower(Status.Black, 3);
			} else if (i == 20) {
				board[i] = new Tower(Status.Black, 5);
			} else if (i == 25) {
				board[i] = new Tower(Status.White, 2);
			} else {
				board[i] = new Tower(Status.Empty, 0);
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
}