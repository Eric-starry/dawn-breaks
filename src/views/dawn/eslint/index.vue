<template>
  <div class="dawn-eslint">
    <p>Eslint 配置</p>
    <p>第一个坑</p>
    <pre>
      使用eslint + prittier规范代码时，会碰到规则冲突的情况，典型的例子：
      eslint配置 space-before-function-paren 时，需要function和后面的括号之前存在空格，但是prittier却强制不需要空格，导致冲突。
      解决：eslintrc文件下 extend属性去除prittier，只保留 ["plugin:vue/essential", "eslint:recommended"]
    </pre>
  </div>
</template>