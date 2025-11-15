import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from './PageHeader.vue'

describe('PageHeader', () => {
  it('renders UiSearch component', () => {
    const wrapper = mount(PageHeader)

    expect(wrapper.findComponent({ name: 'UiSearch' }).exists()).toBe(true)
  })

  it('renders RegionFilter component', () => {
    const wrapper = mount(PageHeader)

    expect(wrapper.findComponent({ name: 'RegionFilter' }).exists()).toBe(true)
  })

  it('renders Sort component', () => {
    const wrapper = mount(PageHeader)

    expect(wrapper.findComponent({ name: 'Sort' }).exists()).toBe(true)
  })

  it('has correct layout classes', () => {
    const wrapper = mount(PageHeader)

    const div = wrapper.find('div')
    expect(div.classes()).toContain('flex')
    expect(div.classes()).toContain('flex-col')
    expect(div.classes()).toContain('items-center')
    expect(div.classes()).toContain('lg:flex-row')
    expect(div.classes()).toContain('lg:justify-between')
  })
})

