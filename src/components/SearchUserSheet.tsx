import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import BottomSheet from './BottomSheet'
import { useTheme } from '../theme/theme'
import { Colors } from '../theme/colors'
import { searchUserByEmail } from '../services/auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from './Button'

type Profile = {
    id: string
    email: string
    first_name: string
    last_name: string
    avatar_url: string
}

type Props = {
    visible: boolean
    onClose: () => void
    onShare: (viewerId: string) => void
}

export default function SearchUserSheet({ visible, onClose, onShare }: Props) {
    const { colors, isDark } = useTheme()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Profile[]>([])
    const [searching, setSearching] = useState(false)
    const [selected, setSelected] = useState<Profile | null>(null)
    const [sharing, setSharing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) return
        setSearching(true)
        setError(null)
        setResults([])
        setSelected(null)
        try {
            const data = await searchUserByEmail(query.trim())
            if (!data || data.length === 0) {
                setError("no one found with that email bestie 👀")
            } else {
                setResults(data)
            }
        } catch (err: any) {
            setError("something went wrong 😭 try again?")
        } finally {
            setSearching(false)
        }
    }

    const handleShare = async () => {
        if (!selected) return
        setSharing(true)
        try {
            await onShare(selected.id)
            setQuery('')
            setResults([])
            setSelected(null)
        } catch (err) {
            setError("couldn't start sharing rn 😭")
        } finally {
            setSharing(false)
        }
    }

    const handleClose = () => {
        setQuery('')
        setResults([])
        setSelected(null)
        setError(null)
        onClose()
    }

    return (
        <BottomSheet
            visible={visible}
            onClose={handleClose}
            title="Share location with"
        >
            {/* Search input */}
            <View style={[
                styles.inputWrapper,
                {
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                }
            ]}>
                <Ionicons name="search-outline" size={16} color={colors.gray} />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search by email"
                    placeholderTextColor={colors.gray}
                    style={[styles.input, { color: colors.text }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {searching && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>

            {/* Search button */}
            <Button
                label="Search"
                onPress={handleSearch}
                loading={searching}
            />

            {/* Error */}
            {error && (
                <View style={styles.errorRow}>
                    <Text style={styles.errorDot}>●</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Results */}
            {results.map((profile) => (
                <TouchableOpacity
                    key={profile.id}
                    onPress={() => setSelected(profile)}
                    style={[
                        styles.resultItem,
                        {
                            backgroundColor: selected?.id === profile.id
                                ? Colors.primary + '18'
                                : 'transparent',
                            borderColor: selected?.id === profile.id
                                ? Colors.primary + '40'
                                : 'transparent',
                        }
                    ]}
                >
                    <View style={[styles.avatar, { backgroundColor: Colors.primary + '22' }]}>
                        <Text style={[styles.avatarText, { color: Colors.primary }]}>
                            {profile.first_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.resultInfo}>
                        <Text style={[styles.resultName, { color: colors.text }]}>
                            {profile.first_name && profile.last_name
                                ? `${profile.first_name} ${profile.last_name}`
                                : profile.email
                            }
                        </Text>
                        <Text style={[styles.resultEmail, { color: colors.gray }]}>
                            {profile.email}
                        </Text>
                    </View>
                    {selected?.id === profile.id && (
                        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    )}
                </TouchableOpacity>
            ))}

            {/* Share button */}
            {selected && (
                <Button
                    label={`Share location with ${selected.first_name || selected.email}`}
                    onPress={handleShare}
                    loading={sharing}
                />
            )}
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 14,
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 14,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    errorDot: { fontSize: 6, color: '#EF4444' },
    errorText: { fontSize: 12, color: '#EF4444', flex: 1 },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 16, fontWeight: 'bold' },
    resultInfo: { flex: 1 },
    resultName: { fontSize: 15, fontWeight: '600' },
    resultEmail: { fontSize: 12 },
})