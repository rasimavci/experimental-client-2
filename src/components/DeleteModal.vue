<template>
  <transition name="fade">
    <div v-show="isModalShow">
      <div class="mask" v-finger:tap="toggle">
        <div class="modal">
          <p>Are you sure to delete?</p>
          <div>
            <button v-finger:tap="yes">Ok</button>
            <button v-finger:tap="no">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      isModalShow: false,
      contact: '',
      number: '',
      initial: ''
    }
  },
  watch: {},
  computed: mapGetters({
    currentFolder: 'getCurrentFolder'
  }),
  methods: {
    toggle (e) {
      console.log(e.target.className)
      if (e.target.className === 'mask') this.isModalShow = !this.isModalShow
    },
    yes () {
      this.$parent.deleteItem()
      this.isModalShow = !this.isModalShow
    },
    no () {
      this.isModalShow = !this.isModalShow
    }
  }
}
</script>
<style lang="less" scoped>
@import '../less/common.less';
.mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal {
  box-sizing: border-box;
  padding: 0 20px;
  width: 180px;
  height: 100px;
  background-color: #fff;
  color: @main-color;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  input,
  button {
    height: 30px;
    line-height: 30px;
    margin: 2px;
    border: 1px solid @main-color;
  }
  input {
    width: 180px;
    padding: 0 20px;
    color: @main-color;
  }
  button {
    margin-top: 10px;
    width: 50px;
    background-color: @main-color;
    color: #fff;
  }
}
</style>
