<template>
  <div>
    <header>
      <div class="left-btn">
        <i class="iconfont icon-prev" @click="$router.go(-1)"></i>
      </div>
      <span class="title">Help</span>
    </header>
    <div class="container">
      <h1>The main function</h1>
      <ul>
        <li>Journal</li>
        <li>TO do</li>
        <li>phone book</li>
      </ul>
      <h1>The main operation</h1>
      <ul>
        <li>Click OK</li>
        <li>Long press delete</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
@import '../less/common.less';
header {
  .commonheader(@bgcolor: @main-color, @fontcolor: #fff);
}
.container {
  box-sizing: border-box;
  padding: 5% 10%;
}
</style>


