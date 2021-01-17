/** index file organises and import all the comment dependencies */
const crypto = require('crypto');
const Id = require('../id').Id;
const ipRegex = require('ip-regex');
const sanitizeHtml = require('sanitize-html');

/** factories to build comment and source */
const buildMakeComment = require('./comment').buildMakeComment;
const buildMakeSource = require('./source').buildMakeSource;

const makeSource = buildMakeSource({ isValidIp })
const makeComment = buildMakeComment({ Id, md5, sanitize, makeSource })

module.exports.makeComment = makeComment;

function isValidIp (ip) {
    return ipRegex({ exact: true }).test(ip)
}

function md5 (text) {
    return crypto
            .createHash('md5')
            .update(text, 'utf-8')
            .digest('hex')
}

function sanitize (text) {
    // TODO: allow more coding embeds
    return sanitizeHtml(text, {
        allowedIframeHostnames: ['fibo.io', 'sprinthack.com']
    })
}