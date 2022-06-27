import { useState } from 'react'
import { Input, Stack, Center, TextArea, useToast, Box, Button } from "native-base"
import { Button as DefaultButton } from 'react-native';
import { JWT_TOKEN, API_ROOT } from '@env'
import { useNavigation } from '@react-navigation/native';


const AddBookmark = () => {
    const [formData, setData] = useState({})
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const navigation = useNavigation()

    const toast = useToast()

    const handlePostBookmark = async ({ navigation }) => {
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
          const json = await response.json()
          if(!!json) {
            setData({ title: '' })
          }
        } catch (error) {
          console.error(error)
        } finally {
            setLoadingSubmit(false)
            setData({})
            toast.show({
                render: () => {
                  return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                          The bookmark was added
                        </Box>
                }
              });
        }
      }

    const handleDisableSubmit = !formData.title || !formData.link || !formData.description && true



  return (
    <Center>
      <DefaultButton 
        shadow={2} 
        onPress={() => navigation.navigate('BookmarksList')}
        title="View Bookmark List"
      />
      <Stack mt={3} space={4} w="75%" maxW="300px">
        <Input size="md" placeholder="Title" onChangeText={
            value => setData({ ...formData, title: value})
        }
        />
        <Input size="md" placeholder="Link" onChangeText={
            value => setData({ ...formData, link: value})
        }
        />
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
      {/* <Stack>
        { bookmarks && bookmarks.map(bookmark => 
            { bookmark.title }
        ) }
      </Stack> */}
    </Center>
  )
}

export default AddBookmark