import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import IndexPage from './pages/index.vue'
// define your routes
const routes = [
  { path: '/', component: IndexPage },
  // more routes here
]

export function createAppRouter() {
  return createRouter({
    history:
      import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  })
}
