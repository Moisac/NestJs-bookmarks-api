import { useState } from 'react'
import { NativeBaseProvider, Box, Button } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import AddBookmark from './src/components/AddBookmark'
import { API_ROOT, JWT_TOKEN } from '@env'
import BookmarksList from './src/components/BookmarksList'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function App() {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState()

  const Stack = createNativeStackNavigator()

  const getUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ROOT}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: JWT_TOKEN
        },
      })
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <NavigationContainer>
      <NativeBaseProvider>
          <StatusBar style='auto' />
          <Stack.Navigator initialRouteName='AddBookmark' style={styles.container}>
            <Stack.Screen 
              name="BookmarksList" 
              component={BookmarksList}
              options={{
                title: 'Your bookmarks list',
                headerTitleAlign: 'center',
                headerShown: true
              }}
            />

            <Stack.Screen
              name="AddBookmark"
              component={AddBookmark}
              options={{
                title: 'Add bookmark',
                headerTitleAlign: 'center',
                headerShown: true
              }}
            />
          </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
})