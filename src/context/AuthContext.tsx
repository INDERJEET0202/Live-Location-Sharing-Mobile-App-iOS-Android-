import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type UserRole = 'admin' | 'user' | null

type AuthContextType = {
    session: Session | null
    user: User | null
    role: UserRole
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    role: null,
    loading: true,
    signOut: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<UserRole>(null)
    const [loading, setLoading] = useState(true)
    const appState = useRef(AppState.currentState)

    const extractRole = (session: Session | null): UserRole => {
        if (!session) return null
        // role stored in user_metadata or app_metadata from supabase
        return session.user?.app_metadata?.role ?? 'user'
    }

    const handleSession = (session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setRole(extractRole(session))
    }

    useEffect(() => {
        // Step 1 — get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session)
            setLoading(false)
        })

        // Step 2 — listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                handleSession(session)
                console.log(event)
                if (event === 'TOKEN_REFRESHED') {
                    console.log('[AuthGuard] Token refreshed silently ✅')
                }

                if (event === 'SIGNED_OUT') {
                    console.log('[AuthGuard] User signed out')
                }

                if (event === 'USER_UPDATED') {
                    console.log('[AuthGuard] User updated')
                }
            }
        )

        // Step 3 — refresh session when app comes back to foreground
        const appStateSub = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextState === 'active'
                ) {
                    // app came to foreground — trigger token refresh if needed
                    supabase.auth.startAutoRefresh()
                    console.log('[AuthGuard] App foregrounded — checking session')
                }

                if (nextState.match(/inactive|background/)) {
                    supabase.auth.stopAutoRefresh()
                }

                appState.current = nextState
            }
        )

        return () => {
            subscription.unsubscribe()
            appStateSub.remove()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        handleSession(null)
    }

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}