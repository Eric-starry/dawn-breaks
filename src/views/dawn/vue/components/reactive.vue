<template>
  <div class="dawn-vue-reactive" id="test">
    <p class="biubiubiu">111</p>
  </div>
</template>

<script>
const handler = {
  get: function (target, key, receiver) {
    console.log(target, key, receiver);
    return target[key];
  },
  set: function (target, key, newVal, receiver) {
    console.log(target, key, newVal, receiver);
    return Reflect.set(target, key, newVal, receiver);
  },
  // apply拦截函数的调用、call、apply操作， apply方法可以接受3个参数，分别是目标对象、目标对象的上下文对象(this)、目标对象参数数组
  apply: function (target, ctx, args) { // target是函数时，触发apply
    console.log(target, ctx, args);
    return Reflect.apply(...arguments);
  }
};
export default {
  data () {
    return {

    };
  },
  mounted () {
    let target1 = function () { return 'I am the target'; };
    let proxy = new Proxy(target1, handler);
    // proxy.count = 1;
    console.log(proxy(1));
    // console.log(proxy.count);
    let domHandler = {
      get: function (target, key) {
        return function (attrs = {}, ...children) {
          let el = document.createElement(key);
          Object.keys(attrs).forEach(attr => {
            el.setAttribute(attr, attrs[attr]);
          });
          for (let child of children) {
            if (typeof child === 'string' || typeof child === 'number') {
              child = document.createTextNode(child);
            }
            el.appendChild(child);
          }
          return el;
        };
      }
    };
    let dom = new Proxy({}, domHandler);
    const el = dom.div({},
      'Hello, my name is ',
      dom.a({href: '//example.com'}, 'Mark'),
      '. I like:',
      dom.ul({},
        dom.li({}, 'The web'),
        dom.li({}, 'Food'),
        dom.li({}, '…actually that\'s it')
      )
    );
    document.getElementsByClassName('dawn-vue-reactive')[0].appendChild(el);
  }
};
</script>