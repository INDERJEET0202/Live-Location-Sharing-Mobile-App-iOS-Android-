// import React, { useEffect, useState, useRef } from 'react'
// import { View, StyleSheet, ActivityIndicator, Text, Platform, AppState, AppStateStatus } from 'react-native'
// import MapView, { UrlTile, PROVIDER_DEFAULT, Region } from 'react-native-maps'
// import {
//     check,
//     request,
//     PERMISSIONS,
//     RESULTS,
// } from 'react-native-permissions'
// import Geolocation from '@react-native-community/geolocation'
// import { Colors } from '../theme/colors'
// import { useTheme } from '../theme/theme'

// export default function HomeScreen() {
//     const { colors, isDark } = useTheme()
//     const mapRef = useRef<MapView>(null)

//     const [region, setRegion] = useState<Region | null>(null)
//     const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>('checking')

//     useEffect(() => {
//         requestLocationPermission()
//     }, [])

//     useEffect(() => {
//         const subscription = AppState.addEventListener(
//             'change',
//             async (nextState: AppStateStatus) => {
//                 if (nextState === 'active') {
//                     const permission = Platform.OS === 'ios'
//                         ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//                         : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

//                     const status = await check(permission)

//                     if (status === RESULTS.GRANTED) {
//                         setPermissionStatus('granted')
//                         getCurrentLocation()
//                     } else {
//                         setPermissionStatus('denied')
//                     }
//                 }
//             }
//         )
//         return () => subscription.remove()
//     }, [])

//     const requestLocationPermission = async () => {
//         try {
//             const permission = Platform.OS === 'ios'
//                 ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//                 : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//             console.log('permission: ', permission)
//             const currentStatus = await check(permission)
//             console.log('currentStatus: ', currentStatus)
//             // ✅ only GRANTED → skip popup
//             if (currentStatus === RESULTS.GRANTED) {
//                 setPermissionStatus('granted')
//                 getCurrentLocation()
//                 return
//             }

//             // ✅ only BLOCKED (Never) → can't ask again → show error
//             if (currentStatus === RESULTS.BLOCKED) {
//                 setPermissionStatus('denied')
//                 return
//             }

//             // ✅ everything else (DENIED, UNDETERMINED) → show popup
//             const result = await request(permission)
//             console.log('result: ', result)
//             if (result === RESULTS.GRANTED) {
//                 setPermissionStatus('granted')
//                 getCurrentLocation()
//             } else if (result === RESULTS.BLOCKED) {
//                 setPermissionStatus('denied')
//             } else {
//                 setPermissionStatus('denied')
//             }

//         } catch (err) {
//             console.error('Permission error:', err)
//             setPermissionStatus('denied')
//         }
//     }

//     const getCurrentLocation = () => {
//         Geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords
//                 setRegion({
//                     latitude,
//                     longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 })
//                 setPermissionStatus('granted')
//             },
//             (error) => {
//                 console.error('Location error:', error.code, error.message)
//                 if (error.code === 1) {
//                     setPermissionStatus('denied')
//                 } else {
//                     setRegion({
//                         latitude: 20.5937,
//                         longitude: 78.9629,
//                         latitudeDelta: 10,
//                         longitudeDelta: 10,
//                     })
//                 }
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 5000,
//             }
//         )
//     }

//     // permission denied state
//     if (permissionStatus === 'denied') {
//         return (
//             <View style={[styles.centered, { backgroundColor: colors.background }]}>
//                 <Text style={styles.deniedIcon}>📍</Text>
//                 <Text style={[styles.deniedTitle, { color: colors.text }]}>
//                     Location access needed
//                 </Text>
//                 <Text style={[styles.deniedSubtext, { color: colors.gray }]}>
//                     we need your location to show the map bestie 🥺{'\n'}
//                     enable it in Settings → Privacy → Location
//                 </Text>
//             </View>
//         )
//     }

//     // loading state while getting location
//     if (permissionStatus === 'checking' || !region) {
//         return (
//             <View style={[styles.centered, { backgroundColor: colors.background }]}>
//                 <ActivityIndicator size="large" color={Colors.primary} />
//                 <Text style={[styles.loadingText, { color: colors.gray }]}>
//                     finding you on the map... 📍
//                 </Text>
//             </View>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             <MapView
//                 ref={mapRef}
//                 provider={PROVIDER_DEFAULT}
//                 style={styles.map}
//                 initialRegion={region}
//                 showsUserLocation={true}       // ✅ blue dot on user's position
//                 followsUserLocation={true}     // ✅ map follows as user moves
//                 showsMyLocationButton={false}  // we'll add custom button later
//                 showsCompass={false}
//             >
//                 {/* OpenStreetMap tiles */}
//                 <UrlTile
//                     urlTemplate={
//                         isDark
//                             ? 'https://cartodb-basemaps-a.global.ssl.fastly.net/{z}/{x}/{y}.png'
//                             : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
//                     }
//                 />
//             </MapView>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     map: {
//         flex: 1,
//     },
//     centered: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 12,
//         padding: 32,
//     },
//     loadingText: {
//         fontSize: 14,
//         marginTop: 8,
//     },
//     deniedIcon: {
//         fontSize: 48,
//         marginBottom: 8,
//     },
//     deniedTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     deniedSubtext: {
//         fontSize: 14,
//         textAlign: 'center',
//         lineHeight: 22,
//     },
// })


import React, { useEffect, useState, useRef } from 'react'
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Platform,
    TouchableOpacity,
    AppState,
    AppStateStatus,
} from 'react-native'
import MapView, { UrlTile, PROVIDER_DEFAULT, Region, Marker } from 'react-native-maps'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'
import { Colors } from '../theme/colors'
import { useTheme } from '../theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    upsertLocation,
    startLocationShare,
    stopAllLocationShares,
    getMyActiveShares,
    getSharesWithMe,
    searchUserByEmail,
    stopLocationShare,
} from '../services/auth'
import { supabase } from '../lib/supabase'
import BottomSheet from '../components/BottomSheet'
import Button from '../components/Button'
import SearchUserSheet from '../components/SearchUserSheet'

type SharedUserLocation = {
    id: string
    lat: number
    lng: number
    profile: {
        id: string
        first_name: string
        last_name: string
        email: string
        avatar_url: string
    }
}

type ActiveShare = {
    id: string
    viewer_id: string
    expires_at: string
    profiles: {
        id: string
        first_name: string
        last_name: string
        email: string
        avatar_url: string
    }
}

export default function HomeScreen() {
    const { colors, isDark } = useTheme()
    const { user } = useAuth()
    const insets = useSafeAreaInsets()
    const mapRef = useRef<MapView>(null)

    const [region, setRegion] = useState<Region | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>('checking')
    const [isSharing, setIsSharing] = useState(false)
    const [activeShares, setActiveShares] = useState<ActiveShare[]>([])
    const [sharedLocations, setSharedLocations] = useState<SharedUserLocation[]>([])
    const [searchSheetVisible, setSearchSheetVisible] = useState(false)
    const [sharesSheetVisible, setSharesSheetVisible] = useState(false)

    const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const realtimeChannelRef = useRef<any>(null)

    // ─── Permission + location ──────────────────────────
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
                    } else if (status === RESULTS.DENIED) {
                        const result = await request(permission)
                        if (result === RESULTS.GRANTED) {
                            setPermissionStatus('granted')
                            getCurrentLocation()
                        } else {
                            setPermissionStatus('denied')
                        }
                    } else {
                        setPermissionStatus('denied')
                    }
                }
            }
        )
        return () => subscription.remove()
    }, [])

    // ─── Load active shares on mount ───────────────────
    useEffect(() => {
        if (user) {
            loadActiveShares()
            subscribeToSharedLocations()
        }
        return () => {
            stopBroadcasting()
            realtimeChannelRef.current?.unsubscribe()
        }
    }, [user])

    // ─── Permission handling ────────────────────────────
    const requestLocationPermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

            const currentStatus = await check(permission)

            if (currentStatus === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
                return
            }

            if (currentStatus === RESULTS.BLOCKED) {
                setPermissionStatus('denied')
                return
            }

            const result = await request(permission)
            if (result === RESULTS.GRANTED) {
                setPermissionStatus('granted')
                getCurrentLocation()
            } else if (result === RESULTS.BLOCKED) {
                setPermissionStatus('denied')
            } else {
                setPermissionStatus('denied')
            }
        } catch (err) {
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
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        )
    }

    // ─── Location broadcasting ──────────────────────────
    const startBroadcasting = () => {
        // broadcast immediately then every 5 seconds
        broadcastLocation()
        locationIntervalRef.current = setInterval(broadcastLocation, 5000)
    }

    const stopBroadcasting = () => {
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current)
            locationIntervalRef.current = null
        }
    }

    const broadcastLocation = () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    await upsertLocation(latitude, longitude)
                } catch (err) {
                    console.error('Failed to broadcast location:', err)
                }
            },
            (err) => console.error('Broadcast location error:', err),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
        )
    }

    // ─── Start sharing with a user ──────────────────────
    const handleStartSharing = async (viewerId: string) => {
        try {
            await startLocationShare(viewerId)
            setIsSharing(true)
            startBroadcasting()
            setSearchSheetVisible(false)
            await loadActiveShares()
        } catch (err: any) {
            console.error('Failed to start sharing:', err.message)
        }
    }

    // ─── Stop all sharing ───────────────────────────────
    const handleStopSharing = async () => {
        try {
            await stopAllLocationShares()
            stopBroadcasting()
            setIsSharing(false)
            setActiveShares([])
        } catch (err: any) {
            console.error('Failed to stop sharing:', err.message)
        }
    }

    // ─── Stop sharing with specific user ───────────────
    const handleStopShareWithUser = async (shareId: string) => {
        try {
            await stopLocationShare(shareId)
            const updated = activeShares.filter(s => s.id !== shareId)
            setActiveShares(updated)
            if (updated.length === 0) {
                stopBroadcasting()
                setIsSharing(false)
            }
        } catch (err: any) {
            console.error('Failed to stop share:', err.message)
        }
    }

    // ─── Load active shares ─────────────────────────────
    const loadActiveShares = async () => {
        try {
            const shares = await getMyActiveShares()
            setActiveShares(shares as any)
            if (shares && shares.length > 0) {
                setIsSharing(true)
                if (!locationIntervalRef.current) {
                    startBroadcasting()
                }
            }
        } catch (err) {
            console.error('Failed to load shares:', err)
        }
    }

    // ─── Realtime subscription ──────────────────────────
    const subscribeToSharedLocations = async () => {
        try {
            const sharesWithMe = await getSharesWithMe()
            if (!sharesWithMe || sharesWithMe.length === 0) return

            const ownerIds = sharesWithMe.map((s: any) => s.owner_id)

            realtimeChannelRef.current = supabase
                .channel('shared-locations')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'locations',
                        filter: `id=in.(${ownerIds.join(',')})`,
                    },
                    (payload) => {
                        const updated = payload.new as any
                        if (!updated) return

                        setSharedLocations(prev => {
                            const existing = prev.find(l => l.id === updated.id)
                            const profile = sharesWithMe.find(
                                (s: any) => s.owner_id === updated.id
                            )?.profiles

                            if (existing) {
                                return prev.map(l =>
                                    l.id === updated.id
                                        ? { ...l, lat: updated.lat, lng: updated.lng }
                                        : l
                                )
                            }
                            return [...prev, {
                                id: updated.id,
                                lat: updated.lat,
                                lng: updated.lng,
                                profile,
                            }]
                        })
                    }
                )
                .subscribe()
        } catch (err) {
            console.error('Realtime subscription error:', err)
        }
    }

    // ─── Render states ──────────────────────────────────
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
            {/* Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
                followsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
            >
                <UrlTile
                    urlTemplate={
                        isDark
                            ? 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                            : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                    maximumZ={19}
                    flipY={false}
                />

                {/* Shared users' location markers */}
                {sharedLocations.map((loc) => (
                    <Marker
                        key={loc.id}
                        coordinate={{ latitude: loc.lat, longitude: loc.lng }}
                        title={loc.profile
                            ? `${loc.profile.first_name} ${loc.profile.last_name}`.trim()
                            : 'Unknown'
                        }
                    >
                        <View style={styles.markerContainer}>
                            <View style={[styles.marker, { backgroundColor: Colors.primary }]}>
                                <Text style={styles.markerInitials}>
                                    {loc.profile?.first_name?.[0]?.toUpperCase() ?? '?'}
                                </Text>
                            </View>
                            <View style={[styles.markerTail, { borderTopColor: Colors.primary }]} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Top right — + button */}
            <View style={[styles.topControls, { top: insets.top + 16 }]}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: isDark ? '#1A1A2E' : '#fff' }]}
                    onPress={() => setSearchSheetVisible(true)}
                >
                    <Ionicons name="person-add-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>

                {/* Active shares count badge */}
                {activeShares.length > 0 && (
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: isDark ? '#1A1A2E' : '#fff' }]}
                        onPress={() => setSharesSheetVisible(true)}
                    >
                        <Ionicons name="people-outline" size={20} color={Colors.primary} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activeShares.length}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Bottom — sharing status pill */}
            {isSharing && (
                <View style={[styles.sharingPill, { bottom: insets.bottom + 90 }]}>
                    <View style={styles.sharingDot} />
                    <Text style={styles.sharingText}>
                        Sharing live location
                    </Text>
                    <TouchableOpacity onPress={handleStopSharing}>
                        <Text style={styles.stopText}>Stop</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Recenter button */}
            <TouchableOpacity
                style={[
                    styles.recenterButton,
                    {
                        bottom: insets.bottom - 1,
                        backgroundColor: isDark ? '#1A1A2E' : '#fff',
                        right: 26,
                    }
                ]}
                onPress={() => {
                    if (region) {
                        mapRef.current?.animateToRegion(region, 500)
                        getCurrentLocation()
                    }
                }}
            >
                <Ionicons name="locate-outline" size={25} color={Colors.primary} />
            </TouchableOpacity>

            {/* Search user sheet */}
            <SearchUserSheet
                visible={searchSheetVisible}
                onClose={() => setSearchSheetVisible(false)}
                onShare={handleStartSharing}
            />

            {/* Active shares sheet */}
            <BottomSheet
                visible={sharesSheetVisible}
                onClose={() => setSharesSheetVisible(false)}
                title="Sharing with"
            >
                {activeShares.length === 0 ? (
                    <Text style={[styles.emptyText, { color: colors.gray }]}>
                        not sharing with anyone rn 👀
                    </Text>
                ) : (
                    activeShares.map((share) => (
                        <View key={share.id} style={styles.shareItem}>
                            <View style={[styles.shareAvatar, { backgroundColor: Colors.primary + '22' }]}>
                                <Text style={[styles.shareAvatarText, { color: Colors.primary }]}>
                                    {(share.profiles as any)?.first_name?.[0]?.toUpperCase() ?? '?'}
                                </Text>
                            </View>
                            <View style={styles.shareInfo}>
                                <Text style={[styles.shareName, { color: colors.text }]}>
                                    {(share.profiles as any)?.first_name} {(share.profiles as any)?.last_name}
                                </Text>
                                <Text style={[styles.shareExpiry, { color: colors.gray }]}>
                                    expires {new Date(share.expires_at).toLocaleTimeString()}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleStopShareWithUser(share.id)}
                                style={styles.stopShareButton}
                            >
                                <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
    },
    loadingText: { fontSize: 14, marginTop: 8 },
    deniedIcon: { fontSize: 48, marginBottom: 8 },
    deniedTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    deniedSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
    topControls: {
        position: 'absolute',
        right: 16,
        gap: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    sharingPill: {
        position: 'absolute',
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    sharingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    sharingText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    stopText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '600',
    },
    recenterButton: {
        position: 'absolute',
        width: 54,
        height: 54,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    markerContainer: {
        alignItems: 'center',
    },
    marker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerInitials: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    markerTail: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginTop: -1,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 16,
    },
    shareItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    shareAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareAvatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    shareInfo: { flex: 1 },
    shareName: { fontSize: 15, fontWeight: '600' },
    shareExpiry: { fontSize: 12 },
    stopShareButton: { padding: 4 },
})