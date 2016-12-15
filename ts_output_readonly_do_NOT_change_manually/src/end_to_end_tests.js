function expectEmptyBrowserLogs() {
    browser.manage().logs().get('browser').then(function (browserLog) {
        // See if there are any errors (warnings are ok)
        var hasErrors = false;
        for (var _i = 0, browserLog_1 = browserLog; _i < browserLog_1.length; _i++) {
            var log_1 = browserLog_1[_i];
            var level = log_1.level.name;
            if (level === 'INFO' || level === 'WARNING')
                continue; // (warnings are ok)
            hasErrors = true;
        }
        if (hasErrors) {
            // It's better to pause, and look and console, then showing this which creates a lot of clutter:
            console.error("Browser has a warning/error in the logs. Opens the developer console and look at the logs.");
            //console.log('\n\n\nlog: ' + require('util').inspect(browserLog) + "\n\n\n");
            browser.pause();
        }
    });
}
var lastTest;
var JasmineOverrides;
(function (JasmineOverrides) {
    var jasmineAny = jasmine;
    var executeMock = jasmineAny.Spec.prototype.execute;
    var jasmineSpec = jasmineAny.Spec;
    jasmineSpec.prototype.execute = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        lastTest = this.result;
        executeMock.apply(this, args);
    };
    // Pause for expect failures
    var originalAddExpectationResult = jasmineSpec.prototype.addExpectationResult;
    jasmineSpec.prototype.addExpectationResult = function () {
        if (!arguments[0]) {
            console.error("\n\nFailure in test:\n" +
                arguments[1].message + "\n" +
                (arguments[1].error ? " stacktrace=\n\n" + arguments[1].error.stack : '') +
                "\n\n\n" +
                " Failure arguments=" + JSON.stringify(arguments));
            browser.pause();
        }
        return originalAddExpectationResult.apply(this, arguments);
    };
    // Pause on exception
    protractor.promise.controlFlow().on('uncaughtException', function (e) {
        console.error('Unhandled error: ' + e);
        browser.pause();
    });
})(JasmineOverrides || (JasmineOverrides = {}));
describe('Backgammon', function () {
    var BLACKHOME = 27;
    var BLACKBAR = 1;
    var WHITEHOME = 0;
    var WHITEBAR = 26;
    var BLACK = 0;
    var WHITE = 1;
    var EMPTY = -1;
    browser.driver.manage().window().setSize(400, 600);
    browser.driver.manage().window().setPosition(10, 10);
    var checkNoErrorInLogsIntervalId = null;
    beforeEach(function () {
        console.log('\n\n\nRunning test: ', lastTest.fullName);
        checkNoErrorInLogsIntervalId = setInterval(expectEmptyBrowserLogs, 100);
        getPage('');
    });
    afterEach(function () {
        expectEmptyBrowserLogs();
        clearInterval(checkNoErrorInLogsIntervalId);
    });
    function getPage(page) {
        browser.get('https://dihou.github.io/Backgammon/');
    }
    function expectPieceKindDisplayed(col, pieceId, isDisplayed) {
        var selector = by.id('t' + col);
        // Careful when using animations and asserting isDisplayed:
        // Originally, my animation started from {opacity: 0;}
        // And then the image wasn't displayed.
        // I changed it to start from {opacity: 0.1;}
        if (isDisplayed) {
            expect(element(selector).isDisplayed()).toEqual(true);
        }
        else {
            expect(element(selector).isPresent()).toEqual(false);
        }
    }
    function expectPiece(col, expectedColId) {
        expectPieceKindDisplayed(col, 0, expectedColId === 0);
        expectPieceKindDisplayed(col, 1, expectedColId === 1);
    }
    function expectBoard(board) {
        for (var i = 0; i < 28; i++) {
            expectPiece(i, board[i].status);
        }
    }
    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Backgammon');
    });
    // it('should have initial board', function() {
    //   expectBoard(
    //     [new Tower(0, WHITE, 0), new Tower(1, BLACK, 0),
    //          new Tower(2, BLACK, 2), new Tower(3, EMPTY, 0),
    //          new Tower(4, EMPTY, 0), new Tower(5, EMPTY, 0),
    //          new Tower(6, EMPTY, 0), new Tower(7, WHITE, 5),
    //          new Tower(8, EMPTY, 0), new Tower(9, WHITE, 3),
    //          new Tower(10, EMPTY, 0), new Tower(11, EMPTY, 0),
    //          new Tower(12, EMPTY, 0), new Tower(13, BLACK, 5),
    //          new Tower(14, WHITE, 5), new Tower(15, EMPTY, 0),
    //          new Tower(16, EMPTY, 0), new Tower(17, EMPTY, 0),
    //          new Tower(18, BLACK, 3), new Tower(19, EMPTY, 0),
    //          new Tower(20, BLACK, 5), new Tower(21, EMPTY, 0),
    //          new Tower(22, EMPTY, 0), new Tower(23, EMPTY, 0),
    //          new Tower(24, EMPTY, 0), new Tower(25, WHITE, 2),
    //          new Tower(26, WHITE, 0), new Tower(27, BLACK, 0)]
    //   );
    // });
});
//# sourceMappingURL=end_to_end_tests.js.map