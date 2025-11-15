import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import type { SSRContext } from 'vue/server-renderer'

/**
 * Create a fresh Vue app instance
 * 
 * SSR requires a fresh app instance per request to avoid state leakage
 * between requests. This factory function ensures each request gets
 * its own isolated app, router, and SSR context.
 */
export function createApp() {
  // Initialize SSR context for data hydration
  const ssrContext: SSRContext = { data: {} as Record<string, string> }
  
  // Create Vue app instance
  const app = createSSRApp(App)
  
  // Setup router
  const {router, navigationStack} = createAppRouter()
  app.use(router)
  
  // Provide SSR context to components via dependency injection
  app.provide('ssrContext', ssrContext)
  app.provide('navigationStack', navigationStack)
  
  return { app, router, ssrContext, navigationStack }
}
