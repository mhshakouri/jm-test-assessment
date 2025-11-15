import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ListCountry from './ListCountry.vue'
import { createMockCountry } from '../../test/utils'

describe('ListCountry', () => {
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
  it('renders ListCountryCard for each country', () => {
    const countries = [
      createMockCountry({ name: 'Germany', alpha3Code: 'DEU' }),
      createMockCountry({ name: 'France', alpha3Code: 'FRA' }),
      createMockCountry({ name: 'Italy', alpha3Code: 'ITA' }),
    ]

    const wrapper = mount(ListCountry, {
      props: {
        countries,
      },
      global: {
        plugins: [router],
      },
    })

    const cards = wrapper.findAllComponents({ name: 'ListCountryCard' })
    expect(cards).toHaveLength(3)
  })

  it('passes preload prop to first 4 cards', () => {
    const countries = Array.from({ length: 6 }, (_, i) =>
      createMockCountry({ name: `Country ${i}`, alpha3Code: `C${i}` })
    )

    const wrapper = mount(ListCountry, {
      props: {
        countries,
      },
      global: {
        plugins: [router],
      },
    })

    const cards = wrapper.findAllComponents({ name: 'ListCountryCard' })
    
    // First 4 should have preload
    expect(cards[0].props('preload')).toBe(true)
    expect(cards[1].props('preload')).toBe(true)
    expect(cards[2].props('preload')).toBe(true)
    expect(cards[3].props('preload')).toBe(true)
    
    // 5th and beyond should not have preload
    expect(cards[4].props('preload')).toBe(false)
    expect(cards[5].props('preload')).toBe(false)
  })

  it('displays "No countries found" when countries array is empty', () => {
    const wrapper = mount(ListCountry, {
      props: {
        countries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('No countries found')
    expect(wrapper.findAllComponents({ name: 'ListCountryCard' })).toHaveLength(0)
  })

  it('has correct grid classes', () => {
    const countries = [createMockCountry()]
    const wrapper = mount(ListCountry, {
      props: {
        countries,
      },
      global: {
        plugins: [router],
      },
    })

    const div = wrapper.find('div')
    expect(div.classes()).toContain('grid')
    expect(div.classes()).toContain('grid-cols-1')
    expect(div.classes()).toContain('md:grid-cols-3')
    expect(div.classes()).toContain('lg:grid-cols-4')
    expect(div.classes()).toContain('xl:grid-cols-5')
  })
})

