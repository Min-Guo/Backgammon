;
var game;
(function (game) {
    game.debug = 0; //0: normal, 1: bear off, ...
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    // export let animationEndedTimeout: ng.IPromise<any> = null;
    game.originalState = null;
    game.currentState = null;
    game.moveStart = -1;
    game.moveEnd = -1;
    game.showSteps = [0, 0, 0, 0];
    game.showStepsControl = [true, true, true, true];
    game.rollingEndedTimeout = null;
    game.slowlyAppearEndedTimeout = null;
    game.targets = [];
    var rolling = false;
    function init() {
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        //resizeGameAreaService.setWidthToHeight(1);
        game.originalState = game.debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
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
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        game.didMakeMove = false; // Only one move per updateUI
        game.currentState = null; // reset
        game.currentUpdateUI = params;
        clearAnimationTimeout();
        game.originalState = params.move.stateAfterMove;
        game.currentState = { board: null, delta: null };
        if (isFirstMove()) {
            game.originalState = game.debug === 1 ? gameLogic.getBearOffState() : gameLogic.getInitialState();
            game.currentState.board = angular.copy(game.originalState.board);
            //setInitialTurnIndex();
            if (isMyTurn()) {
                var firstMove = void 0;
                firstMove = game.debug === 1 ? gameLogic.createInitialBearMove() : gameLogic.createInitialMove();
                makeMove(firstMove);
            }
        }
        else {
            game.currentState.board = angular.copy(game.originalState.board);
        }
    }
    game.updateUI = updateUI;
    function animationEndedCallback() {
        log.info("Animation ended");
        maybeSendComputerMove();
    }
    function clearAnimationTimeout() {
        // Clear rolling dices animation timeout
        if (game.rollingEndedTimeout) {
            $timeout.cancel(game.rollingEndedTimeout);
            game.rollingEndedTimeout = null;
        }
    }
    function maybeSendComputerMove() {
        if (!isComputerTurn())
            return;
        var move = aiService.findComputerMove(game.currentUpdateUI.move);
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
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        clearSlowlyAppearTimeout();
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
                    game.slowlyAppearEndedTimeout = $timeout(slowlyAppearEndedCallback, 600);
                    game.targets.length = 0;
                    game.moveStart = -1;
                    setGrayShowStepsControl(usedValues);
                }
                else {
                    log.warn(["Unable to create a move between:", game.moveStart, game.moveEnd]);
                    clearSlowlyAppearTimeout();
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
    function clearSlowlyAppearTimeout() {
        // Clear checkers slowly appear animation timeout
        if (game.slowlyAppearEndedTimeout) {
            $timeout.cancel(game.slowlyAppearEndedTimeout);
            game.slowlyAppearEndedTimeout = null;
        }
    }
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
        var oneMove = null;
        try {
            oneMove = gameLogic.createMove(game.originalState, game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
        }
        catch (e) {
            log.warn(["Move submission failed."]);
            log.warn(e);
            return;
        }
        // Move is legal, make it!
        makeMove(oneMove);
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
            setDiceStatus(true);
            gameLogic.setOriginalSteps(game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
            var originalSteps = gameLogic.getOriginalSteps(game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
            if (originalSteps.length === 2) {
                game.showSteps[0] = 0;
                game.showSteps[1] = originalSteps[0];
                game.showSteps[2] = originalSteps[1];
                game.showSteps[3] = 0;
            }
            else {
                game.showSteps[0] = originalSteps[0];
                game.showSteps[1] = originalSteps[1];
                game.showSteps[2] = originalSteps[2];
                game.showSteps[3] = originalSteps[3];
            }
            log.info(["Dices rolled: ", game.showSteps]);
            resetGrayToNormal(game.showStepsControl);
            game.rollingEndedTimeout = $timeout(rollingEndedCallback, 500);
        }
        catch (e) {
            log.warn(e);
            setDiceStatus(false);
        }
    }
    game.rollClicked = rollClicked;
    function rollingEndedCallback() {
        log.info("Rolling ended");
        setDiceStatus(false);
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
    function setDiceStatus(b) {
        rolling = b;
    }
    game.setDiceStatus = setDiceStatus;
    function getDiceStatus() {
        return rolling;
    }
    game.getDiceStatus = getDiceStatus;
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
    function shouldSlowlyAppear(col) {
        // log.info(["Test should slowly appear:", col === moveEnd]);
        return col === game.moveEnd;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
    function slowlyAppearEndedCallback() {
        log.info("End point slowly appear ended.");
        game.moveEnd = -1;
    }
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
angular.module('myApp', ['gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map