var Tower = (function () {
    //status: 1 for black, 0 for white, -1 for empty
    function Tower(tid, status, count) {
        this.tid = tid;
        this.status = status;
        this.count = count;
    }
    return Tower;
}());
var DieCombo;
(function (DieCombo) {
    function generate() {
        var die1 = Math.floor(Math.random() * 6 + 1);
        var die2 = Math.floor(Math.random() * 6 + 1);
        if (die1 === die2) {
            return [die1, die1, die1, die1];
        }
        else {
            return [die1, die2];
        }
    }
    DieCombo.generate = generate;
    function init() {
        var die1 = Math.floor(Math.random() * 6 + 1);
        var die2 = Math.floor(Math.random() * 6 + 1);
        while (die1 === die2) {
            //have to regenerate two dies together for fairness issue
            die1 = Math.floor(Math.random() * 6 + 1);
            die2 = Math.floor(Math.random() * 6 + 1);
        }
        return [die1, die2];
    }
    DieCombo.init = init;
})(DieCombo || (DieCombo = {}));
var gameLogic;
(function (gameLogic) {
    //export let originalState: IState = null;
    //export let currentState: IState = null;
    /**
     * A successful minimove shortens the currentSteps.
     * When it reaches 0, the move is submitted.
     */
    //export let currentDelta: BoardDelta = null;
    var currentSteps = null;
    gameLogic.BLACKHOME = 27;
    gameLogic.BLACKBAR = 1;
    gameLogic.WHITEHOME = 0;
    gameLogic.WHITEBAR = 26;
    gameLogic.BLACK = 1;
    gameLogic.WHITE = 0;
    gameLogic.EMPTY = -1;
    //2, 13, 18, 20 black
    //7, 9, 14, 25 white
    /** Returns the initial board. */
    function getInitialBoard() {
        var board = Array(27);
        for (var i = 0; i < 28; i++) {
            if (i === gameLogic.WHITEHOME || i === gameLogic.WHITEBAR) {
                board[i] = new Tower(i, gameLogic.WHITE, 0);
            }
            else if (i === gameLogic.BLACKHOME || i === gameLogic.BLACKBAR) {
                board[i] = new Tower(i, gameLogic.BLACK, 0);
            }
            else if (i === 2) {
                board[i] = new Tower(i, gameLogic.BLACK, 2);
            }
            else if (i === 7) {
                board[i] = new Tower(i, gameLogic.WHITE, 5);
            }
            else if (i === 9) {
                board[i] = new Tower(i, gameLogic.WHITE, 3);
            }
            else if (i === 13) {
                board[i] = new Tower(i, gameLogic.BLACK, 5);
            }
            else if (i === 14) {
                board[i] = new Tower(i, gameLogic.WHITE, 5);
            }
            else if (i === 18) {
                board[i] = new Tower(i, gameLogic.BLACK, 3);
            }
            else if (i === 20) {
                board[i] = new Tower(i, gameLogic.BLACK, 5);
            }
            else if (i === 25) {
                board[i] = new Tower(i, gameLogic.WHITE, 2);
            }
            else {
                board[i] = new Tower(i, gameLogic.EMPTY, 0);
            }
        }
        return board;
    }
    function getInitialState() {
        return { board: getInitialBoard(), delta: null };
    }
    gameLogic.getInitialState = getInitialState;
    /** If all checkers of one player are in his homeboard, he can bear them off. */
    function canBearOff(board, role) {
        if (role === gameLogic.BLACK) {
            if (board[gameLogic.BLACKBAR].count !== 0) {
                return false;
            }
            for (var i = 2; i < 20; i++) {
                if (board[i].status === gameLogic.BLACK) {
                    return false;
                }
            }
            return true;
        }
        else {
            if (board[gameLogic.WHITEBAR].count !== 0) {
                return false;
            }
            for (var i = 25; i > 7; i--) {
                if (board[i].status === gameLogic.WHITE) {
                    return false;
                }
            }
            return true;
        }
    }
    /** If one player has born off all 15 checkers, he wins. */
    function getWinner(board) {
        if (board[gameLogic.WHITEHOME].count == 15) {
            return "White";
        }
        else if (board[gameLogic.BLACKHOME].count == 15) {
            return "Black";
        }
        else {
            return "";
        }
    }
    /** Set the dies value. Initialize the local copy of modifiable steps. */
    function setOriginalSteps(currentState) {
        if (currentSteps) {
            throw new Error("You have already rolled the dices!");
        }
        if (!currentState.delta) {
            currentState.delta = { originalSteps: DieCombo.generate(), moves: null };
        }
        currentSteps = angular.copy(currentState.delta.originalSteps);
    }
    gameLogic.setOriginalSteps = setOriginalSteps;
    /** This function simply converts overflow indexes to respective home value. */
    function getValidPos(start, step, role) {
        var pos;
        if (role === gameLogic.BLACK) {
            var tmp = start + step;
            pos = tmp > 25 ? gameLogic.BLACKHOME : tmp;
        }
        else {
            var tmp = start - step;
            pos = tmp < 2 ? gameLogic.WHITEHOME : tmp;
        }
        return pos;
    }
    gameLogic.getValidPos = getValidPos;
    /**
     * This function models the board result after this move.
     * Successful moves modified the board, and return true.
     * Unsuccessful moves leave the board unmodified and return false.
     */
    function modelMove(board, start, step, role) {
        if (board[start].status !== role) {
            return false;
        }
        var end = getValidPos(start, step, role);
        if (role === gameLogic.BLACK && end === gameLogic.BLACKHOME && canBearOff(board, gameLogic.BLACK)) {
            if (start + step > gameLogic.BLACKHOME - 1) {
                for (var i = start - 1; i > 19; i--) {
                    if (board[i].status === gameLogic.BLACK) {
                        return false;
                    }
                }
            }
            board[start].count -= 1;
            if (board[start].count === 0) {
                board[start].status = gameLogic.EMPTY;
            }
            board[gameLogic.BLACKHOME].count += 1;
            return true;
        }
        else if (role === gameLogic.WHITE && end === gameLogic.WHITEHOME && canBearOff(board, gameLogic.WHITE)) {
            if (start - step < gameLogic.WHITEHOME + 1) {
                for (var i = start + 1; i < 8; i++) {
                    if (board[i].status === gameLogic.WHITE) {
                        return false;
                    }
                }
            }
            board[start].count -= 1;
            if (board[start].count === 0) {
                board[start].status = gameLogic.EMPTY;
            }
            board[gameLogic.WHITEHOME].count += 1;
            return true;
        }
        else if (board[end].status !== 1 - role || board[end].count === 1) {
            board[start].count -= 1;
            if (board[start].count === 0 && start !== gameLogic.BLACKBAR && start !== gameLogic.WHITEBAR) {
                board[start].status = gameLogic.EMPTY;
            }
            if (board[end].status !== 1 - role) {
                board[end].count += 1;
            }
            else {
                var enemyBar = role === gameLogic.BLACK ? gameLogic.WHITEBAR : gameLogic.BLACKBAR;
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
    function startMove(curBoard, start, role) {
        var res = {};
        if (currentSteps.length === 0) {
            return res;
        }
        else if (currentSteps.length === 2) {
            var board = void 0;
            var newStart = void 0;
            // 1 -> 2
            board = angular.copy(curBoard);
            newStart = start;
            for (var i = 0; i < currentSteps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, currentSteps[i], role);
                var modified = modelMove(board, oldStart, currentSteps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
                    if (!res[board[newStart].tid]) {
                        res[board[newStart].tid] = [];
                    }
                    res[board[newStart].tid].push(i);
                    if (newStart === gameLogic.BLACKHOME || newStart == gameLogic.WHITEHOME) {
                        break;
                    }
                }
            }
            // 2 -> 1
            board = angular.copy(curBoard);
            newStart = start;
            for (var i = currentSteps.length - 1; i >= 0; i--) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, currentSteps[i], role);
                var modified = modelMove(board, oldStart, currentSteps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
                    if (!res[board[newStart].tid]) {
                        res[board[newStart].tid] = [];
                    }
                    res[board[newStart].tid].push(i);
                    if (newStart === gameLogic.BLACKHOME || newStart == gameLogic.WHITEHOME) {
                        break;
                    }
                }
            }
        }
        else {
            var board = void 0;
            var newStart = start;
            // 1
            // 1 -> 2 -> 3 [-> 4]
            board = angular.copy(curBoard);
            for (var i = 0; i < currentSteps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, currentSteps[i], role);
                var modified = modelMove(board, oldStart, currentSteps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
                    if (!res[board[newStart].tid]) {
                        res[board[newStart].tid] = [];
                    }
                    res[board[newStart].tid].push(i);
                    if (newStart === gameLogic.BLACKHOME || newStart == gameLogic.WHITEHOME) {
                        break;
                    }
                }
            }
        }
        return res;
    }
    gameLogic.startMove = startMove;
    function createMove(stateBeforeMove, stateAfterMove, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var oldBoard = stateBeforeMove.board;
        if (getWinner(oldBoard) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        if (!currentSteps) {
            throw new Error("You haven't yet rolled the dices!");
        }
        var winner = getWinner(stateAfterMove.board);
        var endMatchScores;
        var turnIndexAfterMove;
        if (winner !== '') {
            // Game over.
            turnIndexAfterMove = -1;
            endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
        }
        else if (currentSteps.length !== 0) {
            // Game continues. You haven't finished your moves.
            throw new Error("You haven't completed your moves!");
        }
        else {
            // Game continues. Now it's the opponent's turn.
            turnIndexAfterMove = 1 - turnIndexBeforeMove;
            endMatchScores = null;
        }
        // Reset after the turn ends.
        currentSteps = null;
        return { endMatchScores: endMatchScores,
            turnIndexAfterMove: turnIndexAfterMove,
            stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    /**
     * This function reacts on the mouse second click or drop event to trigger a move to be created on the original board.
     * Param start comes from the mouse first click or drag event, and denotes the starting point of this move.
     * Param end comes from the mouse second click or drop event, and denotes the ending point of this move.
     * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
     * When no more step available, players are switched.
     */
    function createMiniMove(stateBeforeMove, start, end, roleBeforeMove) {
        if (!currentSteps) {
            throw new Error("You haven't yet rolled the dices!");
        }
        else if (currentSteps.length === 0) {
            console.log("All moves complete. Please submit!");
            return;
        }
        if (getWinner(stateBeforeMove.board) !== "") {
            throw new Error("One can only make a move if the game is not over!");
        }
        var posToStep = startMove(stateBeforeMove.board, start, roleBeforeMove);
        if (end in posToStep) {
            //posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
            var index = posToStep[end][0];
            modelMove(stateBeforeMove.board, start, currentSteps[index], roleBeforeMove);
            currentSteps.splice(index, 1);
            if (!stateBeforeMove.delta.moves) {
                stateBeforeMove.delta.moves = [];
            }
            var oneMiniMove = { start: start, end: end };
            stateBeforeMove.delta.moves.push(oneMiniMove);
        }
        else {
            //no such value found tossed, not a legal move
            throw new Error("No such move!");
        }
    }
    gameLogic.createMiniMove = createMiniMove;
    function createInitialMove() {
        return { endMatchScores: null, turnIndexAfterMove: 0, stateAfterMove: getInitialState() };
    }
    gameLogic.createInitialMove = createInitialMove;
    function checkMoveOk(stateTransition) {
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that the move is OK.
        var turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
        var stateBeforeMove = stateTransition.stateBeforeMove;
        var move = stateTransition.move;
        if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
            angular.equals(createInitialMove(), move)) {
            return;
        }
        var delta = move.stateAfterMove.delta;
        var expectedMove = null;
        currentSteps = angular.copy(delta.originalSteps);
        var stateAfterMove = angular.copy(stateBeforeMove);
        for (var _i = 0, _a = delta.moves; _i < _a.length; _i++) {
            var move_1 = _a[_i];
            createMiniMove(stateAfterMove, move_1.start, move_1.end, turnIndexBeforeMove);
        }
        expectedMove = createMove(stateBeforeMove, stateAfterMove, turnIndexBeforeMove);
        if (!angular.equals(move, expectedMove)) {
            throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
                ", but got stateTransition=" + angular.toJson(stateTransition, true));
        }
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map