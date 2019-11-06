"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sync;

var _utils = require("./utils");

function getCurrentURLPath() {
  var path = decodeURI(window.location.pathname);
  return path + window.location.search + window.location.hash;
}

function getVueRouterBase(router) {
  var _ref = router.options || {},
      _ref$base = _ref.base,
      base = _ref$base === void 0 ? '' : _ref$base;

  return base;
}

function getHistoryBasename(historyOptions) {
  var _ref2 = historyOptions || {},
      _ref2$basename = _ref2.basename,
      basename = _ref2$basename === void 0 ? '' : _ref2$basename;

  return basename;
}

function sync(history, router, historyOptions) {
  // only support browserHistory
  if (router.mode !== 'history') return;
  var basename = getHistoryBasename(historyOptions);
  var base = getVueRouterBase(router);

  var syncFromHistory = function syncFromHistory() {
    // new history path
    var fullNewPath = getCurrentURLPath(); // if new path doesn't has base, ignore

    if (base && !(0, _utils.hasBasename)(fullNewPath, base)) {
      return;
    } // get vue router new path


    var newPath = (0, _utils.stripBasename)(fullNewPath, base); // get current vue-router path

    var oldPath = router.currentRoute.fullPath;

    if (newPath !== oldPath) {
      router.replace(newPath);
    }
  };

  var syncToHistory = function syncToHistory() {
    if (!router.currentRoute) return; // delay to window.location.href change
    // which matches the behavior of react-router

    Promise.resolve().then(function () {
      // get new history path
      var fullNewPath = getCurrentURLPath(); // if new path doesn't match with basename
      // do nothing

      if (basename && !(0, _utils.hasBasename)(fullNewPath, basename)) {
        return;
      } // get new path for history


      var newPath = (0, _utils.stripBasename)(fullNewPath, basename); // get current history path

      var _history$location = history.location,
          hash = _history$location.hash,
          pathname = _history$location.pathname,
          search = _history$location.search;
      var oldPath = pathname + search + hash;

      if (newPath !== oldPath) {
        history.replace(newPath);
      }
    });
  };

  var unlisten = history.listen(syncFromHistory);
  var dispose = router.afterEach(syncToHistory);
  return function () {
    unlisten();
    dispose();
  };
}