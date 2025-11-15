import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Sort from './Sort.vue'

// Mock the composable
const mockToggleSort = vi.fn()
const mockToggleSortOrder = vi.fn()

vi.mock('../composables/useSort', () => ({
  useSort: () => ({
    toggleSort: mockToggleSort,
    toggleSortOrder: mockToggleSortOrder,
    sortIcon: 'mdi:sort-alphabetical-variant',
    sortOrderIcon: 'mdi:sort-alphabetical-ascending',
    sortIconAriaLabel: 'Sort by name',
    sortOrderIconAriaLabel: 'Change sort order to descending',
    sortIconToBe: 'mdi:sort-numeric-variant',
    sortOrderIconToBe: 'mdi:sort-alphabetical-descending',
  }),
}))

describe('Sort', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders two UiSortButton components', () => {
    const wrapper = mount(Sort)

    const buttons = wrapper.findAllComponents({ name: 'UiSortButton' })
    expect(buttons).toHaveLength(2)
  })

  it('passes correct props to sort button', () => {
    const wrapper = mount(Sort)

    const buttons = wrapper.findAllComponents({ name: 'UiSortButton' })
    const sortButton = buttons[0]

    expect(sortButton.props('currentSortIcon')).toBe('mdi:sort-alphabetical-variant')
    expect(sortButton.props('toBeSortIcon')).toBe('mdi:sort-numeric-variant')
    expect(sortButton.props('ariaLabel')).toBe('Sort by name')
    expect(sortButton.props('name')).toBe('Sort by')
  })

  it('passes correct props to sort order button', () => {
    const wrapper = mount(Sort)

    const buttons = wrapper.findAllComponents({ name: 'UiSortButton' })
    const sortOrderButton = buttons[1]

    expect(sortOrderButton.props('currentSortIcon')).toBe('mdi:sort-alphabetical-ascending')
    expect(sortOrderButton.props('toBeSortIcon')).toBe('mdi:sort-alphabetical-descending')
    expect(sortOrderButton.props('ariaLabel')).toBe('Change sort order to descending')
    expect(sortOrderButton.props('name')).toBe('Sort order')
  })

  it('calls toggleSort when sort button is clicked', async () => {
    const wrapper = mount(Sort)

    const buttons = wrapper.findAllComponents({ name: 'UiSortButton' })
    await buttons[0].vm.$emit('click', 'Sort by')

    expect(mockToggleSort).toHaveBeenCalled()
  })

  it('calls toggleSortOrder when sort order button is clicked', async () => {
    const wrapper = mount(Sort)

    const buttons = wrapper.findAllComponents({ name: 'UiSortButton' })
    await buttons[1].vm.$emit('click', 'Sort order')

    expect(mockToggleSortOrder).toHaveBeenCalled()
  })
})

