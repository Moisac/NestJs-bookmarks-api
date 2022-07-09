import { useState } from 'react'
import { Input, Stack, Center, TextArea, useToast, Box, Button, Text } from "native-base"
import { JWT_TOKEN, API_ROOT } from '@env'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { validateUrl } from '../util/ValidationUtils'


const AddBookmark = () => {
    const [formData, setData] = useState({})
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const navigation = useNavigation()

    const toast = useToast()

    const handlePostBookmark = async () => {
        try {
            setLoadingSubmit(true)
          const response = await fetch(`${API_ROOT}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JWT_TOKEN
            },
            body: JSON.stringify({
                "userId": 1,
                ...formData
            })
          })
          await response.json()
          if(response.ok) {
            setData({ title: '' })
            setData({})
            toast.show({
                render: () => {
                  return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                          The bookmark was added
                        </Box>
                }
            });
          }
          navigation.navigate('BookmarksList')
        } catch (error) {
          console.error(error)
        } finally {
            setLoadingSubmit(false)
        }
      }

    const handleDisableSubmit = !formData.title || !formData.link || !formData.description && true



  return (
    <Box>
      <Button 
        mb="5"
        borderRadius="0"
        onPress={() => navigation.navigate('BookmarksList')}
      >
        View bookmarks list
      </Button>

     <Center>
     <Stack mt={3} space={4} w="75%" maxW="300px" styles={styles.addCard}>
        <Input size="md" placeholder="Title" onChangeText={
            value => setData({ ...formData, title: value})
        }
        />
        <Input size="md" placeholder="Link" onChangeText={
            value => setData({ ...formData, link: value})
        }
        />
        { 
          formData?.link && !validateUrl(formData?.link) ? 
          <Text style={styles.errorText}>Invalid URL format</Text> : 
          <></>
        }

        <TextArea h={20} placeholder="Description" onChangeText={
            value => setData({ ...formData, description: value})
        }
        />
          
        <Button 
            onPress={handlePostBookmark} 
            isDisabled={handleDisableSubmit} 
            isLoading={loadingSubmit} 
            isLoadingText="Adding bookmark..."
        >
            Add Bookmark
        </Button>
      </Stack>
     </Center>
    </Box>
  )
}

export default AddBookmark

const styles = StyleSheet.create({
  addCard: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red'
  }
})