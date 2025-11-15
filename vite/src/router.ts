import { createRouter, createMemoryHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import IndexPage from './pages/index.vue'
import CountryPage from './pages/country.vue'

/**
 * Application routes configuration
 */
const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    component: IndexPage 
  },
  {
    path: '/country/:code',
    name: 'country',
    component: CountryPage,
    props: true // Pass route params as component props
  }
]

/**
 * Create and configure the Vue Router instance
 * Uses memory history for SSR, web history for client
 */
export function createAppRouter() {
  const history = import.meta.env.SSR 
    ? createMemoryHistory(import.meta.env.BASE_URL) 
    : createWebHistory(import.meta.env.BASE_URL)
  
  return createRouter({
    history,
    routes,
  })
}
