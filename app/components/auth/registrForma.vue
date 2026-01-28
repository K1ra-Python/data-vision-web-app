<template>
  <div class="register-form">
    <form @submit.prevent="submit">
      <!-- Поле имени -->
      <div class="field">
        <label for="name">Имя</label>
        <input
          id="name"
          v-model.trim="inputUserRegister.name"
          placeholder="Имя"
          type="text"
          :class="{ 'input-error': v$.inputUserRegister.name.$error }"
        />
        <div class="hint" v-if="!v$.inputUserRegister.name.$error">
          Только латинские буквы и цифры
        </div>
        <div class="error" v-if="v$.inputUserRegister.name.$error">
          <span v-if="!v$.inputUserRegister.name.required">Имя обязательно</span>
          <span v-else-if="!v$.inputUserRegister.name.alphaNum">
            Только латинские буквы и цифры (без пробелов и символов)
          </span>
        </div>
      </div>

      <!-- Поле email -->
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="inputUserRegister.email"
          placeholder="Email"
          type="email"
          :class="{ 'input-error': v$.inputUserRegister.email.$error }"
        />
        <div class="hint" v-if="!v$.inputUserRegister.email.$error">
          Введите реальный email
        </div>
        <div class="error" v-if="v$.inputUserRegister.email.$error">
          <span v-if="!v$.inputUserRegister.email.required">Email обязателен</span>
          <span v-else-if="!v$.inputUserRegister.email.email">
            Введите корректный email (например: user@example.com)
          </span>
        </div>
      </div>

      <!-- Поле пароля -->
      <div class="field">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="inputUserRegister.password"
          placeholder="Пароль"
          type="password"
          :class="{ 'input-error': v$.inputUserRegister.password.$error }"
        />
        <div class="password-hint">
          <div>Пароль должен содержать:</div>
          <ul>
            <li :class="{ met: hasUpperCase }">хотя бы одну заглавную букву (A-Z)</li>
            <li :class="{ met: hasDigit }">хотя бы одну цифру (0-9)</li>
            <li :class="{ met: hasSpecialChar }">хотя бы один спецсимвол (!@#$%^&* и др.)</li>
            <li :class="{ met: hasMinLength }">минимум 8 символов</li>
            <li :class="{ met: isLatinOnly }">только латиницу, цифры и спецсимволы</li>
          </ul>
        </div>
        <div class="error" v-if="v$.inputUserRegister.password.$error">
          <span v-if="!v$.inputUserRegister.password.required">Пароль обязателен</span>
          <span v-else-if="!v$.inputUserRegister.password.passwordStrong">
            Пароль не соответствует требованиям (см. подсказку)
          </span>
        </div>
      </div>

      <!-- Кнопка -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="v$.$invalid || loading"
      >
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
      <div class="subLink">
  Есть аккаунт? <NuxtLink to="/auth">Авторизация!</NuxtLink>
      </div>
    
      <!-- Серверная ошибка -->
      <div v-if="error" class="server-error">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, helpers, alphaNum } from '@vuelidate/validators'

// Форма
const inputUserRegister = reactive({
  email: '',
  name: '',
  password: ''
})

const error = ref(null)
const loading = ref(false)

// Кастомный валидатор пароля (используем RegExp без строковых литералов)
const passwordStrong = helpers.withMessage(
  'Пароль должен содержать заглавные буквы, цифры, спецсимволы, только латиница',
  (value) => {
    if (!value) return false

    const hasUpper = /[A-Z]/.test(value)
    const hasDigit = /[0-9]/.test(value)
    const hasSpecial = new RegExp('[!@#$%^&*()_+\\-=[\\]{};:\"\',.<>/?`~]').test(value)
    const isLatinAndAllowed = new RegExp('^[A-Za-z\\d!@#$%^&*()_+\\-=[\\]{};:\"\',.<>/?`~]+$').test(value)
    const minLength = value.length >= 8

    return hasUpper && hasDigit && hasSpecial && isLatinAndAllowed && minLength
  }
)

// Правила валидации
const rules = computed(() => ({
  inputUserRegister: {
    email: { required, email },
    name: { required, alphaNum },
    password: { required, passwordStrong }
  }
}))

const v$ = useVuelidate(rules, { inputUserRegister }, { $autoDirty: true })

// Подсказки для пароля (RegExp вынесены в computed)
const hasUpperCase = computed(() => /[A-Z]/.test(inputUserRegister.password))
const hasDigit = computed(() => /[0-9]/.test(inputUserRegister.password))
const hasSpecialChar = computed(() =>
  new RegExp('[!@#$%^&*()_+\\-=[\\]{};:\"\',.<>/?`~]').test(inputUserRegister.password)
)
const hasMinLength = computed(() => inputUserRegister.password.length >= 8)
const isLatinOnly = computed(() =>
  new RegExp('^[A-Za-z\\d!@#$%^&*()_+\\-=[\\]{};:\"\',.<>/?`~]+$').test(inputUserRegister.password)
)

// Отправка формы
const submit = async () => {
  error.value = null
  await v$.value.$validate()

  if (v$.value.$invalid) {
    error.value = 'Проверьте правильность заполнения полей'
    return
  }

  loading.value = true

  try {
    const { data, error: fetchError } = await useFetch('/api/user', {
      method: 'POST',
      body: inputUserRegister
    })

    if (fetchError.value) {
      throw new Error(fetchError.value.data?.message || 'Ошибка регистрации')
    }

    console.log('Пользователь успешно создан:', data.value)
    // await navigateTo('/login')  // раскомментируй для редиректа

  } catch (err) {
    error.value = err.message || 'Ошибка регистрации'
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
  background: linear-gradient(135deg, #3498db, #2980b9);
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
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
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
</style>