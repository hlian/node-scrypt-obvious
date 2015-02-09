var Assert = require('assert');
var Validator = require('validator');

var Argument = require('./argument.js');
var Lens = require('./lens.js');
var Prelude = require('./Prelude.js');

var over = Lens.over;
var t = Prelude.t;

// Jesus Christ.
var JSARG=1; //Error in JavaScript land: Argument mismatch
var ADDONARG=2; //Error resulting from argument mismatch in the node addon module
var PARMOBJ=3; //Scrypt generated errors
var SCRYPT=4; //Scrypt generated errors

var scrypt = {};

scrypt.params = function() {
    var args_ = Array.prototype.slice.call(arguments);
    var spec = [ ["maxtime", [ t(Argument.isRequired, scrypt.errorObject(ADDONARG, "at least one argument is needed - the maxtime"))
                             , t(Argument.isFloat, scrypt.errorObject(ADDONARG, "maxtime argument must be a number"))
                             , t(Argument.isGreaterThan(0), scrypt.errorObject(ADDONARG, "maxtime must be greater than 0"))
                             ]]
               , ["maxmem", [ t(Argument.isFloat, scrypt.errorObject(ADDONARG, "maxmem argument must be a number")) ]]
                 // Should be s/max_/max/, but that's what upstream does.
               , ["maxmemfrac", [ t(Argument.isFloat, scrypt.errorObject(ADDONARG, "max_memfrac argument must be a number")) ]]
               , ["callback", [ t(Argument.isLast)]]];
    // Upstream tests pass a float in, by accident.
    var args = over("maxmem", Math.ceil)(Argument.parse(args_, spec));
};

scrypt.params.config = {
    maxmem: 0
  , maxmemfrac: 0.5
};

scrypt.hash = function(key, params, callback) {
    return null;
};

scrypt.hash.config = {
    keyEncoding: 'buffer'
  , outputEncoding: 'buffer'
};

scrypt.verify = function(hash, key, callback) {
    return null;
};

scrypt.verify.config = {
    keyEncoding: 'buffer'
  , outputEncoding: 'buffer'
};

scrypt.kdf = function(key, params, len, salt, callback) {
    return null;
};

scrypt.kdf.config = {
    saltEncoding: 'buffer'
  , keyEncoding: 'buffer'
  , outputEncoding: 'buffer'
  , defaultSaltSize: 32
  , outputLength: 64
};

scrypt.errorObject = function(code, message) {
    return { err_code: code, err_message: message };
};

module.exports = scrypt;
