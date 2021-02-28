// const webpack = require("webpack");
const path = require("path");
// const fs = require("fs")
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const jsonfile = require("jsonfile"); // jsonfile.js
const Mock = require("mockjs");
const resolve = dir => path.join(__dirname, dir);

// gzip --start
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzip = true; // 是否使用gzip
const productionGzipExtensions = ["js", "css"]; // 需要gzip压缩的文件后缀
// gzip --end
const externals = {
  // vue: "Vue",
  // "vue-router": "VueRouter",
  // vuex: "Vuex",
  // axios: "axios",
  // "element-ui": "ELEMENT",
  "js-cookie": "Cookies",
  nprogress: "NProgress"
};
const cdn = {
  // 开发环境
  dev: {
    css: [
      "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
      "https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css"
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
      "https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css"
    ],
    js: [
      "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js",
      "https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js",
      "https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js",
      "https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js",
      "https://unpkg.com/element-ui/lib/index.js",
      "https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js",
      "https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js"
    ]
  }
};
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/site/vue-demo/" : "/", // 公共路径
  indexPath: "index.html", // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  transpileDependencies: ['element-ui'],  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  configureWebpack: config => {
    console.log(process);
    const myConfig = {};
    if (process.env.NODE_ENV === "production") {
      // 1. 生产环境npm包转CDN
      myConfig.externals = externals;
      myConfig.plugins = [];
      // gzip
      // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      productionGzip &&
        myConfig.plugins.push(
          new CompressionWebpackPlugin({
            test: new RegExp(
              "\\.(" + productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 8192,
            minRatio: 0.8
          })
        );
      // 去掉注释
      // myConfig.plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       output: {
      //         comments: false, // 去掉注释
      //       },
      //       compress: {
      //         warnings: false,
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ['console.log']//移除console
      //     }
      //     }
      //   })
      // )
    }
    if (process.env.NODE_ENV === "development") {
      /**
       * 关闭host check，方便使用ngrok之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true
      };
    }
    return myConfig;
  },
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    // if (process.env.npm_config_report) {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }
    config.resolve.alias // 添加别名
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@components", resolve("src/components"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"));
    // 图片打包
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
        // mozjpeg: { progressive: true, quality: 65 },
        // optipng: { enabled: false },
        // pngquant: { quality: '65-90', speed: 4 },
        // gifsicle: { interlaced: false },
        // webp: { quality: 75 }
      });
    config.plugin('webpack-bundle-analyzer')
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin); 
    // 使用cdn
    // config.plugin("html").tap(args => {
    //   if (process.env.NODE_ENV === "production") {
    //     args[0].cdn = cdn.build;
    //   }
    //   if (process.env.NODE_ENV === "development") {
    //     args[0].cdn = cdn.dev;
    //   }
    //   return args;
    // });

    // 打包分析
    // if (IS_PROD) {
    //   config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
    //     {
    //       analyzerMode: "static"
    //     }
    //   ]);
    // }
  },
  // css: {
  //   extract: IS_PROD,
  //   requireModuleExtension: false,// 去掉文件名中的 .module
  //   loaderOptions: {
  //     // 给 less-loader 传递 Less.js 相关选项
  //     less: {
  //       // `globalVars` 定义全局对象，可加入全局变量
  //       globalVars: {
  //         primary: '#333'
  //       }
  //     }
  //   }
  // },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       include: [resolve('src'), resolve('test'),resolve('/node_modules/element-ui/src'),resolve('/node_modules/element-ui/packages')]
  //     }
  //   ]
  // },
  devServer: {
    before: function (app) {
      app.use(function (req, res, next) {
        var reqPath = req.path;
        // var reqMethod = req.method.toLowerCase();
        try {
          var apiJson = jsonfile.readFileSync(
            // 读取文件
            path.resolve(
              __dirname,
              `./mock/${reqPath
                .substring(1)
                .split("/")
                .join(".")}.json`
            )
          );
          if (apiJson) {
            var respData = apiJson["data"];
            res.json(Mock.mock(respData));
          } else {
            next();
          }
        } catch (err) {
          next();
        }
      });
    },
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    hotOnly: true, // 热更新
    // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
    proxy: {
      //配置多个跨域
      "/api": {
        target: "http://172.11.11.11:7071",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": "/"
        }
      },
      "/api2": {
        target: "http://172.12.12.12:2018",
        changeOrigin: true,
        //ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api2": "/"
        }
      }
    }
  }
};
