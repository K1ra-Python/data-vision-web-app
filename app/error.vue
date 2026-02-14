<!-- error.vue (в корне проекта) -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      
      <p class="mt-4 text-2xl font-semibold text-gray-800">
        Страница не найдена
      </p>
      
      <p class="mt-4 text-gray-600 max-w-md mx-auto">
        Кажется, вы попали по несуществующей ссылке. 
        Возможно, страница была удалена или перемещена.
      </p>

      <div class="mt-10">
        <NuxtLink 
          to="/" 
          class="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Вернуться на главную
        </NuxtLink>
      </div>
    </div>

    <!-- Можно добавить милую картинку или анимацию -->
    <div class="mt-12 opacity-70">
      <img 
        src="https://illustrations.popsy.co/white/lost-online.svg" 
        alt="Страница потерялась" 
        class="w-64 h-64 object-contain"
      >
    </div>
  </div>
</template>

<script setup>
// Здесь можно использовать composition API как угодно

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

// Можно смотреть на код ошибки
const is404 = props.error?.statusCode === 404
const is500 = props.error?.statusCode === 500

// Пример: можно логировать или отправлять в sentry
// onMounted(() => {
//   if (process.client) {
//     console.error('Произошла ошибка:', props.error)
//   }
// })
</script>

<style scoped>
/* ваши стили, если нужно */
</style>