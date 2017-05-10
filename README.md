# 用到的技术gulp+less+zepto+template
# 利用gulp编译输出压缩后的代码，包括压缩js,压缩css,压缩图片
# 为文件添加md5时间戳，并替换相应文件（防止浏览器缓存严重现象）
# 通过gulp watch 实时监听文件的改动
# 没有合并js,目的是为了减轻初次加载的时间，个人认为没必要合并js(当然前提是没有用webpack)
# 没有压缩html,考虑到一部分人布局的习惯，空格可能会引起布局的混乱
