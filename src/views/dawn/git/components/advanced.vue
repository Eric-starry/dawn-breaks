<template>
  <div class="dawn-git-primary">
    <p>高级篇 -> 远程库操作</p>
    <p>
      标签管理：
      发布一个版本时，我们通常先在版本库中打一个标签（tag），这样，就唯一确定了打标签时刻的版本。
      将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。
      Git的标签虽然是版本库的快照，但其实它就是指向某个commit的指针（跟分支很像对不对？但是分支可以移动，标签不能移动），所以，创建和删除标签都是瞬间完成的。
      问：Git有commit，为什么还要引入tag。
      答：tag就是一个让人容易记住的有意义的名字，它其实是跟某个commit绑在一起。
    </p>
    <p>
      // 查看标签
      git tag

      // 创建标签
      // 默认标签是打在最新提交的commit上
      // 在指定的commit版本上打标签
      git tag v1.0
      git tag v0.9 commit_id

      // 查看某个标签详细信息
      git show v0.9

      // 删除标签
      git tag -d v0.1

      // 推送标签到远程
      // --tags，一次性推送本地全部标签到远程
      git push origin v1.0
      git push origin --tags

      // 从远程删标签
      git push origin :refs/tags/v0.9
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    };
  }
};
</script>