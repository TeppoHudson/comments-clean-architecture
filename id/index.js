/**
 * @return {string}
 */

/**
 * cuid (source online -> modified by Teppo Hudsson)
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 */

var crypto = require('crypto');

var lim = Math.pow(2, 32) - 1;

function S4()   { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
function guid() { return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); }

function getRandomValue () {
    return Math.abs(crypto.randomBytes(4)
        .readInt32BE() / lim);
};
function pad (num, size) {
    var s = '000000000' + num;
    return s.substr(s.length - size);
};

var c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize);

function randomBlock () {
    return pad((getRandomValue() *
        discreteValues << 0)
        .toString(base), blockSize);
}

function safeCounter () {
    c = c < discreteValues ? c : 0;
    c++; // this is not subliminal
    return c - 1;
}
const cuid =function cuid () {
    // Starting with a lowercase letter makes
    // it HTML element ID friendly.
    const letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter = pad(safeCounter().toString(base), blockSize),

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint_pid = pad(process.pid.toString(36), 2),
        // print = fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

    // console.log('cuid:', letter + timestamp + counter + fingerprint_pid + random)
    return letter + timestamp + counter + fingerprint_pid + random;
}


const isCuid = function isCuid (stringToCheck) {
    if (typeof stringToCheck !== 'string') return false;
    if (stringToCheck.startsWith('c')) return true;
    return false;
};

module.exports.Id = Object.freeze({
    makeId: cuid,
    isValidId: isCuid
});