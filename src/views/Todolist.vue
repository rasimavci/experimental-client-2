<template>
  <div class="todolist">
    <header>
      <div class="left-btn">
        <i class="iconfont icon-prev" @click="$router.go(-1)"></i>
      </div>
      <span class="title">{{currentFolderName}}</span>
      <div class="right-btn">
        <i v-if="isInputShow" class="iconfont icon-1" @click="newTodoInput"></i>
        <i v-else class="iconfont icon-pen" @click="newTodoInput"></i>
      </div>
    </header>
    <ul class="items">
      <li v-for="item in items" v-finger:long-tap="showDeleteModal" class="item" @click="changeState" :key="item._id" :data-id="item._id" :class="{complete:item.state}">
        {{item.content}}
      </li>
      <li v-show="isInputShow" class="item will-add">
        <input v-model.lazy="newTodoItem">
      </li>
    </ul>
    <delete-modal ref="DeleteModal"></delete-modal>
  </div>
</template>

<script>
import api from '../api/api-config.js'
import { mapGetters } from 'vuex'
import DeleteModal from '../components/DeleteModal'

export default {
  data () {
    return {
      isInputShow: false,
      newTodoItem: '',
      items: []
    }
  },
  components: {
    DeleteModal
  },
  activated () {
    this.isInputShow = false
    this.getFolderContents()
  },
  computed: mapGetters({
    currentFolder: 'getCurrentFolder',
    currentFolderName: 'getCurrentFolderName'
  }),
  watch: {
    newTodoItem () {
      this.newTodo()
    }
  },
  methods: {
    showDeleteModal (e) {
      this.$refs.DeleteModal.isModalShow = true
      this.selectedItem = e.target.dataset.id
    },
    getFolderContents () {
      this.$axios
        .get(api.getListContents + this.currentFolder)
        .then(res => {
          if (res.data.code === 0) {
            this.items = res.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteItem () {
      this.$axios
        .delete(api.deleteList + this.selectedItem)
        .then(res => {
          if (res.data.code === 0) {
            this.getFolderContents()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    newTodoInput () {
      this.isInputShow = !this.isInputShow
      if (this.isInputShow) {
        this.$nextTick(function () {
          document.querySelector('.will-add > input').focus()
        })
      }
    },
    newTodo () {
      if (!this.newTodoItem) return false
      let data = {
        folderId: this.currentFolder,
        content: this.newTodoItem,
        createdate: +new Date()
      }
      this.$axios
        .post(api.newList, data)
        .then(res => {
          if (res.data.code === 0) {
            this.getFolderContents()
            this.newTodoItem = ''
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // Change event status
    changeState (e) {
      this.$axios
        .put(api.changeListItemState + e.currentTarget.dataset.id)
        .then(res => {
          if (res.data.code === 0) {
            this.getFolderContents()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../less/common.less';
header {
  .commonheader(@bgcolor: @main-color, @fontcolor: #fff);
}

.items {
  background-image: url('../assets/line.png');
  background-size: 100vw 60px;
  background-attachment: local;
  max-height: @todolist-container-height;
  overflow-y: scroll;
  position: relative;
  .complete {
    text-decoration: line-through;
  }
  .item {
    width:100%;
    box-sizing: border-box;
    color: @main-color;
    font-size: 20px;
    padding: 0 40px;
    line-height: 60px;
    overflow-wrap: break-word;
    &:before {
      display: inline;
      content: '·';
    }
    input {
      display: inline-block;
      width: 90%;
      color: @main-color;
      font-size: 20px;
      outline: none;
      line-height: 30px;
      border: none;
    }
  }
}
</style>
