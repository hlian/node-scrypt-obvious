var Assert = require('assert');
var Clone = require('clone');

var Prelude = {};

// Typeclasses.
var _typeclassOf = function(o, dict) {
    if (Array.isArray(o)) {
        return dict['__array__'];
    } else if (typeof(o) === 'object') {
        return dict[o.__type__];
    } else {
        return null;
    }
};

var Functors = {};
var Applicatives = {};
var Monads = {};
var _fdict = function(o) { return _typeclassOf(o, Functors); };
var _adict = function(o) { return _typeclassOf(o, Applicatives); };
var _mdict = function(o) { return _typeclassOf(o, Monads); };

// Church-encoding of Either.
var eitherify = function(o) {
    o.__type__ = 'Either';
    return o;
};

var Left = Prelude.Left = function(err) {
    return eitherify(function(bad, good) {
        return bad(err);
    });
};

var Right = Prelude.Right = function(v) {
    return eitherify(function(bad, good) {
        return good(v);
    });
};

var either = Prelude.either = function(bad, good, aneither) {
    return aneither(bad, good);
};

Functors['Either'] = {
    fmap: function(f, aneither) {
        return eitherify(function(bad, good) {
            return aneither(bad, function(v) {
                return good(f(v));
            });
        });
    }
};

Applicatives['Either'] = {
    pure: Just
  , ap: function(ff, fa) {
      return eitherify(function(bad, good) {
          return ff(bad, function(f) {
              return fa(bad, function(a) {
                  return good(f(a));
              });
          });
      });
    }
};

Monads['Either'] = {
    bind: function(ma, atomb) {
      return eitherify(function(bad, good) {
          return ma(bad, function(a) {
              return atomb(a)(bad, good);
          });
      });
    }
};

// Church-encoding of Maybe.
var maybify = function(o) {
    o.__type__ = 'Maybe';
    return o;
};

var Nothing = Prelude.Nothing = function() {
    return maybify(Left(null));
};

var Just = Prelude.Just = function(v) {
    return maybify(Right(v));
};

var maybe = Prelude.maybe = function(bad, good, amaybe) {
    return amaybe(function(ignore) {
        return bad();
    }, good);
};

Functors['Maybe'] = Functors['Either'];
Applicatives['Maybe'] = Functors['Either'];
Monads['Maybe'] = Monads['Either'];

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

Functors['__array__'] = {
    fmap: function(f, xs) {
        return xs.map(f, null);
    }
};

Applicatives['__array__'] = {
    pure: function(x) {
        return [x];
    }
  , ap: function(fs, xs) {
        return fs.map(function(f) {
            return xs.map(function(x) {
                return f(x);
            });
        }, null);
    }
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

var fmap = Prelude.fmap = function(f, fa) {
    var fdict = _fdict(fa);
    Assert.equal(!!fdict, true, "fmap: not a functor: " + fa.toString());
    return fdict.fmap(f, fa);
};

var bind = Prelude.bind = function(ma, atomb) {
    var mdict = _mdict(ma);
    Assert.equal(!!mdict, true, "bind: not a monad: " + ma.toString());
    return mdict.bind(ma, atomb);
};

module.exports = Prelude;
