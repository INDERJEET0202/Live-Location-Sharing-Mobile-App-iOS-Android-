import React from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../theme/colors'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type Props = {
    label: string
    onPress: () => void
    variant?: ButtonVariant
    loading?: boolean
    disabled?: boolean
    style?: ViewStyle
    textStyle?: TextStyle
}

export default function Button({
    label,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
}: Props) {
    const isDisabled = disabled || loading

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.85}
                disabled={isDisabled}
                style={[styles.wrapper, style]}
            >
                <LinearGradient
                    colors={isDisabled
                        ? ['#9CA3AF', '#9CA3AF']
                        : [Colors.primary, '#4C1D95']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={[styles.primaryText, textStyle]}>{label}</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.85}
                disabled={isDisabled}
                style={[
                    styles.wrapper,
                    styles.outline,
                    { opacity: isDisabled ? 0.5 : 1 },
                    style,
                ]}
            >
                {loading
                    ? <ActivityIndicator color={Colors.primary} />
                    : <Text style={[styles.outlineText, textStyle]}>{label}</Text>
                }
            </TouchableOpacity>
        )
    }

    // ghost
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={isDisabled}
            style={[styles.ghost, { opacity: isDisabled ? 0.5 : 1 }, style]}
        >
            {loading
                ? <ActivityIndicator color={Colors.primary} />
                : <Text style={[styles.ghostText, textStyle]}>{label}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        padding: 10
    },
    gradient: {
        // paddingVertical: 17,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        minHeight: 35,
    },
    primaryText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
        padding: 10
    },
    outline: {
        // paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    outlineText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    ghost: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ghostText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
})