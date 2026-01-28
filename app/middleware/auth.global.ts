import { useUserStore } from '../store/user'
export default defineNuxtRouteMiddleware((to, from) => {
 const userStore = useUserStore()

  // Если стор ещё не инициализирован — загружаем юзера из localStorage
  if (!userStore.user) {
    userStore.loadUser()
  }

  // Если пользователь не залогинен — редиректим на /login
  const isPublicPage = ['/auth', '/register'].includes(to.path)
  if (!isPublicPage && !userStore.user) {
    return navigateTo('/auth')
  }
})
