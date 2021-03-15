<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginFormData.username" placeholder="Username" name="username" type="text" tabindex="1" autocomplete="on" />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="passwordInputRef"
              v-model="loginFormData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.capture="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter="handleLogin"
            />
            <span class="show-pwd" @click="showPassword = !showPassword">
              <svg-icon :icon-class="showPassword ? 'eye-open' : 'eye'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">Login</el-button>

        <div style="position:relative">
          <div class="tips">
            <span>Username : admin</span>
            <span>Password : any</span>
          </div>
          <div class="tips">
            <span style="margin-right:18px;">Username : editor</span>
            <span>Password : any</span>
          </div>

          <el-button class="thirdparty-button" type="primary" @click="showDialog = true">
            Or connect with
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { validUsername } from '@/utils/validate'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Login',
  setup() {
    const loginFormData = reactive({
      username: 'admin',
      password: '111111'
    })
    const validateUsername = (rule: any, value: string, callback: Function) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule: any, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const loginFormRules = {
      username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      password: [{ required: true, trigger: 'blur', validator: validatePassword }]
    }
    const loginFormRef = ref<any>(null)

    const loading = ref<boolean>(false)

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const getOtherQuery = (query: any) => {
      return Object.keys(query).reduce((acc: any, cur: any) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    const redirect: any = route.query.redirect

    const handleLogin = () => {
      //
      loginFormRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true
          store
            .dispatch('user/login', loginFormData)
            .then(() => {
              router.push({ path: redirect || '/', query: getOtherQuery(route.query) })
              loading.value = false
            })
            .catch(() => {
              loading.value = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    const capsTooltip = ref<boolean>(false)

    const checkCapslock = (e: any) => {
      console.log(e)

      const { key } = e
      capsTooltip.value = key && key.length === 1 && key >= 'A' && key <= 'Z'
    }

    const showPassword = ref<boolean>(false)

    // onMounted(() => {
    //   window.addEventListener('keyup', checkCapslock, true)
    // })

    // onBeforeUnmount(() => {
    //   window.removeEventListener('keyup', checkCapslock, true)
    // })

    return {
      loginFormRef,
      loginFormData,
      loginFormRules,
      loading,
      handleLogin,
      capsTooltip,
      showPassword,
      checkCapslock
    }
  }
})
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
