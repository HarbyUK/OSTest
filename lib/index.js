'use strict';

const EventEmitter = require('events');
class OSTestEmitter extends EventEmitter {}
const testEmitter = new OSTestEmitter();

class Invocation {

  get testPass() {
    return this._testPass;
  }

  constructor() {
    this._testPass = false;
  }

  callback() {
    return () => {
      this._testPass = true;
    };
  }
}

class OSTest {

  constructor() {
    this._tests = [];
    this._results = {
      total: 0,
      pass: 0,
      fail: 0,
      error: 0,
      unknown: 0,
      resultDetail: []
    };
    this._currentTest = {};
    testEmitter.on('testCommence', (currentTest) => {
      this._currentTest = currentTest;
      try {
        currentTest.function();
      } catch (err) {
        testEmitter.emit('testComplete', "ERROR", err);
      }
    });
    testEmitter.on('testComplete', (result, message) => {
      this._results.total++;
      if(result === "PASS") {
        this._results.pass++;
        console.log("\u2714 PASS: " + this._currentTest.name);
      } else if (result === "FAIL") {
        this._results.fail++;
        console.log("\u2718 FAIL: " + this._currentTest.name);
        if(message !== undefined)
          console.log(message.toString());
      } else if (result === "ERROR") {
        this._results.error++;
        console.log("\u2757 ERROR: " + this._currentTest.name);

        if(message instanceof Error)
          throw message;
        else
          console.log(message.toString());
      } else {
        this._results.unknown++;
        console.log("\u2757 UNKNOWN: " + this._currentTest.name);
        if(message != undefined)
          console.log(message.toString());
      }
      this._results.resultDetail.push(this._currentTest);
    });
    console.log("Executing Tests:\n---------------------------------\n")
  }

  setup() {}
  teardown() {}

  test(testFunction) {
    this.setup();
    var currentTest = {
      name: testFunction.name.toString(),
      function: testFunction,
      result: 'NOT_RUN'
    };
    testEmitter.emit('testCommence', currentTest);
    this._tests.push(currentTest);
    this.teardown();
  }

  pass() {
    testEmitter.emit('testComplete', "PASS");
  }

  fail(message) {
    testEmitter.emit('testComplete', "FAIL", message);
  }

  assert(expected, actual, message) {
    if(expected === actual) {
      this.pass();
    } else {
      this.fail(message);
    }
  }

  assertTrue(actual, message) {
    if(actual === true) {
      this.pass();
    } else {
      this.fail(message);
    }
  }

  assertFalse(actual, message) {
    this.assertTrue(!actual, message);
  }

  assertError(actualFunction, message) {
    try {
      actualFunction();
    } catch (err) {
      this.pass();
      return;
    }
    this.fail(message);
  }

  assertCallbackInvocation(invocation, message) {
    if (!(invocation instanceof Invocation))
      testEmitter.emit('testComplete', "ERROR", new Error("Please pass instance of OSTest.Invocation to test callback"));

    this.assertTrue(invocation.testPass, message);
  }
}

OSTest.Invocation = Invocation;

module.exports = OSTest;
