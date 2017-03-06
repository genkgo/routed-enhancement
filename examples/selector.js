// index.js
import Router from 'routed-enhancement';

export default function () {

  let router = new Router('my-namespace/controller');
  router.selector('nav', 'nav-controller');
  router.dispatch();

}

// controller/nav-controller.js
export default class {

  process($selector) {
    $selector.find('a').click();
  }

}