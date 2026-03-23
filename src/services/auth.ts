import { supabase } from "../lib/supabase";

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

/**
 * @description: Verifies the OTP entered by the User
 * @params: email:string
 * @return: Promise<void>
 */
// export const verifyOtp = async (
//     email: string,
//     token: string
// ): Promise<void> => {
//     const { error } = await supabase.auth.verifyOtp({
//         email,
//         token,
//         type: 'email',
//     })

//     if (error) {
//         throw new Error(error.message)
//     }
// }

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