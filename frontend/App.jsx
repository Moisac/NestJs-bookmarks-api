import { useState } from 'react'
import { NativeBaseProvider, Box, Button } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'
import AddBookmark from './src/components/AddBookmark'
import { API_ROOT, JWT_TOKEN } from '@env'
import BookmarksList from './src/components/BookmarksList'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function App() {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState()

  const Stack = createNativeStackNavigator();

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
        <View style={styles.container}>
          <StatusBar style='auto' />
          <Stack.Navigator>
            <Stack.Screen
              name="AddBookmark"
              component={AddBookmark}
              options={{ title: 'Add bookmark' }}
            />
            <Stack.Screen name="BookmarkList" component={BookmarksList} />
          </Stack.Navigator>
          <Box>
            {isLoading ? <ActivityIndicator /> : <Text>{data?.email}</Text>}
          </Box>
        </View>
        <AddBookmark />
        <BookmarksList />
      </NativeBaseProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
