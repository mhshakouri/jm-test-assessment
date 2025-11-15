import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiKeyValue from './UiKeyValue.vue'

describe('UiKeyValue', () => {
  it('renders title correctly', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
      },
    })

    expect(wrapper.text()).toContain('Test Title')
  })

  it('renders description when provided', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
      },
    })

    expect(wrapper.text()).toContain('Test Description')
  })

  it('renders slot content when provided', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
      },
      slots: {
        default: '<span>Slot Content</span>',
      },
    })

    expect(wrapper.text()).toContain('Slot Content')
    expect(wrapper.text()).not.toContain('Test Description')
  })

  it('applies flex-col class when flexCol prop is true', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
        flexCol: true,
      },
    })

    expect(wrapper.classes()).toContain('flex-col')
    expect(wrapper.classes()).not.toContain('flex-row')
  })

  it('applies flex-row class by default', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
      },
    })

    expect(wrapper.classes()).toContain('flex-row')
  })

  it('applies w-full class when fullWidth prop is true', () => {
    const wrapper = mount(UiKeyValue, {
      props: {
        title: 'Test Title',
        fullWidth: true,
      },
    })

    expect(wrapper.classes()).toContain('w-full')
  })
})

