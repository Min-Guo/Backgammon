module aiService {
  /** Returns the move that the computer player should do for the given state in move. */
  export function findComputerMove(move: IMove): IMove {
    return createComputerMove(move,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000});
  }

  /**
   * Returns all the possible moves for the given state and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function getPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove[] {
    let possibleMoves: IMove[] = [];
    let moves: IEndToStepIndex = {};
    if (turnIndexBeforeMove === gameLogic.BLACK) {
      for (let i = 1; i < 27; i++) {
        moves = gameLogic.startMove(state, i, gameLogic.BLACK);
        if (!angular.equals(moves, {})) {
          try {
            let ends = Object.keys(moves); //all reachable end positions.
            let choice = Math.floor(Math.random() * ends.length); //pick one end position.
            let index = moves[choice][0]; //pick the first step's index in order to reach that end position.
            let end = gameLogic.getValidPos(i, state.steps[index], turnIndexBeforeMove); //use the step according to its index in steps
            possibleMoves.push(gameLogic.createMiniMove(state, i, end, turnIndexBeforeMove));
          } catch (e) {
            continue;
          }
        }
      }
    } else {
      for (let i = 26; i > 1; i--) {
        moves = gameLogic.startMove(state, i, gameLogic.WHITE);
        if (!angular.equals(moves, {})) {
          try {
            let ends = Object.keys(moves); //all reachable end positions.
            let choice = Math.floor(Math.random() * ends.length); //pick one end position.
            let index = moves[choice][0]; //pick the first step's index in order to reach that end position.
            let end = gameLogic.getValidPos(i, state.steps[index], turnIndexBeforeMove); //use the step according to its index in steps
            possibleMoves.push(gameLogic.createMiniMove(state, i, end, turnIndexBeforeMove));
          } catch (e) {
            continue;
          }
        }
      }
    }
    return possibleMoves;
  }

  /**
   * Returns the move that the computer player should do for the given state.
   * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
   * and it has either a millisecondsLimit or maxDepth field:
   * millisecondsLimit is a time limit, and maxDepth is a depth limit.
   */
  export function createComputerMove(
      move: IMove, alphaBetaLimits: IAlphaBetaLimits): IMove {
    // We use alpha-beta search, where the search states are TicTacToe moves.
    return alphaBetaService.alphaBetaDecision(
        move, move.turnIndexAfterMove, getNextStates, getStateScoreForIndex0, null, alphaBetaLimits);
  }

  function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
    let endMatchScores = move.endMatchScores;
    if (endMatchScores) {
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
          : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
          : 0;
    }
    return 0;
  }

  function getNextStates(move: IMove, playerIndex: number): IMove[] {
    return getPossibleMoves(move.stateAfterMove, playerIndex);
  }
}
