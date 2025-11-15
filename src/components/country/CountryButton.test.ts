import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CountryButton from './CountryButton.vue'
import { createMockCountry } from '../../test/utils'

describe('CountryButton', () => {
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
    const wrapper = mount(CountryButton, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Germany')
  })

  it('navigates to country page on click', async () => {
    const country = createMockCountry({ alpha3Code: 'DEU', name: 'Germany' })
    const wrapper = mount(CountryButton, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    await wrapper.trigger('click')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('country')
    expect(router.currentRoute.value.params.code).toBe('deu')
  })

  it('has correct button classes', () => {
    const country = createMockCountry()
    const wrapper = mount(CountryButton, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-jm-white')
    expect(button.classes()).toContain('rounded-md')
  })

  it('handles missing alpha3Code gracefully', async () => {
    const country = createMockCountry({ alpha3Code: '' })
    const wrapper = mount(CountryButton, {
      props: { country },
      global: {
        plugins: [router],
      },
    })

    const initialRoute = router.currentRoute.value.path
    await wrapper.trigger('click')
    
    // Should not navigate if code is missing
    expect(router.currentRoute.value.path).toBe(initialRoute)
  })
})

