describe("In Backgammon", function () {
    var OK = true;
    var BLACK_TURN = 1;
    var WHITE_TURN = 0;
    var NO_ONE_TURN = -1;
    var NO_ONE_WINS = null;
<<<<<<< HEAD
    var INITIAL_BOARD = [new Tower(0, WHITE_TURN, 0),
        new Tower(1, BLACK_TURN, 0),
        new Tower(2, BLACK_TURN, 2),
        new Tower(3, NO_ONE_TURN, 0),
        new Tower(4, NO_ONE_TURN, 0),
        new Tower(5, NO_ONE_TURN, 0),
        new Tower(6, NO_ONE_TURN, 0),
        new Tower(7, WHITE_TURN, 5),
        new Tower(8, NO_ONE_TURN, 0),
        new Tower(9, WHITE_TURN, 3),
        new Tower(10, NO_ONE_TURN, 0),
        new Tower(11, NO_ONE_TURN, 0),
        new Tower(12, NO_ONE_TURN, 0),
        new Tower(13, BLACK_TURN, 5),
        new Tower(14, WHITE_TURN, 5),
        new Tower(15, NO_ONE_TURN, 0),
        new Tower(16, NO_ONE_TURN, 0),
        new Tower(17, NO_ONE_TURN, 0),
        new Tower(18, BLACK_TURN, 3),
        new Tower(19, NO_ONE_TURN, 0),
        new Tower(20, BLACK_TURN, 5),
        new Tower(21, NO_ONE_TURN, 0),
        new Tower(22, NO_ONE_TURN, 0),
        new Tower(23, NO_ONE_TURN, 0),
        new Tower(24, NO_ONE_TURN, 0),
        new Tower(25, WHITE_TURN, 2),
        new Tower(26, WHITE_TURN, 0),
        new Tower(27, BLACK_TURN, 0)];
=======
>>>>>>> 4eda5e79a282487f84dfb7bb6dc9aaa853f9f0e7
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
                throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!");
            }
        }
    }
    function expectMove(isOk, turnIndexBeforeMove, boardBeforeMove, boardAfterMove, start, end, steps, turnIndexAfterMove, endMatchScores) {
        var stateTransition = {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: boardBeforeMove ? { board: boardBeforeMove, steps: steps, delta: null } : null,
            move: {
                turnIndexAfterMove: turnIndexAfterMove,
                endMatchScores: endMatchScores,
                stateAfterMove: { board: boardAfterMove, steps: steps, delta: { start: start, end: end } }
            },
            numberOfPlayers: null
        };
        expectStateTransition(isOk, stateTransition);
    }
    it("Initial move", function () {
        expectStateTransition(OK, {
            turnIndexBeforeMove: BLACK_TURN,
            stateBeforeMove: null,
            move: {
                turnIndexAfterMove: BLACK_TURN,
                endMatchScores: NO_ONE_WINS,
<<<<<<< HEAD
                stateAfterMove: { board: INITIAL_BOARD,
=======
                stateAfterMove: { board: [new Tower(0, WHITE_TURN, 0),
                        new Tower(1, BLACK_TURN, 0),
                        new Tower(2, BLACK_TURN, 2),
                        new Tower(3, NO_ONE_TURN, 0),
                        new Tower(4, NO_ONE_TURN, 0),
                        new Tower(5, NO_ONE_TURN, 0),
                        new Tower(6, NO_ONE_TURN, 0),
                        new Tower(7, WHITE_TURN, 5),
                        new Tower(8, NO_ONE_TURN, 0),
                        new Tower(9, WHITE_TURN, 3),
                        new Tower(10, NO_ONE_TURN, 0),
                        new Tower(11, NO_ONE_TURN, 0),
                        new Tower(12, NO_ONE_TURN, 0),
                        new Tower(13, BLACK_TURN, 5),
                        new Tower(14, WHITE_TURN, 5),
                        new Tower(15, NO_ONE_TURN, 0),
                        new Tower(16, NO_ONE_TURN, 0),
                        new Tower(17, NO_ONE_TURN, 0),
                        new Tower(18, BLACK_TURN, 3),
                        new Tower(19, NO_ONE_TURN, 0),
                        new Tower(20, BLACK_TURN, 5),
                        new Tower(21, NO_ONE_TURN, 0),
                        new Tower(22, NO_ONE_TURN, 0),
                        new Tower(23, NO_ONE_TURN, 0),
                        new Tower(24, NO_ONE_TURN, 0),
                        new Tower(25, WHITE_TURN, 2),
                        new Tower(26, WHITE_TURN, 0),
                        new Tower(27, BLACK_TURN, 0)],
>>>>>>> 4eda5e79a282487f84dfb7bb6dc9aaa853f9f0e7
                    steps: null, delta: null }
            },
            numberOfPlayers: null
        });
    });
});
//# sourceMappingURL=gameLogic_test.js.map