import { History } from 'history'
import VueRouter from 'vue-router';
import { pathJoin, stripBasename, hasBasename } from './utils';

export type Disposer = () => void;
export interface HistoryOptions {
  basename?: string;
}

function getCurrentURLPath (): string {
  const path = decodeURI(window.location.pathname)
  return path + window.location.search + window.location.hash
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
  // only support browserHistory
  if (router.mode !== 'history') return;
  
  const basename = getHistoryBasename(historyOptions);
  const base = getVueRouterBase(router);

  const syncFromHistory = () => {
    // new history path
    const fullNewPath = getCurrentURLPath();

    // if new path doesn't has base, ignore
    if (base && !hasBasename(fullNewPath, base)) {
      return;
    }

    // get vue router new path
    const newPath = stripBasename(
      fullNewPath,
      base,
    );

    // get current vue-router path
    const { fullPath: oldPath } = router.currentRoute;
  
    if (newPath !== oldPath) {
      router.replace(newPath);
    }
  }

  const syncToHistory = () => {
    if (!router.currentRoute) return;
  
    setTimeout(() => {
      // get new history path
      const fullNewPath = getCurrentURLPath();
      // if new path doesn't match with basename
      // do nothing
      if (basename && !hasBasename(fullNewPath, basename)) {
        return;
      }

      // get new path for history
      const newPath = stripBasename(
        fullNewPath,
        basename,
      );

      // get current history path
      const { hash, pathname, search } = history.location;
      const oldPath = pathname + search + hash;

      if (newPath !== oldPath) {
        history.replace(newPath);
      }
    }, 0);
  }

  const unlisten = history.listen(syncFromHistory);
  const dispose = router.afterEach(syncToHistory);

  return () => {
    unlisten();
    dispose();
  };
}