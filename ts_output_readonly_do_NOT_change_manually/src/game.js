;
var game;
(function (game) {
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.animationEndedTimeout = null;
    game.originalState = null;
    game.currentState = null;
    game.moveStart = -1;
    game.curSelectedCol = null;
    function init() {
        registerServiceWorker();
        translate.setTranslations(getTranslations());
        translate.setLanguage('en');
        //resizeGameAreaService.setWidthToHeight(1);
        game.originalState = gameLogic.getInitialState();
        moveService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            checkMoveOk: gameLogic.checkMoveOk,
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
        game.currentUpdateUI = params;
        clearAnimationTimeout();
        game.originalState = params.move.stateAfterMove;
        if (isFirstMove()) {
            game.originalState = gameLogic.getInitialState();
            game.currentState = angular.copy(game.originalState);
            //setInitialTurnIndex();
            if (isMyTurn()) {
                makeMove(gameLogic.createInitialMove());
            }
        }
        else {
            game.currentState = angular.copy(game.originalState);
            // maybe we want to show the original steps by the opponent first
            // some animation on the originalState.delta.originalSteps needed
            game.currentState.delta = null;
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            game.animationEndedTimeout = $timeout(animationEndedCallback, 500);
        }
    }
    game.updateUI = updateUI;
    function animationEndedCallback() {
        log.info("Animation ended");
        maybeSendComputerMove();
    }
    function clearAnimationTimeout() {
        if (game.animationEndedTimeout) {
            $timeout.cancel(game.animationEndedTimeout);
            game.animationEndedTimeout = null;
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
        if (!isHumanTurn())
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        if (game.moveStart !== -1) {
            try {
                gameLogic.createMiniMove(game.currentState, game.moveStart, target, game.currentUpdateUI.move.turnIndexAfterMove);
                log.info(["Create a move between:", game.moveStart, target]);
            }
            catch (e) {
                log.info(["Unable to create a move between:", game.moveStart, target]);
            }
            finally {
                game.moveStart = -1;
            }
        }
        else {
            game.moveStart = target;
            log.info(["Starting a move from:", game.moveStart]);
        }
    }
    game.towerClicked = towerClicked;
    function submitClicked() {
        log.info(["Submit move."]);
        try {
            var oneMove = gameLogic.createMove(game.originalState, game.currentState, game.currentUpdateUI.move.turnIndexAfterMove);
            makeMove(oneMove);
        }
        catch (e) {
            log.info(["Game: Move submission failed."]);
        }
    }
    game.submitClicked = submitClicked;
    /**
     * This function tries to generate a new combination of dies each time the player's turn begins.
     * It sets the original combination to the local storage of gameLogic.
     */
    function rollClicked() {
        log.info("Clicked on roll:");
        if (!isMyTurn())
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        gameLogic.setOriginalSteps(game.currentState);
    }
    game.rollClicked = rollClicked;
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
        for (var i = 0; i < game.currentState.board.length; i++) {
            if (game.currentState.board[i].tid === col) {
                var n = game.currentState.board[i].count;
                if (n < 7) {
                    return 16.66;
                }
                return 100 / n;
            }
        }
    }
    game.getHeight = getHeight;
    //to-do
    //tower on click highlight
    function selectTower(col) {
        game.curSelectedCol = col;
    }
    game.selectTower = selectTower;
    function isActive(col) {
        return game.curSelectedCol === col;
    }
    game.isActive = isActive;
})(game || (game = {}));
angular.module('myApp', ['gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map