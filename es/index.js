export default function sync(history, router) {
  var syncFromHistory = function syncFromHistory(location) {
    if (!location) return;
    var hash = location.hash,
        pathname = location.pathname,
        search = location.search;
    var newPath = pathname + search + hash;
    var fullPath = router.currentRoute.fullPath;

    if (newPath !== fullPath) {
      router.push(newPath);
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

    if (fullPath !== oldPath) {
      history.push(fullPath);
    }
  };

  var unlisten = history.listen(syncFromHistory);
  var dispose = router.afterEach(syncToHistory);
  return function () {
    unlisten();
    dispose();
  };
}