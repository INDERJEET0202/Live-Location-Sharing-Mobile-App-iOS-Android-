import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'
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

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
    const { colors, isDark } = useTheme()
    const insets = useSafeAreaInsets()

    const tabs = [
        { name: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
        { name: 'Profile', iconActive: 'person', iconInactive: 'person-outline' },
    ]

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom || 16 }]}>
            <View style={[
                styles.pill,
                {
                    backgroundColor: isDark ? '#1A1A2E' : '#ffffff',
                    shadowColor: isDark ? Colors.primary : '#000',
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
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tabItem}
                        >
                            {/* Active indicator pill */}
                            {isFocused && (
                                <View style={[styles.activePill, { backgroundColor: Colors.primary + '18' }]} />
                            )}

                            <Ionicons
                                name={isFocused ? tab.iconActive : tab.iconInactive}
                                size={22}
                                color={isFocused ? Colors.primary : colors.gray}
                            />

                            <Text style={[
                                styles.tabLabel,
                                { color: isFocused ? Colors.primary : colors.gray }
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    pill: {
        flexDirection: 'row',
        borderRadius: 32,
        paddingVertical: 10,
        paddingHorizontal: 24,
        width: width - 48,
        justifyContent: 'space-evenly',
        // gap: 100,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 6,
        gap: 3,
        position: 'relative',
    },
    activePill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 50,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
})