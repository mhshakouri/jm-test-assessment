import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CountryFlag from './CountryFlag.vue'

describe('CountryFlag', () => {
  const mockFlag = {
    png: 'https://example.com/flag.png',
    svg: 'https://example.com/flag.svg',
  }

  it('renders flag image with correct src', () => {
    const wrapper = mount(CountryFlag, {
      props: {
        flag: mockFlag,
        name: 'Germany',
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/flag.png')
  })

  it('sets correct alt text', () => {
    const wrapper = mount(CountryFlag, {
      props: {
        flag: mockFlag,
        name: 'France',
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Flag of France')
  })

  it('uses lazy loading by default', () => {
    const wrapper = mount(CountryFlag, {
      props: {
        flag: mockFlag,
        name: 'Germany',
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('fetchpriority')).toBe('auto')
  })

  it('uses eager loading when preload is true', () => {
    const wrapper = mount(CountryFlag, {
      props: {
        flag: mockFlag,
        name: 'Germany',
        preload: true,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('eager')
    expect(img.attributes('fetchpriority')).toBe('high')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(CountryFlag, {
      props: {
        flag: mockFlag,
        name: 'Germany',
      },
    })

    const span = wrapper.find('span')
    expect(span.classes()).toContain('block')
    expect(span.classes()).toContain('aspect-video')
    expect(span.classes()).toContain('w-full')

    const img = wrapper.find('img')
    expect(img.classes()).toContain('block')
    expect(img.classes()).toContain('w-full')
    expect(img.classes()).toContain('aspect-video')
  })
})

