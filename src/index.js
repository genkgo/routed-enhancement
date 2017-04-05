import $ from 'jquery';

export default class {

  constructor(namespace) {
    this.namespace = namespace;
    this.whenReady = [];
    this.whenSize = [];
    this.whenScroll = [];
    this.selectors = [];
  }

  ready(moduleName) {
    this.whenReady.push(moduleName);
  }

  selector(selector, moduleName) {
    this.selectors.push({
      'selector': selector,
      'moduleName': moduleName
    });
  }

  resize(constraint, selector, moduleName) {
    this.whenSize.push({
      'constraint': constraint,
      'selector': selector,
      'moduleName': moduleName
    });
  }

  scroll(constraint, selector, moduleName) {
    this.whenScroll.push({
      'constraint': constraint,
      'selector': selector,
      'moduleName': moduleName
    });
  }

  dispatch () {
    $(document).ready(() => this.start());
  }

  start() {
    this.actionReady();
    this.actionResize();
    this.actionScroll();
    this.actionSelector();
  }

  actionReady() {
    for (let moduleName of this.whenReady) {
      import(this.namespace + '/' + moduleName).then(
        (imported) =>  {
          const Controller = imported.default;
          let controller = new Controller;
          controller.ready();
        }
      );
    }
  }

  actionResize() {
    for (let { constraint, selector, moduleName} of this.whenSize) {
      let $window = $(window);
      let $selector = $(selector);

      if ($selector.length > 0) {
        import(this.namespace + '/' + moduleName).then(
          (imported) =>  {
            const Controller = imported.default;
            let controller = new Controller;
            let active = false;
            let callback = () => {
              let width = $window.width();
              let height = $window.height();

              if (active === constraint(width, height)) {
                return;
              }

              if (active) {
                controller.deactivate($selector, width, height);
              } else {
                controller.activate($selector, width, height);
              }

              active = !active;
            };

            $window.resize(callback);
            callback();
          }
        );
      }
    }
  }

  actionScroll() {
    for (let { constraint, selector, moduleName} of this.whenScroll) {
      let $window = $(window);
      let $selector = $(selector);

      if ($selector.length > 0) {
        import(this.namespace + '/' + moduleName).then(
          (imported) =>  {
            const Controller = imported.default;
            let controller = new Controller;
            let active = false;
            let callback = () => {
              let scrollTop = $window.scrollTop();

              if (active === constraint(scrollTop)) {
                return;
              }

              if (active) {
                controller.deactivate($selector, scrollTop);
              } else {
                controller.activate($selector, scrollTop);
              }

              active = !active;
            };

            $window.scroll(callback);
            callback();
          }
        );
      }
    }
  }

  actionSelector() {
    for (let { selector, moduleName} of this.selectors) {
      let $selector = $(selector);
      if ($selector.length > 0) {
        import(this.namespace + '/' + moduleName).then(
          (imported) =>  {
            const Controller = imported.default;
            let controller = new Controller;
            controller.process($selector);
          }
        );
      }
    }
  }

}