import { useState, useEffect } from 'react'
import { API_ROOT, JWT_TOKEN } from '@env'
import { Box, FlatList, Heading, Button, HStack, VStack, Text, Spacer, DeleteIcon, InfoIcon } from "native-base";

const BookmarksList = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)

  const getBookmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ROOT}/bookmarks`, {
        method: 'GET',
        headers: {
          Authorization: JWT_TOKEN
        },
      })
      const json = await response.json()
      setBookmarks(json)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <Box>
      <Button shadow={2} onPress={() => navigation.navigate('AddBookmark')}>
            Add Bookmark
          </Button>
      <Heading fontSize="xl" p="4" pb="3">
        Bookmarks
      </Heading>
      <FlatList data={bookmarks} renderItem={({
      item
    }) => <Box borderBottomWidth="1" _dark={{
      borderColor: "gray.600"
    }} borderColor="coolGray.200" pl="4" pr="5" py="2">
            <HStack space={3} justifyContent="space-between">
              <VStack>
                <Text _dark={{
                  color: "warmGray.50"
                }} color="coolGray.800" bold>
                        {item.title}
                </Text>
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                  {item.description}
                </Text>
              </VStack>
              <Spacer />
              <Text fontSize="xs" _dark={{
                color: "warmGray.50"
              }} color="coolGray.800" alignSelf="flex-start">
                <DeleteIcon />
                <InfoIcon />
              </Text>
            </HStack>
          </Box>} keyExtractor={item => item.id} />
    </Box>
  )
}

export default BookmarksList