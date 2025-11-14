import { createSharedComposable } from "@vueuse/core"
import { useCookies } from "@vueuse/integrations/useCookies"
import { ref, useSSRContext, watch } from "vue"
import { ColorScheme } from "../types"

const useColorSchemeComposable = () => {
    let ctxTheme = 'light'
    if (import.meta.env.SSR) {
        const ctx = useSSRContext()
        ctxTheme = ctx?.theme ?? ctxTheme
    }
    const themeCookie = useCookies(['theme'])
    const theme = ref<ColorScheme>(themeCookie.get('theme') || ctxTheme)
    watch(theme, (newTheme: ColorScheme) => {
        themeCookie.set('theme', newTheme)
    }, { immediate: true, flush: 'sync' })
    return { theme }
}

export const useColorScheme = createSharedComposable(useColorSchemeComposable)