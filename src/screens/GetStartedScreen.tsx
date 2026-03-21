import React, { useEffect, useRef } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
    // Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme/theme'
import { Colors } from '../theme/colors'
import { GlobeGraphic } from './GlobeGraphic'

type NavProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>

// const { width } = Dimensions.get('window')

const FEATURES = [
    { icon: '👥', label: 'Safe Circle' },
    { icon: '🗺️', label: 'Live Map' },
    { icon: '🔔', label: 'Alerts' },
    { icon: '🛡️', label: 'Secure' },
    { icon: '⚡', label: 'Real-time' },
]

const PILL_WIDTH = 140
const TOTAL_WIDTH = FEATURES.length * PILL_WIDTH

export default function GetStartedScreen() {
    const navigation = useNavigation<NavProp>()
    const { colors, isDark } = useTheme()

    // Marquee animation
    const marqueeX = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const animate = () => {
            marqueeX.setValue(0)
            Animated.timing(marqueeX, {
                toValue: -TOTAL_WIDTH,
                duration: 9000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) animate()
            })
        }
        animate()
    }, [])

    // Fade + slide up on mount
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(40)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    return (
        <>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient
                colors={[Colors.backgroundDark, '#2D1B69', Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />

                {/* Top illustration area */}
                <View style={styles.illustrationArea}>
                    <GlobeGraphic />
                    {/* <View style={styles.iconRing}>
                        <View style={styles.iconInner}>
                            <Text style={styles.icon}>📍</Text>
                        </View>
                    </View> */}
                </View>

                {/* Bottom card */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: isDark ? '#1A1A2E' : Colors.backgroundLight,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Scrolling marquee */}
                    <View style={styles.marqueeWrapper}>
                        <Animated.View
                            style={[
                                styles.marqueeTrack,
                                { transform: [{ translateX: marqueeX }] },
                            ]}
                        >
                            {[...FEATURES, ...FEATURES].map((f, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.pill,
                                        { backgroundColor: Colors.primary + '22' },
                                    ]}
                                >
                                    <Text style={styles.pillIcon}>{f.icon}</Text>
                                    <Text style={[styles.pillText, { color: Colors.primary }]}>
                                        {f.label}
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        Private Live{'\n'}Location Sharing
                    </Text>

                    {/* Subtitle */}
                    <Text style={[styles.subtitle, { color: colors.gray }]}>
                        Share your location securely with people you trust.
                        Real-time, private, and always in your control.
                    </Text>

                    {/* Feature rows */}
                    <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>👥</Text>
                            <Text style={[styles.featureText, { color: colors.text }]}>Trusted</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🗺️</Text>
                            <Text style={[styles.featureText, { color: colors.text }]}>Live Map</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔔</Text>
                            <Text style={[styles.featureText, { color: colors.text }]}>Alerts</Text>
                        </View>
                    </View>

                    {/* CTA Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.85}
                        style={styles.buttonWrapper}
                    >
                        <LinearGradient
                            colors={[Colors.primary, '#4C1D95']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Get Started →</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text style={[styles.terms, { color: colors.gray }]}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </Animated.View>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: 40,
        left: -80,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: 10,
        right: -50,
    },
    illustrationArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRing: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 52,
    },
    card: {
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingTop: 28,
        paddingHorizontal: 28,
        paddingBottom: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
    },
    marqueeWrapper: {
        overflow: 'hidden',
        marginBottom: 24,
        height: 36,
    },
    marqueeTrack: {
        flexDirection: 'row',
        position: 'absolute',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        width: PILL_WIDTH - 10,
        gap: 6,
    },
    pillIcon: {
        fontSize: 14,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        lineHeight: 42,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 32,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    featureItem: {
        alignItems: 'center',
        gap: 6,
    },
    featureIcon: {
        fontSize: 28,
    },
    featureText: {
        fontSize: 12,
        fontWeight: '500',
    },
    buttonWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        padding: 10
    },
    button: {
        alignItems: 'center',
        borderRadius: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
        padding: 10
    },
    terms: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
})