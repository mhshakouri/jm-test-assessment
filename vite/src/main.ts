import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import type { SSRContext } from 'vue/server-renderer'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const ssrContext: SSRContext = { data: {} as Record<string, any> }
  const app = createSSRApp(App)
  const router = createAppRouter()
  app.use(router)
  app.provide('ssrContext', ssrContext)
  return { app, router, ssrContext }
}
