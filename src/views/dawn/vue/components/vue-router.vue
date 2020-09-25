<template>
  <div class="dawn-vue-router">
    <p>什么是Vue Router</p>
    <pre>
      Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

      嵌套的路由/视图表
      模块化的、基于组件的路由配置
      路由参数、查询、通配符
      基于 Vue.js 过渡系统的视图过渡效果
      细粒度的导航控制
      带有自动激活的 CSS class 的链接
      HTML5 历史模式或 hash 模式，在 IE9 中自动降级
      自定义的滚动条行为
    </pre>

    <p>创建路由实例</p>
    <pre>
      import Vue from "vue";
      import VueRouter from "vue-router";
      // 路由重复请求时错误处理
      const originalPush = VueRouter.prototype.push;
      VueRouter.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err);
      };
      Vue.use(VueRouter);

      const routes = {
        name: '',
        path: '/',  // 路由
        redirect: '/home', // 重定向
        component: Com,  // 组件
        // component: () => import('@/views/redirect/index.vue')  // 懒加载
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }

      const router = new VueRouter({
        routes,
        mode: 'history', // history模式
        base: process.env.BASE_URL,
        scrollBehavior: () => ({ y: 0 }),  // 跳转路由后的滚动位置
      })

      // 4. 创建和挂载根实例。
      // 记得要通过 router 配置参数注入路由，
      // 从而让整个应用都有路由功能
      const app = new Vue({
        router
      }).$mount('#app')
    </pre>

    <p>动态路由匹配</p>
    <pre>
      我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。
      例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。
      那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果

      const router = new VueRouter({
        routes: [
          // 动态路径参数 以冒号开头
          { path: '/user/:id', component: User },
          {/user/:username/post/:post_id}		{ username: 'evan', post_id: '123' }
        ]
      })
      一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。
      现在，像 /user/foo 和 /user/bar 都将映射到相同的路由。 (this.$route.params 分别为 {id:foo} 和 {id:bar})
      像 /user/evan/post/123 和 /user/haha/post/666 将映射到相同的路由。 (this.$route.params 分别为 { username: 'evan', post_id: '123' } 和 { username: 'haha', post_id: '666' })

      提醒一下，当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。
      因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。
      复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象。
      watch: {
        $route(to, from) {
          // 对路由变化作出响应...
        }
      }
      或使用导航守卫
      beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
      }
    </pre>

    <p>编程式导航</p>
    <pre>
      除了使用 router-link 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
      你可以调用 this.$router.push，这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
      // 字符串
      router.push('home')

      // 对象
      router.push({ path: 'home' })

      // 命名的路由
      router.push({ name: 'user', params: { userId: '123' }})

      // 带查询参数，变成 /register?plan=private
      router.push({ path: 'register', query: { plan: 'private' }})

      注意：如果提供了 path，params 会被忽略，你需要提供路由的 name 或手写完整的带有参数的 path
      const userId = '123'
      router.push({ name: 'user', params: { userId }}) // -> /user/123
      router.push({ path: `/user/${userId}` }) // -> /user/123
      // 这里的 params 不生效
      router.push({ path: '/user', params: { userId }}) // -> /user

      router.replace(location, onComplete?, onAbort?) 跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

      router.go(n) 这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。
    </pre>
  </div>
</template>