import React from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useAuth, UserRole } from '../context/AuthContext'
import { Colors } from '../theme/colors'

type Props = {
    children: React.ReactNode
    requireAuth?: boolean          // true = protected screen
    requiredRole?: UserRole        // 'admin' | 'user'
    fallback?: React.ReactNode     // custom loading UI
    unauthorizedFallback?: React.ReactNode  // custom unauthorized UI
}

export default function AuthGuard({
    children,
    requireAuth = false,
    requiredRole,
    fallback,
    unauthorizedFallback,
}: Props) {
    const { session, role, loading } = useAuth()

    // loading state
    if (loading) {
        if (fallback) return <>{fallback}</>
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    // not logged in — but screen requires auth
    if (requireAuth && !session) {
        if (unauthorizedFallback) return <>{unauthorizedFallback}</>
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>🔐 Session expired</Text>
                <Text style={styles.subText}>Please login again</Text>
            </View>
        )
    }

    // logged in — but wrong role
    if (requireAuth && requiredRole && role !== requiredRole) {
        if (unauthorizedFallback) return <>{unauthorizedFallback}</>
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>🚫 Access denied</Text>
                <Text style={styles.subText}>
                    You need {requiredRole} access for this
                </Text>
            </View>
        )
    }

    return <>{children}</>
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundDark,
        gap: 8,
    },
    loadingText: {
        color: Colors.gray,
        fontSize: 14,
        marginTop: 12,
    },
    errorText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subText: {
        color: Colors.gray,
        fontSize: 14,
    },
})