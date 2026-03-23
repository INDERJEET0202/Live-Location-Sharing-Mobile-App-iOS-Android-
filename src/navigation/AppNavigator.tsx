// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import GetStartedScreen from '../screens/GetStartedScreen'
// import LoginScreen from '../screens/LoginScreen'
// import OtpScreen from '../screens/OtpScreen'

// export type RootStackParamList = {
//     GetStarted: undefined
//     Login: undefined
//     Otp: { email: string }
// }

// const Stack = createNativeStackNavigator<RootStackParamList>()

// export default function AppNavigator() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator>
//                 <Stack.Screen name="GetStarted" component={GetStartedScreen}
//                     options={{ headerShown: false }} />
//                 <Stack.Screen name="Login" component={LoginScreen}
//                     options={{ headerShown: false }} />
//                 <Stack.Screen name="Otp" component={OtpScreen}
//                     options={{ headerShown: false }} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     )
// }




import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from '../context/AuthContext'
import AuthGuard from '../middleware/AuthGuard'

import GetStartedScreen from '../screens/GetStartedScreen'
import LoginScreen from '../screens/LoginScreen'
import OtpScreen from '../screens/OtpScreen'
import HomeScreen from '../screens/HomeScreen'
import BottomTabNavigator from './BottomTabNavigator'

export type RootStackParamList = {
    GetStarted: undefined
    Login: undefined
    Otp: { email: string }
    Main: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function Navigator() {
    const { session, loading } = useAuth()

    return (
        <AuthGuard >
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {session ? (
                        // Protected screens
                        <Stack.Screen name="Main">
                            {() => (
                                <AuthGuard requireAuth>
                                    <BottomTabNavigator />
                                </AuthGuard>
                            )}
                        </Stack.Screen>
                    ) : (
                        // Public screens
                        <>
                            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Otp" component={OtpScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthGuard>
    )
}

export default function AppNavigator() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <Navigator />
            </AuthProvider>
        </SafeAreaProvider>
    )
}