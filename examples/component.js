// index.js
import Router from 'routed-enhancement';

export default function () {

  let router = new Router('my-namespace/components');
  router.selector('form.special', 'special-form');
  router.dispatch();

}

// components/special-form.js
export default class {

  constructor($selector) {
    this.$form = $selector;
  }

  initialize() {
    this.$form.submit(
      e => {

      }
    );
  }

}