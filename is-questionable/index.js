//
// import axios from 'axios'
// import querystring from 'querystring'
// import pipe from '@devmastery/pipe'
const {makeIsQuestionable} = require('./is-questionable');
//
// const isQuestionable = makeIsQuestionable({
//     issueHttpRequest: axios,
//     pipe,
//     querystring
// })

const isQuestionable = makeIsQuestionable()

module.exports.isQuestionable = isQuestionable;