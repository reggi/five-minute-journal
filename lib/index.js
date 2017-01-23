#!/usr/bin/env node
'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var fsExists = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fileName) {
    var stats;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fs.lstatAsync(fileName);

          case 3:
            stats = _context.sent;
            return _context.abrupt('return', stats.isFile);

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', false);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function fsExists(_x) {
    return _ref.apply(this, arguments);
  };
}();

var fsTryRead = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fileName) {
    var file;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fs.readFileAsync(fileName, 'utf8');

          case 3:
            file = _context2.sent;
            return _context2.abrupt('return', JSON.parse(file));

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', {});

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function fsTryRead(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var writeToFile = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(data, fileName) {
    var file, merged;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fsTryRead(fileName);

          case 2:
            file = _context3.sent;
            merged = (0, _assign2.default)({}, file, data);
            return _context3.abrupt('return', fs.writeFileAsync(fileName, (0, _stringify2.default)(merged, null, 2)));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function writeToFile(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var repl = require('repl');
var Promise = require('bluebird');
var moment = require('moment');
var fs = require('fs');
Promise.promisifyAll(fs);

var QUESTIONS = {
  'noFileExists': [['I am grateful for...', ['1. ', '2. ', '3. ']], ['What would make today great?', ['1. ', '2. ', '3. ']]],
  'fileExists': [['3 Amazing things that happened today...', ['1. ', '2. ', '3. ']], ['How could I have made today even better?', ['> ']]]
};

var questionCount = 0;
var answerCount = 0;
var fileStamp = moment().format('YYYY-MM-DD');
var fileName = './' + fileStamp + '-five-minute-journal.json';

fsExists(fileName).then(function (exists) {

  var prop = exists ? 'fileExists' : 'noFileExists';

  console.log(QUESTIONS[prop][questionCount][0]);
  var data = {};
  var myRepl = repl.start({
    ignoreUndefined: true,
    prompt: QUESTIONS[prop][questionCount][1][answerCount],
    eval: function _eval(text, context, filename, callback) {

      text = text.replace(/\n/ig, '');

      // answer to first question given

      // store answer
      if (!data[QUESTIONS[prop][questionCount][0]]) data[QUESTIONS[prop][questionCount][0]] = [];
      data[QUESTIONS[prop][questionCount][0]].push(text);

      // increment answer
      answerCount = answerCount + 1;

      // if there's no answer needed
      if (!QUESTIONS[prop][questionCount][1][answerCount]) {
        // if there are no questions left exit
        if (!QUESTIONS[prop][questionCount + 1]) {
          // done no questions left exit
          return writeToFile(data, fileName).then(function () {
            process.exit();
            return callback(null);
          });
        } else {
          // question left
          answerCount = 0; // reset
          questionCount = questionCount + 1; // increment
          console.log(QUESTIONS[prop][questionCount][0]);
        }
      }
      if (QUESTIONS[prop][questionCount] && QUESTIONS[prop][questionCount][1] && QUESTIONS[prop][questionCount][1][answerCount]) {
        // console.log(QUESTIONS[prop][questionCount][1][answerCount])
        myRepl.setPrompt(QUESTIONS[prop][questionCount][1][answerCount]);
      }
      return callback(null);
    }
  });
});