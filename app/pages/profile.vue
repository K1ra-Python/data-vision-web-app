<template>
  <div class="profile-page">
    <h1>Профиль</h1>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Name:</strong> {{ user.name }}</p>
    </div>
  
    <div v-else>
      <p>Пользователь не найден. Войдите, пожалуйста.</p>
    </div>
      <div class="logout">
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../store/user'

const userStore = useUserStore()

// reactive ссылка на пользователя
const user = userStore.user
const logout = () => {
  userStore.logout()   // очищаем стор и куки
  navigateTo('/auth')    // редирект на страницу авторизации
}
watch(
  () => userStore.user,
  (user) => {
    if (!user) {
      navigateTo('/auth')
    }
  }
)
</script>
