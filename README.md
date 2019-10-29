[![npm][npm]][npm-url]
[![node][node]][node-url]
[![license][license]][license-url]


<div align="center">
  <h1>react-vue-router-sync</h1>
  <p>Sync location between React Router and Vue Router</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save react-vue-router-sync
```

<h2 align="center">Usage</h2>

The `react-vue-router-sync` is used to sync between router status for micro frontend apps.


``` js
import sync from 'react-vue-router-sync';
import { createBrowserHistory } from 'history';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const vueRouter = new VueRouter({
  // ...
});

const history = createBrowserHistory({
  // ...
});

const unsync = sync(history, vueRouter);
history.push('/foo/bar');

console.log(vueRouter.currentRoute.fullPath); //  => /foo/bar
unsync(); // dispose sync
```
