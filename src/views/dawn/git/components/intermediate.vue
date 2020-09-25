<template>
  <div class="dawn-git-primary">
    <p>中级篇 -> 远程库操作</p>
    <p>
      此处假设你已经拥有一个GitHub账号
      你已经在本地创建了一个Git仓库后，又想在GitHub创建一个Git仓库，并且让这两个仓库进行远程同步，这样，GitHub上的仓库既可以作为备份，又可以让其他人通过该仓库来协作。
    </p>
    <p>
      登陆GitHub，然后，在右上角找到“Create a new repo”按钮，创建一个新的仓库
      // Step 1：关联远程库
      git remote add origin 你的远程库

      // Step 2：把本地库内容推送到远程库
      // 首次推送，加上了-u参数， Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。
      git push -u origin master

      // 克隆远程库代码
      git clone git库地址

      // 解除与远程库的关联
      git remote rm origin

      // 新建本地分支并切换到新建分支
      // 也可以使用 git switch -c dev
      // 以下命令其实是 git branch dev 和 git checkout dev 的简写
      git checkout -b dev

      // 查看本地分支
      // 当前分支前面会标一个*号。
      git branch

      // git merge 命令用于合并指定分支到当前分支。
      // 把dev分支的工作成果合并到master分支上
      // 记得先从dev分支切换到master分支再执行git merge dev
      // --no-ff参数，表示禁用Fast forward，在Fast forward模式下合并分支，删除分支后，会丢掉分支信息
      // 合并成功后会自动创建一个提交
      // 存在冲突时，先解决冲突，再提交
      git merge dev
      git merge --no-ff -m "merge with no-ff" dev

      // 删除本地分支 
      // 丢弃一个没有被合并过的分支，-D 强行删除
      git branch -d 分支名
      git branch -D 分支名

      // 把当前工作现场“储藏”起来，等以后恢复现场后继续工作
      // git stash list 命令查看存储的工作现场
      // git stash pop 恢复的同时把stash内容也删除
      // git stash apply恢复，但是恢复后，stash内容并不删除，你需要用git stash drop来删除
      // git stash apply stash@{0} 恢复指定工作现场
      git stash
      git stash list
      git stash pop
      git stash apply stash@{0}

      // merge某次修改
      // 例如在master上有多次提交修改，现在要在dev上同步某次修改，可以使用下面命令（记得先切换到dev分支）
      git cherry-pick commit_id

      // 查看关联的远程库
      // -v查看远程库更详细的信息
      // eg：一个详细信息，origin  git@github.com:michaelliao/learngit.git (fetch)，fetch说明有拉取权限
      git remote
      git remote -v

      // 创建远程origin的dev分支到本地
      git checkout -b dev origin/dev

      // git pull提示no tracking information，则说明本地分支和远程分支的连接关系没有创建
      // 本地dev分支与远程origin/dev分支的链接，设置dev和origin/dev的连接
      git branch --set-upstream-to=origin/dev dev

      // rebase操作可以把本地未push的分叉提交历史整理成直线
      git rebase

      
      // 分支规则
      master分支是主分支，因此要时刻与远程同步；
      dev分支是开发分支，团队所有成员都需要在上面工作，所以也需要与远程同步；
      bug分支只用于在本地修复bug，就没必要推到远程了，除非老板要看看你每周到底修复了几个bug；
      feature分支是否推到远程，取决于你是否和你的小伙伴合作在上面开发。

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