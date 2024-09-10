# Routed enhancement

This router helps to progressively enhancement DOM elements on a webpage. A router is used to upgrade the elements. The
router has multiple methods to instantiate a controller that is responsible for the behaviour of the elements.
 
## Constructing a new router

Instantiating a new router is easy. An see the an easy example below. 

```js
import Router from 'routed-enhancement';

// vite way to support importing multiple modules
// see https://vitejs.dev/guide/features#glob-import
const modules = import.meta.glob('./controller/**/*.js');

// pass our module loader to the router
let router = new Router((moduleName) => {
  return modules[`./controller/${moduleName}.js`]();
});

// now we can add routes
// this selector will dispatch every <nav> tag to a nav-controller class
router.selector('nav', 'nav-controller');

// dispatch the routes (once the dom is ready, which is been taken care of in the router). 
router.dispatch();
```

When the router from the example is dispatched, it will select all the `nav` elements on the webpage. If there is more 1
element it available, it will import the module `my-namespace/nav-controller`. The controller is required to have the
following interface.

```js
export default class {
  
  process($selector) {
    
  }
  
}
```

The variable `$selector` contains the list elements found on the page as a jquery object.

## Available methods

The following methods are available on the router.

### Selector method

The selector method looks for available DOM elements on the page. Only when at least 1 element is found, the
controller is imported and executed. The selector is not a live selector. So the element has to be on the page when the
page is ready (or when the router dispatched, but that is true in almost every case).

```js
selector(cssSelector, moduleNameOfController);
```

Example
```js
// in the router
router.selector('nav', 'nav-controller');

// in nav-controller.js
export default class {
  
  process($selector) {
    $selector.find('a').click(/* do something with the click here */);
  }
  
}
```

### Component method

The component method looks for available DOM elements on the page and creates class instances per element. The element
is injected in the constructor. The selector is not a live selector. So the element has to be on the page when the page 
is ready (or when the router dispatched, but that is true in almost every case). The advantage over `selector` is that
an instance is created per element, which allows the instance to carry/remember state of the element.

```js
component(cssSelector, moduleNameOfController);
```

Example
```js
// in the router
router.component('form', 'form-component');

// in nav-controller.js
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
```

### Ready method

The ready method is fired when the DOM is ready. This can be usefull to attach polyfills.

```js
ready(moduleNameOfController);
```

Example
```js
// in the router
router.ready('polyfills');

// in polyfills.js
export default class {
  
  ready() {
    if (!Modernizr.flexbox) {
      import('flexibility').then((m) => m.default(document.body));
    }
  }
  
}
```

### Resize method

The resize method is fired when the screen is resized. This can be usefull to execute scripts when the page is
resized. Only when the constraint returns true and the when at least 1 element that satisfies the css selector is found,
the controller is imported and executed. The method `activate` and `deactivate` on the controller are executed only
when the constraint switches state (true/false).

```js
resize(constraint, cssSelector, moduleNameOfController);
```

Example.
```js
// in the router
router.resize((width, height) => width > 960 && height < 960, '.banners', 'banner-controller');

// in banner-controller.js
export default class {
  
  activate($selector, width, height) {
    // the window size satisfies the constraint
    $selector.find('a').unbind('click');
  }
  
  deactivate ($selector, width, height) {
    // the window size does not satisfy the constraint
    $selector.find('a').click(/* do something with the click here */);
  }
  
}
```

### Scroll method

The scroll method is fired when the scrollbar is moved. Only when the constraint returns true and the when at least 1
element that satisfies the css selector is found, the controller is imported and executed. The method `activate`
and `deactivate` on the controller are executed only when the constraint switches state (true/false).

```js
scroll(constraint, cssSelector, moduleNameOfController);
```

Example.
```js
// in the router
router.scroll((scrollTop) => scrollTop > 100, '.logo', 'logo-controller');

// in logo-controller.js
export default class {
  
  activate($selector, scrollTop) {
    // the scroll position satisfies the constraint
    $selector.addClass('scrolled');
  }
  
  deactivate ($selector, scrollTop) {
    // the scroll position does not satisfy the constraint
    $selector.removeClass('scrolled');
  }
  
}
```

## Requirements

In order to use this package in the browser, one needs to transpile the ES6 code used in the package to javascript
that is supported by the browser. You could use [Babel](https://babeljs.io/) for this purpose. Please keep in mind that
you also need to transpile dynamic imports. Finally, this packages also leans on jquery, which is a dependency of this
package.

## Usage with Genkgo DTK

To use it with the [Genkgo DTK](https://github.com/genkgo/dtk), you need to set the transpile setting to `true` because
vendor packages are not transpiled by default.

```js
new DtkApp({
  "npm": {
    "routed-enhancement": {
      "transpile": true
    }
  }
})
```
