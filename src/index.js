#!/usr/bin/env node
var repl = require('repl')
var Promise = require('bluebird')
var moment = require('moment')
var fs = require('fs')
Promise.promisifyAll(fs)

async function fsExists (fileName) {
  try {
    let stats = await fs.lstatAsync(fileName)
    return stats.isFile
  } catch (e) {
    return false
  }
}

async function fsTryRead (fileName) {
  try {
    let file = await fs.readFileAsync(fileName, 'utf8')
    return JSON.parse(file)
  } catch (e) {
    return {}
  }
}

async function writeToFile (data, fileName) {
  let file = await fsTryRead(fileName)
  let merged = Object.assign({}, file, data)
  return fs.writeFileAsync(fileName, JSON.stringify(merged, null, 2))
}

const QUESTIONS = {
  'noFileExists': [
    ['I am grateful for...', ['1. ', '2. ', '3. ']],
    ['What would make today great?', ['1. ', '2. ', '3. ']],
  ],
  'fileExists': [
    ['3 Amazing things that happened today...', ['1. ', '2. ', '3. ']],
    ['How could I have made today even better?', ['> ']]
  ]
}

var questionCount = 0
var answerCount = 0
var fileStamp = moment().format('YYYY-MM-DD')
var fileName = './' + fileStamp + '-five-minute-journal.json'

fsExists(fileName).then(exists => {

  let prop = (exists) ? 'fileExists' : 'noFileExists'

  console.log(QUESTIONS[prop][questionCount][0])
  var data = {}
  let myRepl = repl.start({
    ignoreUndefined: true,
    prompt: QUESTIONS[prop][questionCount][1][answerCount],
    eval: function (text, context, filename, callback) {

      text = text.replace(/\n/ig, '')

      // answer to first question given

      // store answer
      if (!data[QUESTIONS[prop][questionCount][0]]) data[QUESTIONS[prop][questionCount][0]] = []
      data[QUESTIONS[prop][questionCount][0]].push(text)

      // increment answer
      answerCount = answerCount + 1

      // if there's no answer needed
      if (!QUESTIONS[prop][questionCount][1][answerCount]) {
        // if there are no questions left exit
        if (!QUESTIONS[prop][questionCount + 1]) {
          // done no questions left exit
          return writeToFile(data, fileName).then(() => {
            process.exit()
            return callback(null)
          })
        } else {
          // question left
          answerCount = 0 // reset
          questionCount = questionCount + 1 // increment
          console.log(QUESTIONS[prop][questionCount][0])
        }
      }
      if (QUESTIONS[prop][questionCount] && QUESTIONS[prop][questionCount][1] && QUESTIONS[prop][questionCount][1][answerCount]) {
        // console.log(QUESTIONS[prop][questionCount][1][answerCount])
        myRepl.setPrompt(QUESTIONS[prop][questionCount][1][answerCount])
      }
      return callback(null)
    }
  })
})
