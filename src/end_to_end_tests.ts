// This file has end-to-end tests using protractor, see:
// https://github.com/angular/protractor/blob/master/docs/toc.md 
declare var require: (module: string) => any;
function expectEmptyBrowserLogs() {
  browser.manage().logs().get('browser').then(function(browserLog) {
    // See if there are any errors (warnings are ok)
    let hasErrors = false;
    for (let log of browserLog) {
      let level = log.level.name;
      if (level === 'INFO' || level === 'WARNING') continue; // (warnings are ok)
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

let lastTest: any;
module JasmineOverrides {
  let jasmineAny = (<any>jasmine);
  let executeMock = jasmineAny.Spec.prototype.execute
  let jasmineSpec = jasmineAny.Spec;
  jasmineSpec.prototype.execute = function (...args: any[]) {
      lastTest = this.result;
      executeMock.apply(this, args);
  };
  // Pause for expect failures
  let originalAddExpectationResult = jasmineSpec.prototype.addExpectationResult;
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
  protractor.promise.controlFlow().on('uncaughtException', function(e: any) {
    console.error('Unhandled error: ' + e);
    browser.pause();
  });
}

describe('Backgammon', function() {
  let BLACKHOME = 27;
  let BLACKBAR = 1;
  let WHITEHOME = 0;
  let WHITEBAR = 26;
  let BLACK = 0;
  let WHITE = 1;
  let EMPTY = -1;
  browser.driver.manage().window().setSize(400, 600);
  browser.driver.manage().window().setPosition(10, 10);
  
  let checkNoErrorInLogsIntervalId: number = null;
  beforeEach(()=>{
    console.log('\n\n\nRunning test: ', lastTest.fullName);
    checkNoErrorInLogsIntervalId = setInterval(expectEmptyBrowserLogs, 100);
    getPage('');
  });
  afterEach(()=>{
    expectEmptyBrowserLogs();
    clearInterval(checkNoErrorInLogsIntervalId);
  });
  
  function getPage(page: string) {
    browser.get('https://dihou.github.io/Backgammon/');
  }

  function expectPieceKindDisplayed(col: number, pieceId: number, isDisplayed: boolean) {
    let selector = by.id('t'+col);
    // Careful when using animations and asserting isDisplayed:
    // Originally, my animation started from {opacity: 0;}
    // And then the image wasn't displayed.
    // I changed it to start from {opacity: 0.1;}
    if (isDisplayed) {
      expect(element(selector).isDisplayed()).toEqual(true);
    } else {
      expect(element(selector).isPresent()).toEqual(false);
    }
  }

  function expectPiece(col: number, expectedColId: number) {
    expectPieceKindDisplayed(col, 0, expectedColId === 0);
    expectPieceKindDisplayed(col, 1, expectedColId === 1);
  }

  function expectBoard(board: Tower[]) {
    for (let i = 0; i < 28; i++) {
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