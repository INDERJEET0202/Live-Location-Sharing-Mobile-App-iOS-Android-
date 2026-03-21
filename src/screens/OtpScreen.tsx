import React, { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { verifyOtp, getCurrentUser } from '../services/auth'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'

type Props = {
    route: RouteProp<RootStackParamList, 'Otp'>
}

export default function OtpScreen({ route }: Props) {
    const { email } = route.params
    const [otp, setOtp] = useState('')

    const handleVerify = async () => {
        try {
            await verifyOtp(email, otp)
            const user = await getCurrentUser()
            console.log('Logged in UID:', user?.id)
        } catch (err: any) {
            console.log(err.message)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Enter OTP</Text>
            <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP"
                style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <Button title="Verify OTP" onPress={handleVerify} />
        </View>
    )
}