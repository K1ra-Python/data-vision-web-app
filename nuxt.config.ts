// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  pinia: {
      /**
       * Automatically add stores dirs to the auto imports. This is the same as
       * directly adding the dirs to the `imports.dirs` option. If you want to
       * also import nested stores, you can use the glob pattern `./stores/**`
       * (on Nuxt 3) or `app/stores/**` (on Nuxt 4+)
       *
       * @default `['stores']`
       */
        storesDirs: []
    }
   
})
