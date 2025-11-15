/**
 * Test utilities and helpers
 */
import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Component } from 'vue'

/**
 * Create a router instance for testing
 */
export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/country/:code', name: 'country', component: { template: '<div>Country</div>' } },
    ],
  })
}

/**
 * Mount a component with router
 */
export function mountWithRouter(
  component: Component,
  options: Parameters<typeof mount>[1] = {}
): VueWrapper {
  const router = createTestRouter()
  return mount(component, {
    global: {
      plugins: [router],
    },
    ...options,
  })
}

/**
 * Create mock country data for testing
 */
export function createMockCountry(overrides: Partial<any> = {}) {
  return {
    name: 'Test Country',
    nativeName: 'Test Country Native',
    population: 1000000,
    region: 'europe' as const,
    subregion: 'Western Europe',
    capital: 'Test Capital',
    flags: {
      png: 'https://example.com/flag.png',
      svg: 'https://example.com/flag.svg',
    },
    topLevelDomain: ['.test'],
    currencies: [
      { code: 'TST', name: 'Test Currency', symbol: 'T' },
    ],
    languages: [
      { iso639_1: 'en', name: 'English', nativeName: 'English', iso639_2: 'eng' },
    ],
    borders: ['BOR1', 'BOR2'],
    alpha3Code: 'TST',
    needFullDetails: false,
    ...overrides,
  }
}

