// import React, { useState } from 'react'
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
// } from 'react-native'
// import { verifyOtp, getCurrentUser, sendOtp } from '../services/auth'
// import { useTheme } from '../theme/theme'
// import { RouteProp, useNavigation } from '@react-navigation/native'
// import { RootStackParamList } from '../navigation/AppNavigator'

// type Props = {
//     route: RouteProp<RootStackParamList, 'Otp'>
// }

// export default function OtpScreen({ route }: Props) {
//     const { email } = route.params
//     const [otp, setOtp] = useState('')
//     const { colors } = useTheme()
//     const navigation = useNavigation<any>()

//     const handleVerify = async () => {
//         try {
//             await verifyOtp(email, otp)
//             const user = await getCurrentUser()
//             console.log('Logged in UID:', user?.id)

//             // later: navigate to home
//         } catch (err: any) {
//             console.log(err.message)
//         }
//     }

//     const handleResend = async () => {
//         try {
//             await sendOtp(email)
//             console.log('OTP resent')
//         } catch (err: any) {
//             console.log(err.message)
//         }
//     }

//     return (
//         <View style={[styles.container, { backgroundColor: colors.background }]}>
//             <Text style={[styles.title, { color: colors.text }]}>
//                 Verify Code 🔐
//             </Text>

//             <Text style={[styles.subtitle, { color: colors.gray }]}>
//                 Enter the code sent to {email}
//             </Text>

//             <TextInput
//                 value={otp}
//                 onChangeText={setOtp}
//                 placeholder="Enter OTP"
//                 keyboardType="number-pad"
//                 style={[styles.input, { color: colors.text }]}
//                 placeholderTextColor={colors.gray}
//             />

//             <TouchableOpacity
//                 style={[styles.button, { backgroundColor: colors.primary }]}
//                 onPress={handleVerify}
//             >
//                 <Text style={styles.buttonText}>Verify</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={handleResend}>
//                 <Text style={[styles.resend, { color: colors.primary }]}>
//                     Resend Code
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//     },
//     subtitle: {
//         marginVertical: 10,
//     },
//     input: {
//         borderWidth: 1,
//         borderRadius: 12,
//         padding: 15,
//         marginVertical: 20,
//         textAlign: 'center',
//         fontSize: 18,
//         letterSpacing: 4,
//     },
//     button: {
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     resend: {
//         marginTop: 15,
//         textAlign: 'center',
//     },
// })



import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native'
import { verifyOtp, getCurrentUser, sendOtp } from '../services/auth'
import { useTheme } from '../theme/theme'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '../theme/colors'
import Button from '../components/Button'

type Props = {
    route: RouteProp<RootStackParamList, 'Otp'>
}

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>

const { height } = Dimensions.get('window')

const validateOtp = (otp: string): string | null => {
    if (!otp) return "bestie where's the code 👀"
    if (otp.length < 6) return `${6 - otp.length} more digits to go 🤏`
    if (!/^\d{6}$/.test(otp)) return "numbers only bestie, no cap 💀"
    return null
}

const ERROR_MESSAGES: Record<string, string> = {
    EXPIRED: "code's expired bestie ⏰ tap resend for a fresh one",
    INVALID: "nah that ain't right 🚫 double check the digits",
    TOO_MANY: "too many wrong attempts 💀 request a fresh code",
    UNKNOWN: "something went sideways 😭 try again?",
}

export default function OtpScreen({ route }: Props) {
    const { email } = route.params
    const [otp, setOtp] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [touched, setTouched] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(45)  // starts immediately on mount
    const [resendSuccess, setResendSuccess] = useState(false)

    const { colors, isDark } = useTheme()
    const navigation = useNavigation<NavProp>()
    const insets = useSafeAreaInsets()

    // Staggered animations
    const fadeTitle = useRef(new Animated.Value(0)).current
    const fadeSubtitle = useRef(new Animated.Value(0)).current
    const fadeInput = useRef(new Animated.Value(0)).current
    const fadeButton = useRef(new Animated.Value(0)).current
    const slideTitle = useRef(new Animated.Value(20)).current
    const slideInput = useRef(new Animated.Value(20)).current
    const slideButton = useRef(new Animated.Value(20)).current
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

    // Countdown timer — starts at 45 on mount
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [resendCooldown])

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

    const handleChangeOtp = (val: string) => {
        const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6)
        setOtp(cleaned)
        if (touched) setError(validateOtp(cleaned))
    }

    const handleBlur = () => {
        setIsFocused(false)
        setTouched(true)
        setError(validateOtp(otp))
    }

    const handleVerify = async () => {
        setTouched(true)
        const validationError = validateOtp(otp)
        if (validationError) {
            setError(validationError)
            shake()
            return
        }

        setLoading(true)
        setError(null)
        try {
            await verifyOtp(email, otp)
            const user = await getCurrentUser()
            console.log('Logged in UID:', user?.id)
            // later: navigate to home
        } catch (err: any) {
            const friendly = ERROR_MESSAGES[err.message] ?? ERROR_MESSAGES.UNKNOWN
            setOtp('')
            setTouched(true)
            setError(friendly)
            console.log(friendly)
            shake()
            // if expired, auto-enable resend immediately
            if (err.message === 'EXPIRED') {
                setResendCooldown(0)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0 || resending) return
        setResending(true)
        setResendSuccess(false)
        setError(null)
        setOtp('')
        setTouched(false)
        try {
            await sendOtp(email)
            // const delay = Math.random() * 2000
            // await new Promise(resolve => setTimeout(resolve, delay))
            setResendSuccess(true)
            setResendCooldown(45)
            setTimeout(() => setResendSuccess(false), 3000)
        } catch (err: any) {
            setError("couldn't resend rn 😭 try in a sec?")
        } finally {
            setResending(false)
        }
    }

    const inputBorderColor = () => {
        if (error && touched) return '#EF4444'
        if (isFocused) return Colors.primary
        return isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'
    }

    const maskedEmail = email.replace(
        /^(.{2})(.*)(@.*)$/,
        (_, a, b, c) => a + '*'.repeat(b.length) + c
    )

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
                        scrollEnabled={false}
                    >
                        {/* Top section */}
                        <View style={styles.topSection}>
                            <Animated.View
                                style={[
                                    styles.iconBadge,
                                    { opacity: fadeTitle, transform: [{ translateY: slideTitle }] },
                                ]}
                            >
                                <View style={[styles.iconGradientWrapper, { backgroundColor: Colors.primary }]}>
                                    <Text style={styles.iconEmoji}>🔐</Text>
                                </View>
                            </Animated.View>

                            <Animated.Text
                                style={[
                                    styles.title,
                                    { color: colors.text },
                                    { opacity: fadeTitle, transform: [{ translateY: slideTitle }] },
                                ]}
                            >
                                Check your email
                            </Animated.Text>

                            <Animated.Text
                                style={[
                                    styles.subtitle,
                                    { color: colors.gray },
                                    { opacity: fadeSubtitle },
                                ]}
                            >
                                we just slid into{' '}
                                <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                                    {maskedEmail}
                                </Text>
                                {'\n'}with a 6-digit code. go check! 📬
                            </Animated.Text>
                        </View>

                        {/* Input section */}
                        <Animated.View
                            style={[
                                styles.formSection,
                                { opacity: fadeInput, transform: [{ translateY: slideInput }] },
                            ]}
                        >
                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                One-time code
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
                                <View style={styles.inputInner}>
                                    <Text style={[styles.floatingLabel, { color: colors.gray }]}>
                                        Enter 6 digit OTP
                                    </Text>
                                    <TextInput
                                        value={otp}
                                        onChangeText={handleChangeOtp}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={handleBlur}
                                        placeholder="••••••"
                                        placeholderTextColor={colors.gray}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        style={[styles.input, { color: colors.text }]}
                                        textContentType="oneTimeCode"
                                    />
                                </View>

                                {/* Digit counter */}
                                <Text style={[
                                    styles.digitCounter,
                                    { color: otp.length === 6 ? '#22C55E' : colors.gray },
                                ]}>
                                    {otp.length}/6
                                </Text>
                            </Animated.View>

                            {/* Error */}
                            {error && touched && (
                                <Animated.View
                                    style={[
                                        styles.messageRow,
                                        { transform: [{ translateX: shakeAnim }] },
                                    ]}
                                >
                                    <Text style={styles.errorDot}>●</Text>
                                    <Text style={styles.errorText}>{error}</Text>
                                </Animated.View>
                            )}

                            {/* Resend success */}
                            {resendSuccess && (
                                <View style={styles.messageRow}>
                                    <Text style={[styles.errorDot, { color: '#22C55E' }]}>●</Text>
                                    <Text style={[styles.errorText, { color: '#22C55E' }]}>
                                        code sent again, check your inbox! 📬
                                    </Text>
                                </View>
                            )}
                        </Animated.View>

                        {/* Button section */}
                        <Animated.View
                            style={[
                                styles.buttonSection,
                                { opacity: fadeButton, transform: [{ translateY: slideButton }] },
                            ]}
                        >
                            <Button
                                label="Verify →"
                                onPress={handleVerify}
                                loading={loading}
                            />

                            {/* Resend row */}
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={resendCooldown > 0 || resending}
                                style={styles.resendRow}
                            >
                                <Text style={[styles.resendText, { color: colors.gray }]}>
                                    didn't get it?{' '}
                                </Text>
                                <Text style={[
                                    styles.resendLink,
                                    { color: resendCooldown > 0 ? colors.gray : Colors.primary },
                                ]}>
                                    {resending
                                        ? 'sending...'
                                        : resendCooldown > 0
                                            ? `resend in ${resendCooldown}s`
                                            : 'resend code'
                                    }
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Comedy line */}
                        <View style={styles.bottomSpacer}>
                            <Text style={[styles.comedyLine, { color: colors.gray }]}>
                                check spam too bestie, just saying 👀{'\n'}
                                (we won't judge)
                            </Text>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        minHeight: height,
        paddingHorizontal: 28,
        paddingTop: 48,
        paddingBottom: 32,
    },
    topSection: { marginBottom: 40 },
    iconBadge: {
        width: 60,
        height: 60,
        borderRadius: 18,
        marginBottom: 24,
        overflow: 'hidden',
    },
    iconGradientWrapper: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconEmoji: { fontSize: 26 },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 24,
    },
    formSection: { marginBottom: 32 },
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
        paddingVertical: 4,
    },
    inputInner: { flex: 1 },
    floatingLabel: {
        fontSize: 10,
        marginTop: 8,
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    input: {
        fontSize: 22,
        paddingVertical: 6,
        letterSpacing: 8,
        marginBottom: 8,
        fontWeight: '600',
    },
    digitCounter: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    errorDot: { fontSize: 6, color: '#EF4444' },
    errorText: { fontSize: 12, color: '#EF4444', flex: 1 },
    buttonSection: { gap: 16 },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: { fontSize: 13 },
    resendLink: {
        fontSize: 13,
        fontWeight: '600',
    },
    bottomSpacer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 12,
        minHeight: 280,
    },
    comedyLine: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 18,
        opacity: 0.5,
        fontStyle: 'italic',
    },
})