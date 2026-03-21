/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator'

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container} edges={[]}>
        <AppNavigator />
        {/* <HomeScreen /> */}
      </SafeAreaView>
    </SafeAreaProvider >
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
      <Text>This the app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // take full screen
    // justifyContent: 'center', // vertical center
    // alignItems: 'center',     // horizontal center
  },
  text: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default App;
