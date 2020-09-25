<template>
  <div class="dawn-git">
    <p>学习记录之Git篇</p>
    <div>
      <p>Git是什么</p>
      <p>
        一个分布式版本控制系统，和SVN类似，但远比SVN强大的一个版本控制系统 
        ①Git可以方便的在本地进行版本管理，如同你本地有一个版本管理服务器一样,我们可以选择在合适的时间将本地版本推送到统一的版本管理服务器
        ②Git每次会提取整个代码仓库的完整镜像，相当于对整个代码仓库都进行了一次备份，这样即使版本服务器除了问题，我们可以直接采用本地仓库恢复！结合本地版本管理功能，远程版本管理服务器出问题了，我们依然能继续写自己的代码，当他恢复的时候我们再提交我们的本地版本！ Git研发初期是为了更好的管理Linux内核，不过现在已经广泛应用于各种项目中。
      </p>
      <p>Git安装</p>
      <p>
        如果你的系统是Linux的话，直接打开shell输入:sudo apt-get install git
        当然，大部分的系统估计都是Windows，这就需要我们到网上下载一个Git For Window了，可到下述网站下载，点击 Download，跳转到 Github ，下载对应安装包即可！
        <a href="https://git-for-windows.github.io/">git下载</a>
      </p>
      <p>Git配置</p>
      <p>
        Step 1：先配置下我们的身份吧，这样在提交代码的时候Git就可以知道是谁提交的，命令如下：
        ( 检查一下用户名和邮箱是否配置：git config --global --list)
        git config --global user.name "your name"
        git congif --global user.email "your email"

        Step 2：SSH配置

        1. 查看是否已经有了ssh密钥：cd ~/.ssh
        如果没有密钥则不会有此文件夹，有则备份删除

        2. 生成密钥： ssh-keygen -t rsa -C "your email"
        ( 密钥类型可以用 -t 选项指定。如果没有指定则默认生成用于SSH-2的RSA密钥。这里使用的是rsa。)
        ( 同时在密钥中有一个注释字段，用-C来指定所指定的注释，可以方便用户标识这个密钥，指出密钥的用途或其他有用的信息。所以在这里输入自己的邮箱或者其他都行。)
        ( 输入完毕后程序同时要求输入一个密语字符串(passphrase)，空表示没有密语。接着会让输入2次口令(password)，空表示没有口令。)
        按3个回车，表示密码为空，最后得到了两个文件：id_rsa和id_rsa.pub（一般在自己用户文件夹下）

        3. 添加密钥到ssh
        登录github。打开setting->SSH keys，点击右上角 New SSH key，把生成好的公钥id_rsa.pub放进 key输入框中，再为当前的key起一个title来区分每个key。

        4. 测试是否添加配置成功
        ssh 你的git地址（eg: git@github.com）
      </p>
    </div>
    <a-tabs v-model="current">
      <a-tab-pane v-for="item in pages" :key="item.name" :tab="item.title">
        <keep-alive>
          <component :is="current"></component>
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import primary from './components/primary.vue';
import intermediate from './components/intermediate.vue';
import advanced from './components/advanced.vue';
export default {
  components: {
    'primary': primary,
    'intermediate': intermediate,
    'advanced': advanced
  },
  data () {
    return {
      current: '',
      pages: []
    };
  },
  created () {
    const modules = require.context('./components', true, /\.vue$/);
    const pagesArr = modules.keys().map(page => {
      const name = page.replace(/^\.\/(.*)\.\w+$/, '$1');
      return {
        name: name,
        title: name
      };
    });
    this.pages = pagesArr;
    this.current = this.pages[0].name;
  }
};
</script>