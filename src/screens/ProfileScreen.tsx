// import React, { useState, useRef, useEffect } from 'react'
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     Animated,
//     Easing,
//     Alert,
//     Dimensions,
// } from 'react-native'
// import LinearGradient from 'react-native-linear-gradient'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import { useTheme } from '../theme/theme'
// import { Colors } from '../theme/colors'
// import { useAuth } from '../context/AuthContext'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { getProfile } from '../services/auth'
// import BottomSheet from '../components/BottomSheet'

// const { width } = Dimensions.get('window')

// type MenuItem = {
//     id: string
//     icon: string
//     label: string
//     sublabel?: string
//     danger?: boolean
//     onPress: () => void
// }

// export default function ProfileScreen() {
//     const { colors, isDark } = useTheme()
//     const { user, signOut } = useAuth()
//     console.log(user);
//     const insets = useSafeAreaInsets()
//     const [profile, setProfile] = useState<{
//         first_name: string
//         last_name: string
//         avatar_url: string
//     } | null>(null)

//     // Animations
//     const fadeAnim = useRef(new Animated.Value(0)).current
//     const slideAnim = useRef(new Animated.Value(30)).current
//     const avatarScale = useRef(new Animated.Value(0.8)).current

//     useEffect(() => {
//         if (user?.id) {
//             getProfile(user.id)
//                 .then((data) => {
//                     if (data) setProfile(data)
//                 })
//                 .catch(console.error)
//         }
//     }, [user?.id])
//     console.log(profile)
//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 500,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(slideAnim, {
//                 toValue: 0,
//                 duration: 500,
//                 easing: Easing.out(Easing.cubic),
//                 useNativeDriver: true,
//             }),
//             Animated.spring(avatarScale, {
//                 toValue: 1,
//                 friction: 6,
//                 tension: 80,
//                 useNativeDriver: true,
//             }),
//         ]).start()
//     }, [])

//     const handleLogout = () => {
//         Alert.alert(
//             'Signing out',
//             'you sure you wanna leave? 👀',
//             [
//                 { text: 'nah stay', style: 'cancel' },
//                 {
//                     text: 'yeah bye 👋',
//                     style: 'destructive',
//                     onPress: signOut,
//                 },
//             ]
//         )
//     }

//     const menuItems: MenuItem[] = [
//         {
//             id: 'edit',
//             icon: 'person-outline',
//             label: 'Edit Profile',
//             sublabel: 'Update your name',
//             onPress: () => { },   // will wire up later
//         },
//         {
//             id: 'privacy',
//             icon: 'shield-checkmark-outline',
//             label: 'Privacy Settings',
//             sublabel: 'Control your data',
//             onPress: () => { },
//         },
//         {
//             id: 'help',
//             icon: 'help-circle-outline',
//             label: 'Help & Support',
//             sublabel: 'We got you bestie',
//             onPress: () => { },
//         },
//         {
//             id: 'logout',
//             icon: 'log-out-outline',
//             label: 'Sign Out',
//             danger: true,
//             onPress: handleLogout,
//         },
//     ]

//     // format member since date
//     const memberSince = user?.created_at
//         ? new Date(user.created_at).toLocaleDateString('en-US', {
//             month: 'long',
//             year: 'numeric',
//         })
//         : 'Recently joined'

//     // get initials for avatar placeholder
//     const email = user?.email ?? ''
//     // const initials = email.slice(0, 2).toUpperCase()
//     const firstName = profile?.first_name ?? ''
//     const lastName = profile?.last_name ?? ''
//     const displayName = firstName || lastName
//         ? `${firstName} ${lastName}`.trim()
//         : email   // fallback to email if no name set yet
//     const initials = firstName && lastName
//         ? `${firstName[0]}${lastName[0]}`.toUpperCase()
//         : email.slice(0, 2).toUpperCase()
//     return (
//         <LinearGradient
//             colors={isDark
//                 ? [Colors.backgroundDark, '#2D1B69', Colors.primary]
//                 : ['#F8F5FF', '#EDE8FF', '#DDD5FF']
//             }
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.gradient}
//         >
//             {/* Decorative circles */}
//             <View style={styles.circle1} />
//             <View style={styles.circle2} />

//             <ScrollView
//                 contentContainerStyle={[
//                     styles.scrollContent,
//                     { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
//                 ]}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Header */}
//                 <Animated.View
//                     style={[
//                         styles.header,
//                         { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//                     ]}
//                 >
//                     <Text style={[styles.headerTitle, { color: isDark ? '#fff' : Colors.backgroundDark }]}>
//                         Profile
//                     </Text>
//                 </Animated.View>

//                 {/* Avatar section */}
//                 <Animated.View
//                     style={[
//                         styles.avatarSection,
//                         { transform: [{ scale: avatarScale }], opacity: fadeAnim },
//                     ]}
//                 >
//                     {/* Avatar ring */}
//                     <View style={[styles.avatarRing, { borderColor: Colors.primary + '60' }]}>
//                         <LinearGradient
//                             colors={[Colors.primary, '#4C1D95']}
//                             start={{ x: 0, y: 0 }}
//                             end={{ x: 1, y: 1 }}
//                             style={styles.avatarGradient}
//                         >
//                             <Text style={styles.avatarInitials}>{initials}</Text>
//                         </LinearGradient>
//                     </View>

//                     <Text style={[styles.emailText, { color: isDark ? '#fff' : Colors.backgroundDark }]}>
//                         {displayName}
//                     </Text>

//                     <View style={[styles.memberBadge, { backgroundColor: Colors.primary + '22' }]}>
//                         <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
//                         <Text style={[styles.memberText, { color: Colors.primary }]}>
//                             Member since {memberSince}
//                         </Text>
//                     </View>
//                 </Animated.View>

//                 {/* Menu card */}
//                 <Animated.View
//                     style={[
//                         styles.menuCard,
//                         {
//                             backgroundColor: isDark ? '#1A1A2E' : '#ffffff',
//                             opacity: fadeAnim,
//                             transform: [{ translateY: slideAnim }],
//                         },
//                     ]}
//                 >
//                     {menuItems.map((item, index) => (
//                         <View key={item.id}>
//                             <TouchableOpacity
//                                 onPress={item.onPress}
//                                 activeOpacity={0.7}
//                                 style={styles.menuItem}
//                             >
//                                 {/* Icon badge */}
//                                 <View style={[
//                                     styles.menuIconBadge,
//                                     {
//                                         backgroundColor: item.danger
//                                             ? '#EF444418'
//                                             : Colors.primary + '18',
//                                     },
//                                 ]}>
//                                     <Ionicons
//                                         name={item.icon}
//                                         size={18}
//                                         color={item.danger ? '#EF4444' : Colors.primary}
//                                     />
//                                 </View>

//                                 {/* Label */}
//                                 <View style={styles.menuLabelWrapper}>
//                                     <Text style={[
//                                         styles.menuLabel,
//                                         {
//                                             color: item.danger
//                                                 ? '#EF4444'
//                                                 : colors.text,
//                                         },
//                                     ]}>
//                                         {item.label}
//                                     </Text>
//                                     {item.sublabel && (
//                                         <Text style={[styles.menuSublabel, { color: colors.gray }]}>
//                                             {item.sublabel}
//                                         </Text>
//                                     )}
//                                 </View>

//                                 {/* Arrow */}
//                                 {!item.danger && (
//                                     <Ionicons
//                                         name="chevron-forward"
//                                         size={16}
//                                         color={colors.gray}
//                                     />
//                                 )}
//                             </TouchableOpacity>

//                             {/* Divider — not after last item */}
//                             {index < menuItems.length - 1 && (
//                                 <View style={[
//                                     styles.divider,
//                                     {
//                                         backgroundColor: isDark
//                                             ? 'rgba(255,255,255,0.06)'
//                                             : 'rgba(0,0,0,0.05)',
//                                     },
//                                 ]} />
//                             )}
//                         </View>
//                     ))}
//                 </Animated.View>

//                 {/* App version */}
//                 <Text style={[styles.version, { color: colors.gray }]}>
//                     LiveLocation v1.0.0
//                 </Text>

//             </ScrollView>
//         </LinearGradient>
//     )
// }

// const styles = StyleSheet.create({
//     gradient: {
//         flex: 1,
//     },
//     circle1: {
//         position: 'absolute',
//         width: 300,
//         height: 300,
//         borderRadius: 150,
//         backgroundColor: 'rgba(255,255,255,0.05)',
//         top: 40,
//         left: -80,
//     },
//     circle2: {
//         position: 'absolute',
//         width: 200,
//         height: 200,
//         borderRadius: 100,
//         backgroundColor: 'rgba(255,255,255,0.04)',
//         top: 10,
//         right: -50,
//     },
//     scrollContent: {
//         paddingHorizontal: 24,
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 32,
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },
//     avatarSection: {
//         alignItems: 'center',
//         marginBottom: 32,
//     },
//     avatarRing: {
//         width: 96,
//         height: 96,
//         borderRadius: 48,
//         borderWidth: 2.5,
//         padding: 3,
//         marginBottom: 14,
//     },
//     avatarGradient: {
//         flex: 1,
//         borderRadius: 44,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     avatarInitials: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#fff',
//         letterSpacing: 1,
//     },
//     emailText: {
//         fontSize: 15,
//         fontWeight: '600',
//         marginBottom: 8,
//     },
//     memberBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//         borderRadius: 20,
//         gap: 5,
//     },
//     memberText: {
//         fontSize: 12,
//         fontWeight: '500',
//     },
//     menuCard: {
//         borderRadius: 24,
//         overflow: 'hidden',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.12,
//         shadowRadius: 24,
//         elevation: 8,
//         marginBottom: 24,
//     },
//     menuItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 16,
//         paddingHorizontal: 20,
//         gap: 14,
//     },
//     menuIconBadge: {
//         width: 38,
//         height: 38,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     menuLabelWrapper: {
//         flex: 1,
//         gap: 2,
//     },
//     menuLabel: {
//         fontSize: 15,
//         fontWeight: '600',
//     },
//     menuSublabel: {
//         fontSize: 12,
//     },
//     divider: {
//         height: 1,
//         marginLeft: 72,
//     },
//     version: {
//         fontSize: 11,
//         textAlign: 'center',
//         opacity: 0.5,
//         marginBottom: 8,
//     },
// })


import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing,
    Alert,
    Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from '../theme/theme'
import { Colors } from '../theme/colors'
import { useAuth } from '../context/AuthContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getProfile, updateProfile } from '../services/auth'
import BottomSheet from '../components/BottomSheet'
import Button from '../components/Button'

const { width } = Dimensions.get('window')

type MenuItem = {
    id: string
    icon: string
    label: string
    sublabel?: string
    danger?: boolean
    onPress: () => void
}

export default function ProfileScreen() {
    const { colors, isDark } = useTheme()
    const { user, signOut } = useAuth()
    const insets = useSafeAreaInsets()

    const [profile, setProfile] = useState<{
        first_name: string
        last_name: string
        avatar_url: string
    } | null>(null)

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [saving, setSaving] = useState(false)
    const [editError, setEditError] = useState<string | null>(null)
    const [privacyVisible, setPrivacyVisible] = useState(false)
    const [helpVisible, setHelpVisible] = useState(false)

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(30)).current
    const avatarScale = useRef(new Animated.Value(0.8)).current

    useEffect(() => {
        if (user?.id) {
            getProfile(user.id)
                .then((data) => {
                    if (data) setProfile(data)
                })
                .catch(console.error)
        }
    }, [user?.id])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(avatarScale, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    const openEditModal = () => {
        setFirstName(profile?.first_name ?? '')
        setLastName(profile?.last_name ?? '')
        setEditError(null)
        setEditModalVisible(true)
    }

    const closeEditModal = () => {
        setEditModalVisible(false)
    }

    const handleSave = async () => {
        if (!firstName.trim()) {
            setEditError("first name can't be empty bestie 👀")
            return
        }

        setSaving(true)
        setEditError(null)
        try {
            await updateProfile(user!.id, {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            })
            setProfile(prev => prev
                ? { ...prev, first_name: firstName.trim(), last_name: lastName.trim() }
                : prev
            )
            closeEditModal()
        } catch (err: any) {
            setEditError("couldn't save rn 😭 try again?")
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = () => {
        Alert.alert(
            'Signing out',
            'you sure you wanna leave? 👀',
            [
                { text: 'nah stay', style: 'cancel' },
                {
                    text: 'yeah bye 👋',
                    style: 'destructive',
                    onPress: signOut,
                },
            ]
        )
    }

    const menuItems: MenuItem[] = [
        {
            id: 'edit',
            icon: 'person-outline',
            label: 'Edit Profile',
            sublabel: 'Update your name',
            onPress: openEditModal,
        },
        {
            id: 'privacy',
            icon: 'shield-checkmark-outline',
            label: 'Privacy Settings',
            sublabel: 'Control your data',
            onPress: () => setPrivacyVisible(true),
        },
        {
            id: 'help',
            icon: 'help-circle-outline',
            label: 'Help & Support',
            sublabel: 'We got you bestie',
            onPress: () => setHelpVisible(true),
        },
        {
            id: 'logout',
            icon: 'log-out-outline',
            label: 'Sign Out',
            danger: true,
            onPress: handleLogout,
        },
    ]

    // Derived values
    const email = user?.email ?? ''
    const firstName_ = profile?.first_name ?? ''
    const lastName_ = profile?.last_name ?? ''
    const displayName = firstName_ || lastName_
        ? `${firstName_} ${lastName_}`.trim()
        : email
    const avatarUrl = profile?.avatar_url ?? null
    const initials = firstName_ && lastName_
        ? `${firstName_[0]}${lastName_[0]}`.toUpperCase()
        : email.slice(0, 2).toUpperCase()
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })
        : 'Recently joined'

    return (
        <>
            <LinearGradient
                colors={isDark
                    ? [Colors.backgroundDark, '#2D1B69', Colors.primary]
                    : ['#F8F5FF', '#EDE8FF', '#DDD5FF']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />

                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : Colors.backgroundDark }]}>
                            Profile
                        </Text>
                    </Animated.View>

                    {/* Avatar section */}
                    <Animated.View
                        style={[
                            styles.avatarSection,
                            { transform: [{ scale: avatarScale }], opacity: fadeAnim },
                        ]}
                    >
                        {/* <View style={[styles.avatarRing, { borderColor: Colors.primary + '60' }]}>
                            {avatarUrl ? (
                                <Image
                                    source={{ uri: avatarUrl }}
                                    style={styles.avatarImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <LinearGradient
                                    colors={[Colors.primary, '#4C1D95']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.avatarGradient}
                                >
                                    <Text style={styles.avatarInitials}>{initials}</Text>
                                </LinearGradient>
                            )}
                        </View> */}
                        <View style={[styles.avatarRing, { borderColor: Colors.primary + '60' }]}>
                            <LinearGradient
                                colors={[Colors.primary, '#4C1D95']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarInitials}>{initials}</Text>
                            </LinearGradient>
                        </View>

                        <Text style={[styles.displayName, { color: isDark ? '#fff' : Colors.backgroundDark }]}>
                            {displayName}
                        </Text>

                        <Text style={[styles.emailSubtext, { color: colors.gray }]}>
                            {email}
                        </Text>

                        <View style={[styles.memberBadge, { backgroundColor: Colors.primary + '22' }]}>
                            <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                            <Text style={[styles.memberText, { color: Colors.primary }]}>
                                Member since {memberSince}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Menu card */}
                    <Animated.View
                        style={[
                            styles.menuCard,
                            {
                                backgroundColor: isDark ? '#1A1A2E' : '#ffffff',
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {menuItems.map((item, index) => (
                            <View key={item.id}>
                                <TouchableOpacity
                                    onPress={item.onPress}
                                    activeOpacity={0.7}
                                    style={styles.menuItem}
                                >
                                    <View style={[
                                        styles.menuIconBadge,
                                        {
                                            backgroundColor: item.danger
                                                ? '#EF444418'
                                                : Colors.primary + '18',
                                        },
                                    ]}>
                                        <Ionicons
                                            name={item.icon}
                                            size={18}
                                            color={item.danger ? '#EF4444' : Colors.primary}
                                        />
                                    </View>

                                    <View style={styles.menuLabelWrapper}>
                                        <Text style={[
                                            styles.menuLabel,
                                            { color: item.danger ? '#EF4444' : colors.text },
                                        ]}>
                                            {item.label}
                                        </Text>
                                        {item.sublabel && (
                                            <Text style={[styles.menuSublabel, { color: colors.gray }]}>
                                                {item.sublabel}
                                            </Text>
                                        )}
                                    </View>

                                    {!item.danger && (
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color={colors.gray}
                                        />
                                    )}
                                </TouchableOpacity>

                                {index < menuItems.length - 1 && (
                                    <View style={[
                                        styles.divider,
                                        {
                                            backgroundColor: isDark
                                                ? 'rgba(255,255,255,0.06)'
                                                : 'rgba(0,0,0,0.05)',
                                        },
                                    ]} />
                                )}
                            </View>
                        ))}
                    </Animated.View>

                    {/* App version */}
                    <Text style={[styles.version, { color: colors.gray }]}>
                        LiveLocation v1.0.0
                    </Text>
                </ScrollView>
            </LinearGradient>

            {/* Edit Profile Bottom Sheet — outside ScrollView and LinearGradient */}
            <BottomSheet
                visible={editModalVisible}
                onClose={closeEditModal}
                title="Edit Profile"
            >
                {/* First name */}
                <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        First name
                    </Text>
                    <View style={[
                        styles.fieldInput,
                        {
                            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                        },
                    ]}>
                        <TextInput
                            value={firstName}
                            onChangeText={(val) => {
                                setFirstName(val)
                                setEditError(null)
                            }}
                            placeholder="Enter first name"
                            placeholderTextColor={colors.gray}
                            style={[styles.fieldTextInput, { color: colors.text }]}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* Last name */}
                <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        Last name
                    </Text>
                    <View style={[
                        styles.fieldInput,
                        {
                            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                        },
                    ]}>
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                            placeholderTextColor={colors.gray}
                            style={[styles.fieldTextInput, { color: colors.text }]}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* Error */}
                {editError && (
                    <View style={styles.editErrorRow}>
                        <Text style={styles.editErrorDot}>●</Text>
                        <Text style={styles.editErrorText}>{editError}</Text>
                    </View>
                )}

                {/* Save button */}
                <Button
                    label="Save Changes"
                    onPress={handleSave}
                    loading={saving}
                />
            </BottomSheet>
            {/* Privacy Settings Sheet */}
            <BottomSheet
                visible={privacyVisible}
                onClose={() => setPrivacyVisible(false)}
                title="Privacy Settings"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 420 }}
                >
                    <View style={styles.sheetContent}>

                        {/* What we collect */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="server-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    What we collect
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                We collect your email address, first and last name, and real-time location data only when you actively share it with trusted contacts.
                            </Text>
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* Location data */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="location-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    How we use location
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                Your location is only shared with people you explicitly trust and approve. We never store your location history. Sharing stops the moment you turn it off.
                            </Text>
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* Data deletion */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: '#EF444418' }]}>
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    Data deletion
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                You can request full deletion of your account and all associated data at any time by contacting us at privacy@livelocation.app. We'll process it within 7 days.
                            </Text>
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* Third party */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="git-network-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    Third party services
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                We use Supabase for secure authentication and data storage, and DiceBear for avatar generation. No data is sold to advertisers. Ever.
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </BottomSheet>

            {/* Help & Support Sheet */}
            <BottomSheet
                visible={helpVisible}
                onClose={() => setHelpVisible(false)}
                title="Help & Support"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 420 }}
                >
                    <View style={styles.sheetContent}>

                        {/* FAQ */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    FAQ
                                </Text>
                            </View>
                            {[
                                {
                                    q: 'How do I share my location?',
                                    a: 'Go to the Home screen, tap "Share Location" and select a trusted contact to share with.',
                                },
                                {
                                    q: 'Can others see my location without my permission?',
                                    a: 'Never. You are always in full control of who sees your location and when.',
                                },
                                {
                                    q: 'How do I stop sharing?',
                                    a: 'Tap "Stop Sharing" on the Home screen at any time. Sharing stops instantly.',
                                },
                            ].map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <Text style={[styles.faqQuestion, { color: colors.text }]}>
                                        Q: {item.q}
                                    </Text>
                                    <Text style={[styles.faqAnswer, { color: colors.gray }]}>
                                        {item.a}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* Contact us */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="mail-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    Contact us
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                Got a question or just wanna say hi? We're here 👋
                            </Text>
                            <TouchableOpacity
                                style={[styles.contactButton, { borderColor: Colors.primary + '40' }]}
                                onPress={() => {
                                    // will wire up with Linking.openURL later
                                }}
                            >
                                <Ionicons name="mail" size={15} color={Colors.primary} />
                                <Text style={[styles.contactButtonText, { color: Colors.primary }]}>
                                    support@livelocation.app
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* Report a bug */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: '#EF444418' }]}>
                                    <Ionicons name="bug-outline" size={16} color="#EF4444" />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    Report a bug
                                </Text>
                            </View>
                            <Text style={[styles.infoText, { color: colors.gray }]}>
                                Found something broken? spill the tea 🍵
                            </Text>
                            <TouchableOpacity
                                style={[styles.contactButton, { borderColor: '#EF444440' }]}
                                onPress={() => {
                                    // will wire up with Linking.openURL later
                                    // Linking.openURL('mailto:support@livelocation.app')
                                }}
                            >
                                <Ionicons name="bug" size={15} color="#EF4444" />
                                <Text style={[styles.contactButtonText, { color: '#EF4444' }]}>
                                    bugs@livelocation.app
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.sheetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]} />

                        {/* App version */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoSectionHeader}>
                                <View style={[styles.infoIconBadge, { backgroundColor: Colors.primary + '18' }]}>
                                    <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
                                </View>
                                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                                    App info
                                </Text>
                            </View>
                            <View style={styles.appInfoRow}>
                                <Text style={[styles.appInfoLabel, { color: colors.gray }]}>Version</Text>
                                <Text style={[styles.appInfoValue, { color: colors.text }]}>1.0.0</Text>
                            </View>
                            <View style={styles.appInfoRow}>
                                <Text style={[styles.appInfoLabel, { color: colors.gray }]}>Build</Text>
                                <Text style={[styles.appInfoValue, { color: colors.text }]}>100</Text>
                            </View>
                            <View style={styles.appInfoRow}>
                                <Text style={[styles.appInfoLabel, { color: colors.gray }]}>Platform</Text>
                                <Text style={[styles.appInfoValue, { color: colors.text }]}>React Native</Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </BottomSheet>
        </>
    )
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: 40,
        left: -80,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.04)',
        top: 10,
        right: -50,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2.5,
        padding: 3,
        marginBottom: 14,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 44,
    },
    avatarGradient: {
        flex: 1,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    displayName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    emailSubtext: {
        fontSize: 13,
        marginBottom: 8,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
    },
    memberText: {
        fontSize: 12,
        fontWeight: '500',
    },
    menuCard: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 14,
    },
    menuIconBadge: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabelWrapper: {
        flex: 1,
        gap: 2,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    menuSublabel: {
        fontSize: 12,
    },
    divider: {
        height: 1,
        marginLeft: 72,
    },
    version: {
        fontSize: 11,
        textAlign: 'center',
        opacity: 0.5,
        marginBottom: 8,
    },
    fieldGroup: {
        gap: 8,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    fieldInput: {
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 14,
    },
    fieldTextInput: {
        fontSize: 15,
        paddingVertical: 14,
    },
    editErrorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    editErrorDot: {
        fontSize: 6,
        color: '#EF4444',
    },
    editErrorText: {
        fontSize: 12,
        color: '#EF4444',
        flex: 1,
    },

    sheetContent: {
        gap: 4,
        paddingBottom: 8,
    },
    infoSection: {
        paddingVertical: 12,
        gap: 10,
    },
    infoSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
    sheetDivider: {
        height: 1,
        marginVertical: 4,
    },
    faqItem: {
        gap: 4,
        marginBottom: 10,
    },
    faqQuestion: {
        fontSize: 13,
        fontWeight: '600',
    },
    faqAnswer: {
        fontSize: 12,
        lineHeight: 18,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    contactButtonText: {
        fontSize: 13,
        fontWeight: '500',
    },
    appInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    appInfoLabel: {
        fontSize: 13,
    },
    appInfoValue: {
        fontSize: 13,
        fontWeight: '500',
    },
})