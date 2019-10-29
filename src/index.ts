import { History, Location } from 'history'
import VueRouter from 'vue-router';

type Disposer = () => void;

export default function sync(history: History, router: VueRouter): Disposer {
  const syncFromHistory = (location: Location) => {
    if (!location) return;

    const { hash, pathname, search } = location;
  
    const newPath = pathname + search + hash;
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

    if (fullPath !== oldPath) {
      history.push(fullPath);
    }
  }

  const unlisten = history.listen(syncFromHistory);
  const dispose = router.afterEach(syncToHistory);

  return () => {
    unlisten();
    dispose();
  };
}