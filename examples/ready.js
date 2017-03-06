// index.js
import Router from 'routed-enhancement';

export default function () {

  let router = new Router('my-namespace/controller');
  router.ready('polyfills');
  router.dispatch();

}

// controller/polyfills.js
import Modernizr from 'modernizr';

export default class {

  ready() {
    if (!Modernizr.flexbox) {
      import('flexibility').then((m) => m.default(document.body));
    }
  }

}