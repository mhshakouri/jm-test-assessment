import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
      ],
    })
  })

  it('renders default slogan', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Where in the world?')
  })

  it('renders custom slogan when provided', () => {
    const wrapper = mount(AppHeader, {
      props: {
        slogan: 'Custom Slogan',
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Custom Slogan')
  })

  it('renders ColorSchemeToggler component', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'ColorSchemeToggler' }).exists()).toBe(true)
  })

  it('has RouterLink to home', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    })

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/')
  })

  it('has correct header classes', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
      },
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('bg-jm-white')
    expect(header.classes()).toContain('sticky')
    expect(header.classes()).toContain('top-0')
  })
})

