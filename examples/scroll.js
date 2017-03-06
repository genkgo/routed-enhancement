// index.js
import Router from 'routed-enhancement';

export default function () {

  let router = new Router('my-namespace/controller');
  router.scroll((scrollTop) => scrollTop > 480, '.element', 'resize-after-scroll');
  router.dispatch();

}

// controller/resize-after-scroll.js
export default class {

  activate($selector, width, height) {
    $selector.addClass('scrolled');
  }

  deactivate($selector, width, height) {
    $selector.removeClass('scrolled');
  }

}