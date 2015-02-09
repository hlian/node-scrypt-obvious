var Clone = require('clone');

// ekmett's lenses utils.
var over = function(lens, func) {
    return function(old) {
        var copy = Clone(old);
        copy[lens] = func(old[lens]);
        return copy;
    };
};

module.exports = {
    over: over
};
