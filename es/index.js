import { pathJoin, stripBasename, hasBasename } from './utils';

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

export default function sync(history, router, historyOptions) {
  var basename = getHistoryBasename(historyOptions);
  var base = getVueRouterBase(router);

  var syncFromHistory = function syncFromHistory(location) {
    if (!location) return;
    var hash = location.hash,
        pathname = location.pathname,
        search = location.search; // new history path

    var fullNewPath = pathJoin(basename, pathname) + search + hash; // if new path doesn't has base, ignore

    if (base && !hasBasename(fullNewPath, base)) {
      return;
    }

    var newPath = stripBasename(fullNewPath, base);
    var fullPath = router.currentRoute.fullPath;

    if (newPath !== fullPath) {
      router.replace(newPath);
    }
  };

  var syncToHistory = function syncToHistory() {
    if (!router.currentRoute) return;
    var fullPath = router.currentRoute.fullPath;
    var _history$location = history.location,
        hash = _history$location.hash,
        pathname = _history$location.pathname,
        search = _history$location.search;
    var oldPath = pathname + search + hash;
    var fullNewPath = pathJoin(base, fullPath); // if new path doesn't match with basename
    // do nothing

    if (basename && !hasBasename(fullNewPath, basename)) {
      return;
    }

    var newPath = stripBasename(fullNewPath, basename);

    if (newPath !== oldPath) {
      history.replace(newPath);
    }
  };

  var unlisten = history.listen(syncFromHistory);
  var dispose = router.afterEach(syncToHistory);
  return function () {
    unlisten();
    dispose();
  };
}