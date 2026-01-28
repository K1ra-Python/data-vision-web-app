// ~/app/store/user.ts
import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | { id: string; email: string; name?: string },
  }),

  actions: {
    // Сохраняем юзера и куку
    setUser(user: { id: string; email: string; name?: string }) {
      this.user = user
      const userCookie = useCookie('user', { sameSite: 'lax' })
      userCookie.value = JSON.stringify(user)
    },

    // Загружаем юзера из куки
    loadUser() {
      const userCookie = useCookie('user', { sameSite: 'lax' })
      if (userCookie.value) {
        try {
          this.user = JSON.parse(userCookie.value)
        } catch (err) {
          console.warn('Ошибка парсинга куки user:', err)
          this.user = null
        }
      }
    },

    // Выход
    logout() {
      this.user = null
      const userCookie = useCookie('user', { sameSite: 'lax' })
      userCookie.value = null
    },
  },
})
