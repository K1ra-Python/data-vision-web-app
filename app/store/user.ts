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
  const val = userCookie.value

  if (!val) {
    this.user = null
    return
  }

  // Если это уже объект — просто присвоить
  if (typeof val === 'object') {
    this.user = val
    return
  }

  try {
    this.user = JSON.parse(val)
  } catch (err) {
    console.warn('Ошибка парсинга куки user:', err)
    this.user = null
  }
}
,

    // Выход
    logout() {
      this.user = null
      const userCookie = useCookie('user', { sameSite: 'lax' })
      userCookie.value = null
    },
  },
})
