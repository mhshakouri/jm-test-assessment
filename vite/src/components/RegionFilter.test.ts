import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RegionFilter from './RegionFilter.vue'
import { Region } from '../types'
import { Ref } from 'vue'

// Mock composables
const mockSetRegion = vi.fn()
const mockFetchCountries = vi.fn()
const mockRegionFilter = { value: undefined } as Ref<Region | undefined>

vi.mock('../composables/useRegionFilter', () => ({
  useRegionFilter: () => ({
    regionFilter: mockRegionFilter,
    setRegion: mockSetRegion,
  }),
}))

vi.mock('../composables/useFetchCountries', () => ({
  useFetchCountries: () => ({
    fetchCountries: mockFetchCountries,
  }),
}))

describe('RegionFilter', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRegionFilter.value = undefined

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
      ],
    })
  })

  it('renders UiSelect component', () => {
    const wrapper = mount(RegionFilter, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'UiSelect' }).exists()).toBe(true)
  })

  it('passes regions as optionList to UiSelect', () => {
    const wrapper = mount(RegionFilter, {
      global: {
        plugins: [router],
      },
    })

    const select = wrapper.findComponent({ name: 'UiSelect' })
    const options = select.props('optionList')

    expect(options).toBeDefined()
    expect(Array.isArray(options)).toBe(true)
    expect(options.length).toBeGreaterThan(0)
  })

  it('shows default option when no region is selected', () => {
    mockRegionFilter.value = undefined

    const wrapper = mount(RegionFilter, {
      global: {
        plugins: [router],
      },
    })

    const select = wrapper.findComponent({ name: 'UiSelect' })
    const modelValue = select.props('modelValue')

    expect(modelValue?.label).toBe('Filter by Region')
    expect(modelValue?.value).toBeUndefined()
  })

  it('shows selected region when regionFilter has value', () => {
    // Region values match regionsData which has capitalized values like "Europe", "Africa", etc.
    mockRegionFilter.value = 'Europe'

    const wrapper = mount(RegionFilter, {
      global: {
        plugins: [router],
      },
    })

    const select = wrapper.findComponent({ name: 'UiSelect' })
    const modelValue = select.props('modelValue')

    // Component finds region by matching value, so it should find "Europe"
    expect(modelValue?.value).toBe('Europe')
    expect(modelValue?.label).toBe('Europe')
  })

  it('calls setRegion and fetchCountries when region is selected', async () => {
    mockSetRegion.mockResolvedValue(undefined)
    mockFetchCountries.mockResolvedValue(undefined)

    const wrapper = mount(RegionFilter, {
      global: {
        plugins: [router],
      },
    })

    const select = wrapper.findComponent({ name: 'UiSelect' })
    await select.vm.$emit('update:model-value', { label: 'Europe', value: 'europe' })

    // Wait for async operations
    await wrapper.vm.$nextTick()

    expect(mockSetRegion).toHaveBeenCalledWith('europe')
    expect(mockFetchCountries).toHaveBeenCalled()
  })
})

