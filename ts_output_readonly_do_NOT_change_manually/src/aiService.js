var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move) {
        return createComputerMove(move, 
        // at most 1 second for the AI to choose a move (but might be much quicker)
        { millisecondsLimit: 1000 });
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns all the possible moves for the given state and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(state, turnIndexBeforeMove) {
        var possibleMoves = [];
        var moves = {};
        if (turnIndexBeforeMove === gameLogic.BLACK) {
            for (var i = 1; i < 27; i++) {
                moves = gameLogic.startMove(state, i, gameLogic.BLACK);
                if (!angular.equals(moves, {})) {
                    try {
                        var ends = Object.keys(moves); //all reachable end positions.
                        var choice = Math.floor(Math.random() * ends.length); //pick one end position.
                        var index = moves[choice][0]; //pick the first step's index in order to reach that end position.
                        var end = gameLogic.getValidPos(i, state.steps[index], turnIndexBeforeMove); //use the step according to its index in steps
                        possibleMoves.push(gameLogic.createMove(state, i, end, turnIndexBeforeMove));
                    }
                    catch (e) {
                        continue;
                    }
                }
            }
        }
        else {
            for (var i = 26; i > 1; i--) {
                moves = gameLogic.startMove(state, i, gameLogic.WHITE);
                if (!angular.equals(moves, {})) {
                    try {
                        var ends = Object.keys(moves); //all reachable end positions.
                        var choice = Math.floor(Math.random() * ends.length); //pick one end position.
                        var index = moves[choice][0]; //pick the first step's index in order to reach that end position.
                        var end = gameLogic.getValidPos(i, state.steps[index], turnIndexBeforeMove); //use the step according to its index in steps
                        possibleMoves.push(gameLogic.createMove(state, i, end, turnIndexBeforeMove));
                    }
                    catch (e) {
                        continue;
                    }
                }
            }
        }
        return possibleMoves;
    }
    aiService.getPossibleMoves = getPossibleMoves;
    /**
     * Returns the move that the computer player should do for the given state.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    function createComputerMove(move, alphaBetaLimits) {
        // We use alpha-beta search, where the search states are TicTacToe moves.
        return alphaBetaService.alphaBetaDecision(move, move.turnIndexAfterMove, getNextStates, getStateScoreForIndex0, null, alphaBetaLimits);
    }
    aiService.createComputerMove = createComputerMove;
    function getStateScoreForIndex0(move, playerIndex) {
        var endMatchScores = move.endMatchScores;
        if (endMatchScores) {
            return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
                : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
                    : 0;
        }
        return 0;
    }
    function getNextStates(move, playerIndex) {
        return getPossibleMoves(move.stateAfterMove, playerIndex);
    }
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map