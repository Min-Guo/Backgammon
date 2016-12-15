describe("In Backgammon", function() {
  let OK = true;
  let BEAROFFTIME = true;
  let NO_BEAROFF = false;
  let ILLEGAL = false;
  let BLACK_TURN = 0;
  let WHITE_TURN = 1;
  let NO_ONE_TURN = -1;
  let BLACK_WIN_SCORES = [1, 0];
  let WHITE_WIN_SCORES = [0, 1];
  let NO_ONE_WINS: number[] = null;
  let EMPTY_BOARD: Tower[] = 
         [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
  let INITIAL_BOARD: Tower[] = 
          [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
  
  
  function expectStateTransition(
      isBearOffTime: boolean, isOk: boolean, stateTransition: IStateTransition, testDelta?: BoardDelta) {
        if (isBearOffTime) {
          if (isOk) {
            gameLogic.checkMoveOkBear(stateTransition);
          } else {
            let didThrowException = false;
            try {
              gameLogic.checkMoveOkBear(stateTransition);
            } catch (e) {
              didThrowException = true;
            }
            if (!didThrowException) {
              throw new Error("We expect an illegal move, but checkMoveOkBear didn't throw any exception!")
            }
         }  
      } else {
          if (isOk) {
            gameLogic.checkMoveOk(stateTransition, testDelta);
          } else {
            let didThrowException = false;
            try {
              gameLogic.checkMoveOk(stateTransition, testDelta);
            } catch (e) {
              didThrowException = true;
            }
            if (!didThrowException) {
              throw new Error("We expect an illegal move, but checkMoveOkBear didn't throw any exception!")
            }
          }  
      }  
  }

  function expectMove(
      testDelta: BoardDelta,
      isBearOffTime: boolean,
      isOk: boolean,
      turnIndexBeforeMove: number,
      boardBeforeMove: Board,
      boardAfterMove: Board,
      start: number,
      end: number,
      turns: ITurnDelta[],
      // originalSteps: Steps,
      // currentStepsBeforeMove: number[],
      // currentStepsAfterMove: number[],
      turnIndexAfterMove: number,
      endMatchScores: number[]): void {
      // // let moves: IMiniMove[] = [{start: start, end: end}]; 
      // let turnsAfterMove: ITurnDelta[] = [{originalSteps: originalSteps, currentSteps: currentStepsAfterMove, moves: moves}];
    let stateTransition: IStateTransition = {
      turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: boardBeforeMove ? {board: boardBeforeMove, delta: null} : null,
      move: {
        turnIndexAfterMove: turnIndexAfterMove,
        endMatchScores: endMatchScores,
        stateAfterMove: {board: boardAfterMove, delta: {turns: turns}}
      },
      numberOfPlayers: null
    };
    expectStateTransition(isBearOffTime, isOk, stateTransition, testDelta);
  }


   it("PLacing BLACK on the empty position is legal.", function() {
    let boardBeforeMove: Tower[] = INITIAL_BOARD;
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [5, 6], currentSteps: [], moves:[{start: 2, end: 8}, {start: 8, end: 13}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("PLacing WHITE on the empty position is legal.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [3, 4], currentSteps: [], moves:[{start: 25, end: 22}, {start: 25, end: 21}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("PLacing BLACK on the position where only one WHITE is legal.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [4, 2], currentSteps: [], moves:[{start: 13, end: 17}, {start: 17, end: 19}]}];     
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("PLacing WHITE on the position where only one BLACK is legal.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1), 
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [1, 5], currentSteps: [], moves:[{start: 9, end: 8}, {start: 8, end: 3}]}];     
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Initial move", function() {
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: null,
      move: {
        turnIndexAfterMove: BLACK_TURN,
        endMatchScores: NO_ONE_WINS,
        stateAfterMove: {board: INITIAL_BOARD, delta: null}
      },
      numberOfPlayers: null
    }, null);
  });

  it("Moving other BLACK is illegal while BLACK_BAR is not empty.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 1),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [3, 5], currentSteps: [], moves:[{start: 13, end: 16}, {start: 18, end: 23}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Moving BLACK to BLACK HOME when bearoff.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [2, 3], currentSteps: [], moves:[{start: 24, end: 27}, {start: 23, end: 27}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Moving WHITE to WHITE HOME when bearoff.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [2, 5], currentSteps: [], moves:[{start: 7, end: 5}, {start: 6, end: 0}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

it("BLACK wins the game.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [4, 4, 4, 4], currentSteps: [4], moves:[{start: 24, end: 27}, {start: 24, end: 27}, {start: 25, end: 27}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: BLACK_WIN_SCORES,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Moving BLACK to BLACK_HOME is illegal when not bearoff time.", function() {
    let boardBeforeMove: Tower[] = INITIAL_BOARD;
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [4, 5], currentSteps: [], moves:[{start: 2, end: 27}, {start: 2, end: 27}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Moving WHITE to WHITE_HOME is illegal when not bearoff time.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 2), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [5, 1], currentSteps: [], moves:[{start: 25, end: 0}, {start: 25, end: 0}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Move is illegal when game is ended.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 4), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 5), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [5], currentSteps: [5], moves:[{start: 4, end: 0}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: NO_ONE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });


  it("BLACK should submit when all its miniMoves finished.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0), 
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [1, 2], currentSteps: [], moves:[{start: 2, end: 3}, {start: 3, end: 5}, {start: 13, end: 18}]}];    
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: {turns: null}},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("BLACK cannot move to HOME (end position is larger than 27) when there is other BLACKs on its left side, even it is bearoff time.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [5, 1], currentSteps: [], moves:[{start: 25, end: 27}, {start: 23, end: 27}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("WHITE wins the game.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 15), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [1, 6], currentSteps: [1], moves:[{start: 3, end: 0}]}];
    expectStateTransition(NO_BEAROFF, OK, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: NO_ONE_TURN, endMatchScores: WHITE_WIN_SCORES,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("BLACK cannot bearoff when there is BLACK between 2-19.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
          new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
          new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
          new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 4),
          new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
          new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
          new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
          new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
          new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
          new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
          new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
          new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
          new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
          new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 4),
          new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 3),
          new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 2),
          new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
          new Tower(20, BLACK_TURN, 4), new Tower(21, NO_ONE_TURN, 0),
          new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
          new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
          new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 1)];
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [2, 6], currentSteps: [], moves:[{start: 13, end: 15}, {start: 20, end: 27}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });
 
  it("WHITE cannot bearoff when there is WHITE between pos 8-25.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
          new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
          new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 5),
          new Tower(8, WHITE_TURN, 2), new Tower(9, WHITE_TURN, 4),
          new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
          new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
          new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
          new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
          new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
          new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
          new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
          new Tower(2, NO_ONE_TURN, 0), new Tower(3, NO_ONE_TURN, 0),
          new Tower(4, NO_ONE_TURN, 0), new Tower(5, BLACK_TURN, 1),
          new Tower(6, NO_ONE_TURN, 0), new Tower(7, WHITE_TURN, 4),
          new Tower(8, WHITE_TURN, 3), new Tower(9, WHITE_TURN, 3),
          new Tower(10, WHITE_TURN, 1), new Tower(11, NO_ONE_TURN, 0),
          new Tower(12, NO_ONE_TURN, 0), new Tower(13, BLACK_TURN, 4),
          new Tower(14, WHITE_TURN, 3), new Tower(15, BLACK_TURN, 1),
          new Tower(16, NO_ONE_TURN, 0), new Tower(17, BLACK_TURN, 1),
          new Tower(18, BLACK_TURN, 3), new Tower(19, NO_ONE_TURN, 0),
          new Tower(20, BLACK_TURN, 5), new Tower(21, NO_ONE_TURN, 0),
          new Tower(22, NO_ONE_TURN, 0), new Tower(23, NO_ONE_TURN, 0),
          new Tower(24, NO_ONE_TURN, 0), new Tower(25, NO_ONE_TURN, 0),
          new Tower(26, WHITE_TURN, 0), new Tower(27, BLACK_TURN, 0)];
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [6, 1], currentSteps: [], moves:[{start: 7, end: 0}, {start: 9, end: 8}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });



  it("WHITE cannot move to HOME when WHITE_BAR is not empty.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [4, 1], currentSteps: [], moves:[{start: 26, end: 0}, {start: 9, end: 8}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Initial bearoff state when game starts.", function() {
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
          new Tower(2, WHITE_TURN, 3), new Tower(3, WHITE_TURN, 3),
          new Tower(4, WHITE_TURN, 4), new Tower(5, WHITE_TURN, 4),
          new Tower(6, NO_ONE_TURN, 0), new Tower(7, NO_ONE_TURN, 0),
          new Tower(8, NO_ONE_TURN, 0), new Tower(9, NO_ONE_TURN, 0),
          new Tower(10, NO_ONE_TURN, 0), new Tower(11, NO_ONE_TURN, 0),
          new Tower(12, NO_ONE_TURN, 0), new Tower(13, NO_ONE_TURN, 0),
          new Tower(14, NO_ONE_TURN, 0), new Tower(15, NO_ONE_TURN, 0),
          new Tower(16, NO_ONE_TURN, 0), new Tower(17, NO_ONE_TURN, 0),
          new Tower(18, NO_ONE_TURN, 0), new Tower(19, BLACK_TURN, 2),
          new Tower(20, BLACK_TURN, 3), new Tower(21, BLACK_TURN, 3),
          new Tower(22, BLACK_TURN, 3), new Tower(23, BLACK_TURN, 2),
          new Tower(24, NO_ONE_TURN, 0), new Tower(25, BLACK_TURN, 2),
          new Tower(26, WHITE_TURN, 1), new Tower(27, BLACK_TURN, 0)];
    expectStateTransition(BEAROFFTIME, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: null,
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: null}},
         numberOfPlayers: 2
    });
  });

  it("Bearoff time test.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [1, 3], currentSteps: [], moves:[{start: 20, end: 21}, {start: 20, end: 23}]}];
    expectStateTransition(BEAROFFTIME, OK, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
       move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  it("Do not roll dice before its own turn.", function() {
    let boardBeforeMove: Tower[] = INITIAL_BOARD;
    let boardAfterMove: Tower[] = INITIAL_BOARD;
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
       move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: null}}},
         numberOfPlayers: 2
    });
  });


  it("Bearoff time throw error test.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [1, 3], currentSteps: [], moves:[{start: 20, end: 21}, {start: 20, end: 23}]}];
    expectStateTransition(BEAROFFTIME, ILLEGAL, {
      turnIndexBeforeMove: BLACK_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
       move: { turnIndexAfterMove: WHITE_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

it("Roll dice to start a new turn", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 0), new Tower(1, BLACK_TURN, 0),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 1), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [2, 5], currentSteps: [], moves:[{start: 7, end: 5}, {start: 6, end: 0}]}];
  
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: null}},
         numberOfPlayers: 2
    });
  });

it("Should complete all mini move.", function() {
    let boardBeforeMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 13), new Tower(1, BLACK_TURN, 0),
          new Tower(2, NO_ONE_TURN, 0), new Tower(3, WHITE_TURN, 2),
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
    let boardAfterMove: Tower[] = 
        [new Tower(0, WHITE_TURN, 14), new Tower(1, BLACK_TURN, 0),
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
    let turnsAfterMove: ITurnDelta[] = [{originalSteps: [3, 6], currentSteps: [6], moves:[{start: 3, end: 0}]}];
    expectStateTransition(NO_BEAROFF, ILLEGAL, {
      turnIndexBeforeMove: WHITE_TURN,
      stateBeforeMove: {board: boardBeforeMove, delta: null},
      move: { turnIndexAfterMove: BLACK_TURN, endMatchScores: NO_ONE_WINS,
         stateAfterMove: {board: boardAfterMove, delta: {turns: turnsAfterMove}}},
         numberOfPlayers: 2
    });
  });

  
              
});