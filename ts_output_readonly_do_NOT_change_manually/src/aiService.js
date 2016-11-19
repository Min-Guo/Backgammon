var aiService;
(function (aiService) {
    aiService.originalState = null;
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move, state) {
        aiService.originalState = move.stateAfterMove;
        var tmpMove = {
            endMatchScores: move.endMatchScores,
            turnIndexAfterMove: move.turnIndexAfterMove,
            stateAfterMove: { board: angular.copy(state.board), delta: null } // {board: originalState.board, delta: null} haven't rolled dices yet!!!
        };
        return createComputerMove(tmpMove);
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns one possible move for the given state and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(state, turnIndexBeforeMove) {
        var possibleMoves = [];
        while (true) {
            try {
                gameLogic.setOriginalSteps(state, turnIndexBeforeMove);
                var last = state.delta.turns.length - 1;
                var remainStepsCount = state.delta.turns[last].currentSteps.length;
                newMiniMove: while (remainStepsCount !== 0) {
                    if (gameLogic.getWinner(state.board))
                        break;
                    if (!gameLogic.moveExist(state, turnIndexBeforeMove))
                        break;
                    if (turnIndexBeforeMove === gameLogic.BLACK) {
                        for (var i = 1; i <= 25; i++) {
                            for (var j = 27; j > i; j--) {
                                if (j === 26)
                                    continue;
                                var usedCount = gameLogic.createMiniMove(state, i, j, turnIndexBeforeMove).length;
                                if (usedCount !== 0) {
                                    remainStepsCount -= usedCount;
                                    continue newMiniMove;
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 26; i >= 2; i--) {
                            for (var j = 0; j < i; j++) {
                                if (j === 1)
                                    continue;
                                var usedCount = gameLogic.createMiniMove(state, i, j, turnIndexBeforeMove).length;
                                if (usedCount !== 0) {
                                    remainStepsCount -= usedCount;
                                    continue newMiniMove;
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                break;
            }
        }
        possibleMoves.push(gameLogic.createMove(aiService.originalState, state, turnIndexBeforeMove));
        return possibleMoves;
    }
    aiService.getPossibleMoves = getPossibleMoves;
    /**
     * Returns the move that the computer player should do for the given state.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    // export function createComputerMove(
    //     move: IMove, alphaBetaLimits: IAlphaBetaLimits): IMove {
    //   // We use alpha-beta search, where the search states are TicTacToe moves.
    //   return alphaBetaService.alphaBetaDecision(
    //       move, move.turnIndexAfterMove, getNextStates, getStateScoreForIndex0, null, alphaBetaLimits);
    // }
    function createComputerMove(move) {
        return getNextStates(move, move.turnIndexAfterMove)[0];
    }
    aiService.createComputerMove = createComputerMove;
    // function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
    //   let endMatchScores = move.endMatchScores;
    //   if (endMatchScores) {
    //     return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
    //         : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
    //         : 0;
    //   }
    //   return 0;
    // }
    function getNextStates(move, playerIndex) {
        return getPossibleMoves(move.stateAfterMove, playerIndex);
    }
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map