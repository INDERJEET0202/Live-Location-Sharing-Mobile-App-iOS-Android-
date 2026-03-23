import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    StyleProp,
    ViewStyle,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme/theme'

type Props = {
    visible: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    contentStyle?: StyleProp<ViewStyle>
}

export default function BottomSheet({
    visible,
    onClose,
    title,
    children,
    contentStyle,
}: Props) {
    const { colors, isDark } = useTheme()
    const insets = useSafeAreaInsets()

    const modalSlide = useRef(new Animated.Value(400)).current
    const modalFade = useRef(new Animated.Value(0)).current
    const [isRendered, setIsRendered] = useState(false)

    useEffect(() => {
        if (visible) {
            setIsRendered(true) // mount first
            // then animate in
            Animated.parallel([
                Animated.timing(modalFade, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(modalSlide, {
                    toValue: 0,
                    friction: 8,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]).start()
        } else {
            // animate out first
            Animated.parallel([
                Animated.timing(modalFade, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(modalSlide, {
                    toValue: 400,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsRendered(false) // unmount only AFTER animation finishes
                modalSlide.setValue(400)
            })
        }
    }, [visible])

    return (
        <Modal
            visible={isRendered}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            {/* <View style={styles.sheetShadow} /> */}
            <Animated.View style={[styles.backdrop, { opacity: modalFade }]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    activeOpacity={1}
                />
            </Animated.View>

            {/* KeyboardAvoidingView wraps the sheet */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                pointerEvents="box-none"
            >
                {/* Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            backgroundColor: isDark ? '#1A1A2E' : '#ffffff',
                            paddingBottom: insets.bottom + 16,
                            transform: [{ translateY: modalSlide }],
                        },
                    ]}
                >
                    {/* Handle bar */}
                    <View style={[
                        styles.handleBar,
                        {
                            backgroundColor: isDark
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.12)',
                        },
                    ]} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor: isDark
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(0,0,0,0.05)',
                                },
                            ]}
                        >
                            <Ionicons name="close" size={18} color={colors.gray} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={[styles.content, contentStyle]}>
                        {children}
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 12,
        paddingHorizontal: 24,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // Android
        elevation: 12,
    },
    sheetShadow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 20,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    handleBar: {
        width: 36,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: -0.3,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        gap: 16,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'flex-end',
        pointerEvents: 'box-none',
    },
})