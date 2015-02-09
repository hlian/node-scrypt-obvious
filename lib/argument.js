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
    isRequired: {}
  , isFloat : {}
  , isLast: {}
  , isGreaterThan: function(i) {
  }

  // [Any] -> [(String, [(Validation, Error)])] -> Either Error (Map String Any)
  , parse: function(args, spec) {
      var f = function(x, acc) {
          return bind(acc, function(amap) {
              Map.insert(x.first, x.second, amap);
          });
      };
      return foldr(f, Map.empty, fmap(uncurry(function(s, validators) {
          return t(s, fmap(uncurry(function(validation, error) {
              maybe(Left(error), Right, validation(args, s));
          }), validators));
      }), spec));
  }
};

module.exports = Argument;
