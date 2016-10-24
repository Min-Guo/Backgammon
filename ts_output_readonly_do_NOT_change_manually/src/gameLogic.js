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
        var board;
        for (var i = 0; i < 28; i++) {
            if (i == gameLogic.WHITEHOME || i == gameLogic.WHITEBAR) {
                board[i] = new Tower(i, gameLogic.WHITE, 0);
            }
            else if (i == gameLogic.BLACKHOME || i == gameLogic.BLACKBAR) {
                board[i] = new Tower(i, gameLogic.BLACK, 0);
            }
            else if (i == 2) {
                board[i] = new Tower(i, gameLogic.BLACK, 2);
            }
            else if (i == 7) {
                board[i] = new Tower(i, gameLogic.WHITE, 5);
            }
            else if (i == 9) {
                board[i] = new Tower(i, gameLogic.WHITE, 3);
            }
            else if (i == 13) {
                board[i] = new Tower(i, gameLogic.BLACK, 5);
            }
            else if (i == 14) {
                board[i] = new Tower(i, gameLogic.WHITE, 5);
            }
            else if (i == 18) {
                board[i] = new Tower(i, gameLogic.BLACK, 3);
            }
            else if (i == 20) {
                board[i] = new Tower(i, gameLogic.BLACK, 5);
            }
            else if (i == 25) {
                board[i] = new Tower(i, gameLogic.WHITE, 2);
            }
            else {
                board[i] = new Tower(i, gameLogic.EMPTY, 0);
            }
        }
        return board;
    }
    function getInitialState() {
        return { board: getInitialBoard(), steps: null, delta: null };
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
    //make it a stateBeforeToss transition, or a IMove?
    function toss(stateBeforeToss, roleBeforeToss) {
        stateBeforeToss.steps = DieCombo.generate();
    }
    gameLogic.toss = toss;
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
            for (var i = 20; i < start; i++) {
                if (board[i].status === gameLogic.BLACK) {
                    return false;
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
            for (var i = 7; i > start; i--) {
                if (board[i].status === gameLogic.WHITE) {
                    return false;
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
            if (board[start].count === 0) {
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
    function startMove(stateBeforeMove, start, role) {
        var res = {};
        if (stateBeforeMove.steps.length === 0) {
            return res;
        }
        else if (stateBeforeMove.steps.length === 2) {
            var board = void 0;
            var steps = stateBeforeMove.steps;
            var newStart = void 0;
            // 1 -> 2
            board = angular.copy(stateBeforeMove.board);
            newStart = start;
            for (var i = 0; i < steps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, steps[i], role);
                var modified = modelMove(board, oldStart, steps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
                    res[board[newStart].tid].push(i);
                    if (newStart === gameLogic.BLACKHOME || newStart == gameLogic.WHITEHOME) {
                        break;
                    }
                }
            }
            // 2 -> 1
            board = angular.copy(stateBeforeMove.board);
            newStart = start;
            for (var i = steps.length - 1; i >= 0; i--) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, steps[i], role);
                var modified = modelMove(board, oldStart, steps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
                    res[board[newStart].tid].push(i);
                    if (newStart === gameLogic.BLACKHOME || newStart == gameLogic.WHITEHOME) {
                        break;
                    }
                }
            }
        }
        else {
            var board = void 0;
            var steps = stateBeforeMove.steps;
            var newStart = start;
            // 1
            // 1 -> 2 -> 3 [-> 4]
            board = angular.copy(stateBeforeMove.board);
            for (var i = 0; i < steps.length; i++) {
                var oldStart = newStart;
                newStart = getValidPos(oldStart, steps[i], role);
                var modified = modelMove(board, oldStart, steps[i], role);
                if (modified) {
                    //assume an automatic conversion from number to string
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
    function checkValidPos(board, start, end, result, role) {
        if (role === gameLogic.BLACK) {
            if (end <= 25) {
                if (board[end].status === role || (board[end].status === gameLogic.WHITE && board[end].count === 1)) {
                    var tBoard = board[end];
                    result.push(tBoard);
                }
            }
            else if (end === 26) {
                ///if end is 26, home is a reachable position.
                var tBoard = board[27];
                result.push(tBoard);
            }
            else {
                ///home is reachable postion if there is no checker left on its left side. Otherwise, there is no reachable position.
                var fakeStart = start - 1;
                while (fakeStart > 19) {
                    if (board[fakeStart].status === role) {
                        throw new Error("Must move leftmost checker first!");
                    }
                    fakeStart--;
                }
                var tBoard = board[27];
                result.push(tBoard);
            }
        }
        if (role === gameLogic.WHITE) {
            if (end >= 2) {
                if (board[end].status === role || (board[end].status === gameLogic.BLACK && board[end].count === 1)) {
                    var tBoard = board[end];
                    result.push(tBoard);
                }
            }
            else if (end === 1) {
                ///if end is 1, home is a reachable postion.
                var tBoard = board[0];
                result.push(tBoard);
            }
            else {
                ///home is reachable postion if there is no checker left on its left side. Otherwise, there is no reachable position.
                var fakeStart = start + 1;
                while (fakeStart < 8) {
                    if (board[fakeStart].status === role) {
                        throw new Error("Must move leftmost checker first!");
                    }
                    fakeStart++;
                }
                var tBoard = board[0];
                result.push(tBoard);
            }
        }
    }
    function bearOffStartMove(stateBeforeMove, start, role) {
        var board = stateBeforeMove.board;
        var steps = stateBeforeMove.steps;
        var bearOffRes;
        if (steps.length === 1) {
            if (role === gameLogic.BLACK) {
                checkValidPos(board, start, start + steps[0], bearOffRes, role);
            }
            else {
                checkValidPos(board, start, start - steps[0], bearOffRes, role);
            }
        }
        if (steps.length === 2 && (steps[0] !== steps[1])) {
            if (role === gameLogic.BLACK) {
                checkValidPos(board, start, start + steps[0], bearOffRes, role);
                checkValidPos(board, start, start + steps[1], bearOffRes, role);
                checkValidPos(board, start, start + steps[0] + start[1], bearOffRes, role);
            }
            else {
                checkValidPos(board, start, start - steps[0], bearOffRes, role);
                checkValidPos(board, start, start - steps[1], bearOffRes, role);
                checkValidPos(board, start, start - steps[0] - start[1], bearOffRes, role);
            }
        }
        if (steps.length >= 2 && steps[0] === steps[1]) {
            var len = steps.length;
            if (role === gameLogic.BLACK) {
                for (var i = 2; i <= len; i++) {
                    checkValidPos(board, start, start + i * steps[0], bearOffRes, role);
                }
            }
            else {
                for (var i = 2; i <= len; i++) {
                    checkValidPos(board, start, start - i * steps[0], bearOffRes, role);
                }
            }
        }
        return bearOffRes;
    }
    /**
     * This function reacts on the mouse second click or drop event to trigger a move to be created on the original board.
     * Param start comes from the mouse first click or drag event, and denotes the starting point of this move.
     * Param end comes from the mouse second click or drop event, and denotes the ending point of this move.
     * If |end - start| is indeed a valid step, a trial of modelMove is issued which may modify boardAfterMove.
     * When no more step available, players are switched.
     */
    function createMove(stateBeforeMove, start, end, roleBeforeMove) {
        //assume now that |end-start| appears in steps, and no automatic move relay
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var board = stateBeforeMove.board;
        var steps = stateBeforeMove.steps;
        if (getWinner(board) !== "") {
            throw new Error("One can only make a move if the game is not over!");
        }
        var boardAfterMove = angular.copy(board);
        //if the move exists, process the move on the copy board, and remove the step from the steps
        var posToStep = startMove(stateBeforeMove, start, roleBeforeMove);
        if (end in posToStep) {
            //posToStep[end] is the array of intended steps index, must access first element for the index, hence [0]
            var index = posToStep[end][0];
            modelMove(boardAfterMove, start, steps[index], roleBeforeMove);
            steps.splice(index, 1);
        }
        else {
            //no such value found tossed, must roll back
            return { endMatchScores: null, turnIndexAfterMove: roleBeforeMove, stateAfterMove: stateBeforeMove };
        }
        var endMatchScores;
        var roleAfterMove;
        var winner = getWinner(boardAfterMove);
        if (winner !== "") {
            //Game over.
            roleAfterMove = -1;
            endMatchScores = winner === "Black" ? [1, 0] : [0, 1];
        }
        else {
            if (steps.length === 0) {
                //if no further steps, switch player.
                roleAfterMove = 1 - roleBeforeMove;
            }
            else {
                //further steps, player unchanged.
                roleAfterMove = roleBeforeMove;
            }
            endMatchScores = null;
        }
        var delta = { start: start, end: end };
        var stateAfterMove = { board: boardAfterMove, steps: steps, delta: delta };
        return { endMatchScores: endMatchScores, turnIndexAfterMove: roleAfterMove, stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    function moveExist(stateBeforeMove, role) {
        //no move exists for ended game
        if (role === -1) {
            return false;
        }
        var board = stateBeforeMove.board;
        var steps = stateBeforeMove.steps;
        var stepCombination;
        var bearTime = canBearOff(board, role);
        //Valid move always exists when bearoff time
        if (bearTime) {
            return true;
        }
        //for the purpose of this function, stepCombination contains at most two numbers
        if (steps.length === 1 || steps.length === 3 || steps.length === 4) {
            stepCombination = [steps[0]];
        }
        else if (steps.length === 2) {
            if (steps[0] !== steps[1]) {
                //only need to check valid split moves, not sum of split moves
                stepCombination = [steps[0], steps[1]];
            }
            else {
                stepCombination = [steps[0]];
            }
        }
        if (role === gameLogic.BLACK) {
            if (board[gameLogic.BLACKBAR].count !== 0) {
                // for (let step of stepCombination) {
                var moves = startMove(stateBeforeMove, gameLogic.BLACKBAR, gameLogic.BLACK);
                // if (angular.equals(moves, {})) {
                // 	return false;
                // }
                if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
                    return true;
                }
                // }
                return false;
            }
            else {
                for (var i = 2; i < 26; i++) {
                    var moves = startMove(stateBeforeMove, i, gameLogic.BLACK);
                    if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
                        return true;
                    }
                }
                return false;
            }
        }
        else {
            if (board[gameLogic.WHITEBAR].count !== 0) {
                // for (let step of stepCombination) {
                var moves = startMove(stateBeforeMove, gameLogic.WHITEBAR, gameLogic.WHITE);
                // if (angular.equals(moves, {})) {
                // 	return false;
                // }
                if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
                    return true;
                }
                // }
                return false;
            }
            else {
                for (var i = 25; i > 1; i--) {
                    var moves = startMove(stateBeforeMove, i, gameLogic.WHITE);
                    if (Object.keys(moves).length !== 0 && moves.constructor === Object) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
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
        var deltaValue = move.stateAfterMove.delta;
        var start = deltaValue.start;
        var end = deltaValue.end;
        var expectedMove = createMove(stateBeforeMove, start, end, turnIndexBeforeMove);
        if (!angular.equals(move, expectedMove)) {
            throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
                ", but got stateTransition=" + angular.toJson(stateTransition, true));
        }
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map