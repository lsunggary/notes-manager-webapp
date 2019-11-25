<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>登陆</h1>
                  <!-- <p class="text-muted" v-if="error">{{errorMsg}}</p> -->
                  <p class="text-style" v-show="error">{{errorMsg}}</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="text" class="form-control" :class="nameErrorStyle" @focus="onFocus('name')" placeholder="用户名" autocomplete="username email" v-model="username"/>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password" class="form-control" :class="passwordErrorStyle" @focus="onFocus('password')" placeholder="密码" autocomplete="current-password" v-model="password"/>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="login()">登陆</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0" @click="forgetPassword()">忘记密码?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import config from './../config/config'
const ERROR_STYLE = 'error-style'
const SUCCESS_STYLE = 'success-style'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      error: false,
      errorMsg: '',
      nameErrorStyle: '',
      passwordErrorStyle: '',
    }
  },
  methods: {
    login: function() {
      if (this.username == '') {
        this.setError('账号不能为空', true, ERROR_STYLE, 'name')
        return false
      }
      if (this.password == '') {
        this.setError('密码不能为空', true, ERROR_STYLE, 'password')
        return false
      }
      if (/^[0-9]*$/.test(this.username)) {
        this.setError('账号不能为纯数字', true, ERROR_STYLE, 'name')
        return false
      }
      if (/^[0-9]*$/.test(this.password)) {
        this.setError('密码不能为纯数字', true, ERROR_STYLE, 'password')
        return false
      }
      let loginUrl = config.serverPath+config.loginUrl
      var params = new URLSearchParams()
      params.append('username', (this.username).trim())
      params.append('password', (this.password).trimRight())
      this.$http.post(loginUrl, params)
        .then((res) => {
          if (res.data.code === '401') {
            this.setError(res.data.message, true, ERROR_STYLE, '')
          } else {
            this.$router.push({
              path: '/dashboard?_key=' + res.data.username
            })
          }
        }).catch((e) => { 
          window.alert(e.message)
        })
    },
    forgetPassword: function() {
      window.alert("忘记密码？ 点了也没用，因为没有做^_^")
    },
    onFocus: function(type) {
      this.setError('', false, '', type)
    },
    // checkName: function() {
    //   if (!/^[a-zA-Z][a-zA-Z0-9]{5,11}$/.test(this.username)) {
    //     this.setError("用户必须为英文字母开头，最小不小于6位，最大不超过12位！", true, ERROR_STYLE, 'name')
    //     return false
    //   }
    //   let loginUrl = config.serverPath+config.checkUsername+'?username='+this.username
    //   this.$http.get(loginUrl)
    //     .then((res) => {
    //       if (res.data.code === '401') {
    //         this.setError(res.data.message, true, ERROR_STYLE, 'name')
          // } else if (res.data === 0) {
          //   this.setError('', false, SUCCESS_STYLE, 'name')
          // } else {
          //   this.setError('', true, ERROR_STYLE, 'name')
    //       }
    //     }).catch((e) => { 
    //       window.alert(e.message)
    //     })
    // },
    setError: function(msg, errorStatus, errorStyle, type) {
      this.errorMsg = msg
      this.error = errorStatus
      if (type === 'name') {
        this.nameErrorStyle = errorStyle
      } else if (type === 'password') {
        this.passwordErrorStyle = errorStyle
      } else {
        this.nameErrorStyle = errorStyle
        this.passwordErrorStyle = errorStyle
      }
    }
  }
}
</script>
<style scoped>
  .success-style {
    border-color: aqua;
  }
  .error-style {
    border-color: brown;
  }
  .text-style {
    color:brown;
  }
</style>