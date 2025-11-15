import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import ColorSchemeToggler from './ColorSchemeToggler.vue'

// Mock the composable
const mockToggleColorScheme = vi.fn()
const mockTheme = { value: 'light' as 'light' | 'dark' }

vi.mock('../composables/useColorSchemeToggler', () => ({
  useColorSchemeToggler: () => ({
    toggleColorScheme: mockToggleColorScheme,
    themeIcon: computed(() => mockTheme.value === 'light' ? 'mdi:moon-and-stars' : 'mdi:white-balance-sunny'),
    theme: mockTheme,
  }),
}))

describe('ColorSchemeToggler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTheme.value = 'light'
  })

  afterEach(() => {
    // Clean up any DOM changes
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme')
    }
  })

  it('renders button', () => {
    const wrapper = mount(ColorSchemeToggler)

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('displays "Dark mode" when theme is light', () => {
    mockTheme.value = 'light'
    const wrapper = mount(ColorSchemeToggler)

    expect(wrapper.text()).toContain('Dark mode')
  })

  it('displays "Light mode" when theme is dark', () => {
    mockTheme.value = 'dark'
    const wrapper = mount(ColorSchemeToggler)

    expect(wrapper.text()).toContain('Light mode')
  })

  it('calls toggleColorScheme when button is clicked', async () => {
    const wrapper = mount(ColorSchemeToggler)

    await wrapper.find('button').trigger('click')

    expect(mockToggleColorScheme).toHaveBeenCalled()
  })

  it('renders theme icon', () => {
    const wrapper = mount(ColorSchemeToggler)

    // Icon component from @iconify/vue might be stubbed in test environment
    // Check that the icon is present in the rendered HTML instead
    // The component has <Icon :icon="themeIcon" /> so we verify the structure
    const html = wrapper.html()
    
    // The icon should be rendered (as SVG in test environment)
    // Check that there's an icon element or SVG in the button
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    
    // Verify icon is present by checking for SVG (Iconify renders as SVG)
    // or check that button contains the icon structure
    const hasIcon = html.includes('svg') || html.includes('Icon') || button.html().includes('svg')
    expect(hasIcon).toBe(true)
  })

  it('has correct button classes', () => {
    const wrapper = mount(ColorSchemeToggler)

    const button = wrapper.find('button')
    expect(button.classes()).toContain('flex')
    expect(button.classes()).toContain('cursor-pointer')
    expect(button.classes()).toContain('rounded-md')
  })

  it('has aria-label on span', () => {
    const wrapper = mount(ColorSchemeToggler)

    const span = wrapper.find('span[aria-label]')
    expect(span.exists()).toBe(true)
    expect(span.attributes('aria-label')).toBe('Toggle color scheme')
  })
})

