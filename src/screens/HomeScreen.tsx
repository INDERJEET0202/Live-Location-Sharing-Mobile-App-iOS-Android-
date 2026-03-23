// import React from 'react'
// import { View, Text, StyleSheet } from 'react-native'
// import { useTheme } from '../theme/theme'

// export default function HomeScreen() {
//     const { colors } = useTheme()
//     return (
//         <View style={[styles.container, { backgroundColor: colors.background }]}>
//             <Text style={[styles.text, { color: colors.text }]}>
//                 Home Screen
//             </Text>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//     text: { fontSize: 24, fontWeight: 'bold' },
// })


import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Platform,
} from 'react-native'
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

    const requestLocationPermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

            // check current status first
            const currentStatus = await check(permission)
            console.log(currentStatus);
            if (currentStatus === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
                return
            }

            // request if not granted
            const result = await request(permission)

            if (result === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
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
                const userRegion: Region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,   // zoomed in — street level
                    longitudeDelta: 0.01,
                }
                setRegion(userRegion)
            },
            (error) => {
                console.error('Location error:', error)
                // fallback to India center
                setRegion({
                    latitude: 20.5937,
                    longitude: 78.9629,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                })
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
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
                    urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
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