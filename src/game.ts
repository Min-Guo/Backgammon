interface SupportedLanguages {
    en: string, ch: string,
};

interface Translations {
    [index: string]: SupportedLanguages;
}

module game {
  export let debug: number = 0; //0: normal, 1: bear off, ...
  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let lastHumanMove: IMove = null; // We don't animate moves we just made.
  export let remainingTurns: ITurnDelta[] = [];
  export let remainingMiniMoves: IMiniMove[] = [];
  export let turnAnimationInterval: ng.IPromise<any> = null;
  export let checkerAnimationInterval: ng.IPromise<any> = null;
  export let recRollingEndedTimeout: ng.IPromise<any> = null;
  export let rollingEndedTimeout: ng.IPromise<any> = null;

  export let originalState: IState = null;
  export let currentState: IState = null;
  export let moveStart = -1;
  export let moveEnd = -1;
  export let showSteps: number[] = [0, 0, 0, 0];
  export let showStepsControl: boolean[] = [true, true, true, true];
  // export let slowlyAppearEndedTimeout : ng.IPromise<any> = null;
  export let targets: number[] = [];
  export let rolling: boolean = false;

  // For community games.
  export let playerIdToProposal: IProposals = null;
  export let proposals: any = null; // ?
  export let yourPlayerInfo: IPlayerInfo = null;

  export function init() {
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    translate.setLanguage('en');
    resizeGameAreaService.setWidthToHeight(1.7778);
    currentState = debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: debug === 1 ? gameLogic.checkMoveOkBear : gameLogic.checkMoveOk,
      updateUI: updateUI,
      // gotMessageFromPlatform: null,
      communityUI: communityUI, 
      getStateForOgImage: getStateForOgImage,
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      let n: any = navigator;
      log.log('Calling serviceWorker.register');
      n.serviceWorker.register('service-worker.js').then(function(registration: any) {
        log.log('ServiceWorker registration successful with scope: ',    registration.scope);
      }).catch(function(err: any) {
        log.log('ServiceWorker registration failed: ', err);
      });
    }
  }

  function getTranslations(): Translations {
    return {};
  }

  function setCheckerAnimationInterval() {
    advanceToNextCheckerAnimation();
    checkerAnimationInterval = $interval(advanceToNextCheckerAnimation, 600);

  }

  function clearCheckerAnimationInterval() {
    if (checkerAnimationInterval) {
      $interval.cancel(checkerAnimationInterval);
      checkerAnimationInterval = null;
    }
  }

  function advanceToNextCheckerAnimation() {
    if (remainingMiniMoves.length == 0) {
      clearCheckerAnimationInterval();
      return;
    }
    let miniMove = remainingMiniMoves.shift();
    let usedValues = gameLogic.createMiniMove(currentState, miniMove.start, miniMove.end, currentUpdateUI.turnIndexBeforeMove);
    setGrayShowStepsControl(usedValues);
    if (remainingMiniMoves.length === 0 && remainingTurns.length === 0) {
      clearCheckerAnimationInterval();
      clearTurnAnimationInterval();
      clearRecRollingAnimationTimeout();
      // Checking we got to the final correct board
      let expectedBoard = currentUpdateUI.move.stateAfterMove.board;
      if (!angular.equals(currentState.board, expectedBoard)) {
        throw new Error("Animations ended in a different board: expected=" 
          + angular.toJson(expectedBoard, true) + " actual after animations=" 
          + angular.toJson(currentState.board, true));
      }
      // Save previous move end state in originalState.
      originalState = angular.copy(currentState);
      // Reset currentState.delta to include only data from the current turn.
      currentState.delta = null;
      maybeSendComputerMove();
    }
  }

  function setTurnAnimationInterval() {
    advanceToNextTurnAnimation();
    turnAnimationInterval = $interval(advanceToNextTurnAnimation, 3000); // At lease 2900 ms needed = 500 + 600 * 4.
  }

  function clearTurnAnimationInterval() {
    if (turnAnimationInterval) {
      $interval.cancel(turnAnimationInterval);
      turnAnimationInterval = null;
    }
  }

  function advanceToNextTurnAnimation() {
    if (remainingTurns.length == 0) {
      clearTurnAnimationInterval();
      clearRecRollingAnimationTimeout();
      // Save previous move end state in originalState.
      originalState = angular.copy(currentState);
      currentState.delta = null;
      maybeSendComputerMove();
      return;
    }
    clearCheckerAnimationInterval();
    let turn = remainingTurns.shift();
    remainingMiniMoves = turn.moves || [];
    // roll dices animation
    clearRecRollingAnimationTimeout();
    rolling = true;
    gameLogic.setOriginalStepsWithDefault(currentState, currentUpdateUI.turnIndexBeforeMove, turn.originalSteps);
    resetGrayToNormal(showStepsControl);
    showOriginalSteps(turn.originalSteps);
    recRollingEndedTimeout = $timeout(recRollingEndedCallBack, 500);
  }

  function recRollingEndedCallBack() {
    rolling = false;
    setCheckerAnimationInterval();
  }

  function clearRecRollingAnimationTimeout() {
    if (recRollingEndedTimeout) {
      $timeout.cancel(recRollingEndedTimeout);
      recRollingEndedTimeout = null;
    }
  }

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    didMakeMove = false; // Only one move per updateUI
    currentUpdateUI = params;
    originalState = null;

    proposals = null;
    playerIdToProposal = null;
    yourPlayerInfo = null;
    
    let shouldAnimate = !lastHumanMove || !angular.equals(params.move.stateAfterMove, lastHumanMove.stateAfterMove);
    clearTurnAnimationInterval();
    if (isFirstMove()) {
      currentState = debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
      // setInitialTurnIndex();
      if (isMyTurn()) {
        let firstMove: IMove;
        firstMove = debug === 1 ? gameLogic.createInitialBearMove() : gameLogic.createInitialMove();
        makeMove(firstMove);
      }
    } else if (!shouldAnimate) {
      currentState.board = angular.copy(params.move.stateAfterMove.board);
      currentState.delta = null;
      setTurnAnimationInterval();      
    } else {
      if (!params.stateBeforeMove) {
        currentState.board = debug === 1 ? gameLogic.getBearOffBoard() : gameLogic.getInitialBoard();
      } else {
        currentState.board = angular.copy(params.stateBeforeMove.board);
      }
      currentState.delta = null;
      // currentState = {board: angular.copy(params.stateBeforeMove.board), delta: null};
      if (params.move.stateAfterMove.delta) {
        remainingTurns = angular.copy(params.move.stateAfterMove.delta.turns);
      }
      setTurnAnimationInterval();
    }
  }

  export function communityUI(communityUI: ICommunityUI): void {
    log.info("Game got communityUI:", communityUI);
    // If only proposals changed, then do NOT call updateUI. Then update proposals.
    let nextUpdateUI: IUpdateUI = {
      playersInfo: [],
      playMode: communityUI.yourPlayerIndex,
      move: communityUI.move,
      numberOfPlayers: communityUI.numberOfPlayers,
      stateBeforeMove: communityUI.stateBeforeMove,
      turnIndexBeforeMove: communityUI.turnIndexBeforeMove,
      yourPlayerIndex: communityUI.yourPlayerIndex,
    };
    if (angular.equals(yourPlayerInfo, communityUI.yourPlayerInfo) &&
      currentUpdateUI && angular.equals(currentUpdateUI, nextUpdateUI)) {
      // We're not calling updateUI to avoid disrupting the player if he's in the middle of a move.
    } else {
      // Things changed, so call updateUI.
      updateUI(nextUpdateUI);
    }
    // This must be after calling updateUI, because we nullify things there (like playerIdToProposal&proposals&etc)
    yourPlayerInfo = communityUI.yourPlayerInfo;
    playerIdToProposal = communityUI.playerIdToProposal; 
    didMakeMove = !!playerIdToProposal[communityUI.yourPlayerInfo.playerId];
  }

  function clearRollingAnimationTimeout() {
    if (rollingEndedTimeout) {
      $timeout.cancel(rollingEndedTimeout);
      rollingEndedTimeout = null;
    }
  }

  function maybeSendComputerMove() {
    if (!isComputerTurn()) return;
    if (currentUpdateUI.move.turnIndexAfterMove === -1) return;
    let move = aiService.findComputerMove(currentUpdateUI.move, currentState);
    //showOriginalSteps(originalState.delta.turns[0].originalSteps); // need further work    
    log.info("Computer move: ", move);
    makeMove(move);
  }

  function makeMove(move: IMove) {
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;
    if (!proposals) {
      moveService.makeMove(move);
    }
  }

  function isFirstMove() {
    return !currentUpdateUI.move.stateAfterMove;
  }

  function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  function isComputer() {
    return currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex].playerId === '';
  }

  function isComputerTurn() {
    return isMyTurn() && isComputer();
  }

  function isHumanTurn() {
    return isMyTurn() && !isComputer();
  }

  function isMyTurn() {
    return currentUpdateUI.move.turnIndexAfterMove >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it's my turn
  }

  export function towerClicked(target: number): void {
    log.info(["Clicked on tower:", target]);
    if (moveStart === -1 && currentUpdateUI.move.turnIndexAfterMove !== currentState.board[target].status) {
      return;
    }
    if (!isHumanTurn()) return;
    if (!currentState.delta) return;
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (moveStart !== -1) {
      if (target === moveStart) {
        // If mistakenly clicked one checker twice, i.e. moveStart === moveEnd,
        // no animation shall be displayed on this checker.
        return;
      } else {
        moveEnd = target;        
        let usedValues: number[] = gameLogic.createMiniMove(currentState, moveStart, moveEnd, currentUpdateUI.move.turnIndexAfterMove);
        if (usedValues.length !== 0) {
          log.info(["Create a move between:", moveStart, moveEnd]);                      
          targets.length = 0;
          moveStart = -1;
          setGrayShowStepsControl(usedValues);
        } else {
          log.warn(["Unable to create a move between:", moveStart, moveEnd]);                    
          moveEnd = -1;
          moveStart = -1; // comment out this line if you want the moveStart unchanged
          targets.length = 0;
        }
      }
    } else {
      moveStart = target;
      let board: Board = currentState.board;
      let last = currentState.delta.turns.length - 1;
      let currentSteps = currentState.delta.turns[last].currentSteps;
      let turnIndex = currentUpdateUI.move.turnIndexAfterMove;
      let keys: String[] = Object.keys(gameLogic.startMove(board, currentSteps, moveStart, turnIndex));
      for (let i of keys) {
        targets.push(+ i);
      }
      log.info(["Starting a move from:", moveStart]);
    }
  }

  function setGrayShowStepsControl(used: number[]) {
    outer:
    for (let value of used) {
      for (let i = 0; i < 4; i++) {
        if (showSteps[i] === value && showStepsControl[i] === true) {
          showStepsControl[i] = false;
          continue outer;
        }
      }
    }
  }

  export function getGrayShowStepsControl(index: number): boolean {
    return showStepsControl[index];
  }

  export function submitClicked(): void {
    log.info(["Submit move."]);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    try {
      lastHumanMove = gameLogic.createMove(originalState, currentState, currentUpdateUI.move.turnIndexAfterMove);
    } catch (e) {
      log.warn(["Move submission failed.", e]);
      return;
    }
    // Move is legal, make it!
    makeMove(lastHumanMove);
  }

  /**
   * This function tries to generate a new combination of dies each time the player's turn begins.
   * It sets the original combination to the local storage of gameLogic.
   */
  export function rollClicked(): void {
    log.info("Clicked on roll.");
    if (!isMyTurn()) return;
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    try {
      rolling = true;
      gameLogic.setOriginalSteps(currentState, currentUpdateUI.move.turnIndexAfterMove);
      let originalSteps = gameLogic.getOriginalSteps(currentState, currentUpdateUI.move.turnIndexAfterMove);
      showOriginalSteps(originalSteps);
      log.info(["Dices rolled: ", showSteps]);
      resetGrayToNormal(showStepsControl);        
      rollingEndedTimeout = $timeout(rollingEndedCallback, 500);
    } catch (e) {
      log.warn(e);
      rolling = false;
    }
  }

  function showOriginalSteps(steps: number[]): void {
      if (steps.length === 2) {
        showSteps[0] = 0;
        showSteps[1] = steps[0];
        showSteps[2] = steps[1];
        showSteps[3] = 0;
      } else { // 4
        showSteps[0] = steps[0];
        showSteps[1] = steps[1];
        showSteps[2] = steps[2];
        showSteps[3] = steps[3];
      }
  }

  function rollingEndedCallback() {
    log.info("Rolling ended");
    rolling = false;
  }

  function resetGrayToNormal(ssc: boolean[]): void {
    for (let i = 0; i < 4; i++) {
      ssc[i] = true;
    }
  }

  export function getTowerCount(col: number): number[] {
    let tc = currentState.board[col].count;
    return new Array(tc);
  }

  export function getPlayer(col: number):  string {
    return 'player' + currentState.board[col].status;
  }
  
  export function getHeight(col: number): number {
    let n = currentState.board[col].count;
    if (n < 7) {
      return 16.66;
    }
    return (100 - (16.66 - 100 / n)) / n;
  }

  export function getDiceVal(index: number): number {
    return showSteps[index];
  }

  export function isActive(col: number): boolean {
    return moveStart === col;
  }

  export function isInTargets(col: number): boolean {
    for (let i of targets) {
      if (col === i) return true;
    }
    return false;
  }
  
  export function canSomebodyBearOff(home: number): boolean {
    let turn = currentUpdateUI.move.turnIndexAfterMove;
    if (home === 0) return turn === gameLogic.WHITE && gameLogic.canBearOff(currentState.board, turn);
    if (home === 27) return turn === gameLogic.BLACK && gameLogic.canBearOff(currentState.board, turn);
    return false;
  }

  export function shouldRotate(): boolean {
    if (typeof currentUpdateUI.playMode !== "number") {
      return false;
    } else {
      return currentUpdateUI.playMode === 1;
    }
  }

  // function setInitialTurnIndex(): void {
  //   if (state && state.currentSteps) return;
  //   let twoDies = DieCombo.init();
  //   state.currentSteps = twoDies;
  //   currentUpdateUI.move.turnIndexAfterMove = twoDies[0] > twoDies[1] ? 0 : 1;
  // }

  export function getStateForOgImage(): string {
    if (!currentUpdateUI || !currentUpdateUI.move) {
      log.warn("Got stateForOgImage without currentUpdateUI!");
      return;
    }
    let state: IState = currentUpdateUI.move.stateAfterMove;
    if (!state) return '';
    let board: Board = state.board;
    if (!board) return '';
    let boardStr: string = '';
    for (let i = 0; i < 28; i++) {
      let color: string = board[i].status == 0 ? " black " : board[i].status == 1 ? " white " : " empty ";
      boardStr += "#" + board[i].tid + color + board[i].count + "\n";
    }
    return boardStr;
  }
}

angular.module('myApp', ['gameServices', 'ngAnimate'])
  .run(function () {
    $rootScope['game'] = game;
    game.init();
  });
