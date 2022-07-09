import { useState, useEffect } from 'react'
import { API_ROOT, JWT_TOKEN } from '@env'
import { Box, FlatList, Heading, Button, HStack, VStack, Text, Spacer, DeleteIcon, InfoIcon, useToast } from "native-base";
import { useNavigation } from '@react-navigation/native';
import CustomAlertDialog from './common/CustomAlertDialog'
import { StyleSheet } from 'react-native'

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteBookmark, setDeleteBookmark] = useState(null)
  const [infoBookmark, setInfoBookmark] = useState({})
  const navigation = useNavigation();
  const toast = useToast()

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

  const handleDeleteBookmark = async () => {
    try {
      const response = await fetch(`${API_ROOT}/bookmarks/${deleteBookmark}`, {
        method: 'DELETE',
        headers: {
          Authorization: JWT_TOKEN
        },
      })

      if(response.ok) {
        toast.show({
          render: () => {
            return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    {`Bookmark with id ${deleteBookmark} was deleted`}
                  </Box>
          }
        });

        setDeleteBookmark(null)
        getBookmarks()
      }
    } catch (error) {
      console.error(error)
    } 
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  return (
    <>
      <Box>
        <Button shadow={2} onPress={() => navigation.navigate('AddBookmark')}>
          Add Bookmark
        </Button>
        <Heading fontSize="xl" p="4" pb="3">
          Bookmarks
        </Heading>
        <FlatList srtyle={styles.wrapper} data={bookmarks} renderItem={({
        item
      }) => <Box borderBottomWidth="1" _dark={{
        borderColor: "gray.600"
      }} borderColor="coolGray.200" pl="4" pr="5" py="2">
          <HStack>
            <VStack>
              <Text bold>
                      {item.title}
              </Text>
              <Text>
                {item.description}
              </Text>
            </VStack>
            <Spacer />
            <VStack space={1} direction={{
              base: "row",
            }}>
              <Button colorScheme="danger" onPress={() => setDeleteBookmark(item.id)}>
                  <DeleteIcon style={styles.actionItem}/>
                </Button>
                <Button colorScheme="primary" onPress={() => setInfoBookmark(item)} style={styles.actionItem}>
                  <InfoIcon style={styles.actionItem}/>
                </Button>
            </VStack>
          </HStack>
        </Box>} keyExtractor={item => item.id} />
      </Box>
      <CustomAlertDialog 
        deleteBookmark={deleteBookmark}
        setDeleteBookmark={setDeleteBookmark}
        infoBookmark={infoBookmark}
        setInfoBookmark={setInfoBookmark}
        handleDeleteBookmark={handleDeleteBookmark}
      />
    </>
  )
}

export default BookmarksList

const styles = StyleSheet.create({
  actionItem: {
    color: '#fff',
  } 
})