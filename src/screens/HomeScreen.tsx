import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator, Text, Platform, AppState, AppStateStatus } from 'react-native'
import MapView, { UrlTile, PROVIDER_DEFAULT, Region } from 'react-native-maps'
import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
} from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'
import { Colors } from '../theme/colors'
import { useTheme } from '../theme/theme'

export default function HomeScreen() {
    const { colors, isDark } = useTheme()
    const mapRef = useRef<MapView>(null)

    const [region, setRegion] = useState<Region | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>('checking')

    useEffect(() => {
        requestLocationPermission()
    }, [])

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            async (nextState: AppStateStatus) => {
                if (nextState === 'active') {
                    const permission = Platform.OS === 'ios'
                        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

                    const status = await check(permission)

                    if (status === RESULTS.GRANTED) {
                        setPermissionStatus('granted')
                        getCurrentLocation()
                    } else {
                        setPermissionStatus('denied')
                    }
                }
            }
        )
        return () => subscription.remove()
    }, [])

    const requestLocationPermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            console.log('permission: ', permission)
            const currentStatus = await check(permission)
            console.log('currentStatus: ', currentStatus)
            // ✅ only GRANTED → skip popup
            if (currentStatus === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
                return
            }

            // ✅ only BLOCKED (Never) → can't ask again → show error
            if (currentStatus === RESULTS.BLOCKED) {
                setPermissionStatus('denied')
                return
            }

            // ✅ everything else (DENIED, UNDETERMINED) → show popup
            const result = await request(permission)
            console.log('result: ', result)
            if (result === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
            } else if (result === RESULTS.BLOCKED) {
                setPermissionStatus('denied')
            } else {
                setPermissionStatus('denied')
            }

        } catch (err) {
            console.error('Permission error:', err)
            setPermissionStatus('denied')
        }
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
                setPermissionStatus('granted')
            },
            (error) => {
                console.error('Location error:', error.code, error.message)
                if (error.code === 1) {
                    setPermissionStatus('denied')
                } else {
                    setRegion({
                        latitude: 20.5937,
                        longitude: 78.9629,
                        latitudeDelta: 10,
                        longitudeDelta: 10,
                    })
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
        )
    }

    // permission denied state
    if (permissionStatus === 'denied') {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <Text style={styles.deniedIcon}>📍</Text>
                <Text style={[styles.deniedTitle, { color: colors.text }]}>
                    Location access needed
                </Text>
                <Text style={[styles.deniedSubtext, { color: colors.gray }]}>
                    we need your location to show the map bestie 🥺{'\n'}
                    enable it in Settings → Privacy → Location
                </Text>
            </View>
        )
    }

    // loading state while getting location
    if (permissionStatus === 'checking' || !region) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={[styles.loadingText, { color: colors.gray }]}>
                    finding you on the map... 📍
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}       // ✅ blue dot on user's position
                followsUserLocation={true}     // ✅ map follows as user moves
                showsMyLocationButton={false}  // we'll add custom button later
                showsCompass={false}
            >
                {/* OpenStreetMap tiles */}
                <UrlTile
                    urlTemplate={
                        isDark
                            ? 'https://cartodb-basemaps-a.global.ssl.fastly.net/{z}/{x}/{y}.png'
                            : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
    },
    loadingText: {
        fontSize: 14,
        marginTop: 8,
    },
    deniedIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    deniedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deniedSubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
})