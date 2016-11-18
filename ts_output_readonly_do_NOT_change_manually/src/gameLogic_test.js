describe("In Backgammon", function () {
    var OK = true;
    var BEAROFFTIME = true;
    var NO_BEAROFF = false;
    var ILLEGAL = false;
    var BLACK_TURN = 0;
    var WHITE_TURN = 1;
    var NO_ONE_TURN = -1;
    var BLACK_WIN_SCORES = [1, 0];
    var WHITE_WIN_SCORES = [0, 1];
    var NO_ONE_WINS = null;
    var EMPTY_BOARD = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
        new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
        new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
        new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
        new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
        new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
        new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
        new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
        new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    var INITIAL_BOARD = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
        new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
        new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
        new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
        new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
        new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
        new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
        new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
        new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    function expectStateTransition(isBearOffTime, isOk, stateTransition) {
        if (isBearOffTime) {
            if (isOk) {
                gameLogic.checkMoveOkBear(stateTransition);
            }
            else {
                var didThrowException = false;
                try {
                    gameLogic.checkMoveOkBear(stateTransition);
                }
                catch (e) {
                    didThrowException = true;
                }
                if (!didThrowException) {
                    throw new Error("We expect an illegal move, but checkMoveOkBear didn't throw any exception!");
                }
            }
        }
        else {
            if (isOk) {
                gameLogic.checkMoveOk(stateTransition);
            }
            else {
                var didThrowException = false;
                try {
                    gameLogic.checkMoveOk(stateTransition);
                }
                catch (e) {
                    didThrowException = true;
                }
                if (!didThrowException) {
                    throw new Error("We expect an illegal move, but checkMoveOkBear didn't throw any exception!");
                }
            }
        }
    }
    function expectMove(isBearOffTime, isOk, turnIndexBeforeMove, boardBeforeMove, boardAfterMove, start, end, turns, 
        // originalSteps: Steps,
        // currentStepsBeforeMove: number[],
        // currentStepsAfterMove: number[],
        turnIndexAfterMove, endMatchScores) {
        // // let moves: IMiniMove[] = [{start: start, end: end}]; 
        // let turnsAfterMove: ITurnDelta[] = [{originalSteps: originalSteps, currentSteps: currentStepsAfterMove, moves: moves}];
        var stateTransition = {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: boardBeforeMove ? { board: boardBeforeMove, delta: null } : null,
            move: {
                turnIndexAfterMove: turnIndexAfterMove,
                endMatchScores: endMatchScores,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turns } }
            },
            numberOfPlayers: null
        };
        expectStateTransition(isBearOffTime, isOk, stateTransition);
    }
    it("PLacing BLACK on the empty position is legal.", function () {
        var boardBeforeMove = INITIAL_BOARD;
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 6),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [5, 6], currentSteps: [], moves: [{ start: 2, end: 8 }, { start: 8, end: 13 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("PLacing WHITE on the empty position is legal.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, BLACK_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, WHITE_TURN, 1),
            new Tower(22, WHITE_TURN, 1), new Tower(23, BLACK_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [3, 4], currentSteps: [], moves: [{ start: 25, end: 22 }, { start: 25, end: 21 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("PLacing BLACK on the position where only one WHITE is legal.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, BLACK_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 4), new Tower(19, WHITE_TURN, 1),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, BLACK_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 4), new Tower(19, BLACK_TURN, 1),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [4, 2], currentSteps: [], moves: [{ start: 13, end: 17 }, { start: 17, end: 19 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("PLacing WHITE on the position where only one BLACK is legal.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, BLACK_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 2),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [1, 5], currentSteps: [], moves: [{ start: 9, end: 8 }, { start: 8, end: 3 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Initial move", function () {
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: null,
            move: {
                turnIndexAfterMove: BLACK_TURN,
                endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: INITIAL_BOARD, delta: null }
            },
            numberOfPlayers: null
        });
    });
    it("Moving other BLACK is illegal while BLACK_BAR is not empty.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, BLACK_TURN, 1), new Tower(7, WHITE_TURN, 3),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, BLACK_TURN, 1), new Tower(7, WHITE_TURN, 3),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, BLACK_TURN, 1), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, BLACK_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [3, 5], currentSteps: [], moves: [{ start: 13, end: 16 }, { start: 18, end: 23 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Moving BLACK to BLACK HOME when bearoff.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 4),
            new Tower(6, WHITE_TURN, 3), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 4),
            new Tower(22, BLACK_TURN, 1), new Tower(23, BLACK_TURN, 1),
            new Tower(24, BLACK_TURN, 4), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 4),
            new Tower(6, WHITE_TURN, 3), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 4),
            new Tower(22, BLACK_TURN, 1), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, BLACK_TURN, 3), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 2)];
        var turnsAfterMove = [{ originalSteps: [2, 3], currentSteps: [], moves: [{ start: 24, end: 27 }, { start: 23, end: 27 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Moving WHITE to WHITE HOME when bearoff.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 4),
            new Tower(6, WHITE_TURN, 3), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 4),
            new Tower(22, BLACK_TURN, 1), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, BLACK_TURN, 3), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 2)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 5),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 4),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 4),
            new Tower(22, BLACK_TURN, 1), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, BLACK_TURN, 3), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 2)];
        var turnsAfterMove = [{ originalSteps: [2, 5], currentSteps: [], moves: [{ start: 7, end: 5 }, { start: 6, end: 0 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("BLACK wins the game.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 5),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 12)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 5),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
        var turnsAfterMove = [{ originalSteps: [4, 4, 4, 4], currentSteps: [4], moves: [{ start: 24, end: 27 }, { start: 24, end: 27 }, { start: 25, end: 27 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: BLACK_WIN_SCORES,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Moving BLACK to BLACK_HOME is illegal when not bearoff time.", function () {
        var boardBeforeMove = INITIAL_BOARD;
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 2)];
        var turnsAfterMove = [{ originalSteps: [4, 5], currentSteps: [], moves: [{ start: 2, end: 27 }, { start: 2, end: 27 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Moving WHITE to WHITE_HOME is illegal when not bearoff time.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 6), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 2), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 6), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [5, 1], currentSteps: [], moves: [{ start: 25, end: 0 }, { start: 25, end: 0 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Move is illegal when game is ended.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 5),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 5), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 3), new Tower(5, WHITE_TURN, 5),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
        var turnsAfterMove = [{ originalSteps: [5], currentSteps: [5], moves: [{ start: 4, end: 0 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: NO_ONE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    //-->  createMiniMove check submit situation based on stateBeforeMove.delta.currentSteps.length == 0.  setOriginalStepsWithDefault only check !delta and shouldRollDiceAgain, it will throw exception if none above happened.
    // If stateBeforeMove.delta.currentSteps.length == 0 and it is not rollDiceAgain situtaion, throw exception. createMiniMove will not happen.
    it("WHITE should submit when all its miniMoves finished.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, BLACK_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 4), new Tower(19, WHITE_TURN, 2),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, BLACK_TURN, 1), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 4), new Tower(19, WHITE_TURN, 2),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsBeforeMove = [{ originalSteps: [4, 2], currentSteps: [], moves: [{ start: 13, end: 17 }, { start: 17, end: 19 }] }];
        var turnsAfterMove = [{ originalSteps: [1, 2], currentSteps: [], moves: [{ start: 2, end: 3 }, { start: 3, end: 5 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: { turns: turnsBeforeMove } },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("BLACK cannot move to HOME (end position is larger than 27) when there is other BLACKs on its left side, even it is bearoff time.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 3), new Tower(23, BLACK_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 3)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 3), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 5)];
        var turnsAfterMove = [{ originalSteps: [5, 1], currentSteps: [], moves: [{ start: 25, end: 27 }, { start: 23, end: 27 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("WHITE wins the game.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 3), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 5)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 15), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 3), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 5)];
        var turnsAfterMove = [{ originalSteps: [1, 6], currentSteps: [1], moves: [{ start: 3, end: 0 }] }];
        expectStateTransition(NO_BEAROFF, OK, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: WHITE_WIN_SCORES,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("WHITE cannot bearoff when WHITE_BAR is not empty.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 3),
            new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, WHITE_TURN, 3), new Tower(9, WHITE_TURN, 2),
            new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [4, 1], currentSteps: [], moves: [{ start: 26, end: 0 }, { start: 9, end: 8 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: WHITE_WIN_SCORES,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("WHITE cannot move to HOME when WHITE_BAR is not empty.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 3),
            new Tower(10, WHITE_TURN, 1), new Tower(11, BLACK_TURN, 1),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, WHITE_TURN, 3), new Tower(9, WHITE_TURN, 2),
            new Tower(10, WHITE_TURN, 1), new Tower(11, BLACK_TURN, 1),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
            new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [4, 1], currentSteps: [], moves: [{ start: 26, end: 0 }, { start: 9, end: 8 }] }];
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Initial bearoff state when game starts.", function () {
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 5), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 2), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 2),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        expectStateTransition(BEAROFFTIME, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: null,
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: null } },
            numberOfPlayers: 2
        });
    });
    it("Bearoff time test.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 5), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 2), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 2),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 5), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, BLACK_TURN, 3),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 3),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [1, 3], currentSteps: [], moves: [{ start: 20, end: 21 }, { start: 20, end: 23 }] }];
        expectStateTransition(BEAROFFTIME, OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Bearoff time throw error test.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 5), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 2), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 2),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 5), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, BLACK_TURN, 3),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 3),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [1, 3], currentSteps: [], moves: [{ start: 20, end: 21 }, { start: 20, end: 23 }] }];
        expectStateTransition(BEAROFFTIME, ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    //------------------> If extrme case happened on WHITE's turn (delta == null), setOriginalStepsWithDefault will set delta and exit <---------
    // No shouldRollDiceAgain checking.
    it("extreme case test.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 4), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, BLACK_TURN, 3),
            new Tower(20, BLACK_TURN, 2), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 2),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 2),
            new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 4), new Tower(3, WHITE_TURN, 2),
            new Tower(4, WHITE_TURN, 2), new Tower(5, WHITE_TURN, 2),
            new Tower(6, WHITE_TURN, 2), new Tower(7, WHITE_TURN, 2),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, WHITE_TURN, 1), new Tower(19, BLACK_TURN, 3),
            new Tower(20, BLACK_TURN, 2), new Tower(21, BLACK_TURN, 2),
            new Tower(22, BLACK_TURN, 2), new Tower(23, BLACK_TURN, 2),
            new Tower(24, BLACK_TURN, 2), new Tower(25, BLACK_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [5, 3], currentSteps: [], moves: [{ start: 26, end: 21 }, { start: 21, end: 18 }] }];
        debugger;
        expectStateTransition(NO_BEAROFF, ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: { turns: [] } },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
});
//# sourceMappingURL=gameLogic_test.js.map