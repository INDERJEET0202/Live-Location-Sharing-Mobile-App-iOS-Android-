// import React, { useState } from 'react'
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
// } from 'react-native'
// import { sendOtp } from '../services/auth'
// import { useNavigation } from '@react-navigation/native'
// import { useTheme } from '../theme/theme'

// export default function LoginScreen() {
//     const [email, setEmail] = useState('')
//     const navigation = useNavigation<any>()
//     const { colors } = useTheme()

//     const handleSendOtp = async () => {
//         await sendOtp(email)
//         navigation.navigate('Otp', { email })
//     }

//     return (
//         <View style={[styles.container, { backgroundColor: colors.background }]}>
//             <Text style={[styles.title, { color: colors.text }]}>
//                 Welcome Back 👋
//             </Text>

//             <Text style={[styles.subtitle, { color: colors.gray }]}>
//                 Enter your email to continue
//             </Text>

//             <TextInput
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 style={[styles.input, { color: colors.text }]}
//                 placeholderTextColor={colors.gray}
//             />

//             <TouchableOpacity
//                 style={[styles.button, { backgroundColor: colors.primary }]}
//                 onPress={handleSendOtp}
//             >
//                 <Text style={styles.buttonText}>Send OTP</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', padding: 20 },
//     title: { fontSize: 28, fontWeight: 'bold' },
//     subtitle: { marginBottom: 20 },
//     input: {
//         borderWidth: 1,
//         borderRadius: 12,
//         padding: 15,
//         marginBottom: 20,
//     },
//     button: {
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     buttonText: { color: '#fff', fontWeight: 'bold' },
// })



import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendOtp } from '../services/auth'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme/theme'
import { Colors } from '../theme/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/Button'

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

const validateEmail = (email: string): string | null => {
    if (!email) return "yo, we need your email to continue 👀"
    if (email.length < 5) return "that's too short to be an email bestie 💀"
    if (!email.includes('@')) return "missing the @ — classic mistake ngl 😅"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "that's not quite an email bestie 🤔"
    return null
}

export default function LoginScreen() {
    const [email, setEmail] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [touched, setTouched] = useState(false)

    const navigation = useNavigation<NavProp>()
    const { colors, isDark } = useTheme()
    const insets = useSafeAreaInsets()

    // Staggered fade animations
    const fadeTitle = useRef(new Animated.Value(0)).current
    const fadeSubtitle = useRef(new Animated.Value(0)).current
    const fadeInput = useRef(new Animated.Value(0)).current
    const fadeButton = useRef(new Animated.Value(0)).current

    const slideTitle = useRef(new Animated.Value(20)).current
    const slideInput = useRef(new Animated.Value(20)).current
    const slideButton = useRef(new Animated.Value(20)).current

    // Error shake animation
    const shakeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const stagger = (anim: Animated.Value, slide: Animated.Value | null, delay: number) => {
            Animated.parallel([
                Animated.timing(anim, {
                    toValue: 1, duration: 500, delay,
                    useNativeDriver: true,
                }),
                ...(slide ? [Animated.timing(slide, {
                    toValue: 0, duration: 500, delay,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })] : []),
            ]).start()
        }

        stagger(fadeTitle, slideTitle, 100)
        stagger(fadeSubtitle, null, 200)
        stagger(fadeInput, slideInput, 300)
        stagger(fadeButton, slideButton, 400)
    }, [])

    const shake = () => {
        shakeAnim.setValue(0)
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start()
    }

    const handleChangeEmail = (val: string) => {
        setEmail(val)
        if (touched) setError(validateEmail(val))
    }

    const handleBlur = () => {
        setIsFocused(false)
        setTouched(true)
        setError(validateEmail(email))
    }

    const handleSendOtp = async () => {
        setTouched(true)
        const validationError = validateEmail(email)
        if (validationError) {
            setError(validationError)
            shake()
            return
        }

        setLoading(true)
        setError(null)
        try {
            await sendOtp(email)
            navigation.navigate('Otp', { email })
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
            shake()
        } finally {
            setLoading(false)
        }
    }

    const inputBorderColor = () => {
        if (error && touched) return '#EF4444'
        if (isFocused) return Colors.primary
        return isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'
    }

    return (
        <>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Top section */}
                        <View style={styles.topSection}>

                            {/* Icon badge */}
                            <Animated.View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: Colors.primary + '18' },
                                    { opacity: fadeTitle, transform: [{ translateY: slideTitle }] },
                                ]}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, '#4C1D95']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.iconGradient}
                                >
                                    <Text style={styles.iconEmoji}>📍</Text>
                                </LinearGradient>
                            </Animated.View>

                            {/* Title */}
                            <Animated.Text
                                style={[
                                    styles.title,
                                    { color: colors.text },
                                    { opacity: fadeTitle, transform: [{ translateY: slideTitle }] },
                                ]}
                            >
                                Login
                            </Animated.Text>

                            {/* Subtitle */}
                            {/* <Animated.Text
                                style={[
                                    styles.subtitle,
                                    { color: colors.gray },
                                    { opacity: fadeSubtitle },
                                ]}
                            >
                                Enter your email to receive a one-time code
                            </Animated.Text> */}
                            <Animated.Text
                                style={[
                                    styles.subtitle,
                                    { color: colors.gray },
                                    { opacity: fadeSubtitle },
                                ]}
                            >
                                Enter your email and we'll send you a magic code.{'\n'}
                                No password. No drama. Just vibes. ✨
                            </Animated.Text>
                        </View>

                        {/* Form section */}
                        <Animated.View
                            style={[
                                styles.formSection,
                                { opacity: fadeInput, transform: [{ translateY: slideInput }] },
                            ]}
                        >
                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                Email address
                            </Text>

                            <Animated.View
                                style={[
                                    styles.inputWrapper,
                                    {
                                        borderColor: inputBorderColor(),
                                        backgroundColor: isDark
                                            ? 'rgba(255,255,255,0.06)'
                                            : 'rgba(0,0,0,0.03)',
                                    },
                                    { transform: [{ translateX: shakeAnim }] },
                                ]}
                            >
                                <Text style={styles.inputIcon}>✉️</Text>
                                <TextInput
                                    placeholder="you@example.com"
                                    value={email}
                                    onChangeText={handleChangeEmail}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={handleBlur}
                                    style={[styles.input, { color: colors.text }]}
                                    placeholderTextColor={colors.gray}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {/* Validation tick */}
                                {!error && touched && email.length > 0 && (
                                    <Text style={styles.validIcon}>✓</Text>
                                )}
                            </Animated.View>

                            {/* Error message */}
                            {error && touched && (
                                <Animated.View
                                    style={[
                                        styles.errorRow,
                                        { transform: [{ translateX: shakeAnim }] },
                                    ]}
                                >
                                    <Text style={styles.errorDot}>●</Text>
                                    <Text style={styles.errorText}>{error}</Text>
                                </Animated.View>
                            )}
                        </Animated.View>

                        {/* Button */}
                        <Animated.View
                            style={[
                                styles.buttonSection,
                                { opacity: fadeButton, transform: [{ translateY: slideButton }] },
                            ]}
                        >
                            <Button
                                label={loading ? 'Sending code...' : 'Send OTP →'}
                                onPress={handleSendOtp}
                                loading={loading}
                                variant="primary"
                            />
                            <Text style={[styles.footerNote, { color: colors.gray }]}>
                                No password needed — just your email.
                            </Text>

                            {/* Comedy line */}
                            <View style={styles.bottomSpacer}>
                                <Text style={[styles.comedyLine, { color: colors.gray }]}>
                                    we promise we won't spam you.{'\n'}
                                    (our mums are watching 👀)
                                </Text>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 48,
        paddingBottom: 32,
    },
    topSection: {
        marginBottom: 40,
    },
    iconBadge: {
        width: 60,
        height: 60,
        borderRadius: 18,
        marginBottom: 24,
        overflow: 'hidden',
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconEmoji: {
        fontSize: 26,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    formSection: {
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 14,
        gap: 10,
    },
    inputIcon: {
        fontSize: 16,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 14,
    },
    validIcon: {
        fontSize: 16,
        color: '#22C55E',
        fontWeight: 'bold',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    errorDot: {
        fontSize: 6,
        color: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        flex: 1,
    },
    buttonSection: {
        gap: 16,
    },
    footerNote: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    comedyLine: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 24,
        opacity: 0.5,
        fontStyle: 'italic',
    },
    bottomSpacer: {
        flex: 1,                  // ✅ pushes comedy line to bottom
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12,
    },
})