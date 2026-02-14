import { useUserStore } from '../store/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // загружаем пользователя из cookie, если он ещё не загружен
  if (!userStore.user) {
    userStore.loadUser()
  }

  const isLoginPage = to.path === '/auth'
  const isRegisterPage = to.path === '/register'

  // если юзер уже залогинен
  if (userStore.user) {
    // блокируем доступ к страницам логина и регистрации
    if (isLoginPage || isRegisterPage) {
      return navigateTo('/') // редирект на главную
    }
    return // далее пускаем — залогинен и страница не публичная
  }

  // если пользователь не залогинен...
  const isPublicPage = isLoginPage || isRegisterPage || to.path === '/'
  if (!isPublicPage) {
    // защищённые страницы — редиректим на главную (или '/auth')
    return navigateTo('/auth')
  }
})
