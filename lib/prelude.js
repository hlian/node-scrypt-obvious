var Assert = require('assert');
var Clone = require('clone');

var Prelude = {};

// Typeclasses.
var _typeclassFind = function(dict, o) {
    if (typeof(o) === 'object') {
        return Monads[o.__type__];
    } else {
        return null;
    }
};

// Functor class.
var Functors = {};

// Applicative class.
var Applicatives = {};

// Monad class.
var Monads = {};

var _mdict = function(o) { return _typeclassFind(Monads, o); };

// Church-encoding of Maybe.
var Nothing = Prelude.Nothing = function() {
    var f = function(bad, good) {
        return bad;
    };
    f.__type__ = 'Maybe';
    return f;
};

var Just = Prelude.Just = function(v) {
    var f = function(bad, good) {
        return good(v);
    }
    f.__type__ = 'Maybe';
    return f;
};

var maybe = Prelude.maybe = function(bad, good, amaybe) {
    return amaybe(bad, good);
};

// Church-encoding of Either.
var Left = Prelude.Left =function(err) {
    var f = function(bad, good) {
        return bad(err);
    }
    f.__type__ = 'Either';
    return f;
};

var Right = Prelude.Right = function(v) {
    var f = function(bad, good) {
        return good(v);
    }
    f.__type__ = 'Either';
    return f;
};

var either = Prelude.either = function(bad, good, aneither) {
    return aneither(bad, good);
};

// Quick way of constructing tuples
var t = Prelude.t = function() {
    var args = Array.prototype.slice.call(arguments);
    var tuple = {};
    if (args.length > 0) tuple.first = args[0];
    if (args.length > 1) tuple.second = args[1];
    return tuple;
};

// Function utils.
var id = Prelude.id = function(x) { return x; };

var constant = Prelude.constant = function(x) { return function() { return x; } };

var uncurry = Prelude.uncurry = function(f) {
    return function() {
        var args = Array.prototype.slice(arguments);
        Assert.equal(args.length, 2, 'uncurry: expecting 2-arity');
        return f(args[0], args[1]);
    };
};

// List utils.
var foldr = Prelude.foldr = function(accumulator, start, xs) {
    var acc = start;
    for (var i = 0; i < xs.length; i++) {
        acc = accumulator(acc, xs[i]);
    };
    return acc;
};

// Map.
var Map = Prelude.Map = {
    empty: []
  , insert: function(key, value, amap) {
      var arr = Map.delete(key, amap)
      arr.push(t(key, value));
      return arr;
  }
  , delete: function(key, value, amap) {
      var arr = amap.filter(function(t) { return t.first != key; });
      return arr;
  }
};

var bind = Prelude.bind = function(ma, atomb) {
    var mdict = _mdict(ma);
    Assert.equal(!!mdict, true, "bind: not a monad");
};

module.exports = Prelude;
