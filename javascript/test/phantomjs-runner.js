// PhantomJS Test Runner

/*globals phantom WebPage*/

var testsTimeout = 15 * 1000;
var testsCheckInterval = 500;

var args = phantom.args;
if (args.length != 1) {
  console.log("Usage: " + phantom.scriptName + " <URL>");
  phantom.exit(1);
}

var page = new WebPage();

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.open(args[0], function(status) {
  if (status !== 'success') {
    console.error("Unable to access page");
    phantom.exit(1);
  } else {
    var start = Date.now();
    var interval = setInterval(function() {
      if (Date.now() > start + testsTimeout) {
        console.error("Tests timed out");
        phantom.exit(3);
      } else {
        var testResult = page.evaluate(function() {
          var testResultElement = document.getElementById('nodeunit-testresult');
          return testResultElement ? testResultElement.innerText : null;
        });

        if (testResult) {
          clearInterval(interval);

          console.log(testResult);

          if (testResult.match(/, 0 failed./)) {
            phantom.exit();
          } else {
            phantom.exit(2);
          }
        }
      }
    }, testsCheckInterval);
  }
});
