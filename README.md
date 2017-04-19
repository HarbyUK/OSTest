# ostest [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Open-Source testing framework for those who want simple unit assertions

## Installation

```sh
$ npm install --save ostest
```

## Usage

To start testing you must first import OSTest and create a new instance:

```js
const OSTest = require('ostest');

let exampleTest = new OSTest();
```

Then to run a test, simply call the test function with the following signature:

```js
exampleTest.test(function exampleTestFunction() {
	// You must put an assertion function here e.g.
	// exampleTest.assertTrue(x);
});
```

## Assertions

The different assertion types are as follows:

* assert - Simple assertion to check that to see that the actual value matches expected using strict equality

* assertTrue - Expects the returned value to be true

* assertFalse - Expects the returned value to be false

* assertCallbackInvocation - Passes a stubbed callback function into a real implementation. If the callback occurs, the test passes, otherwise the test fails

```js
exampleTest.test(function exampleCallbackTest() {
	var invocation = new OSTest.Invocation();
	example.exampleFunction(invocation.callback());
	exampleTest.assertCallbackInvocation(invocation);
});
```

* assertError - Used to assert that an error was thrown

## License

GPL-3.0 © [Scott McKenna]()


[npm-image]: https://badge.fury.io/js/ostest.svg
[npm-url]: https://npmjs.org/package/ostest
[travis-image]: https://travis-ci.org/harbyuk/ostest.svg?branch=master
[travis-url]: https://travis-ci.org/harbyuk/ostest
[daviddm-image]: https://david-dm.org/harbyuk/ostest.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/harbyuk/ostest
