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

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * @description: Verifies the OTP entered by the User
 * @params: email:string
 * @return: Promise<void>
 */
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
        throw new Error(error.message)
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