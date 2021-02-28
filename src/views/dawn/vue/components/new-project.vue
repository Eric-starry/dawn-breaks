<template>
  <div class="dawn-vue-new-project">
    <p>创建一个vue项目</p>
    // 运行以下命令来创建一个新项目
    // 你会被提示选取一个 preset。你可以选默认的包含了基本的 Babel + ESLint 设置的 preset，也可以选“手动选择特性”来选取需要的特性。
    vue create hello-world

    <p>拉取旧版本</p>
    // Vue CLI >= 3 和旧版使用了相同的 vue 命令，所以 Vue CLI 2 (vue-cli) 被覆盖了。如果你仍然需要使用旧版本的 vue init 功能，你可以全局安装一个桥接工具
    // # `vue init` 的运行效果将会跟 `vue-cli@2.x` 相同
    npm install -g @vue/cli-init
    vue init webpack my-project

    <p>安装插件</p>
    // Vue CLI 使用了一套基于插件的架构。如果你查阅一个新创建项目的 package.json，就会发现依赖都是以 @vue/cli-plugin- 开头的。插件可以修改 webpack 的内部配置。
    // 如果你想在一个已经被创建好的项目中安装一个插件，可以使用 vue add 命令
    vue add eslint

    <p>项目本地插件</p>
    // 如果你需要在项目里直接访问插件 API 而不需要创建一个完整的插件，你可以在 package.json 文件中使用 vuePlugins.service 选项
    {
      "vuePlugins": {
        "service": ["my-commands.js"]
      }
    }

    <p>浏览器兼容</p>
    <div>
    package.json 文件里的 browserslist 字段 (或一个单独的 .browserslistrc 文件)，指定了项目的目标浏览器的范围
    这个值会被 @babel/preset-env 和 Autoprefixer 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀

    一个默认的 Vue CLI 项目会使用 @vue/babel-preset-app，它通过 @babel/preset-env 和 browserslist 配置来决定项目需要的 polyfill。

    如果有依赖需要特殊的 polyfill，你有几种选择：
    如果该依赖基于一个目标环境不支持的 ES 版本撰写: 将其添加到 vue.config.js 中的 transpileDependencies 选项。这会为该依赖同时开启语法转换和根据使用情况检测 polyfill。
    如果该依赖交付了 ES5 代码并显式地列出了需要的 polyfill: 你可以使用 @vue/babel-preset-app 的 polyfills 选项预包含所需要的 polyfill。注意 es.promise 将被默认包含，因为现在的库依赖 Promise 是非常普遍的。
    // babel.config.js
    module.exports = {
      presets: [
        ['@vue/app', {
          polyfills: [
            'es.promise',
            'es.symbol'
          ]
        }]
      ]
    }
    </div>
  </div>
</template>