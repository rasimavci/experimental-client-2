<template>
    <div>
        <header>
            <div class="left-btn">
                <i class="iconfont icon-prev" @click="$router.go(-1)"></i>
            </div>
            <span class="title">由来</span>
        </header>
        <div class="container">
            <vue-markdown :source="article"></vue-markdown>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import VueMarkdown from 'vue-markdown'
export default {
  components: {
    VueMarkdown
  },
  data () {
    return {
      article: `This application comes from a (once) very hot animated movie, the movie's level is still proportional and popular
Watching the movie when the diary application, could not help but immediately[Imitation of one](https://github.com/ssshooter/MyDiary)，After that I used jquery and learned Vue for some time，The browser side is fairly proficient and starts thinking more about Vue's ecosystem
After reading a variety of information, I find it hard to understand the place or must be understood from practice，So once again remembered MyDiary  
其中不少不熟练的地方，请大家在issues提醒我
这个项目前后端分离，后端使用nodejs和express实现RESTful API（[MyDiary API](https://github.com/ssshooter/MyDiary-API)）
数据库选择了mongoDB，由于对数据库不太熟悉，数据库构建还是有所欠缺      
前端使用了vue全家桶，使用webpack进行打包
## 技术栈
vue2 / vuex / vue-router / webpack / ES6  / less
## The main function
- Phone book, a search function, there is a sidebar alphabetical index
- Charge d'affaires, you can add, delete matters, crossed to complete
- Notebook function, a search function can be
- Small flip calendar
## todo
- [x] Login interface
- [x] Registration interface
- [x] Settings page
- [x] Diary page unlimited scroll page
- [ ] Diary modification function
- [ ] Search function
- [ ] Database structure optimization
- [ ] 交换日记
- [x] 使用electron构建pc端
- [ ] 十分遥远的下一个目标，重构为PWA`
    }
  }
}
</script>
<style lang="less" scoped>
@import '../less/common.less';
header {
  .commonheader(@bgcolor: @main-color, @fontcolor: #fff);
}
.container {
  box-sizing: border-box;
  padding: 50/75rem;
  width: 100vw;
  height: @todolist-container-height;
}
</style>


