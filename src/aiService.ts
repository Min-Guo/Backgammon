module aiService {
  export let originalState: IState = null;

  /** Returns the move that the computer player should do for the given state in move. */
  export function findComputerMove(move: IMove, state: IState): IMove {
    originalState = move.stateAfterMove;
    let tmpMove: IMove = {
      endMatchScores: move.endMatchScores, 
      turnIndexAfterMove: move.turnIndexAfterMove, 
      stateAfterMove: state // {board: originalState.board, delta: null} haven't rolled dices yet!!!
    };
    return createComputerMove(tmpMove
        // at most 1 second for the AI to choose a move (but might be much quicker)
        // , {millisecondsLimit: 1000}
        );
  }

  /**
   * Returns one possible move for the given state and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function getPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove[] {
    let possibleMoves: IMove[] = [];
    while (true) {
      try {
        gameLogic.setOriginalSteps(state, turnIndexBeforeMove);
        let last = state.delta.turns.length - 1;
        let remainStepsCount = state.delta.turns[last].currentSteps.length;
        newMiniMove:
        while (remainStepsCount !== 0) {
          if (gameLogic.getWinner(state.board)) break;
          if (!gameLogic.moveExist(state, turnIndexBeforeMove)) break;
          if (turnIndexBeforeMove === gameLogic.BLACK) {
            for (let i = 1; i <= 25; i++) { // start
              for (let j = 27; j > i; j--) { // end
                if (j === 26) continue;
                let usedCount = gameLogic.createMiniMove(state, i, j, turnIndexBeforeMove).length;
                if (usedCount !== 0) {
                  remainStepsCount -= usedCount;
                  continue newMiniMove;
                }
              }
            }
          } else {
            for (let i = 26; i >= 2; i--) { // start
              for (let j = 0; j < i; j++) { // end
                if (j === 1) continue;
                let usedCount = gameLogic.createMiniMove(state, i, j, turnIndexBeforeMove).length;
                if (usedCount !== 0) {
                  remainStepsCount -= usedCount;
                  continue newMiniMove;
                }
              }
            }
          }
        }
      } catch (e) {
        break;
      }
    }
    possibleMoves.push(gameLogic.createMove(originalState, state, turnIndexBeforeMove));
    return possibleMoves;
  }

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
  export function createComputerMove(move: IMove): IMove {
    return getNextStates(move, move.turnIndexAfterMove)[0];
  }


  // function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
  //   let endMatchScores = move.endMatchScores;
  //   if (endMatchScores) {
  //     return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
  //         : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
  //         : 0;
  //   }
  //   return 0;
  // }

  function getNextStates(move: IMove, playerIndex: number): IMove[] {
    return getPossibleMoves(move.stateAfterMove, playerIndex);
  }
}
