<template>
  <div class="login-form">
    <form @submit.prevent="submit">
      <!-- Email -->
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="form.email"
          placeholder="Email"
          type="email"
          :class="{ 'input-error': v$.email.$error}"
        />
        <div class="hint" v-if="!v$.email.$error">Введите ваш email</div>
        <div class="error" v-if="v$.email.$error">
          <span v-if="!v$.email.required">Email обязателен</span>
          <span v-else-if="!v$.email.email">
            Введите корректный email (например: user@example.com)
          </span>
        </div>
      </div>

      <!-- Пароль -->
      <div class="field">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="form.password"
          placeholder="Пароль"
          type="password"
          :class="{ 'input-error': v$.password.$error }"
        />
      
        <div class="error" v-if="v$.password.$error">
          <span v-if="!v$.password.required">Пароль обязателен</span>
          <span v-else-if="!v$.password.passwordStrong">
            Пароль не соответствует требованиям
          </span>
        </div>
      </div>

      <!-- Кнопка -->
    <button type="submit" class="submit-btn" :disabled="isFormInvalid">
  {{ loading ? 'Вход...' : 'Войти' }}
</button>


      <!-- Серверная ошибка -->
      <div v-if="error" class="server-error">{{ error }}</div>

      <!-- Ссылка на регистрацию -->
      <div class="form-footer">
        Нет аккаунта? <NuxtLink to="/register">Зарегестрироваться!</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import { useUserStore } from '../../store/user'  // путь к твоему Pinia стору
import { navigateTo } from '#app'

// -----------------
// Форма
// -----------------
const form = reactive({
  email: '',
  password: ''
})

const error = ref(null)
const loading = ref(false)

// -----------------
// Валидатор пароля
// -----------------
const passwordStrong = helpers.withMessage(
  'Пароль должен содержать заглавные буквы, цифры, спецсимволы, только латиница и минимум 8 символов',
  (value) => {
    if (!value) return false
    return (
      /[A-Z]/.test(value) &&                    // заглавная
      /[0-9]/.test(value) &&                   // цифра
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(value) && // спецсимвол
      /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(value) && // только латиница и спецсимволы
      value.length >= 8
    )
  }
)

// -----------------
// Vuelidate
// -----------------
const rules = {
  email: { required, email },
  password: { required, passwordStrong }
}

const v$ = useVuelidate(rules, form)


// -----------------
// Подсказки для пароля
// -----------------
const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
const hasDigit = computed(() => /[0-9]/.test(form.password))
const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(form.password))
const hasMinLength = computed(() => form.password.length >= 8)
const isLatinOnly = computed(() => /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(form.password))

// -----------------
// Отправка формы
// -----------------
const submit = async () => {
  error.value = null
  await v$.value.$validate()

  if (v$.value.$invalid) {
    error.value = 'Проверьте правильность заполнения полей'
    return
  }

  loading.value = true
  try {
    // Преобразуем reactive в обычный объект для useFetch
    const body = JSON.parse(JSON.stringify(form))

    const { data, error: fetchError } = await useFetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })

    // Проверяем ошибки от сервера
    if (fetchError.value) {
      error.value = fetchError.value.data?.message || 'Ошибка входа'
      return
    }

    console.log('Успешный вход, данные пользователя:', data.value)
    // Тут можно сохранить user в стор/пиней или редирект
     const userStore = useUserStore()
  userStore.setUser(data.value.user) // сохраняем в стор и куку
  navigateTo('/profile') 
  } catch (err) {
    error.value = err.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form {
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.field {
  margin-bottom: 1.6rem;
}

label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 500;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.input-error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.hint {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.password-hint {
  margin-top: 0.6rem;
  font-size: 0.85rem;
  color: #34495e;
}

.password-hint ul {
  margin: 0.5rem 0 0 1.4rem;
  padding: 0;
  list-style: none;
}

.password-hint li {
  margin-bottom: 0.3rem;
  color: #7f8c8d;
}

.password-hint li.met {
  color: #27ae60;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.server-error {
  margin-top: 1.2rem;
  color: #e74c3c;
  text-align: center;
  font-weight: 500;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>