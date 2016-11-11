var Tower = (function () {
    //status: 0 for black, 1 for white, -1 for empty
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
    gameLogic.BLACKHOME = 27;
    gameLogic.BLACKBAR = 1;
    gameLogic.WHITEHOME = 0;
    gameLogic.WHITEBAR = 26;
    gameLogic.BLACK = 0;
    gameLogic.WHITE = 1;
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
    function getOriginalSteps(currentState, role) {
        var lastTurn = currentState.delta.turns[currentState.delta.turns.length - 1];
        return lastTurn.originalSteps;
    }
    gameLogic.getOriginalSteps = getOriginalSteps;
    /** Start a new turn. Set the original dice values. */
    function setOriginalSteps(currentState, role) {
        // We can assume the currentState has been properly initialized with the final board,
        // while the final delta may or may not be initialized:
        // if yes, not the first turn; if not, the first turn.
        if (!currentState.delta) {
            currentState.delta = { turns: [] };
            var imSteps = DieCombo.generate();
            var mSteps = angular.copy(imSteps);
            currentState.delta.turns.push({ originalSteps: imSteps, currentSteps: mSteps, moves: null });
        }
        else if (shouldRollDicesAgain(currentState, role)) {
            var imSteps = DieCombo.generate();
            var mSteps = angular.copy(imSteps);
            currentState.delta.turns.push({ originalSteps: imSteps, currentSteps: mSteps, moves: null });
        }
        else {
            throw new Error("You should not try to roll the dices again, your opponent has a chance to move!");
        }
    }
    gameLogic.setOriginalSteps = setOriginalSteps;
    /** Start a new turn with customized original dice values. */
    function setOriginalStepsWithDefault(currentState, role, steps) {
        if (!currentState.delta) {
            currentState.delta = { turns: [] };
            var imSteps = angular.copy(steps);
            var mSteps = angular.copy(imSteps);
            currentState.delta.turns.push({ originalSteps: imSteps, currentSteps: mSteps, moves: null });
        }
        else if (shouldRollDicesAgain(currentState, role)) {
            var imSteps = angular.copy(steps);
            var mSteps = angular.copy(imSteps);
            currentState.delta.turns.push({ originalSteps: imSteps, currentSteps: mSteps, moves: null });
        }
        else {
            throw new Error("You should not try to roll the dices again, your opponent has a chance to move!");
        }
    }
    /**
     * This function checks the extreme case whether the opponent's home board has been occupied by six doubles.
     * And the opponent still has checkers waiting on the bar to enter the board.
     * No matter how the dices are rolled, the opponent cannot make a move in this case.
     * Therefore it signals the current player to roll the dices legally to start the next turn.
     */
    function isEnemySurelyStuck(board, role) {
        var enemyBar = role === gameLogic.BLACK ? gameLogic.WHITEBAR : gameLogic.BLACKBAR;
        if (board[enemyBar].count !== 0) {
            if (role === gameLogic.BLACK) {
                for (var i = 20; i < 26; i++) {
                    if (board[i].status !== role || board[i].count === 1) {
                        return false;
                    }
                }
                return true;
            }
            else {
                for (var i = 2; i < 8; i++) {
                    if (board[i].status !== role || board[i].count === 1) {
                        return false;
                    }
                }
                return true;
            }
        }
        else {
            return false;
        }
    }
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
     * This function models the board result after this mini-move.
     * Successful mini-move modifies the board, and returns true.
     * Unsuccessful mini-move leaves the board unmodified and returns false.
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
    function startMove(curBoard, curSteps, start, role) {
        var res = {};
        var myBar = role === gameLogic.BLACK ? gameLogic.BLACKBAR : gameLogic.WHITEBAR;
        if ((curBoard[myBar].count !== 0 && start !== myBar) || curSteps.length === 0) {
            return res;
        }
        else if (curSteps.length === 2) {
            var board = void 0;
            var newStart = void 0;
            // 1 -> 2
            board = angular.copy(curBoard);
            newStart = start;
            for (var i = 0; i < curSteps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, curSteps[i], role);
                var modified = modelMove(board, oldStart, curSteps[i], role);
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
            for (var i = curSteps.length - 1; i >= 0; i--) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, curSteps[i], role);
                var modified = modelMove(board, oldStart, curSteps[i], role);
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
            for (var i = 0; i < curSteps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, curSteps[i], role);
                var modified = modelMove(board, oldStart, curSteps[i], role);
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
    function createMove(originalState, currentState, turnIndexBeforeMove) {
        // if (!stateBeforeMove) {
        // 	stateBeforeMove = getInitialState();
        // }
        var oldBoard = originalState.board;
        if (getWinner(oldBoard) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        if (!currentState.delta) {
            throw new Error("Please roll the dices to start your turn!");
        }
        var last = currentState.delta.turns.length - 1;
        var lastTurn = currentState.delta.turns[last];
        var winner = getWinner(currentState.board);
        var endMatchScores;
        var turnIndexAfterMove;
        if (winner !== '') {
            // Game over.
            turnIndexAfterMove = -1;
            endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
        }
        else if (shouldRollDicesAgain(currentState, turnIndexBeforeMove)) {
            // Game continues. You should roll the dices again to start a new turn directly.
            throw new Error("Your opponent is closed out. You should roll the dices again to start a new turn directly.");
        }
        else if (lastTurn.currentSteps.length !== 0) {
            // Game continues. You should complete all available mini-moves within your turn.
            throw new Error("You should complete all available mini-moves within your turn.");
        }
        else {
            // Game continues. Now it's the opponent's turn.
            turnIndexAfterMove = 1 - turnIndexBeforeMove;
            endMatchScores = null;
        }
        //let stateAfterMove: IState = angular.copy(currentState); // do we need to copy this?
        var stateAfterMove = currentState;
        return { endMatchScores: endMatchScores,
            turnIndexAfterMove: turnIndexAfterMove,
            stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    /**
     * This function reacts on the mouse second click or drop event to trigger a mini-move to be created on the current board.
     * Param start comes from the mouse first click or drag event, and denotes the starting point of this mini-move.
     * Param end comes from the mouse second click or drop event, and denotes the ending point of this mini-move.
     * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
     * When no more step available, players are switched.
     */
    function createMiniMove(stateBeforeMove, start, end, roleBeforeMove) {
        // We can assume the stateBeforeMove has been properly initialized with the final board,
        // while the turns or originalSteps in the current turn may not be initialized (dices not rolled first).
        var turns = stateBeforeMove.delta.turns;
        if (!turns) {
            // throw new Error("You have to roll the dices to start a new turn!");
            log.info(["You have to roll the dices to start a new turn!"]);
            return false;
        }
        else if (shouldRollDicesAgain(stateBeforeMove, roleBeforeMove)) {
            // throw new Error("Your opponent is closed out. You can roll the dices to start a new turn again!");
            log.info(["Your opponent is closed out. You can roll the dices to start a new turn again!"]);
            return false;
        }
        else if (turns[turns.length - 1].currentSteps.length === 0) {
            // Cannot re-roll the dices, and the current turn is complete, must submit the move.
            log.info(["All mini-moves complete. Please submit your move!"]);
            return false;
        }
        else {
            // make a mini-move
            var curTurn = turns[turns.length - 1];
            if (getWinner(stateBeforeMove.board) !== "") {
                log.info(["The game is over. If it's your turn, you can submit this move now!"]);
                return false;
            }
            var posToStep = startMove(stateBeforeMove.board, curTurn.currentSteps, start, roleBeforeMove);
            if (end in posToStep) {
                //posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
                var index = posToStep[end][0];
                modelMove(stateBeforeMove.board, start, curTurn.currentSteps[index], roleBeforeMove);
                curTurn.currentSteps.splice(index, 1);
                if (!curTurn.moves) {
                    curTurn.moves = [];
                }
                var oneMiniMove = { start: start, end: end };
                curTurn.moves.push(oneMiniMove);
                return true;
            }
            else {
                //no such value found tossed, not a legal move
                log.info(["No such move!"]);
                return false;
            }
        }
    }
    gameLogic.createMiniMove = createMiniMove;
    /**
     * This function checks whether it is legal to roll the dices again.
     * The only allowed case is when the player has completed the current turn,
     * and the opponent is closed out for moves.
     */
    function shouldRollDicesAgain(state, role) {
        // We can assume the state has at least one turn in the delta
        var last = state.delta.turns.length - 1;
        var lastTurn = state.delta.turns[last];
        if (lastTurn.currentSteps.length !== 0) {
            return false;
        }
        else if (isEnemySurelyStuck(state.board, role)) {
            return true;
        }
        else {
            return false;
        }
    }
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
        var tmpState = { board: angular.copy(stateBeforeMove.board), delta: null };
        for (var _i = 0, _a = delta.turns; _i < _a.length; _i++) {
            var turn = _a[_i];
            setOriginalStepsWithDefault(tmpState, turnIndexBeforeMove, turn.originalSteps);
            for (var _b = 0, _c = turn.moves; _b < _c.length; _b++) {
                var move_1 = _c[_b];
                createMiniMove(tmpState, move_1.start, move_1.end, turnIndexBeforeMove);
            }
        }
        expectedMove = createMove(stateBeforeMove, tmpState, turnIndexBeforeMove);
        if (!angular.equals(move, expectedMove)) {
            throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
                ", but got stateTransition=" + angular.toJson(stateTransition, true));
        }
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map