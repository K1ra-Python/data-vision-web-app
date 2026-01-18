<
<template>
  <div>
    <form>
      <input v-model="email" placeholder="EMAIL" required type="email" />email
      <input
        v-model="password"
        placeholder="PASSWORD"
        required
        type="password"
      />pass
      <button type="submit" @click="submit">send</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
const email = ref("");
const password = ref("")
const submit = () => {
  console.log({ email: email.value, password: password.value })
  // здесь вызов API для регистрации
}
</script>

<style></style>
