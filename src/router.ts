import { createRouter, createMemoryHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import IndexPage from './pages/index.vue'
import CountryPage from './pages/country.vue'
// In your store or global state
const navigationStack: string[] = [];

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
    props: false // Pass route params as component props
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
  
  const router = createRouter({
    history,
    routes,
  })
  router.beforeEach((_to, from, next) => {
    navigationStack.push(from.fullPath);
    next();
  });
  return {router, navigationStack};
}
