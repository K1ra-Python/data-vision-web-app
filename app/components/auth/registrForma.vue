<
<template>
  <div>
    <div>
    <h1>Users</h1>
    <ul v-if="users?.length">
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
    <p v-else>No users yet.</p>
  </div>
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
const { data: users } = await useFetch('/api/users')
const submit = () => {
  console.log({ email: email.value, password: password.value })
  // здесь вызов API для регистрации
  
}
</script>

<style></style>
