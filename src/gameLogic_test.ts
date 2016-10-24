describe("In Backgammon", function() {
  let OK = true;
  let BLACK_TURN = 1;
  let WHITE_TURN = 0;
  let NO_ONE_TURN = -1;
  let NO_ONE_WINS: number[] = null;
  
  
  function expectStateTransition(
      isOk: boolean, stateTransition: IStateTransition) {
    if (isOk) {
      gameLogic.checkMoveOk(stateTransition);
    } else {
      let didThrowException = false;
      try {
        gameLogic.checkMoveOk(stateTransition);
      } catch (e) {
        didThrowException = true;
      }
      if (!didThrowException) {
        throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!")
      }
    }    
  }

  function expectMove(
      isOk: boolean,
      turnIndexBeforeMove: number,
      boardBeforeMove: Board,
      boardAfterMove: Board,
      turnIndexAfterMove: number,
      endMatchScores: number[]): void {
    let stateTransition: IStateTransition = {
      turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: boardBeforeMove ? {board: boardBeforeMove, delta: null} : null,
      move: {
        turnIndexAfterMove: turnIndexAfterMove,
        endMatchScores: endMatchScores,
        stateAfterMove: {board: boardAfterMove, delta: {start: start, end: end}}
      },
      numberOfPlayers: null
    };
    expectStateTransition(isOk, stateTransition);
  }

  it("Initial move", function() {
    expectStateTransition(OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: null,
      move: {
        turnIndexAfterMove: BLACK_TURN,
        endMatchScores: NO_ONE_WINS,
        stateAfterMove: {board:
          [new Tower(0, WHITE_TURN, 0),
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
           new Tower(27, BLACK_TURN, 0)], delta = null}
      },
      numberOfPlayers: null
      });
    });

});