import { createSharedComposable } from "@vueuse/core"
import { useCookies } from "@vueuse/integrations/useCookies"
import { ref, watch } from "vue"
import { ColorScheme } from "../types"

const useColorSchemeComposable = () => {
    const themeCookie = useCookies(['theme'])
    const theme = ref<ColorScheme>(themeCookie.get('theme') || 'light')
    watch(theme, (newTheme: ColorScheme) => {
        themeCookie.set('theme', newTheme)
    }, { immediate: true, flush: 'sync' })
    return { theme }
}

export const useColorScheme = createSharedComposable(useColorSchemeComposable)