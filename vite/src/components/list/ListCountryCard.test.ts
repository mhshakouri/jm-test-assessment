import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ListCountryCard from './ListCountryCard.vue'
import { createMockCountry } from '../../test/utils'

// Mock composables
vi.mock('../../composables/useSearch', () => ({
  useSearch: () => ({
    searchText: { value: undefined },
  }),
}))

vi.mock('../../composables/useRegion', () => ({
  useRegion: () => ({
    region: { value: undefined },
  }),
}))

describe('ListCountryCard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/country/:code', name: 'country', component: { template: '<div>Country</div>' } },
      ],
    })
  })

  it('renders country name', () => {
    const country = createMockCountry({ name: 'Germany' })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Germany')
  })

  it('displays formatted population', () => {
    const country = createMockCountry({ population: 1000000 })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('1,000,000')
  })

  it('displays region and capital', () => {
    const country = createMockCountry({
      region: 'europe',
      capital: 'Berlin',
    })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('europe')
    expect(wrapper.text()).toContain('Berlin')
  })

  it('renders flag when available', () => {
    const country = createMockCountry({
      flags: { png: 'https://example.com/flag.png', svg: 'https://example.com/flag.svg' },
    })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'Flag' }).exists()).toBe(true)
  })

  it('does not render flag when png is missing', () => {
    const country = createMockCountry({
      flags: { png: '', svg: 'https://example.com/flag.svg' },
    })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'Flag' }).exists()).toBe(false)
  })

  it('navigates to country page on click', async () => {
    const country = createMockCountry({ alpha3Code: 'DEU', name: 'Germany' })
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    await wrapper.find('button').trigger('click')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('country')
    expect(router.currentRoute.value.params.code).toBe('deu')
  })

  it('has correct button classes', () => {
    const country = createMockCountry()
    const wrapper = mount(ListCountryCard, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-jm-white')
    expect(button.classes()).toContain('rounded-md')
    expect(button.classes()).toContain('cursor-pointer')
  })
})

