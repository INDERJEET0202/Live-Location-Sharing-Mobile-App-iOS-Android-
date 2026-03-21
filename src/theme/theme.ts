import { Colors } from './colors'
import { useColorScheme } from 'react-native'

type ThemeColors = {
    background: string
    text: string
    primary: string
    gray: string
}

type ThemeReturn = {
    colors: ThemeColors
    isDark: boolean
}

export const useTheme = ():ThemeReturn => {
    const scheme = useColorScheme()

    const isDark = scheme === 'dark'

    return {
        colors: {
            background: isDark
                ? Colors.backgroundDark
                : Colors.backgroundLight,
            text: isDark ? Colors.textDark : Colors.textLight,
            primary: Colors.primary,
            gray: Colors.gray,
        },
        isDark,
    }
}