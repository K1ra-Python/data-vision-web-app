<
<template>
  <div>
    <form>
      <input v-model="email" placeholder="EMAIL" required type="email" />email
      <input v-model="name" placeholder="NAME" required type="name" />name
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
const password = ref("");
const name = ref("");
const error = ref(null);
const loading = ref(false);

const submit = async () => {
  error.value = null;
  loading.value = true;

  try {
    const { data, error: fetchError } = await useFetch("/api/user", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
      },
    });

    if (fetchError.value) {
      throw new Error(fetchError.value.data?.message || "Ошибка регистрации");
    }

    console.log("Пользователь успешно создан:", data.value);
    // здесь можно сделать redirect или показать успех
    // navigateTo('/login') например
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style></style>
