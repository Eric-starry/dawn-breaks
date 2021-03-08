// var AssetsPlugin = require("assets-webpack-plugin");
// var AssetsManifest = require("webpack-assets-manifest");
// var Mock = require("mockjs");
// var jsonfile = require("jsonfile");
// var path = require("path");
// var url = require("url");
// var _perms = require("./mockDatas/skyeye._perms.json");
// var leadOption = require("./dev_custom_config.js");
// var _ = require("lodash");

// module.exports = (options, req) => {
//   const isPro = options.mode === "production";
//   const isPlugin = options.otf == "plugin";
//   const cusOption = options.cusOption
//     ? eval("[" + options.cusOption + "]")[0]
//     : {};
//   const inHtmlOption = {
//     title: isPro ? "{{title}}" : "本地调试",
//     description: "",
//     token: "{{session.csrf_token}}",
//     filename: "../templates/window.html",
//     isPro,
//     leadOption
//   };
//   return _.merge(
//     {
//       env: {
//         OUTPUT_TYPE_FLAG: isPro
//           ? isPlugin
//             ? "plugin"
//             : "standard"
//           : leadOption.devFlag || "plugin"
//       },
//       pages: {
//         [leadOption.moduleName]: {
//           entry: "./src/main.js",
//           html: isPro
//             ? isPlugin
//               ? _.merge(inHtmlOption, { inject: false, isPlugin })
//               : false
//             : inHtmlOption
//         }
//       },
//       vendor: false,
//       dist: `./dist/${isPro && isPlugin ? "plugin" : "standard"}/static`,
//       homepage: isPro
//         ? isPlugin
//           ? `/static/plugin/xenadmin_${leadOption.moduleName}/${leadOption.moduleName}`
//           : `/static/standard/${leadOption.moduleName}`
//         : `/static/${leadOption.moduleName}`,
//       removeDist: isPro ? true : false,
//       restartOnFileChanges: ["dev_custom_config.js"],
//       templateCompiler: true,
//       port: leadOption.devServerPort || 5000,
//       babel: {
//         babelrc: false,
//         cacheDirectory: true,
//         presets: ["es2015", "stage-3"],
//         plugins: [
//           "add-module-exports",
//           "jsx-v-model",
//           "transform-vue-jsx",
//           [
//             "transform-object-rest-spread",
//             {
//               useBuiltIns: true
//             }
//           ],
//           [
//             "transform-runtime",
//             {
//               polyfill: false,
//               regenerator: true
//             }
//           ],
//           "syntax-dynamic-import"
//         ]
//       },
//       presets: [],
//       webpack(config, webpack) {
//         if (isPro) {
//           config.plugins.push(
//             new AssetsPlugin({
//               useCompilerPath: true,
//               filename: "build-assets.json",
//               prettyPrint: true,
//               includeAllFileTypes: false,
//               fileTypes: ["js", "css"]
//             })
//           );
//           config.plugins.push(
//             new AssetsManifest({ output: "build-assets-manifest.json" })
//           );
//           config.devtool = "hidden-source-map";
//           config.optimization.minimizer[0].options.uglifyOptions.compress.drop_console = true;
//         }
//         return config;
//       },
//       chainWebpack(config, webpack) {
//         config.resolve.alias.set("PLUGINS", "@/3rd"),
//           config.resolve.alias.set("COMMONS", "@/commons");
//         config.resolve.alias.set("COMPONENTS", "@/components");
//         config.resolve.alias.set("RESOURCE", "@/assets");
//         config.resolve.alias.set("UTIL", "@/util");
//         config.module
//           .rule("html")
//           .test(/\.html$/)
//           .use("html-loader")
//           .loader("html-loader");
//       },
//       devServer: {
//         before: function(app) {
//           app.use(function(req, res, next) {
//             var reqPath = req.path,
//               reqMethod = req.method.toLowerCase();
//             try {
//               var apiJson = jsonfile.readFileSync(
//                 path.resolve(
//                   __dirname,
//                   `./mockDatas/${reqPath
//                     .substring(1)
//                     .split("/")
//                     .join(".")}.json`
//                 )
//               );
//               if (apiJson && apiJson[reqMethod]) {
//                 var respData = apiJson[reqMethod];
//                 if (
//                   (respData.hasOwnProperty("isSpecial") &&
//                     !!respData.isSpecial) ||
//                   leadOption.localMockData
//                 ) {
//                   if (reqPath == "/skyeye/_perms") {
//                     var pids = [],
//                       _permsClone = _.cloneDeep(
//                         respData["content"][respData["use"]]
//                       );
//                     _permsClone.data.forEach(function(perm) {
//                       if (!perm.hasOwnProperty("plugin") || !perm["plugin"])
//                         perm.plugin = "standard";
//                       if (!perm.hasOwnProperty("need_request"))
//                         perm.need_request = 0;
//                       if (
//                         perm.level == 1 &&
//                         leadOption.appModules[perm.name] &&
//                         !!leadOption.appModules[perm.name].isPlugin
//                       ) {
//                         pids.push(perm.id);
//                         perm.need_request = 1;
//                         perm.plugin = `${perm.name}`;
//                         perm.url = `/skyeye/home/plugin/${leadOption.tagCode}/${
//                           leadOption.customCode
//                         }/${perm.url.replace("/skyeye/", "")}`;
//                       } else {
//                         if (perm.level > 1 && pids.indexOf(perm.pid) != -1) {
//                           pids.push(perm.id);
//                           perm.need_request = 0;
//                           perm.plugin = `${perm.name}`;
//                           perm.url = `/skyeye/home/plugin/${
//                             leadOption.tagCode
//                           }/${leadOption.customCode}/${perm.url.replace(
//                             "/skyeye/",
//                             ""
//                           )}`;
//                         }
//                       }
//                     });
//                     pids = null;
//                     res.json(_permsClone);
//                   } else {
//                     res.json(Mock.mock(respData["content"][respData["use"]]));
//                   }
//                 } else {
//                   next();
//                 }
//               } else {
//                 next();
//               }
//             } catch (err) {
//               next();
//             }
//           });
//         },
//         proxy: [
//           {
//             target: "http://localhost:8970",
//             changeOrigin: true,
//             agent: false,
//             logLevel: "debug",
//             context: _.concat(
//               [
//                 "**",
//                 "!/",
//                 "!/skyeye/home/404",
//                 "!/skyeye/home/login",
//                 "!**/js/*.js",
//                 "!**/js/*.js.map",
//                 "!**/css/*.css",
//                 "!**/*.html",
//                 `!**/${leadOption.moduleName}/**/assets/**`,
//                 `!**/${leadOption.moduleName}/**/images/**`,
//                 `!/static/standard/${leadOption.moduleName}/**`
//               ],
//               _.map(
//                 _perms["get"]["content"][_perms["get"]["use"]].data,
//                 function(perm) {
//                   if (
//                     !(
//                       perm.level == 1 &&
//                       leadOption.appModules[perm.name] &&
//                       !!leadOption.appModules[perm.name].isPlugin
//                     )
//                   ) {
//                     return "!" + perm.url.replace("/skyeye", "/skyeye/home");
//                   }
//                 }
//               ).filter(function(item) {
//                 return !!item;
//               })
//             )
//           }
//         ]
//       }
//     },
//     cusOption
//   );
// };
