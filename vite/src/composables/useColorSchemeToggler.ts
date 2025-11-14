import { watch } from "vue"
import { useColorScheme } from "./useColorScheme";
import { ColorScheme } from "../types";

export const useColorSchemeToggler = () => {
    const { theme } = useColorScheme();

    const applyColorScheme = () => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme.value)
        }
    }
    
    const setColorScheme = (scheme: ColorScheme) => {
        theme.value = scheme
    }
    
    const toggleColorScheme = () => {
        setColorScheme(theme.value === 'light' ? 'dark' : 'light')
    }

    const setupColorScheme = () => {
        applyColorScheme()
        watch(theme, applyColorScheme, { immediate: true, flush: 'sync' })
    }
    
    return {
        theme,
        toggleColorScheme,
        setupColorScheme,
    }
}
