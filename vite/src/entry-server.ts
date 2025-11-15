import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import universalCookie from 'universal-cookie'
import { ColorScheme } from './types'

const DEFAULT_THEME: ColorScheme = 'light'

/**
 * Extract theme from cookies
 */
const getThemeFromCookies = (cookies?: string | object | null): ColorScheme => {
  const themeCookie = new universalCookie(cookies)?.get('theme')
  return themeCookie || DEFAULT_THEME
}

/**
 * Render the Vue app to HTML string for SSR
 * @param url - The URL to render
 * @param cookies - Request cookies for theme extraction
 */
export async function render(url: string, cookies?: string | object | null) {
  const { app, router, navigationStack, ssrContext } = createApp()
  
  // Navigate to the requested URL
  await router.push(url)
  await router.isReady()
  
  // Extract theme from cookies
  const theme = getThemeFromCookies(cookies)
  
  // Create render context with theme and SSR data
  // SSR context is provided to components via useSSRContext()
  const ctx = { theme, ssrContext, navigationStack }
  
  // Render Vue app to HTML string
  const html = await renderToString(app, ctx)
  
  return { html, ctx }
}
