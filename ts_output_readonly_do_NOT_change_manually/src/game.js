;
var game;
(function (game) {
    game.debug = 0; //0: normal, 1: bear off, ...
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.lastHumanMove = null; // We don't animate moves we just made.
    game.remainingTurns = [];
    game.remainingMiniMoves = [];
    game.turnAnimationInterval = null;
    game.checkerAnimationInterval = null;
    game.recRollingEndedTimeout = null;
    game.rollingEndedTimeout = null;
    game.originalState = null;
    game.currentState = null;
    game.moveStart = -1;
    game.moveEnd = -1;
    game.showSteps = [0, 0, 0, 0];
    game.showStepsControl = [true, true, true, true];
    // export let slowlyAppearEndedTimeout : ng.IPromise<any> = null;
    game.targets = [];
    game.rolling = false;
    function init() {
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1.7778);
        game.currentState = game.debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
        moveService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            checkMoveOk: game.debug === 1 ? gameLogic.checkMoveOkBear : gameLogic.checkMoveOk,
            updateUI: updateUI,
            gotMessageFromPlatform: null,
        });
    }
    game.init = init;
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            var n = navigator;
            log.log('Calling serviceWorker.register');
            n.serviceWorker.register('service-worker.js').then(function (registration) {
                log.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                log.log('ServiceWorker registration failed: ', err);
            });
        }
    }
    function getTranslations() {
        return {};
    }
    function setCheckerAnimationInterval() {
        game.checkerAnimationInterval = $interval(advanceToNextCheckerAnimation, 1000);
    }
    function clearCheckerAnimationInterval() {
        if (game.checkerAnimationInterval) {
            $interval.cancel(game.checkerAnimationInterval);
            game.checkerAnimationInterval = null;
        }
    }
    function advanceToNextCheckerAnimation() {
        if (game.remainingMiniMoves.length == 0) {
            clearCheckerAnimationInterval();
            advanceToNextTurnAnimation();
            return;
        }
        var miniMove = game.remainingMiniMoves.shift();
        var usedValues = gameLogic.createMiniMove(game.currentState, miniMove.start, miniMove.end, game.currentUpdateUI.turnIndexBeforeMove);
        setGrayShowStepsControl(usedValues);
    }
    function setTurnAnimationInterval() {
        advanceToNextTurnAnimation();
    }
    function clearTurnAnimationInterval() {
        if (game.turnAnimationInterval) {
            $interval.cancel(game.turnAnimationInterval);
            game.turnAnimationInterval = null;
        }
    }
    function advanceToNextTurnAnimation() {
        if (game.remainingTurns.length == 0 && game.remainingMiniMoves.length == 0) {
            var expectedBoard = game.currentUpdateUI.move.stateAfterMove.board;
            if (!angular.equals(game.currentState.board, expectedBoard)) {
                throw new Error("Animations ended in a different board: expected="
                    + angular.toJson(expectedBoard, true) + " actual after animations="
                    + angular.toJson(game.currentState.board, true));
            }
            // Save previous move end state in originalState.
            game.originalState = angular.copy(game.currentState);
            // Reset currentState.delta to include only data from the current turn.
            game.currentState.delta = null;
            maybeSendComputerMove();
            return;
        }
        var turn = game.remainingTurns.shift();
        game.remainingMiniMoves = turn.moves || [];
        // roll dices animation
        game.rolling = true;
        gameLogic.setOriginalStepsWithDefault(game.currentState, game.currentUpdateUI.turnIndexBeforeMove, turn.originalSteps);
        resetGrayToNormal(game.showStepsControl);
        showOriginalSteps(turn.originalSteps);
        game.recRollingEndedTimeout = $timeout(recRollingEndedCallBack, 500);
    }
    function recRollingEndedCallBack() {
        game.rolling = false;
        clearRecRollingAnimationTimeout();
        setCheckerAnimationInterval();
    }
    function clearRecRollingAnimationTimeout() {
        if (game.recRollingEndedTimeout) {
            $timeout.cancel(game.recRollingEndedTimeout);
            game.recRollingEndedTimeout = null;
        }
    }
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        game.didMakeMove = false; // Only one move per updateUI
        game.currentUpdateUI = params;
        game.originalState = null;
        var shouldAnimate = !game.lastHumanMove || !angular.equals(params.move.stateAfterMove, game.lastHumanMove.stateAfterMove);
        clearTurnAnimationInterval();
        if (isFirstMove()) {
            game.currentState = game.debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
            // setInitialTurnIndex();
            if (isMyTurn()) {
                var firstMove = void 0;
                firstMove = game.debug === 1 ? gameLogic.createInitialBearMove() : gameLogic.createInitialMove();
                makeMove(firstMove);
            }
        }
        else if (!shouldAnimate) {
            game.currentState.board = angular.copy(params.move.stateAfterMove.board);
            game.currentState.delta = null;
            setTurnAnimationInterval();
        }
        else {
            if (!params.stateBeforeMove) {
                game.currentState.board = game.debug === 1 ? gameLogic.getBearOffBoard() : gameLogic.getInitialBoard();
            }
            else {
                game.currentState.board = angular.copy(params.stateBeforeMove.board);
            }
            game.currentState.delta = null;
            // currentState = {board: angular.copy(params.stateBeforeMove.board), delta: null};
            if (params.move.stateAfterMove.delta) {
                game.remainingTurns = angular.copy(params.move.stateAfterMove.delta.turns);
            }
            setTurnAnimationInterval();
        }
    }
    game.updateUI = updateUI;
    function clearRollingAnimationTimeout() {
        if (game.rollingEndedTimeout) {
            $timeout.cancel(game.rollingEndedTimeout);
            game.rollingEndedTimeout = null;
        }
    }
    function maybeSendComputerMove() {
        if (!isComputerTurn())
            return;
        if (game.currentUpdateUI.move.turnIndexAfterMove === -1)
            return;
        var move = aiService.findComputerMove(game.currentUpdateUI.move, game.currentState);
        log.info("Computer move: ", move);
        makeMove(move);
    }
    function makeMove(move) {
        if (game.didMakeMove) {
            return;
        }
        game.didMakeMove = true;
        moveService.makeMove(move);
    }
    function isFirstMove() {
        return !game.currentUpdateUI.move.stateAfterMove;
    }
    function yourPlayerIndex() {
        return game.currentUpdateUI.yourPlayerIndex;
    }
    function isComputer() {
        return game.currentUpdateUI.playersInfo[game.currentUpdateUI.yourPlayerIndex].playerId === '';
    }
    function isComputerTurn() {
        return isMyTurn() && isComputer();
    }
    function isHumanTurn() {
        return isMyTurn() && !isComputer();
    }
    function isMyTurn() {
        return game.currentUpdateUI.move.turnIndexAfterMove >= 0 &&
            game.currentUpdateUI.yourPlayerIndex === game.currentUpdateUI.move.turnIndexAfterMove; // it's my turn
    }
    function towerClicked(target) {
        log.info(["Clicked on tower:", target]);
        if (game.moveStart === -1 && game.currentUpdateUI.move.turnIndexAfterMove !== game.currentState.board[target].status) {
            return;
        }
        if (!isHumanTurn())
            return;
        if (!game.currentState.delta)
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        if (game.moveStart !== -1) {
            if (target === game.moveStart) {
                // If mistakenly clicked one checker twice, i.e. moveStart === moveEnd,
                // no animation shall be displayed on this checker.
                return;
            }
            else {
                game.moveEnd = target;
                var usedValues = gameLogic.createMiniMove(game.currentState, game.moveStart, game.moveEnd, game.currentUpdateUI.move.turnIndexAfterMove);
                if (usedValues.length !== 0) {
                    log.info(["Create a move between:", game.moveStart, game.moveEnd]);
                    game.targets.length = 0;
                    game.moveStart = -1;
                    setGrayShowStepsControl(usedValues);
                }
                else {
                    log.warn(["Unable to create a move between:", game.moveStart, game.moveEnd]);
                    game.moveEnd = -1;
                    game.moveStart = -1; // comment out this line if you want the moveStart unchanged
                    game.targets.length = 0;
                }
            }
        }
        else {
            game.moveStart = target;
            var board = game.currentState.board;
            var last = game.currentState.delta.turns.length - 1;
            var currentSteps = game.currentState.delta.turns[last].currentSteps;
            var turnIndex = game.currentUpdateUI.move.turnIndexAfterMove;
            var keys = Object.keys(gameLogic.startMove(board, currentSteps, game.moveStart, turnIndex));
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var i = keys_1[_i];
                game.targets.push(+i);
            }
            log.info(["Starting a move from:", game.moveStart]);
        }
    }
    game.towerClicked = towerClicked;
    function setGrayShowStepsControl(used) {
        outer: for (var _i = 0, used_1 = used; _i < used_1.length; _i++) {
            var value = used_1[_i];
            for (var i = 0; i < 4; i++) {
                if (game.showSteps[i] === value && game.showStepsControl[i] === true) {
                    game.showStepsControl[i] = false;
                    continue outer;
                }
            }
        }
    }
    function getGrayShowStepsControl(index) {
        return game.showStepsControl[index];
    }
    game.getGrayShowStepsControl = getGrayShowStepsControl;
    function submitClicked() {
        log.info(["Submit move."]);
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        try {
            game.lastHumanMove = gameLogic.createMove(game.originalState, game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
        }
        catch (e) {
            log.warn(["Move submission failed.", e]);
            return;
        }
        // Move is legal, make it!
        makeMove(game.lastHumanMove);
    }
    game.submitClicked = submitClicked;
    /**
     * This function tries to generate a new combination of dies each time the player's turn begins.
     * It sets the original combination to the local storage of gameLogic.
     */
    function rollClicked() {
        log.info("Clicked on roll.");
        if (!isMyTurn())
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        try {
            game.rolling = true;
            gameLogic.setOriginalSteps(game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
            var originalSteps = gameLogic.getOriginalSteps(game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
            showOriginalSteps(originalSteps);
            log.info(["Dices rolled: ", game.showSteps]);
            resetGrayToNormal(game.showStepsControl);
            game.rollingEndedTimeout = $timeout(rollingEndedCallback, 500);
        }
        catch (e) {
            log.warn(e);
            game.rolling = false;
        }
    }
    game.rollClicked = rollClicked;
    function showOriginalSteps(steps) {
        if (steps.length === 2) {
            game.showSteps[0] = 0;
            game.showSteps[1] = steps[0];
            game.showSteps[2] = steps[1];
            game.showSteps[3] = 0;
        }
        else {
            game.showSteps[0] = steps[0];
            game.showSteps[1] = steps[1];
            game.showSteps[2] = steps[2];
            game.showSteps[3] = steps[3];
        }
    }
    function rollingEndedCallback() {
        log.info("Rolling ended");
        game.rolling = false;
    }
    function resetGrayToNormal(ssc) {
        for (var i = 0; i < 4; i++) {
            ssc[i] = true;
        }
    }
    function getTowerCount(col) {
        var tc = game.currentState.board[col].count;
        return new Array(tc);
    }
    game.getTowerCount = getTowerCount;
    function getPlayer(col) {
        return 'player' + game.currentState.board[col].status;
    }
    game.getPlayer = getPlayer;
    function getHeight(col) {
        var n = game.currentState.board[col].count;
        if (n < 7) {
            return 16.66;
        }
        return (100 - (16.66 - 100 / n)) / n;
    }
    game.getHeight = getHeight;
    function getDiceVal(index) {
        return game.showSteps[index];
    }
    game.getDiceVal = getDiceVal;
    function isActive(col) {
        return game.moveStart === col;
    }
    game.isActive = isActive;
    function isInTargets(col) {
        for (var _i = 0, targets_1 = game.targets; _i < targets_1.length; _i++) {
            var i = targets_1[_i];
            if (col === i)
                return true;
        }
        return false;
    }
    game.isInTargets = isInTargets;
    function canSomebodyBearOff(home) {
        var turn = game.currentUpdateUI.move.turnIndexAfterMove;
        if (home === 0)
            return turn === gameLogic.WHITE && gameLogic.canBearOff(game.currentState.board, turn);
        if (home === 27)
            return turn === gameLogic.BLACK && gameLogic.canBearOff(game.currentState.board, turn);
        return false;
    }
    game.canSomebodyBearOff = canSomebodyBearOff;
    function shouldRotate() {
        if (typeof game.currentUpdateUI.playMode !== "number") {
            return false;
        }
        else {
            return game.currentUpdateUI.playMode === 1;
        }
    }
    game.shouldRotate = shouldRotate;
})(game || (game = {}));
angular.module('myApp', ['gameServices', 'ngAnimate'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map