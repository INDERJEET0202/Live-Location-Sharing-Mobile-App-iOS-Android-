import React, { useEffect, useRef } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Animated,
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '../theme/colors'
import { useTheme } from '../theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'

export type BottomTabParamList = {
    Home: undefined
    Profile: undefined
}

const Tab = createBottomTabNavigator<BottomTabParamList>()
const { width } = Dimensions.get('window')

type CustomTabBarProps = {
    state: any
    descriptors: any
    navigation: any
}

// Animated tab item component
function TabItem({route, index, isFocused, tab, onPress, colors, isDark,}: {route: any
                                                                            index: number
                                                                            isFocused: boolean
                                                                            tab: { name: string; iconActive: string; iconInactive: string }
                                                                            onPress: () => void
                                                                            colors: any
                                                                            isDark: boolean}) {
    const scaleAnim = useRef(new Animated.Value(1)).current
    const translateYAnim = useRef(new Animated.Value(0)).current
    const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.6)).current
    const indicatorWidth = useRef(new Animated.Value(isFocused ? 32 : 0)).current

    useEffect(() => {
        if (isFocused) {
            // bounce up animation on active
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.15,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(translateYAnim, {
                    toValue: -3,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(indicatorWidth, {
                    toValue: 32,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: false,
                }),
            ]).start()
        } else {
            // back to normal on inactive
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(translateYAnim, {
                    toValue: 0,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.6,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(indicatorWidth, {
                    toValue: 0,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: false,
                }),
            ]).start()
        }
    }, [isFocused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
        >
            {/* Animated top indicator */}
            <Animated.View style={[
                styles.activeIndicator,
                {
                    width: indicatorWidth,
                    backgroundColor: Colors.primary,
                }
            ]} />

            {/* Animated icon + label */}
            <Animated.View style={[
                styles.tabContent,
                {
                    transform: [
                        { scale: scaleAnim },
                        { translateY: translateYAnim },
                    ],
                    opacity: opacityAnim,
                }
            ]}>
                <Ionicons
                    name={isFocused ? tab.iconActive : tab.iconInactive}
                    size={20}
                    color={isFocused ? Colors.primary : colors.gray}
                />
                <Text style={[
                    styles.tabLabel,
                    {
                        color: isFocused ? Colors.primary : colors.gray,
                        fontWeight: isFocused ? '600' : '400',
                    }
                ]}>
                    {tab.name}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    )
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
    const { colors, isDark } = useTheme()
    const insets = useSafeAreaInsets()

    const tabs = [
        { name: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
        { name: 'Profile', iconActive: 'person', iconInactive: 'person-outline' },
    ]

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? '#1A1A2E' : '#ffffff',
                borderTopColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.08)',
                paddingBottom: insets.bottom - 20 || 8,
            }
        ]}>
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index
                const tab = tabs[index]

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                return (
                    <TabItem
                        key={route.key}
                        route={route}
                        index={index}
                        isFocused={isFocused}
                        tab={tab}
                        onPress={onPress}
                        colors={colors}
                        isDark={isDark}
                    />
                )
            })}
        </View>
    )
}

// Animated screen wrapper
function AnimatedScreen({ children, focused }: { children: React.ReactNode, focused: boolean }) {
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(10)).current

    useEffect(() => {
        if (focused) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]).start()
        } else {
            fadeAnim.setValue(0)
            slideAnim.setValue(10)
        }
    }, [focused])

    return (
        <Animated.View
            style={[
                styles.screenWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }
            ]}
        >
            {children}
        </Animated.View>
    )
}

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'fade',
            })}>
            <Tab.Screen name="Home">
                {({ navigation, route }) => (
                    <AnimatedScreen focused={true}>
                        <HomeScreen />
                    </AnimatedScreen>
                )}
            </Tab.Screen>
            <Tab.Screen name="Profile">
                {({ navigation, route }) => (
                    <AnimatedScreen focused={true}>
                        <ProfileScreen />
                    </AnimatedScreen>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: width,
        borderTopWidth: 1,
        paddingTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        position: 'relative',
    },
    tabContent: {
        alignItems: 'center',
        gap: 4,
    },
    activeIndicator: {
        position: 'absolute',
        top: -8,
        height: 3,
        borderRadius: 2,
    },
    tabLabel: {
        fontSize: 11,
        letterSpacing: 0.2,
    },
    screenWrapper: {
        flex: 1,
    },
})