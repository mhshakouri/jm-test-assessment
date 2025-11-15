import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UiSortButton from './UiSortButton.vue'

describe('UiSortButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(UiSortButton, {
      props: {
        currentSortIcon: 'mdi:sort-alphabetical',
        toBeSortIcon: 'mdi:sort-numeric',
        name: 'Sort by',
        ariaLabel: 'Sort by name',
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits click event with name when clicked', async () => {
    const wrapper = mount(UiSortButton, {
      props: {
        currentSortIcon: 'mdi:sort-alphabetical',
        toBeSortIcon: 'mdi:sort-numeric',
        name: 'Sort by',
        ariaLabel: 'Sort by name',
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('click')?.[0]).toEqual(['Sort by'])
  })

  it('has correct aria-label and title attributes', () => {
    const wrapper = mount(UiSortButton, {
      props: {
        currentSortIcon: 'mdi:sort-alphabetical',
        toBeSortIcon: 'mdi:sort-numeric',
        name: 'Sort by',
        ariaLabel: 'Sort by name',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Sort by name')
    expect(button.attributes('title')).toBe('Sort by name')
  })

  it('has correct button classes', () => {
    const wrapper = mount(UiSortButton, {
      props: {
        currentSortIcon: 'mdi:sort-alphabetical',
        toBeSortIcon: 'mdi:sort-numeric',
        name: 'Sort by',
        ariaLabel: 'Sort by name',
      },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-jm-white')
    expect(button.classes()).toContain('rounded-md')
    expect(button.classes()).toContain('cursor-pointer')
  })

  it('renders icon components', () => {
    const wrapper = mount(UiSortButton, {
      props: {
        currentSortIcon: 'mdi:sort-alphabetical',
        toBeSortIcon: 'mdi:sort-numeric',
        name: 'Sort by',
        ariaLabel: 'Sort by name',
      },
    })

    // Check that icon components exist (they may be stubbed)
    const span = wrapper.find('span.flex.items-center.gap-2')
    expect(span.exists()).toBe(true)
  })
})

