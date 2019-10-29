import { History, Location, createBrowserHistory } from 'history'
import VueRouter from 'vue-router';
import { pathJoin, stripBasename, hasBasename } from './utils';

export type Disposer = () => void;
export interface HistoryOptions {
  basename?: string;
}

function getVueRouterBase(router: VueRouter) {
  const { base = ''} = (router as any).options || {};
  return base;
}

function getHistoryBasename(historyOptions?: HistoryOptions) {
  const { basename = ''} = historyOptions || {};

  return basename;
}

export default function sync(history: History, router: VueRouter, historyOptions?: HistoryOptions): Disposer {
  const basename = getHistoryBasename(historyOptions);
  const base = getVueRouterBase(router);

  const syncFromHistory = (location: Location) => {
    if (!location) return;

    const { hash, pathname, search } = location;

    // new history path
    const fullNewPath = pathJoin(basename, pathname) + search + hash;

    // if new path doesn't has base, ignore
    if (base && !hasBasename(fullNewPath, base)) {
      return;
    }

    const newPath = stripBasename(
      fullNewPath,
      base,
    );
    const { fullPath } = router.currentRoute;
  
    if (newPath !== fullPath) {
      router.replace(newPath);
    }
  }

  const syncToHistory = () => {
    if (!router.currentRoute) return;
  
    const { fullPath } = router.currentRoute;
    const { hash, pathname, search } = history.location;
    const oldPath = pathname + search + hash;

    const fullNewPath = pathJoin(base, fullPath);
    // if new path doesn't match with basename
    // do nothing
    if (basename && !hasBasename(fullNewPath, basename)) {
      return;
    }
  
    const newPath = stripBasename(
      fullNewPath,
      basename,
    );

    if (newPath !== oldPath) {
      history.replace(newPath);
    }
  }

  const unlisten = history.listen(syncFromHistory);
  const dispose = router.afterEach(syncToHistory);

  return () => {
    unlisten();
    dispose();
  };
}