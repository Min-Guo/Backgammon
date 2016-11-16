describe("In Backgammon", function () {
    var OK = true;
    var ILLEGAL = false;
    var BLACK_TURN = 1;
    var WHITE_TURN = 0;
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
    function expectStateTransition(isOk, stateTransition) {
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
    function expectMove(isOk, turnIndexBeforeMove, boardBeforeMove, boardAfterMove, start, end, originalSteps, currentStepsBeforeMove, currentStepsAfterMove, turnIndexAfterMove, endMatchScores) {
        var moves = [{ start: start, end: end }];
        var turnsAfterMove = [{ originalSteps: originalSteps, currentSteps: currentStepsAfterMove, moves: moves }];
        var stateTransition = {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: boardBeforeMove ? { board: boardBeforeMove, delta: null } : null,
            move: {
                turnIndexAfterMove: turnIndexAfterMove,
                endMatchScores: endMatchScores,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } }
            },
            numberOfPlayers: null
        };
        expectStateTransition(isOk, stateTransition);
    }
    // it("Initial move", function() {
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: NO_ONE_TURN,
    //     stateBeforeMove: null,
    //     move: {
    //       turnIndexAfterMove: NO_ONE_TURN,
    //       endMatchScores: NO_ONE_WINS,
    //       stateAfterMove: {board: INITIAL_BOARD, 
    //          steps: null, delta: null}
    //     },
    //     numberOfPlayers: null
    //   });
    // });
    it("Illeal WHITE move when BLACK's steps is not empty", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 6), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [2, 4], currentSteps: [4], moves: [{ start: 18, end: 20 }] }];
        expectStateTransition(ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    it("Illeal BLACK move when WHITE's steps is not empty", function () {
        var boardBeforeMove = INITIAL_BOARD;
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, WHITE_TURN, 1), new Tower(9, WHITE_TURN, 2),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 4), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, BLACK_TURN, 2), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var turnsAfterMove = [{ originalSteps: [1, 1, 1, 1], currentSteps: [1, 1, 1], moves: [{ start: 9, end: 8 }] }];
        expectStateTransition(ILLEGAL, {
            turnIndexBeforeMove: WHITE_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
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
        expectStateTransition(OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    // it("PLacing WHITE on the position where only one BLACK is legal.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
    //        new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, BLACK_TURN, 2), new Tower(7, WHITE_TURN, 5),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
    //        new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, BLACK_TURN, 3), new Tower(19, BLACK_TURN, 1),
    //        new Tower(20, BLACK_TURN, 5), new Tower(21, WHITE_TURN, 1),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, BLACK_TURN, 1), new Tower(25, WHITE_TURN, 1),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1), 
    //        new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, BLACK_TURN, 2), new Tower(7, WHITE_TURN, 5),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
    //        new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, BLACK_TURN, 3), new Tower(19, WHITE_TURN, 1),
    //        new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, BLACK_TURN, 1), new Tower(25, WHITE_TURN, 1),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let turnsBeforeMove: ITurnDelta[] = [{originalSteps: [2, 4], currentSteps: [2, 4], moves: null}];
    //   let turnsAfterMove: ITurnDelta[] = [{originalSteps: [2, 4], currentSteps: [4], moves:[{start: 21, end: 19}]}];     
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, delta: {turns: turnsBeforeMove}},
    //     move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("PLacing WHITE on the position where only one BLACK is legal.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
    //        new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, BLACK_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, BLACK_TURN, 1), new Tower(7, WHITE_TURN, 5),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
    //        new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
    //        new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1), 
    //        new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, BLACK_TURN, 2), new Tower(7, WHITE_TURN, 5),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
    //        new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, BLACK_TURN, 3), new Tower(19, WHITE_TURN, 1),
    //        new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, BLACK_TURN, 1), new Tower(25, WHITE_TURN, 1),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let turnsBeforeMove: ITurnDelta[] = [{originalSteps: [3, 2], currentSteps: [3, 2], moves: null}];
    //   let turnsAfterMove: ITurnDelta[] = [{originalSteps: [3, 2], currentSteps: [2], moves:[{start: 7, end: 4}]}];     
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, delta: {turns: turnsBeforeMove}},
    //     move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
    //        numberOfPlayers: 2
    //   });
    // });
    it("PLacing BLACK on the position where more than one WHITE is illegal.", function () {
        var boardBeforeMove = INITIAL_BOARD;
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, BLACK_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, BLACK_TURN, 1),
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
        var turnsAfterMove = [{ originalSteps: [2, 5], currentSteps: [], moves: [{ start: 2, end: 4 }, { start: 2, end: 7 }] }];
        expectStateTransition(ILLEGAL, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: { board: boardBeforeMove, delta: null },
            move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
                stateAfterMove: { board: boardAfterMove, delta: { turns: turnsAfterMove } } },
            numberOfPlayers: 2
        });
    });
    // //We expect an illegal move, but checkMoveOk didn't throw any exception!
    // it("Moving other BLACK is illegal while BLACK_BAR is not empty.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1), 
    //        new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 6),
    //        new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 2),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, WHITE_TURN, 2),
    //        new Tower(12, WHITE_TURN, 1), new Tower(13, BLACK_TURN, 1),
    //        new Tower(14, WHITE_TURN, 1), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, WHITE_TURN, 1),
    //        new Tower(18, BLACK_TURN, 2), new Tower(19, BLACK_TURN, 3),
    //        new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1), 
    //        new Tower(2, BLACK_TURN, 2), new Tower(3, NO_ONE_TURN, 0),
    //        new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //        new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 6),
    //        new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 2),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, WHITE_TURN, 2),
    //        new Tower(12, WHITE_TURN, 1), new Tower(13, BLACK_TURN, 1),
    //        new Tower(14, WHITE_TURN, 1), new Tower(15, NO_ONE_TURN, 0),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, WHITE_TURN, 1),
    //        new Tower(18, BLACK_TURN, 2), new Tower(19, BLACK_TURN, 2),
    //        new Tower(20, BLACK_TURN, 6), new Tower(21, NO_ONE_TURN, 0),
    //        new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //        new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   expectStateTransition(ILLEGAL, {
    //     turnIndexBeforeMove: BLACK_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[1, 4], delta: null},
    //     move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, steps: [4], delta: {start: 19, end: 20}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // //We expect an illegal move, but checkMoveOk didn't throw any exception!
    // it("Moving other WHITE is illegal while WHITE_BAR is not empty.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
    //          new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
    //          new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
    //          new Tower(8, BLACK_TURN, 1), new Tower(9, WHITE_TURN, 2),
    //          new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
    //          new Tower(14, WHITE_TURN, 5), new Tower(15, BLACK_TURN, 1),
    //          new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
    //          new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //          new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //          new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
    //          new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //         [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
    //          new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
    //          new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
    //          new Tower(8, BLACK_TURN, 1), new Tower(9, WHITE_TURN, 2),
    //          new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
    //          new Tower(14, WHITE_TURN, 5), new Tower(15, BLACK_TURN, 1),
    //          new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
    //          new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
    //          new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
    //          new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 1),
    //          new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
    //   expectStateTransition(ILLEGAL, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[4, 2], delta: null},
    //     move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, steps: [4], delta: {start: 25, end: 23}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("Legal BLACK move when bearoff.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
    //        new Tower(2, WHITE_TURN, 3), new Tower(3, WHITE_TURN, 1),
    //        new Tower(4, WHITE_TURN, 3), new Tower(5, WHITE_TURN, 1),
    //        new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 2),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, WHITE_TURN, 1), new Tower(13, WHITE_TURN, 1),
    //        new Tower(14, NO_ONE_TURN, 0), new Tower(15, WHITE_TURN, 1),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //        new Tower(20, BLACK_TURN, 8), new Tower(21, BLACK_TURN, 3),
    //        new Tower(22, BLACK_TURN, 2), new Tower(23, WHITE_TURN, 1),
    //        new Tower(24, WHITE_TURN, 1), new Tower(25, BLACK_TURN, 2),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
    //        new Tower(2, WHITE_TURN, 3), new Tower(3, WHITE_TURN, 1),
    //        new Tower(4, WHITE_TURN, 3), new Tower(5, WHITE_TURN, 1),
    //        new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 2),
    //        new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //        new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //        new Tower(12, WHITE_TURN, 1), new Tower(13, WHITE_TURN, 1),
    //        new Tower(14, NO_ONE_TURN, 0), new Tower(15, WHITE_TURN, 1),
    //        new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //        new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //        new Tower(20, BLACK_TURN, 7), new Tower(21, BLACK_TURN, 3),
    //        new Tower(22, BLACK_TURN, 2), new Tower(23, WHITE_TURN, 1),
    //        new Tower(24, WHITE_TURN, 1), new Tower(25, BLACK_TURN, 2),
    //        new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 1)];
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: BLACK_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[6, 4], delta: null},
    //     move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, steps: [4], delta: {start: 20, end: 27}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("Legal WHITE move when bearoff.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
    //         new Tower(2, BLACK_TURN, 2), new Tower(3, BLACK_TURN, 3),
    //         new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 2),
    //         new Tower(6, WHITE_TURN, 3), new Tower(7, WHITE_TURN, 6),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 1),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, BLACK_TURN, 3),
    //         new Tower(22, BLACK_TURN, 4), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
    //         new Tower(2, BLACK_TURN, 2), new Tower(3, BLACK_TURN, 3),
    //         new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 3),
    //         new Tower(6, WHITE_TURN, 3), new Tower(7, WHITE_TURN, 5),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 1),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, BLACK_TURN, 3),
    //         new Tower(22, BLACK_TURN, 4), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[2], delta: null},
    //     move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, steps: [], delta: {start: 7, end: 5}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("BLACK wins game while BLACK_HOME equals to 15.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 10), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 5), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 14)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 10), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 5), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: BLACK_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[4], delta: null},
    //     move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: BLACK_WIN_SCORES,
    //        stateAfterMove: {board: boardAfterMove, steps: [], delta: {start: 25, end: 27}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("One can only make a move if the game is not over.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 10), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 5), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 0),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 11), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 4), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
    //   expectStateTransition(ILLEGAL, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[5, 4], delta: null},
    //     move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: BLACK_WIN_SCORES,
    //        stateAfterMove: {board: boardAfterMove, steps: [5], delta: {start: 2, end: 0}}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("Turn index if steps has been finished.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 2), new Tower(3, WHITE_TURN, 3),
    //         new Tower(4, WHITE_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 1),
    //         new Tower(8, WHITE_TURN, 4), new Tower(9, WHITE_TURN, 1),
    //         new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, WHITE_TURN, 1),
    //         new Tower(14, WHITE_TURN, 1), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, BLACK_TURN, 1), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 2),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, BLACK_TURN, 4), new Tower(25, BLACK_TURN, 4),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 2), new Tower(3, WHITE_TURN, 3),
    //         new Tower(4, WHITE_TURN, 1), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 1),
    //         new Tower(8, WHITE_TURN, 4), new Tower(9, WHITE_TURN, 1),
    //         new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, WHITE_TURN, 1),
    //         new Tower(14, WHITE_TURN, 1), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, BLACK_TURN, 1), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, BLACK_TURN, 4), new Tower(21, BLACK_TURN, 2),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, BLACK_TURN, 4), new Tower(25, BLACK_TURN, 4),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[], delta: null},
    //     move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
    //        stateAfterMove: {board: boardAfterMove, steps: null, delta: null}},
    //        numberOfPlayers: 2
    //   });
    // });
    // it("WHITE wins game while WHITE_HOME equals to 15.", function() {
    //   let boardBeforeMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, WHITE_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 5),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 10)];
    //   let boardAfterMove: Tower[] = 
    //       [new Tower(0, WHITE_TURN, 15), new Tower(1, BLACK_TURN, 0),
    //         new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
    //         new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
    //         new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
    //         new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
    //         new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
    //         new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
    //         new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
    //         new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
    //         new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
    //         new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
    //         new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
    //         new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 5),
    //         new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 10)];
    //   expectStateTransition(OK, {
    //     turnIndexBeforeMove: WHITE_TURN,
    //     stateBeforeMove: {board: boardBeforeMove, steps:[4], delta: null},
    //     move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: WHITE_WIN_SCORES,
    //        stateAfterMove: {board: boardAfterMove, steps: [], delta: {start: 2, end: 0}}},
    //        numberOfPlayers: 2
    //   });
    // });
});
//# sourceMappingURL=gameLogic_test.js.map