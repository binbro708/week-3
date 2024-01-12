<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <h1 class="h3 mb-3 font-weight-normal d-flex justify-content-center">
        請先登入
      </h1>
      <div class="col-8">
        <form id="form" class="form-signin">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              required
              autofocus
              v-model="params.username"
            />
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
              v-model="params.password"
            />
            <label for="password">Password</label>
          </div>
          <button
            class="btn btn-lg btn-primary w-100 mt-3"
            type="submit"
            @click.prevent="submit"
            :disabled="isLogin || !isValid"
          >
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted d-flex justify-content-center">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
//登入中
const isLogin = ref(false);

const params = ref({
  username: "",
  password: "",
});

//帳號密碼都有填
const isValid = computed(() => {
  return !!params.value.username && !!params.value.password;
});

//登入
function submit() {
  isLogin.value = true;

  axios
    .post("https://vue3-course-api.hexschool.io/v2/admin/signin", params.value)
    .then((res) => {
      //只把要的屬性解出來
      const { token, expired } = res.data;
      //把token加入cookies並設置過期時間
      document.cookie = `token=${token};expires=${new Date(expired)};`;
      //導去後台
      router.push("/products");
    })
    .catch((err) => {
      isLogin.value = false;
      alert(err.response.data.message);
    });
}
</script>

<style scoped>
html,
body {
  height: 100%;
  text-align: center;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>
