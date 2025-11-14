import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import universalCookie from 'universal-cookie'

export async function render(_url: string, cookies?: string | object | null) {
  const { app } = createApp()

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {}
  const html = await renderToString(app, ctx)

  // Extract theme from cookies (default to 'light' if not set)
  const theme = new universalCookie(cookies)?.get('theme') || 'light'

  return { html, theme }
}
