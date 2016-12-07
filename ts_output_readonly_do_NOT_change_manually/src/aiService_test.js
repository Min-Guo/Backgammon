describe("aiService", function () {
    var BLACK_TURN = 0;
    var WHITE_TURN = 1;
    var NO_ONE_TURN = -1;
    var BLACK_WIN_SCORES = [1, 0];
    var WHITE_WIN_SCORES = [0, 1];
    var NO_ONE_WINS = null;
    function createComputerMove(move, state) {
        return aiService.findComputerMove(move, state);
    }
    it("getPossibleMoves returns only one position", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, BLACK_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 1),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, BLACK_TURN, 1), new Tower(3, BLACK_TURN, 1),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 4),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 4), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 2), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, BLACK_TURN, 1),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, WHITE_TURN, 1),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var preTurn = [{ originalSteps: [1, 3], currentSteps: [], moves: [{ start: 2, end: 3 }, { start: 18, end: 21 }] }];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 1,
            stateAfterMove: { board: boardBeforeMove, delta: { turns: preTurn } }
        };
        var curTurn = [{ originalSteps: [5, 2], currentSteps: [], moves: [{ start: 25, end: 23 }, { start: 14, end: 9 }] }];
        var state = { board: boardBeforeMove, delta: null };
        debugger;
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.7;
            if (numberOfTimesCalledRandom == 2)
                return 0.2;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
});
//# sourceMappingURL=aiService_test.js.map