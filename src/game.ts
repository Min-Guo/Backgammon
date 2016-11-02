interface SupportedLanguages {
    en: string, ch: string,
};

interface Translations {
    [index: string]: SupportedLanguages;
}

module game {

  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let originalState: IState = null;
  export let currentState: IState = null;
  export let moveStart = -1;
  export let curSelectedCol: number = null;

  export function init() {
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    translate.setLanguage('en');
    //resizeGameAreaService.setWidthToHeight(1);
    originalState = gameLogic.getInitialState();
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: gameLogic.checkMoveOk,
      updateUI: updateUI,
      gotMessageFromPlatform: null,
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

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    didMakeMove = false; // Only one move per updateUI
    currentState = null; // reset
    currentUpdateUI = params;
    clearAnimationTimeout();
    originalState = params.move.stateAfterMove;
    //currentState.delta = null;    
    if (isFirstMove()) {
      originalState = gameLogic.getInitialState();
      currentState.board = angular.copy(originalState.board);
      //setInitialTurnIndex();
      if (isMyTurn()) {
        makeMove(gameLogic.createInitialMove());
      }
    } else {
      currentState.board = angular.copy(originalState.board);
      // maybe we want to show the original steps by the opponent first
      // some animation on the originalState.delta.originalSteps needed

      // We calculate the AI move only after the animation finishes,
      // because if we call aiService now
      // then the animation will be paused until the javascript finishes.
      animationEndedTimeout = $timeout(animationEndedCallback, 500);
    }
  }

  function animationEndedCallback() {
    log.info("Animation ended");
    maybeSendComputerMove();
  }

  function clearAnimationTimeout() {
    if (animationEndedTimeout) {
      $timeout.cancel(animationEndedTimeout);
      animationEndedTimeout = null;
    }
  }

  function maybeSendComputerMove() {
    if (!isComputerTurn()) return;
    let move = aiService.findComputerMove(currentUpdateUI.move);
    log.info("Computer move: ", move);
    makeMove(move);
  }

  function makeMove(move: IMove) {
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;
    moveService.makeMove(move);
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
    if (!isHumanTurn()) return;
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (moveStart !== -1) {
      try {
        gameLogic.createMiniMove(currentState, moveStart, target, currentUpdateUI.move.turnIndexAfterMove);
        log.info(["Create a move between:", moveStart, target]);
      } catch (e) {
        log.info(["Unable to create a move between:", moveStart, target]);
      } finally { // comment the finally clause if you want the moveStart unchanged
        moveStart = -1;
      }
    } else {
      moveStart = target;
      log.info(["Starting a move from:", moveStart]);
      //to-do startMove(...)
    }
  }

  export function submitClicked(): void {
    log.info(["Submit move."]);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    let oneMove: IMove = null;
    try {
      oneMove = gameLogic.createMove(originalState, currentState, currentUpdateUI.move.turnIndexAfterMove);
    } catch (e) {
      log.info(["Game: Move submission failed."]);
      return;
    }
    // Move is legal, make it!
    makeMove(oneMove);
  }

  /**
   * This function tries to generate a new combination of dies each time the player's turn begins.
   * It sets the original combination to the local storage of gameLogic.
   */
  export function rollClicked(): void {
    log.info("Clicked on roll:");
    if (!isMyTurn()) return;
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    gameLogic.setOriginalSteps(currentState, currentUpdateUI.move.turnIndexAfterMove);
  }

  export function getTowerCount(col: number): number[] {
    let tc = currentState.board[col].count;
    return new Array(tc);
  }

  export function getPlayer(col: number):  string {
    return 'player' + currentState.board[col].status;
  }
  
  export function getHeight(col: number): number {
    for(let i=0; i < currentState.board.length; i++) {
      if(currentState.board[i].tid === col) {
        var n = currentState.board[i].count;
        if(n < 7) {
          return 16.66;
        }
        return 100 / n;
      }
    }
  }

  //to-do

  //tower on click highlight
  export function selectTower(col: number) {
    curSelectedCol = col;
  }
  export function isActive(col: number) {
    return curSelectedCol === col;
  }





  // export function isActive(col: number): boolean {
  //   let tmp = moveStart;
  //   moveStart = -1;
  //   return tmp !== -1 && col === tmp;
  // }
  
  // export function shouldSlowlyAppear(start: number, end: number): boolean {
  //   return state.delta &&
  //     state.delta.start === start && state.delta.end === end;
  // }

  // function setInitialTurnIndex(): void {
  //   if (state && state.currentSteps) return;
  //   let twoDies = DieCombo.init();
  //   state.currentSteps = twoDies;
  //   currentUpdateUI.move.turnIndexAfterMove = twoDies[0] > twoDies[1] ? 0 : 1;
  // }
}

angular.module('myApp', ['gameServices'])
  .run(function () {
    $rootScope['game'] = game;
    game.init();
  });
