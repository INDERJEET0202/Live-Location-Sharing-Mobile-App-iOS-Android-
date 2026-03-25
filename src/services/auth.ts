import { supabase } from "../lib/supabase";

export type LocationShare = {
    id: string
    owner_id: string
    viewer_id: string
    expires_at: string
    created_at: string
}

export type UserLocation = {
    id: string
    lat: number
    lng: number
    created_at: string
}

/**
 * @description: Send OTP to user's email provided
 * @params: email:string
 * @return: Promise<void>
 */
export const sendOtp = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithOtp({
        email,
    })

    // mock delay 1-3 seconds
    // const delay = Math.random() * 2000
    // await new Promise(resolve => setTimeout(resolve, delay))

    if (error) {
        throw new Error(error.message)
    }
}

export const verifyOtp = async (
    email: string,
    token: string
): Promise<void> => {
    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    })

    if (error) {
        // map exact supabase error messages to user friendly ones
        const msg = error.message.toLowerCase()

        if (msg.includes('expired') || error.status === 403) {
            throw new Error('EXPIRED')
        }
        if (msg.includes('invalid') || msg.includes('incorrect') || error.status === 401) {
            throw new Error('INVALID')
        }
        if (msg.includes('attempts') || msg.includes('limit')) {
            throw new Error('TOO_MANY')
        }

        throw new Error('UNKNOWN')
    }
}

/**
 * @description: Get current logged-in user
 * @params: 
 * @return: 
 */
export const getCurrentUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        throw new Error(error.message)
    }

    return user
}

/**
 * @description: Fetch profile from public.profiles table
 * @params: userId
 */
export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, avatar_url')
        .eq('id', userId)
        .maybeSingle()

    if (error) throw new Error(error.message)
    return data
}

/**
 * @description: Update first_name and last_name in public.profiles
 * @params: userId, update fields
 */
export const updateProfile = async (
    userId: string,
    updates: { first_name?: string; last_name?: string }
) => {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

    if (error) throw new Error(error.message)
}

/**
 * @description: Search user by email
 * @params: email:string
 * @return: Promise<void>
 */
export const searchUserByEmail = async (email: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, avatar_url')
        .ilike('email', `%${email}%`)
        .neq('id', (await supabase.auth.getUser()).data.user?.id) // exclude self
        .limit(5)

    if (error) throw new Error(error.message)
    return data
}

// ─── Start sharing location with a user ───────────────
export const startLocationShare = async (viewerId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    const { data, error } = await supabase
        .from('location_shares')
        .insert({
            owner_id: user.id,
            viewer_id: viewerId,
            expires_at: expiresAt,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// ─── Stop sharing location ─────────────────────────────
export const stopLocationShare = async (shareId: string) => {
    const { error } = await supabase
        .from('location_shares')
        .delete()
        .eq('id', shareId)

    if (error) throw new Error(error.message)
}

// ─── Stop ALL active shares (owner stops sharing) ─────
export const stopAllLocationShares = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('location_shares')
        .delete()
        .eq('owner_id', user.id)

    if (error) throw new Error(error.message)
}

// ─── Upsert current location ───────────────────────────
export const upsertLocation = async (lat: number, lng: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('locations')
        .upsert({
            id: user.id,
            lat,
            lng,
        })

    if (error) throw new Error(error.message)
}

// ─── Get active shares where I am the owner ───────────
// export const getMyActiveShares = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) throw new Error('Not authenticated')

//     const { data, error } = await supabase
//         .from('location_shares')
//         .select(`
//             id,
//             owner_id,
//             viewer_id,
//             expires_at,
//             created_at,
//             profiles!viewer_id (
//                 id,
//                 first_name,
//                 last_name,
//                 email,
//                 avatar_url
//             )
//         `)
//         .eq('owner_id', user.id)
//         .gt('expires_at', new Date().toISOString())

//     if (error) throw new Error(error.message)
//     return data
// }

export const getMyActiveShares = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Step 1 — get shares
    const { data: shares, error } = await supabase
        .from('location_shares')
        .select('id, owner_id, viewer_id, expires_at, created_at')
        .eq('owner_id', user.id)
        .gt('expires_at', new Date().toISOString())

    if (error) throw new Error(error.message)
    if (!shares || shares.length === 0) return []

    // Step 2 — get profiles for each viewer
    const viewerIds = shares.map(s => s.viewer_id)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', viewerIds)

    // Step 3 — merge manually
    return shares.map(share => ({
        ...share,
        profiles: profiles?.find(p => p.id === share.viewer_id) ?? null
    }))
}

// ─── Get active shares where I am the viewer ──────────
// export const getSharesWithMe = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) throw new Error('Not authenticated')

//     const { data, error } = await supabase
//         .from('location_shares')
//         .select(`
//             id,
//             owner_id,
//             viewer_id,
//             expires_at,
//             created_at,
//             profiles!owner_id (
//                 id,
//                 first_name,
//                 last_name,
//                 email,
//                 avatar_url
//             )
//         `)
//         .eq('viewer_id', user.id)
//         .gt('expires_at', new Date().toISOString())

//     if (error) throw new Error(error.message)
//     return data
// }

export const getSharesWithMe = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: shares, error } = await supabase
        .from('location_shares')
        .select('id, owner_id, viewer_id, expires_at, created_at')
        .eq('viewer_id', user.id)
        .gt('expires_at', new Date().toISOString())

    if (error) throw new Error(error.message)
    if (!shares || shares.length === 0) return []

    const ownerIds = shares.map(s => s.owner_id)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', ownerIds)

    return shares.map(share => ({
        ...share,
        profiles: profiles?.find(p => p.id === share.owner_id) ?? null
    }))
}