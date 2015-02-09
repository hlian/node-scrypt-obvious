var Validator = require('validator');

var Prelude = require('./prelude.js');
var Just = Prelude.Just;
var Left = Prelude.Left;
var Map = Prelude.Map;
var Nothing = Nothing;
var Right = Prelude.Right;
var bind = Prelude.bind;
var fmap = Prelude.fmap;
var foldr = Prelude.foldr;
var id = Prelude.id;
var maybe = Prelude.maybe;
var t = Prelude.t;
var uncurry = Prelude.uncurry;

var Argument = {
    isRequired: function(args, i) {
        // TODO not right
        if (args.length > i) {
            return Nothing();
        } else {
            return Just(args[i]);
        }
    }
  , isFloat: function(args, i) {
        if (Validation.isFloat(args[i])) {
            return Just(args[i]);
        } else {
            return Nothing();
        }
    }
  , isLast: function(args, i) {
        if (args.length == i + 1) {
            return Just(args[i]);
        } else {
            return Nothing();
        }
    }
  , isGreaterThan: function(n) {
        return function(args, i) {
            if (args[i] > n) {
                return Just(args[i]);
            } else {
                return Nothing();
            }
        }
    }

  // [Any] -> [(String, [(Validation, Error)])] -> Either Error (Map String Any)
  , parse: function(args, spec) {
      var f = function(x, acc) {
          return bind(acc, function(amap) {
              Map.insert(x.first, x.second, amap);
          });
      };
      return foldr(f, Map.empty, fmap(uncurry(function(s, validators) {
          var i = 0;
          return t(s, fmap(uncurry(function(validation, error) {
              return maybe(Left(error), Right, validation(args, ++i));
          }), validators));
      }), spec));
  }
};

module.exports = Argument;
