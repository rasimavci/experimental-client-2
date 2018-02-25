<template>
  <div class="login">
    <img class="logo" src="../assets/logo.png">
    <input v-model="username" placeholder="please enter user name">
    <input v-model="password" type="password" placeholder="Please enter the password">
    <button v-if="!isRegister" @click="login">Login</button>
    <button v-else @click="register">Registered</button>
    <p v-if="!isRegister" @click="isRegister=!isRegister">I do not have an account click register</p>
    <p v-else @click="isRegister=!isRegister">I already have an account click register</p>
  </div>
</template>
<script>
import api from '../api/api-config'

export default {
  data () {
    return {
      username: '',
      password: '',
      isRegister: false
    }
  },
  methods: {
    login () {
      var data = {
        name: this.username,
        password: this.password
      }
      this.$axios.post(api.login, data)
        .then(res => {
          if (res.data.code === 0) {
            this.$router.replace('home')
          }
        })
        .catch(function (error) {
          alert(error)
        })
    },
    register () {
      var data = {
        name: this.username,
        password: this.password
      }
      this.$axios.post(api.register, data)
        .then(res => {
          if (res.data.code === 1 && res.data.err.code === 11000) {
            alert('Username has been used...')
          }
          if (res.data.code === 0) {
            this.$router.replace('home')
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
.login {
  background-image: url('../assets/63524818_p0.png');
  background-size: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo,
  input,
  button,
  p {
    width: 250px;
  }
  input,
  button {
    height: 40px;
    font-size: 20px;
    margin-top: 10px;
  }
  input {
    box-sizing: border-box;
    padding: 0 15px;
    border: none;
    background-color: #fff;
    border-radius: 5px;
  }
  button {
    border: none;
    background-color: #4582ff;
    color: #fff;
    border-radius: 50px;
  }
  p {
    color: #fff;
    margin-top: 10px;
    text-align: right;
  }
}
</style>
