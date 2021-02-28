const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
console.log('---------------------------', IS_PROD);
module.exports = {
  /**
   * publicPath
   * 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。
   * 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
   * 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
   */
  publicPath: IS_PROD ? '/home' : '/',
  /**
   * outputDir
   * 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
   */
  outputDir: 'dist',
  /**
   * assetsDir
   * 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
   */
  assetsDir: '',
  /**
   * indexPath
   * 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
   */
  indexPath: 'index.html',
  /**
   * filenameHashing
   * 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
   * 然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。
   * 如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
   */
  filenameHashing: true,
  /**
   * runtimeComplie
   * .vue文件中的template是由谁处理的==》是由vue-template-compiler
   * 为false，使用runtimeOnly配置，在编译阶段就将.vue文件编译成JavaScript，所以只包含运行时的vue.js代码，得到的是render函数的版本（将template在打包的时候，就已经编译为render函数）
   * 为true时，得到的是带有编译器的版本，编译过程在运行时发生（在运行的时候才去编译template）
   * 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
   */
  // runtimeComplie: false,
  /**
   * transplieDependencies
   * 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
   * 如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
   */
  // transplieDependencies: '',
  /** 
   * productionSourceMap
   * 如果你不需要生产环境的source map，可以将其设置为false以加速生产构建
  */
 productionSourceMap: true,
 /**
  * chainWebpack
  * 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例，允许对内部的webpack配置进行更细粒度的修改。
  */
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  /**
   * configureWebpack
   * 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
   * 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
   */
  configureWebpack: {},
  css: {
    /**
     * requireModuleExtension
     * 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
     * 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
     * 如果你在 css.loaderOptions.css 里配置了自定义的 CSS Module 选项，则 css.requireModuleExtension 必须被显式地指定为 true 或者 false，
     * 否则我们无法确定你是否希望将这些自定义配置应用到所有 CSS 文件中。
     */
    requireModuleExtension: true,
    /**
     * extract
     * 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
     * 同样当构建 Web Components 组件时它总是会被禁用 (样式是 inline 的并注入到了 shadowRoot 中)。
     * 当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS。
     */
    extract: IS_PROD,
    /**
     * sourceMap
     * 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。
     */
    sourceMap: false,
    /**
     * loaderOptions
     * 像css相关的的loader传递选项
     */
    loaderOptions: {
      // 支持的loader：css-loader、postcss-loader、sass-loader、less-loader、stylus-loader
      css: {
        // 给 css-loader 传递选项
      },
       sass: {
         // 给 sass-loader 传递选项
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        // additionalData: `@import "~@/variables.sass"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      less:{
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: '#fff'
        }
      }
    }
  },
  /**
   * pluginOptions
   * 这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项。
   */
  pluginOptions: {

  },
  /**
   * Vue CLI 使用了 Babel 7 中的新配置格式 babel.config.js。
   * 和 .babelrc 或 package.json 中的 babel 字段不同，这个配置文件不会使用基于文件位置的方案，
   * 而是会一致地运用到项目根目录以下的所有文件，包括 node_modules 内部的依赖。
   * 我们推荐在 Vue CLI 项目中始终使用 babel.config.js 取代其它格式。
   * 
   * 所有的 Vue CLI 应用都使用 @vue/babel-preset-app，它包含了 babel-preset-env、JSX 支持以及为最小化包体积优化过的配置。
   * 通过它的文档可以查阅到更多细节和 preset 选项。
   */
  // Babel: {},
  /**
   * ESLint 可以通过 .eslintrc 或 package.json 中的 eslintConfig 字段来配置。
   */
  // ESLint: {},
  /**
   * TypeScript 可以通过 tsconfig.json 来配置。
   */
  // TypeScript: {},
  /**
   * devServe
   * 有些值像 host、port 和 https 可能会被命令行参数覆写。
   * 有些值像 publicPath 和 historyApiFallback 不应该被修改，因为它们需要和开发服务器的 publicPath 同步以保障正常的工作。
   */
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 8080,
    https: false,
    open: false,
    hotOnly: true,
    /**
     * 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。
     * 这个问题可以通过 vue.config.js 中的 devServer.proxy 选项来配置。devServer.proxy 可以是一个指向开发环境 API 服务器的字符串。
     */
    proxy: {
      '/api': {
        target: '<server url>',
        ws: true, // 支持websocket
        changeOrigin: true, // changeOrigin默认是false：请求头中host仍然是浏览器发送过来的host，如果设置成true：发送请求头中host会设置成target·
        secure: false,
        pathRewrite: {
          '^/api': '/' // rewrite path
        }
      }
    }
  }
};