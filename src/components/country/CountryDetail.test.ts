import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CountryDetail from './CountryDetail.vue'
import { createMockCountry } from '../../test/utils'

describe('CountryDetail', () => {
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
    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Germany')
  })

  it('displays country details correctly', () => {
    const country = createMockCountry({
      name: 'France',
      nativeName: 'France',
      population: 67000000,
      region: 'europe',
      subregion: 'Western Europe',
      capital: 'Paris',
    })

    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('France')
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.text()).toContain('Western Europe')
  })

  it('displays formatted population', () => {
    const country = createMockCountry({ population: 1000000 })
    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('1,000,000')
  })

  it('displays border countries when provided', () => {
    const country = createMockCountry()
    const borderCountries = [
      createMockCountry({ name: 'Neighbor 1', alpha3Code: 'N1' }),
      createMockCountry({ name: 'Neighbor 2', alpha3Code: 'N2' }),
    ]

    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Border Countries:')
    expect(wrapper.text()).toContain('Neighbor 1')
    expect(wrapper.text()).toContain('Neighbor 2')
  })

  it('does not display border countries section when empty', () => {
    const country = createMockCountry()
    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).not.toContain('Border Countries:')
  })

  it('displays languages correctly', () => {
    const country = createMockCountry({
      languages: [
        { iso639_1: 'en', name: 'English', nativeName: 'English' },
        { iso639_1: 'fr', name: 'French', nativeName: 'Français' },
      ],
    })

    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Languages:')
    expect(wrapper.text()).toContain('English')
    expect(wrapper.text()).toContain('French')
    expect(wrapper.text()).toContain('Français')
  })

  it('displays currencies correctly', () => {
    const country = createMockCountry({
      currencies: [
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
      ],
    })

    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Currencies:')
    expect(wrapper.text()).toContain('Euro')
    expect(wrapper.text()).toContain('€')
  })

  it('handles missing flag gracefully', () => {
    const country = createMockCountry({
      flags: { png: '', svg: '' },
    })

    const wrapper = mount(CountryDetail, {
      props: {
        country,
        borderCountries: [],
      },
      global: {
        plugins: [router],
      },
    })

    // Flag component should not render when png is empty
    expect(wrapper.find('img').exists()).toBe(false)
  })
})

