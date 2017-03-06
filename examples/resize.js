// index.js
import Router from 'routed-enhancement';

export default function () {

  let router = new Router('my-namespace/controller');
  router.resize((width, height) => width < 320 && height > 480, '.element', 'hide-mobile-elements');
  router.dispatch();

}

// controller/hide-mobile-elements.js
export default class {

  activate($selector, width, height) {
    $selector.hide();
  }

  deactivate($selector, width, height) {
    $selector.show();
  }

}