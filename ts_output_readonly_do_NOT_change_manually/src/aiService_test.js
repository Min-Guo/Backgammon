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
    it("White move", function () {
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
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 1,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [5, 2], currentSteps: [], moves: [{ start: 25, end: 23 }, { start: 14, end: 9 }] }];
        var state = { board: boardBeforeMove, delta: null };
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
    it("Black move", function () {
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
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, WHITE_TURN, 3),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, BLACK_TURN, 1), new Tower(13, BLACK_TURN, 5),
            new Tower(14, WHITE_TURN, 5), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 0,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [], moves: [{ start: 2, end: 8 }, { start: 8, end: 12 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("Game ended", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 15), new Tower(1, BLACK_TURN, 0),
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
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 14)];
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
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 15)];
        var preMove = {
            endMatchScores: WHITE_WIN_SCORES,
            turnIndexAfterMove: 0,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [], moves: [{ start: 25, end: 27 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        expect(function () { createComputerMove(preMove, state); }).toThrow();
    });
    it("No move exists", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, WHITE_TURN, 3), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 5),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, WHITE_TURN, 2),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, WHITE_TURN, 2), new Tower(19, BLACK_TURN, 5),
            new Tower(20, BLACK_TURN, 5), new Tower(21, WHITE_TURN, 2),
            new Tower(22, WHITE_TURN, 2), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, WHITE_TURN, 2), new Tower(25, WHITE_TURN, 2),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 0,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [2, 5], currentSteps: [2, 5], moves: null }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.2;
            if (numberOfTimesCalledRandom == 2)
                return 0.7;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardBeforeMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("DieComb generates four dices", function () {
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
            new Tower(2, BLACK_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, BLACK_TURN, 1), new Tower(7, WHITE_TURN, 5),
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
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 0,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [1, 1, 1, 1], currentSteps: [], moves: [{ start: 2, end: 3 }, { start: 3, end: 4 }, { start: 4, end: 5 }, { start: 5, end: 6 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.1;
            if (numberOfTimesCalledRandom == 2)
                return 0.1;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("Black bar is not empty", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 1),
            new Tower(2, WHITE_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
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
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 14)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
            new Tower(2, WHITE_TURN, 1), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, BLACK_TURN, 1),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 14)];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 0,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [], moves: [{ start: 1, end: 7 }, { start: 7, end: 11 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("White bar is not empty", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
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
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 14)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, NO_ONE_TURN, 0), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, WHITE_TURN, 1), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 1),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 14)];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 1,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [], moves: [{ start: 26, end: 20 }, { start: 20, end: 16 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("No move exists when role is -1.", function () {
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
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: -1,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [6, 4], moves: null }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardBeforeMove, delta: { turns: curTurn } })).toBe(true);
    });
    it("White can bearoff.", function () {
        var boardBeforeMove = [new Tower(0, WHITE_TURN, 10), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, WHITE_TURN, 5), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 10)];
        var boardAfterMove = [new Tower(0, WHITE_TURN, 12), new Tower(1, BLACK_TURN, 0),
            new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
            new Tower(4, WHITE_TURN, 3), new Tower(5, NO_ONE_TURN, 0),
            new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
            new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
            new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
            new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
            new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
            new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
            new Tower(18, NO_ONE_TURN, 0), new Tower(19, NO_ONE_TURN, 0),
            new Tower(20, NO_ONE_TURN, 0), new Tower(21, NO_ONE_TURN, 0),
            new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
            new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 5),
            new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 10)];
        var preMove = {
            endMatchScores: NO_ONE_WINS,
            turnIndexAfterMove: 1,
            stateAfterMove: { board: boardBeforeMove, delta: null }
        };
        var curTurn = [{ originalSteps: [6, 4], currentSteps: [], moves: [{ start: 4, end: 0 }, { start: 4, end: 0 }] }];
        var state = { board: boardBeforeMove, delta: null };
        var numberOfTimesCalledRandom = 0;
        Math.random = function () {
            numberOfTimesCalledRandom++;
            if (numberOfTimesCalledRandom == 1)
                return 0.9;
            if (numberOfTimesCalledRandom == 2)
                return 0.6;
        };
        var move = createComputerMove(preMove, state);
        expect(angular.equals(move.stateAfterMove, { board: boardAfterMove, delta: { turns: curTurn } })).toBe(true);
    });
});
//# sourceMappingURL=aiService_test.js.map