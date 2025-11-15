import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import IndexPage from './pages/index.vue'
import CountryPage from './pages/country.vue'
// define your routes
const routes = [
  { path: '/', component: IndexPage },
  {
    path: '/country/:name', // dynamic param "name"
    name: 'country',
    component: CountryPage,
    props: true // to pass route params as props
  }
]

export function createAppRouter() {
  return createRouter({
    history:
      import.meta.env.SSR ? createMemoryHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
