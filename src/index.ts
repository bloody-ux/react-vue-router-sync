import { History, Location, createBrowserHistory } from 'history'
import VueRouter from 'vue-router';
import { pathJoin, stripBasename } from './utils';

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
    const newPath = stripBasename(
      pathJoin(basename, pathname) + search + hash,
      base,
    );
    const { fullPath } = router.currentRoute;
  
    if (newPath !== fullPath) {
      router.push(newPath);
    }
  }

  const syncToHistory = () => {
    if (!router.currentRoute) return;
  
    const { fullPath } = router.currentRoute;
    const { hash, pathname, search } = history.location;
    const oldPath = pathname + search + hash;
    const newPath = stripBasename(
      pathJoin(base, fullPath),
      basename,
    );

    if (newPath !== oldPath) {
      history.push(newPath);
    }
  }

  const unlisten = history.listen(syncFromHistory);
  const dispose = router.afterEach(syncToHistory);

  return () => {
    unlisten();
    dispose();
  };
}