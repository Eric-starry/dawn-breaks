<template>
  <div class="dawn-git-primary">
    <p>初级篇 -> 创建本地库</p>
    <p>
      创建一个版本库非常简单，首先，选择一个合适的地方，创建一个空目录：
      <pre>
        mkdir learngit
        cd learngit
        pwd
        pwd命令用于显示当前目录
      </pre>
    </p>
    <pre>
      第二步，通过git init命令把这个目录变成Git可以管理的仓库：
      git init
      Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支master，以及指向master的一个指针叫HEAD。
    </pre>
    <pre>
      使用Windows的童鞋要特别注意：
      千万不要使用Windows自带的记事本编辑任何文本文件。
      原因是Microsoft开发记事本的团队使用了一个非常弱智的行为来保存UTF-8编码的文件，他们自作聪明地在每个文件开头添加了0xefbbbf（十六进制）的字符，
      你会遇到很多不可思议的问题，比如，网页第一行可能会显示一个“?”，明明正确的程序一编译就报语法错误，等等，都是由记事本的弱智行为带来的。
      建议你下载Notepad++代替记事本，不但功能强大，而且免费！记得把Notepad++的默认编码设置为UTF-8 without BOM即可
    </pre>
    <pre>
      常用命令：
      // 添加某个文件时，该文件必须在当前目录下存在，用ls或者dir命令查看当前目录的文件，看看文件是否存在，或者是否写错了文件名。
      // git add 实际上是将当前工作区的修改提交到暂存区
      git add 文件名（eg:readme.txt）

      // 添加当前目录下的所有文件
      git add .

      // 提交文件，-m添加备注，-n忽略代码检测，-m, -n可选
      // git commit 实际上就是把暂存区的所有内容提交到当前分支。
      // 创建Git版本库时，Git自动为我们创建了唯一一个master分支，所以，现在，git commit就是往master分支上提交更改。
      git commit -m "我是一个备注" -n
      
      // 查看仓库的状态
      git status

      // 查看某个文件的修改，版本id指查看哪个版本的修改，HEAD指当前版本
      git diff 版本id -- 文件名
      git diff HEAD -- readme.txt
      // 查看所有修改
      git diff

      // 查看提交记录，git log:查看历史版本，git reflog：查看未来版本
      git log
      git reflog

      // 回退到上一个版本，HEAD指向当前版本
      // 回到指定版本 commit_id：指定版本的id，git log查看
      git reset --hard HEAD
      git reset --hard commit_id

      // 丢弃工作区的修改
      // git checkout -- readme.txt 意思就是，把readme.txt文件在工作区的修改全部撤销
      // 两种情况：
      // 1. 自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态
      // 2. 已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。
      // 总之，就是让这个文件回到最近一次git commit或git add时的状态。
      git checkout -- 文件名
      git checkout -- readme.txt

      // 撤销暂存区的修改
      // git reset HEAD 文件名 可以把暂存区的修改撤销掉（unstage），重新放回工作区
      git reset HEAD readme.txt
    </pre>
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