import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GetStartedScreen from '../screens/GetStartedScreen'
import LoginScreen from '../screens/LoginScreen'
import OtpScreen from '../screens/OtpScreen'

export type RootStackParamList = {
    GetStarted: undefined
    Login: undefined
    Otp: { email: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="GetStarted" component={GetStartedScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen name="Otp" component={OtpScreen}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}