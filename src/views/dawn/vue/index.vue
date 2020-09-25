<template>
  <div class="dawn-vue">
    <p>vue的成长之路</p>
    <div class="dawn-vue-content">
      <div class="dawn-content-side">
        <p v-for="comp in comps" :key="comp">
          <span @click="click(comp)">{{comp}}</span>
        </p>
      </div>
      <div class="dawn-content-main">
        <div>
          <p>@vue/cli</p>
          <pre>
            Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统，提供：

            通过 @vue/cli 实现的交互式的项目脚手架。
            通过 @vue/cli + @vue/cli-service-global 实现的零配置原型开发。
            一个运行时依赖 (@vue/cli-service)，该依赖：
            可升级；
            基于 webpack 构建，并带有合理的默认配置；
            可以通过项目内的配置文件进行配置；
            可以通过插件进行扩展。
            一个丰富的官方插件集合，集成了前端生态中最好的工具。
            一套完全图形化的创建和管理 Vue.js 项目的用户界面。
            Vue CLI 致力于将 Vue 生态中的工具基础标准化。它确保了各种构建工具能够基于智能的默认配置即可平稳衔接，这样你可以专注在撰写应用上，而不必花好几天去纠结配置的问题。
            与此同时，它也为每个工具提供了调整配置的灵活性，无需 eject。

            CLI (@vue/cli) 是一个全局安装的 npm 包，提供了终端里的 vue 命令。它可以通过 vue create 快速搭建一个新项目，或者直接通过 vue serve 构建新想法的原型。
            你也可以通过 vue ui 通过一套图形化界面管理你的所有项目。
          </pre>
          <p>安装</p>
          <pre>
            Vue CLI 的包名称由 vue-cli 改成了 @vue/cli。 如果你已经全局安装了旧版本的 vue-cli (1.x 或 2.x)，你需要先通过 npm uninstall vue-cli -g 或 yarn global remove vue-cli 卸载它。

            npm install -g @vue/cli
            # OR
            yarn global add @vue/cli

            你可以用这个命令来检查其版本是否正确
            vue --version

            npm update -g @vue/cli

            # 或者
            yarn global upgrade --latest @vue/cli

            上面列出来的命令是用于升级全局的 Vue CLI。如需升级项目中的 Vue CLI 相关模块（以 @vue/cli-plugin- 或 vue-cli-plugin- 开头），请在项目目录下运行 vue upgrade
            用法： upgrade [options] [plugin-name]

            （试用）升级 Vue CLI 服务及插件

            选项：
              -t, --to version    升级 plugin-name 到指定的版本
              -f, --from version  跳过本地版本检测，默认插件是从此处指定的版本升级上来
              -r, --registry url  使用指定的 registry 地址安装依赖
              --all                 升级所有的插件
              --next                检查插件新版本时，包括 alpha/beta/rc 版本在内
              -h, --help            输出帮助内容
          </pre>
        </div>
        <keep-alive>
          <component :is="current"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import navigetionGuard from './components/navigetion-guard.vue';
import newProject from './components/new-project.vue';
import vueRouter from './components/vue-router.vue';
export default {
  components: {
    'navigetion-guard': navigetionGuard,
    'new-project': newProject,
    'vue-router': vueRouter
  },
  data () {
    return {
      current: 'new-project',
      comps: ['new-project', 'vue-router', 'navigetion-guard']
    };
  },
  methods: {
    click (name) {
      this.current = name;
    }
  }
};
</script>